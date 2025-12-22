import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Smartphone, 
  Shirt, 
  Sparkles, 
  Home as HomeIcon, 
  Dumbbell, 
  BookOpen,
  Gamepad2,
  Car,
  Package
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [categoryIcon, setCategoryIcon] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*, products(id)")
        .order("name");

      if (error) throw error;
      return data?.map(cat => ({
        ...cat,
        productCount: cat.products?.length || 0
      })) || [];
    },
  });

  const addCategoryMutation = useMutation({
    mutationFn: async ({ name, icon }: { name: string; icon: string }) => {
      const { error } = await supabase.from("categories").insert({ name, icon });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category added successfully!" });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error adding category", description: error.message, variant: "destructive" });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name, icon }: { id: string; name: string; icon: string }) => {
      const { error } = await supabase.from("categories").update({ name, icon }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category updated successfully!" });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error updating category", description: error.message, variant: "destructive" });
    },
  });

  const toggleCategoryMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("categories").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating category", description: error.message, variant: "destructive" });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
      toast({ title: "Category deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting category", description: error.message, variant: "destructive" });
    },
  });

  const openAddDialog = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryIcon("");
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: any) => {
    setEditingCategory(category.id);
    setCategoryName(category.name);
    setCategoryIcon(category.icon || "");
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryIcon("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      toast({ title: "Category name is required", variant: "destructive" });
      return;
    }

    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory, name: categoryName, icon: categoryIcon });
    } else {
      addCategoryMutation.mutate({ name: categoryName, icon: categoryIcon });
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Categories">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Categories">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex justify-end">
          <Button className="shadow-glow" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>

        {/* Categories Grid */}
        {categories && categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
            No categories yet. Add your first category!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories?.map((category, index) => {
              const iconKey = category.icon?.toLowerCase() || category.name.toLowerCase();
              const Icon = categoryIcons[iconKey] || Package;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`bg-card rounded-2xl p-6 shadow-sm border border-border transition-opacity ${
                    !category.is_active ? "opacity-50" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <button
                      onClick={() => toggleCategoryMutation.mutate({ id: category.id, is_active: !category.is_active })}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {category.is_active ? (
                        <ToggleRight className="w-6 h-6 text-success" />
                      ) : (
                        <ToggleLeft className="w-6 h-6" />
                      )}
                    </button>
                  </div>

                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {category.productCount} products
                  </p>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(category)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Category Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g., Electronics"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon Key</Label>
              <Input
                id="icon"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                placeholder="e.g., electronics, fashion, beauty"
              />
              <p className="text-xs text-muted-foreground">
                Available: electronics, fashion, beauty, home, sports, books, toys, automotive
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addCategoryMutation.isPending || updateCategoryMutation.isPending}
              >
                {(addCategoryMutation.isPending || updateCategoryMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingCategory ? "Update" : "Add"} Category
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
