import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminRoute } from "@/components/auth/AdminRoute";
import SplashScreen from "./pages/SplashScreen";
import HomePage from "./pages/HomePage";
import CategoriesPage from "./pages/CategoriesPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import WishlistPage from "./pages/WishlistPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Mobile App Routes */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/categories/:id" element={<CategoriesPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
            <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
            <Route path="/admin/banners" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AdminAnalytics /></AdminRoute>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
