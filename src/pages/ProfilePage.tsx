import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useWishlist } from "@/hooks/useWishlist";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";
import { 
  User, 
  Heart, 
  Clock, 
  Moon, 
  Sun, 
  ChevronRight, 
  LogOut,
  Shield
} from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { wishlist } = useWishlist();
  const { theme, toggleTheme } = useTheme();

  const menuItems = [
    { icon: Heart, label: "Wishlist", value: `${wishlist.length} items`, path: "/wishlist" },
    { icon: Clock, label: "Recently Viewed", value: "8 items", path: "#" },
    { icon: Shield, label: "Privacy Policy", path: "#" },
  ];

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </motion.div>

        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Guest User</h2>
              <p className="text-sm text-muted-foreground">Sign in to sync your data</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-4 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Sign In
          </button>
        </motion.div>

        {/* Dark Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-4 shadow-sm mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <span className="font-medium text-foreground">Dark Mode</span>
            </div>
            <Switch
              checked={theme === "dark"}
              onCheckedChange={toggleTheme}
            />
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl shadow-sm overflow-hidden"
        >
          {menuItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => item.path && navigate(item.path)}
              className={`w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors ${
                index !== menuItems.length - 1 ? "border-b border-border" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value && (
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                )}
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>
            </button>
          ))}
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mt-6 flex items-center justify-center gap-2 py-4 text-destructive font-medium"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </motion.button>
      </div>
    </MobileLayout>
  );
}
