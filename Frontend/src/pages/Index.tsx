import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { MediaUploader } from "@/components/MediaUploader";
import { ResultsPage } from "@/components/ResultsPage";
import type { AnalysisResult as AnalysisResultType } from "@/components/ResultsPage";
import { Shield, Zap, Users, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const [currentPage, setCurrentPage] = useState<"home" | "results">("home");
  const [uploadedMedia, setUploadedMedia] = useState<File | null>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [serverResult, setServerResult] = useState<AnalysisResultType | null>(null);

  const { isLoggedIn } = useAuth();   // 🔥 FIX — ensures page reacts to login state
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (mediaUrl) URL.revokeObjectURL(mediaUrl);
    };
  }, [mediaUrl]);

  const handleMediaUpload = (file: File, result: AnalysisResultType) => {
    const newUrl = URL.createObjectURL(file);
    setUploadedMedia(file);
    setServerResult(result);
    setMediaUrl(newUrl);
    setCurrentPage("results");
  };

  // 🚨 BLOCK RESULTS PAGE IF USER LOGS OUT
  // 🔥 FIX – if logged out, force back to home & disable analysis
  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentPage("home");
      setUploadedMedia(null);
      setServerResult(null);
    }
  }, [isLoggedIn]);

  if (currentPage === "results" && uploadedMedia) {
    return (
      <ResultsPage
        mediaFile={uploadedMedia}
        mediaUrl={mediaUrl || undefined}
        serverResult={serverResult || undefined}
        onBack={() => {
          setCurrentPage("home");
          setUploadedMedia(null);
          setServerResult(null);
          if (mediaUrl) URL.revokeObjectURL(mediaUrl);
          setMediaUrl(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="min-h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left - Text */}
          <div>
            <h1 className="text-4xl font-bold sm:text-5xl lg:text-6xl text-gray-900 leading-tight">
              Detect Deepfakes with{" "}
              <span className="relative block mt-2 text-orange-600">
                AI-Powered Precision
              </span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-700">
              Upload videos or images and uncover deepfakes in seconds with our powerful detection engine.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row sm:items-center gap-6">
              <button
                onClick={() => {
                  // 🔥 FIX — Redirect to login if not signed in
                  if (!isLoggedIn) {
                    navigate("/login");
                  } else {
                    document
                      .getElementById("uploader")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                disabled={!isLoggedIn}   // 🔥 FIX — Lock button
                className={`inline-flex items-center justify-center px-8 py-4 font-semibold text-lg transition rounded-lg ${
                  isLoggedIn
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                }`}
              >
                {isLoggedIn ? "Start Detecting" : "🔒 Sign in to Start"}
              </button>

              {!isLoggedIn && (
                <p className="mt-2 text-gray-500 text-sm">
                  Please log in to start detecting deepfakes.
                </p>
              )}
            </div>
          </div>

          {/* Right - Uploader */}
          <div className="flex justify-center lg:justify-end" id="uploader">
            <div
              className={`w-full max-w-sm lg:max-w-lg border-2 border-dashed rounded-xl p-4 sm:p-6 lg:p-8 bg-white/70 backdrop-blur 
                ${isLoggedIn ? "border-gray-300" : "border-red-300 opacity-40"}`
              } // 🔥 FIX — lock uploader visually
            >
              {/* 🔥 FIX — Disable uploader if not logged in */}
              {isLoggedIn ? (
                <MediaUploader onUpload={handleMediaUpload} />
              ) : (
                <p className="text-center text-gray-500">Login to upload files</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-600">Powered by AI</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            Why Choose DeepfakeGuard
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Protect your brand, reputation, and security with cutting-edge deepfake detection technology trusted worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="creative-card group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Military-Grade Security
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Advanced neural networks trained on millions of deepfake samples detect even the most sophisticated manipulations.
              </p>
            </CardContent>
          </Card>

          <Card className="creative-card group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Lightning Fast</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Real-time processing with results in seconds. Our optimized algorithms work at the speed of thought.
              </p>
            </CardContent>
          </Card>

          <Card className="creative-card group">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Trusted Globally</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Media organizations, law enforcement, and security firms worldwide rely on our platform daily.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;
