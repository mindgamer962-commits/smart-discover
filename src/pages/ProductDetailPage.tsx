import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { useWishlist } from "@/hooks/useWishlist";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Star, ExternalLink, Check, Info, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted, isLoggedIn } = useWishlist();
  const { user } = useAuth();
  const { toast } = useToast();

  // Fetch product from database
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  const handleWishlistToggle = async () => {
    if (!product) return;
    
    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save items to your wishlist",
        action: (
          <button 
            onClick={() => navigate("/login")}
            className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm"
          >
            Sign In
          </button>
        ),
      });
      return;
    }
    await toggleWishlist(product.id);
  };

  // Record click when user clicks buy now
  const handleBuyNow = async () => {
    if (!product?.affiliate_url) return;

    // Record click if user is logged in
    if (user) {
      try {
        await supabase.from("product_clicks").insert({
          product_id: product.id,
          user_id: user.id,
        });
      } catch (error) {
        console.error("Error recording click:", error);
      }
    }

    // Validate URL before opening
    try {
      const url = new URL(product.affiliate_url);
      if (['http:', 'https:'].includes(url.protocol)) {
        window.open(product.affiliate_url, '_blank', 'noopener,noreferrer');
      }
    } catch {
      toast({
        title: "Invalid link",
        description: "This product link is not available",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MobileLayout>
    );
  }

  if (error || !product) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-muted-foreground">Product not found</p>
          <Button onClick={() => navigate("/home")}>Go Home</Button>
        </div>
      </MobileLayout>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen pb-24">
        {/* Image Section */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-secondary"
          >
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.title}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Top Navigation */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={handleWishlistToggle}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                wishlisted
                  ? "bg-primary text-primary-foreground"
                  : "bg-card/80 backdrop-blur-sm text-foreground"
              )}
            >
              <Heart className={cn("w-5 h-5", wishlisted && "fill-current")} />
            </button>
          </div>

          {/* Discount Badge */}
          {product.discount_percent && (
            <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg">
              -{product.discount_percent}% OFF
            </div>
          )}
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-4 py-6 space-y-6"
        >
          {/* Title & Rating */}
          <div>
            <h1 className="text-xl font-bold text-foreground mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-lg">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-sm font-medium text-foreground">
                  {product.rating ? Number(product.rating).toFixed(1) : "N/A"}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Verified product</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${Number(product.price).toFixed(2)}
            </span>
            {product.original_price && (
              <span className="text-lg text-muted-foreground line-through">
                ${Number(product.original_price).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Features */}
          {product.features && product.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Key Features</h3>
              <div className="space-y-2">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="flex items-start gap-3 p-4 bg-secondary rounded-xl">
            <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Price may vary on seller website. We earn a commission on qualifying purchases.
            </p>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        {product.affiliate_url && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-xl border-t border-border">
            <Button
              className="w-full h-14 text-lg font-semibold rounded-xl shadow-glow"
              onClick={handleBuyNow}
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Buy Now
            </Button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
