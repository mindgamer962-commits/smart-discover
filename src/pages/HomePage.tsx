import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { SearchBar } from "@/components/ui/SearchBar";
import { BannerSlider } from "@/components/ui/BannerSlider";
import { ProductCard } from "@/components/ui/ProductCard";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { mockProducts, mockBanners, mockCategories } from "@/data/mockData";
import { useWishlist } from "@/hooks/useWishlist";
import { motion } from "framer-motion";
import { 
  Smartphone, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Dumbbell, 
  BookOpen,
  Gamepad2,
  Car,
  ChevronRight
} from "lucide-react";

const categoryIcons: Record<string, any> = {
  electronics: Smartphone,
  fashion: Shirt,
  beauty: Sparkles,
  home: HomeIcon,
  sports: Dumbbell,
  books: BookOpen,
  toys: Gamepad2,
  automotive: Car,
};

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toggleWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();

  const featuredProducts = mockProducts.slice(0, 4);
  const trendingProducts = mockProducts.slice(2, 6);

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4 space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Discover</h1>
            <p className="text-sm text-muted-foreground">Find the best deals</p>
          </div>
        </motion.div>

        {/* Search Bar */}
        <SearchBar value={searchQuery} onChange={setSearchQuery} />

        {/* Banner Slider */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <BannerSlider banners={mockBanners} />
        </motion.div>

        {/* Categories */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Categories</h2>
            <button 
              onClick={() => navigate("/categories")}
              className="text-sm text-primary flex items-center gap-1"
            >
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {mockCategories.slice(0, 8).map((category) => {
              const Icon = categoryIcons[category.id] || Smartphone;
              return (
                <CategoryCard
                  key={category.id}
                  icon={Icon}
                  name={category.name}
                  onClick={() => navigate(`/categories/${category.id}`)}
                />
              );
            })}
          </div>
        </motion.section>

        {/* Featured Products */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Featured Products</h2>
            <button className="text-sm text-primary flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isWishlisted={isWishlisted(product.id)}
                onWishlistToggle={toggleWishlist}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </motion.section>

        {/* Trending Today */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Trending Today</h2>
            <button className="text-sm text-primary flex items-center gap-1">
              See All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                isWishlisted={isWishlisted(product.id)}
                onWishlistToggle={toggleWishlist}
                onClick={() => navigate(`/product/${product.id}`)}
              />
            ))}
          </div>
        </motion.section>
      </div>
    </MobileLayout>
  );
}
