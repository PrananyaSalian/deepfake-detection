import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Password mismatch", description: "Please make sure your passwords match", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formData.name, email: formData.email, password: formData.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      localStorage.setItem("token", data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      toast({ title: "Account created! 🎉", description: "Welcome to DeepfakeGuard!" });
      navigate("/");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-electric-blue/5 to-coral-pink/5 flex items-center justify-center px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--electric-blue))_0%,transparent_50%)] opacity-[0.02]"></div>
      <div className="w-full max-w-md relative z-10">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 hover:bg-electric-blue/10">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Button>
        <Card className="creative-card">
          <CardHeader className="text-center space-y-4">
            <div className="w-16 h-16 bg-gradient-to-br from-coral-pink/20 to-neon-purple/20 rounded-2xl flex items-center justify-center mx-auto">
              <UserPlus className="w-8 h-8 text-coral-pink" />
            </div>
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <p className="text-foreground/70">Join thousands protecting digital truth with AI</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={(e) => handleInputChange("password", e.target.value)} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="w-4 h-4 text-foreground/50" /> : <Eye className="w-4 h-4 text-foreground/50" />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" value={formData.confirmPassword} onChange={(e) => handleInputChange("confirmPassword", e.target.value)} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-foreground/50" /> : <Eye className="w-4 h-4 text-foreground/50" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full creative-button" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <div className="text-center space-y-4">
              <p className="text-sm text-foreground/70">
                Already have an account?{" "}
                <Link to="/login" className="text-electric-blue hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;
