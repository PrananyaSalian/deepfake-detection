import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Define your API response type
interface LoginResponse {
  token: string;
  user?: { id: string; name: string; email: string };
  message?: string;
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // ⚙️ Google Client ID (your actual ID)
  const GOOGLE_CLIENT_ID =
    "496935034237-ia0575732npmatrpq49ak92inq6ajqgc.apps.googleusercontent.com";

  // ✅ Load Google OAuth script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // ✅ Handle Google sign-in callback
  const handleGoogleResponse = async (response: any) => {
    try {
      const res = await fetch(
        "https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=" +
          response.credential
      );
      const googleData = await res.json();

      if (!googleData.email) throw new Error("Google login failed");

      // Optional: Send to backend if you want to register/login via server
      localStorage.setItem("token", response.credential);
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: googleData.name,
          email: googleData.email,
          id: googleData.sub,
        })
      );

      toast({
        title: "Welcome!",
        description: `Signed in as ${googleData.email}`,
      });

      navigate("/");
    } catch (err: any) {
      toast({
        title: "Google Login Failed",
        description: err.message || "Error during sign-in",
        variant: "destructive",
      });
    }
  };

  // ✅ Initialize Google Sign-In button
  useEffect(() => {
    if (window.google && GOOGLE_CLIENT_ID) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInDiv"),
        { theme: "outline", size: "large", width: "100%" }
      );
    }
  }, [GOOGLE_CLIENT_ID]);

  // ✅ Normal Email Login
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Welcome back! 🎉",
        description: "Successfully logged in!",
      });
      navigate("/");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-electric-blue/5 to-coral-pink/5 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--electric-blue))_0%,transparent_50%)] opacity-[0.02]" />
      <div className="w-full max-w-md relative z-10">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6 hover:bg-electric-blue/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>

        <Card className="creative-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-electric-blue/20 to-coral-pink/20 rounded-2xl flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-electric-blue" />
            </div>
            <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
            <p className="text-foreground/70">
              Sign in to your account to continue detecting deepfakes
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-foreground/50" />
                    ) : (
                      <Eye className="w-4 h-4 text-foreground/50" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full creative-button"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Google Login Section */}
            <div className="flex items-center justify-center my-2">
              <div className="w-1/4 border-t" />
              <span className="px-2 text-sm text-muted-foreground">or</span>
              <div className="w-1/4 border-t" />
            </div>

            <div id="googleSignInDiv" className="w-full flex justify-center">
              {/* Google Sign-In button will render here */}
            </div>

            <div className="text-center space-y-4 mt-4">
              <p className="text-sm text-foreground/70">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-electric-blue hover:underline font-medium"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
