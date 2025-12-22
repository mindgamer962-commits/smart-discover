import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockUsers } from "@/data/mockData";
import { motion } from "framer-motion";
import { Search, Mail, Calendar, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Users">
      <div className="space-y-6">
        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Users Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-semibold text-primary">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined {new Date(user.signupDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {user.wishlistCount} items in wishlist
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
