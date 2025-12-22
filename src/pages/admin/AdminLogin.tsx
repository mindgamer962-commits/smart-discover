import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Mail, Lock, Eye, EyeOff, Shield, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, isAdmin, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in as admin
  if (!authLoading && user && isAdmin) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Check if the user has admin role after login
    toast({
      title: "Checking admin access...",
      description: "Verifying your permissions.",
    });

    // Small delay to allow role check to complete
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-glow">
            <ShoppingBag className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Admin Login</h1>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-4 h-4 text-primary" />
            <p className="text-muted-foreground text-sm">Secure admin access</p>
          </div>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="space-y-4 bg-card p-8 rounded-2xl shadow-lg border border-border"
        >
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 pl-12 rounded-xl bg-secondary border-0"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 pl-12 pr-12 rounded-xl bg-secondary border-0"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Eye className="w-5 h-5 text-muted-foreground" />
              )}
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 rounded-xl text-lg font-semibold shadow-glow"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In to Dashboard"
            )}
          </Button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Back to App
            </button>
          </div>
        </motion.form>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20"
        >
          <p className="text-sm text-center text-muted-foreground">
            <strong className="text-foreground">Need an admin account?</strong><br />
            Contact the system administrator to get admin access.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
