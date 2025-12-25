import { useState } from "react";
import { AdminLayout } from "@/components/layout/AdminLayout";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Loader2, Image, Link, Type, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BANNER_SIZES = [
  { value: "small", label: "Small (200px)", height: "200px" },
  { value: "medium", label: "Medium (280px)", height: "280px" },
  { value: "large", label: "Large (360px)", height: "360px" },
  { value: "full", label: "Full Screen (480px)", height: "480px" },
];

interface BannerFormData {
  title: string;
  subtitle: string;
  imageUrl: string;
  ctaText: string;
  ctaUrl: string;
  displayOrder: number;
}

export default function AdminBanners() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<string | null>(null);
  const [formData, setFormData] = useState<BannerFormData>({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "",
    ctaUrl: "",
    displayOrder: 0,
  });
  const [bannerSize, setBannerSize] = useState("medium");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: banners, isLoading } = useQuery({
    queryKey: ["admin-banners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("display_order");

      if (error) throw error;
      return data || [];
    },
  });

  const addBannerMutation = useMutation({
    mutationFn: async (data: BannerFormData) => {
      const { error } = await supabase.from("banners").insert({
        title: data.title,
        subtitle: data.subtitle || null,
        image_url: data.imageUrl || null,
        cta_text: data.ctaText || null,
        cta_url: data.ctaUrl || null,
        display_order: data.displayOrder,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast({ title: "Banner added successfully!" });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error adding banner", description: error.message, variant: "destructive" });
    },
  });

  const updateBannerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BannerFormData }) => {
      const { error } = await supabase
        .from("banners")
        .update({
          title: data.title,
          subtitle: data.subtitle || null,
          image_url: data.imageUrl || null,
          cta_text: data.ctaText || null,
          cta_url: data.ctaUrl || null,
          display_order: data.displayOrder,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast({ title: "Banner updated successfully!" });
      closeDialog();
    },
    onError: (error: Error) => {
      toast({ title: "Error updating banner", description: error.message, variant: "destructive" });
    },
  });

  const toggleBannerMutation = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase.from("banners").update({ is_active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error updating banner", description: error.message, variant: "destructive" });
    },
  });

  const deleteBannerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-banners"] });
      toast({ title: "Banner deleted successfully!" });
    },
    onError: (error: Error) => {
      toast({ title: "Error deleting banner", description: error.message, variant: "destructive" });
    },
  });

  const openAddDialog = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "",
      ctaUrl: "",
      displayOrder: (banners?.length || 0) + 1,
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: any) => {
    setEditingBanner(banner.id);
    setFormData({
      title: banner.title,
      subtitle: banner.subtitle || "",
      imageUrl: banner.image_url || "",
      ctaText: banner.cta_text || "",
      ctaUrl: banner.cta_url || "",
      displayOrder: banner.display_order,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "",
      ctaUrl: "",
      displayOrder: 0,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({ title: "Banner title is required", variant: "destructive" });
      return;
    }

    if (editingBanner) {
      updateBannerMutation.mutate({ id: editingBanner, data: formData });
    } else {
      addBannerMutation.mutate(formData);
    }
  };

  const updateFormField = (field: keyof BannerFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedSize = BANNER_SIZES.find((s) => s.value === bannerSize) || BANNER_SIZES[1];

  if (isLoading) {
    return (
      <AdminLayout title="Banners">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Banners">
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex items-center gap-3">
            <Label className="text-sm text-muted-foreground">Preview Size:</Label>
            <Select value={bannerSize} onValueChange={setBannerSize}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover z-50">
                {BANNER_SIZES.map((size) => (
                  <SelectItem key={size.value} value={size.value}>
                    {size.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="shadow-glow" onClick={openAddDialog}>
            <Plus className="w-4 h-4 mr-2" />
            Add Banner
          </Button>
        </div>

        {/* Banners List */}
        {banners && banners.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border">
            <Image className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No banners yet. Add your first banner!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {banners?.map((banner, index) => (
              <motion.div
                key={banner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-card rounded-2xl overflow-hidden shadow-sm border border-border transition-opacity ${
                  !banner.is_active ? "opacity-50" : ""
                }`}
              >
                {/* Banner Preview */}
                <div
                  className="relative bg-gradient-to-br from-primary/20 to-secondary overflow-hidden"
                  style={{ height: selectedSize.height }}
                >
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  
                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{banner.title}</h3>
                    {banner.subtitle && (
                      <p className="text-white/80 mb-3">{banner.subtitle}</p>
                    )}
                    {banner.cta_text && (
                      <span className="inline-block bg-white text-foreground px-4 py-2 rounded-lg font-medium w-fit">
                        {banner.cta_text}
                      </span>
                    )}
                  </div>

                  {/* Order Badge */}
                  <div className="absolute top-4 left-4 bg-foreground/80 text-background px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                    <GripVertical className="w-4 h-4" />
                    Order: {banner.display_order}
                  </div>

                  {/* Status Toggle */}
                  <button
                    onClick={() => toggleBannerMutation.mutate({ id: banner.id, is_active: !banner.is_active })}
                    className="absolute top-4 right-4 bg-background/90 p-2 rounded-lg hover:bg-background transition-colors"
                  >
                    {banner.is_active ? (
                      <ToggleRight className="w-6 h-6 text-success" />
                    ) : (
                      <ToggleLeft className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>
                </div>

                {/* Actions Bar */}
                <div className="p-4 flex flex-wrap gap-2 bg-secondary/30">
                  <div className="flex-1 min-w-0 flex items-center gap-2 text-sm text-muted-foreground">
                    {banner.cta_url && (
                      <span className="flex items-center gap-1 truncate">
                        <Link className="w-4 h-4" />
                        <span className="truncate">{banner.cta_url}</span>
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(banner)}>
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => {
                        if (confirm("Are you sure you want to delete this banner?")) {
                          deleteBannerMutation.mutate(banner.id);
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Banner Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                <Type className="w-4 h-4 inline mr-2" />
                Banner Title *
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => updateFormField("title", e.target.value)}
                placeholder="e.g., Summer Sale"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (optional)</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => updateFormField("subtitle", e.target.value)}
                placeholder="e.g., Up to 50% off on selected items"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                <Image className="w-4 h-4 inline mr-2" />
                Image URL (optional)
              </Label>
              <Input
                id="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={(e) => updateFormField("imageUrl", e.target.value)}
                placeholder="https://example.com/banner-image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2 rounded-lg overflow-hidden border border-border">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Paste an image URL to use as banner background
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ctaText">Button Text</Label>
                <Input
                  id="ctaText"
                  value={formData.ctaText}
                  onChange={(e) => updateFormField("ctaText", e.target.value)}
                  placeholder="e.g., Shop Now"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  min={0}
                  value={formData.displayOrder}
                  onChange={(e) => updateFormField("displayOrder", parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctaUrl">
                <Link className="w-4 h-4 inline mr-2" />
                Button Link URL
              </Label>
              <Input
                id="ctaUrl"
                type="url"
                value={formData.ctaUrl}
                onChange={(e) => updateFormField("ctaUrl", e.target.value)}
                placeholder="https://example.com/sale"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={addBannerMutation.isPending || updateBannerMutation.isPending}
              >
                {(addBannerMutation.isPending || updateBannerMutation.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {editingBanner ? "Update" : "Add"} Banner
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
