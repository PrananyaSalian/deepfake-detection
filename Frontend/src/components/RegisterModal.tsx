import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Brain, Mail } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/apiFetch";
import { useToast } from "../hooks/use-toast";

interface RegisterResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin: () => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  open,
  onOpenChange,
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { registerAndLogin } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const response = await apiFetch<RegisterResponse>("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });

      const { token, user } = response;
      if (!token) throw new Error("No token returned from server");

      // ✅ Map backend "_id" → frontend "id"
      const mappedUser = { id: user._id, name: user.name, email: user.email };

      registerAndLogin?.(token, mappedUser);

      toast({
        title: "Account created successfully",
        description: `Welcome, ${mappedUser.name || mappedUser.email}!`,
      });

      onOpenChange(false);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An error occurred during signup";
      toast({
        title: "Registration failed",
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
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-logo-gradient">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Join{" "}
            <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              DeepfakeGuard
            </span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="register-name">Name</Label>
              <Input
                id="register-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Creating..." : "Create Account"}
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
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="font-medium text-primary hover:underline"
          >
            Sign in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
