import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockCategories } from "@/data/mockData";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Smartphone, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Dumbbell, 
  BookOpen,
  Gamepad2,
  Car
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

export default function AdminCategories() {
  const [categories, setCategories] = useState(
    mockCategories.map((c) => ({ ...c, active: true }))
  );

  const toggleCategory = (id: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-end">
          <Button className="shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((category, index) => {
            const Icon = categoryIcons[category.id] || Smartphone;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-2xl p-6 shadow-sm border border-border transition-opacity ${
                  !category.active ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Icon className="w-7 h-7 text-primary" />
                  </div>
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {category.active ? (
                      <ToggleRight className="w-6 h-6 text-success" />
                    ) : (
                      <ToggleLeft className="w-6 h-6" />
                    )}
                  </button>
                </div>

                <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {category.itemCount} products
                </p>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="icon" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AdminLayout>
  );
}
