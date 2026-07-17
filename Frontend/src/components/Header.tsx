import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";
import { Shield, Menu, X, History, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl border-b border-foreground/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-electric-blue to-coral-pink rounded-2xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Deepfake<span className="accent-text">Guard</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link to="/history">
                  <Button variant="ghost" className="font-medium hover:bg-electric-blue/10 hover:text-electric-blue">
                    <History className="w-4 h-4 mr-2" />
                    History
                  </Button>
                </Link>

                <div className="flex items-center gap-2 text-sm text-foreground/80">
                  <User className="w-4 h-4" />
                  <span className="max-w-[12ch] truncate">{user?.name || user?.email || "User"}</span>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="font-medium hover:bg-electric-blue/10 hover:text-electric-blue"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  className="font-medium hover:bg-electric-blue/10 hover:text-electric-blue"
                  onClick={() => setShowLoginModal(true)}
                >
                  Sign In
                </Button>
                <Button className="creative-button font-medium" onClick={() => setShowRegisterModal(true)}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMobileMenuOpen((s) => !s)}
              variant="ghost"
              size="sm"
              className="hover:bg-electric-blue/10"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-lg border-t border-foreground/10">
            <div className="px-6 py-4 space-y-3">
              {isLoggedIn ? (
                <>
                  <Link to="/history" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start font-medium hover:bg-electric-blue/10 hover:text-electric-blue">
                      <History className="w-4 h-4 mr-2" /> History
                    </Button>
                  </Link>

                  <div className="px-2 py-1 text-sm text-foreground/80 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span className="max-w-[18ch] truncate">{user?.name || user?.email || "User"}</span>
                  </div>

                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    className="w-full justify-start font-medium hover:bg-electric-blue/10 hover:text-electric-blue"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={() => {
                      setShowLoginModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                    className="w-full justify-start font-medium hover:bg-electric-blue/10 hover:text-electric-blue"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRegisterModal(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full creative-button font-medium"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      <LoginModal
        open={showLoginModal}
        onOpenChange={setShowLoginModal}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
};

export default Header;
