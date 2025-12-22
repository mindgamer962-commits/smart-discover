import { useParams, useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { mockProducts } from "@/data/mockData";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Star, ExternalLink, Check, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = mockProducts.find((p) => p.id === id);

  if (!product) {
    return (
      <MobileLayout showNav={false}>
        <div className="flex items-center justify-center h-screen">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </MobileLayout>
    );
  }

  const wishlisted = isWishlisted(product.id);

  return (
    <MobileLayout showNav={false}>
      <div className="min-h-screen">
        {/* Image Section */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square bg-secondary"
          >
            <img
              src={product.image}
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
              onClick={() => toggleWishlist(product.id)}
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
          {product.discount && (
            <div className="absolute bottom-4 left-4 bg-primary text-primary-foreground text-sm font-semibold px-3 py-1.5 rounded-lg">
              -{product.discount}% OFF
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
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm text-muted-foreground">Verified product</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          {/* Features */}
          {product.features && (
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
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card/95 backdrop-blur-xl border-t border-border">
          <Button
            className="w-full h-14 text-lg font-semibold rounded-xl shadow-glow"
            onClick={() => window.open(product.affiliateUrl, "_blank")}
          >
            <ExternalLink className="w-5 h-5 mr-2" />
            Buy Now
          </Button>
        </div>
      </div>
    </MobileLayout>
  );
}
