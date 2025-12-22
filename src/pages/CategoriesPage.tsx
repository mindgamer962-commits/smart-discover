import { useNavigate } from "react-router-dom";
import { MobileLayout } from "@/components/layout/MobileLayout";
import { CategoryCard } from "@/components/ui/CategoryCard";
import { mockCategories } from "@/data/mockData";
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
  ArrowLeft
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

export default function CategoriesPage() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      <div className="px-4 pt-6 pb-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </button>
          <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {mockCategories.map((category, index) => {
            const Icon = categoryIcons[category.id] || Smartphone;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <CategoryCard
                  icon={Icon}
                  name={category.name}
                  itemCount={category.itemCount}
                  onClick={() => navigate(`/categories/${category.id}`)}
                />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </MobileLayout>
  );
}
