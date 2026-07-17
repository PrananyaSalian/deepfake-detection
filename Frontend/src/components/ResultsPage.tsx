// src/components/ResultsPage.tsx
import React from "react";
import { ArrowLeft, CheckCircle, AlertTriangle, Clock, Cpu } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export type Indicator = {
  name: string;
  score: number;
};

export type RawData = {
  result: "FAKE" | "REAL";
  probability?: number;
  frames?: number;
  image?: string;
  fake_votes?: number;
  real_votes?: number;
  [key: string]: string | number | undefined;
};

export type AnalysisResult = {
  isDeepfake: boolean;
  confidence: number;
  riskLevel: "Low" | "Moderate" | "High";
  analysisTimeMs: number;
  detectionMethod: string;
  frames?: number;
  indicators: Indicator[];
  raw: RawData;
};

export type ResultsPageProps = {
  mediaFile?: File;
  mediaUrl?: string;
  serverResult?: AnalysisResult;
  onBack?: () => void;
};

export const ResultsPage: React.FC<ResultsPageProps> = ({
  mediaFile,
  mediaUrl,
  serverResult,
  onBack,
}) => {
  if (!serverResult) return null;

  const { isDeepfake, confidence, riskLevel, analysisTimeMs, detectionMethod, frames, indicators } =
    serverResult;

  const confidencePercentage = (confidence * 100).toFixed(1);

  const riskColors = {
    High: "bg-red-600",
    Moderate: "bg-yellow-500 text-gray-900",
    Low: "bg-green-600",
  } as const;

  const riskColor = riskColors[riskLevel];

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center font-sans">
      <div className="w-full max-w-6xl space-y-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition font-semibold px-4 py-2 rounded-full bg-gray-100 shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Upload
        </button>

        {/* Header Section */}
        <Card className="p-8 shadow-lg rounded-xl border border-gray-200 transition-transform hover:scale-105 duration-300 ease-in-out">
          <CardHeader className="mb-4">
            <CardTitle className="text-4xl font-extrabold text-gray-900 mb-2">
              Deepfake Analysis Results
            </CardTitle>
            <p className="text-gray-600 text-md">
              File analyzed: <span className="font-semibold">{mediaFile?.name}</span>
            </p>
          </CardHeader>

          <CardContent className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Media Preview */}
            {mediaUrl && (
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300">
                {mediaFile?.type.startsWith("video/") ? (
                  <video src={mediaUrl} controls className="w-full h-auto rounded-xl" />
                ) : (
                  <img src={mediaUrl} alt="Analyzed media" className="w-full h-auto object-contain" />
                )}
              </div>
            )}

            {/* Summary Info */}
            <div className="space-y-6 px-4">
              {/* Detection Method */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Detection Method</h3>
                <p className="text-gray-600">{detectionMethod}</p>
              </div>
              {/* Frames Analyzed */}
              {frames !== undefined && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Frames Analyzed</h3>
                  <p className="text-gray-600">{frames}</p>
                </div>
              )}
              {/* Analysis Time */}
              <div className="flex items-center gap-3 text-gray-700 mb-2">
                <Clock className="w-5 h-5" />
                <span>Analysis Time: {(analysisTimeMs / 1000).toFixed(2)}s</span>
              </div>
              {/* Model Confidence */}
              <div className="flex items-center gap-3 text-gray-700 mb-4">
                <Cpu className="w-5 h-5" />
                <span className="font-semibold">
                  Model Confidence: {confidencePercentage}%
                </span>
              </div>
              {/* Fake/Real Badge */}
              <div>
                <Badge
                  className={`text-white px-4 py-2 rounded-full text-md ${
                    isDeepfake ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {isDeepfake ? "FAKE DETECTED" : "AUTHENTIC CONTENT"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confidence Level */}
        <Card className="p-8 shadow-lg rounded-xl border border-gray-200 transition-transform hover:scale-105 duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Confidence Level</h3>
          <Progress
            value={confidence * 100}
            className={`h-4 rounded-full ${riskColor} shadow-inner`}
          />
          <div className="flex justify-between mt-2 text-sm text-gray-600 px-2">
            <span>0%</span>
            <span className="font-semibold">{confidencePercentage}%</span>
            <span>100%</span>
          </div>
          <div className="mt-4 flex justify-center">
            <span
              className={`font-semibold text-white px-4 py-2 rounded-full ${riskColor} text-md shadow`}
            >
              Risk Level: {riskLevel}
            </span>
          </div>
        </Card>

        {/* Indicators Section */}
        <Card className="p-8 shadow-lg rounded-xl border border-gray-200 transition-transform hover:scale-105 duration-300 ease-in-out">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Key Detection Indicators</h3>
          <div className="space-y-4">
            {indicators.map((indicator, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 font-semibold">{indicator.name}</span>
                  <span className="text-gray-500 text-sm">{(indicator.score * 100).toFixed(1)}%</span>
                </div>
                <Progress value={indicator.score * 100} className="h-3 rounded-full" />
              </div>
            ))}
          </div>
        </Card>

        {/* Raw Data Debug */}
        <Card className="p-8 shadow-lg rounded-xl border border-gray-200 overflow-x-auto">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Raw Output (Debug Info)</h3>
          <pre className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
            {JSON.stringify(serverResult.raw, null, 2)}
          </pre>
        </Card>

        {/* Footer Status */}
        <div className="flex justify-center py-6">
          {isDeepfake ? (
            <div className="flex items-center gap-3 text-red-600 font-semibold text-lg">
              <AlertTriangle className="w-6 h-6" />
              <span>Deepfake Detected</span>
            </div>
          ) : (
            <div className="flex items-center gap-3 text-green-600 font-semibold text-lg">
              <CheckCircle className="w-6 h-6" />
              <span>Content Verified as Real</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
