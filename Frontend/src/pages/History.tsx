import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Loader2, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HistoryItem {
  _id: string;
  filename: string;
  result: "REAL" | "FAKE";
  probability: number;
  type: "video" | "image";
  createdAt: string;
}

export default function History() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "video" | "image">("all");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("http://localhost:5000/api/history", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setHistory(data.history || []);
      } catch (err: any) {
        console.error("Fetch error:", err);
        setError("Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [token]);

  const filtered = filter === "all" ? history : history.filter((h) => h.type === filter);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Back to Home */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center mb-6 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Home
        </button>

        <h1 className="text-5xl font-extrabold text-blue-700 mb-3">Your Upload History</h1>
        <p className="text-gray-600 mb-8">
          Review all your previous deepfake analysis results here.
        </p>

        <Card className="shadow-lg rounded-2xl">
          <CardHeader className="flex items-center space-x-2 border-b bg-white/80">
            <Calendar className="w-6 h-6 text-blue-500" />
            <CardTitle>Your Upload History</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filter Tabs */}
            <div className="flex justify-center mb-6 space-x-4">
              {(["all", "video", "image"] as const).map((type) => (
                <Button
                  key={type}
                  variant={filter === type ? "default" : "ghost"}
                  className="rounded-full px-6"
                  onClick={() => setFilter(type)}
                >
                  {type === "all"
                    ? "All Files"
                    : type.charAt(0).toUpperCase() + type.slice(1) + "s"}
                </Button>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-10">
                <Loader2 className="animate-spin text-blue-500 w-8 h-8" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center text-red-500 font-medium py-6">
                {error}
              </div>
            )}

            {/* No Results */}
            {!loading && !error && filtered.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No uploads found in your history.
              </div>
            )}

            {/* History Items */}
            {!loading && !error && filtered.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {filtered.map((item) => (
                  <Card key={item._id} className="hover:shadow-lg transition">
                    <CardContent className="p-5">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-semibold text-lg">{item.filename}</h3>
                        <Badge
                          variant={
                            item.result === "REAL" ? "success" : "destructive"
                          }
                        >
                          {item.result}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        Probability: {(item.probability * 100).toFixed(2)}%
                      </p>
                      <p className="text-sm text-gray-500">
                        Type: {item.type === "video" ? "🎥 Video" : "🖼️ Image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(item.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
