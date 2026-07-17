import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  Play,
  Image as ImageIcon,
  AlertCircle,
  X,
  Sparkles,
  Zap,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import type { AnalysisResult } from "../types/analysis";

interface MediaUploaderProps {
  onUpload: (file: File, result: AnalysisResult) => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({ onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) handleMediaFile(file);
  };

  const handleMediaFile = (file: File) => {
    if (!file.type.startsWith("video/") && !file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a video or image.",
        variant: "destructive",
      });
      return;
    }

    if (mediaPreview) URL.revokeObjectURL(mediaPreview);

    setSelectedMedia(file);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleUploadClick = async () => {
    if (!selectedMedia) return fileInputRef.current?.click();

    const formData = new FormData();
    formData.append("file", selectedMedia);

    const endpoint = selectedMedia.type.startsWith("image/")
      ? "http://localhost:5000/api/analyze-image"
      : "http://localhost:5000/api/analyze";

    try {
      setIsUploading(true);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Analysis failed");

      // ---------------------------------------------
      // ✅ MAP BACKEND OUTPUT → FRONTEND STRUCTURE
      // ---------------------------------------------
      const confidenceValue =
        data.confidence ?? data.probability ?? 0;

      const mappedResult: AnalysisResult = {
        isDeepfake: data.result === "FAKE",
        confidence: confidenceValue,
        riskLevel:
          confidenceValue > 0.85
            ? "High"
            : confidenceValue > 0.5
            ? "Moderate"
            : "Low",
        analysisTimeMs: data.time_ms ?? 1200,
        detectionMethod: selectedMedia.type.startsWith("video/")
          ? "Video Deepfake Voting Model"
          : "Image CNN Deepfake Detector",
        frames: data.frames ?? undefined,
        indicators: [
          { name: "Model Confidence", score: confidenceValue },
          {
            name: "Real Votes Ratio",
            score:
              data.real_votes && data.fake_votes
                ? data.real_votes / (data.real_votes + data.fake_votes)
                : 0,
          },
          {
            name: "Fake Votes Ratio",
            score:
              data.fake_votes && data.real_votes
                ? data.fake_votes / (data.real_votes + data.fake_votes)
                : 0,
          },
        ],
        raw: data,
      };
      // ---------------------------------------------

      toast({
        title: "✅ Analysis complete",
        description: `${selectedMedia.name} analyzed successfully.`,
      });

      // SEND CORRECT STRUCTURE TO ResultPage
      onUpload(selectedMedia, mappedResult);
    } catch (err) {
      toast({
        title: "❌ Analysis error",
        description:
          err instanceof Error ? err.message : "Unexpected error",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) handleMediaFile(e.target.files[0]);
  };

  const clearMedia = () => {
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);
    setSelectedMedia(null);
    setMediaPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card
        className={`relative p-12 border-3 transition-all duration-500 cursor-pointer group ${
          dragActive
            ? "border-electric-blue bg-electric-blue/10 scale-105 shadow-2xl"
            : "border-dashed border-foreground/20 hover:border-electric-blue/60 hover:shadow-xl"
        } ${selectedMedia ? "!border-electric-blue" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !selectedMedia && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          onChange={handleFileInput}
          className="hidden"
        />

        {selectedMedia ? (
          <div className="space-y-6 animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-electric-blue to-coral-pink rounded-2xl flex items-center justify-center">
                  {selectedMedia.type.startsWith("video/") ? (
                    <Play className="w-7 h-7 text-white" />
                  ) : (
                    <ImageIcon className="w-7 h-7 text-white" />
                  )}
                </div>

                <div>
                  <p className="font-bold text-lg text-foreground">
                    {selectedMedia.name}
                  </p>
                  <p className="text-foreground/60 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    {(selectedMedia.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  clearMedia();
                }}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {mediaPreview &&
              (selectedMedia.type.startsWith("video/") ? (
                <video
                  src={mediaPreview}
                  controls
                  className="w-full max-h-72 rounded-2xl shadow-lg"
                />
              ) : (
                <img
                  src={mediaPreview}
                  alt="Preview"
                  className="w-full max-h-72 object-contain rounded-2xl shadow-lg"
                />
              ))}
          </div>
        ) : (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-electric-blue/20 to-coral-pink/20 rounded-3xl flex items-center justify-center mx-auto">
                <Upload className="w-12 h-12 text-electric-blue" />
              </div>
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-sunset-orange animate-pulse" />
            </div>

            <h3 className="text-2xl font-bold text-foreground">
              Drop your media here for{" "}
              <span className="accent-text">AI analysis</span>
            </h3>
          </div>
        )}
      </Card>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleUploadClick}
          disabled={!selectedMedia || isUploading}
          className="creative-button px-10 py-4 text-white font-bold text-lg rounded-2xl"
        >
          {isUploading ? "⏳ Analyzing..." : "🚀 Analyze with AI"}
        </button>
      </div>

      {!selectedMedia && (
        <div className="mt-6 flex items-center justify-center gap-3 text-foreground/60">
          <AlertCircle className="w-5 h-5 text-coral-pink" />
          <span className="text-lg">
            Upload a video or image to start analysis
          </span>
        </div>
      )}
    </div>
  );
};
