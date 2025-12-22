import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { ProductCard } from "@/components/ui/ProductCard";
import { mockProducts } from "@/data/mockData";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist, isWishlisted, clearWishlist } = useWishlist();

  const wishlistedProducts = mockProducts.filter((p) => wishlist.includes(p.id));

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wishlist</h1>
            <p className="text-sm text-muted-foreground">
              {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearWishlist}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </motion.div>

        {/* Content */}
        {wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Heart className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold text-foreground mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Start adding products you love
            </p>
            <Button onClick={() => navigate("/home")}>
              Explore Products
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 gap-3"
          >
            {wishlistedProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isWishlisted={isWishlisted(product.id)}
                onWishlistToggle={toggleWishlist}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </MobileLayout>
  );
}
