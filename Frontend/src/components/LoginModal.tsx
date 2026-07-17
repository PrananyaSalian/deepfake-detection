import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/apiFetch";
import { useToast } from "../hooks/use-toast";

// ✅ Define response type for the login API
interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  open,
  onOpenChange,
  onSwitchToRegister,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ✅ Type-safe API call
      const { token, user } = await apiFetch<LoginResponse>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      login(token, user);
      toast({
        title: "Login successful",
        description: `Welcome back ${user.name || user.email || ""}`,
      });

      onOpenChange(false);
      setEmail("");
      setPassword("");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-logo-gradient rounded-xl flex items-center justify-center mb-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Welcome back to{" "}
            <span className="logo-gradient">DeepfakeGuard</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-background px-2 text-sm text-muted-foreground">
                or
              </span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full">
            <Mail className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <button
            onClick={onSwitchToRegister}
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
