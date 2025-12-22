import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockAnalytics, mockProducts } from "@/data/mockData";
import { motion } from "framer-motion";
import { Users, Package, MousePointer, TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const stats = [
  {
    label: "Total Users",
    value: mockAnalytics.totalUsers.toLocaleString(),
    icon: Users,
    change: "+12.5%",
    up: true,
  },
  {
    label: "Total Products",
    value: mockAnalytics.totalProducts.toLocaleString(),
    icon: Package,
    change: "+8.2%",
    up: true,
  },
  {
    label: "Total Clicks",
    value: mockAnalytics.totalClicks.toLocaleString(),
    icon: MousePointer,
    change: "+23.1%",
    up: true,
  },
  {
    label: "Conversion Rate",
    value: `${mockAnalytics.conversionRate}%`,
    icon: TrendingUp,
    change: "-2.4%",
    up: false,
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-sm border border-border"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${stat.up ? "text-success" : "text-destructive"}`}>
                  {stat.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Clicks Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Clicks Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockAnalytics.clicksByDay}>
                  <defs>
                    <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                  <XAxis dataKey="date" stroke="hsl(220, 9%, 46%)" fontSize={12} />
                  <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
                      borderRadius: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="clicks"
                    stroke="hsl(217, 91%, 60%)"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorClicks)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Top Products */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Products</h3>
            <div className="space-y-4">
              {mockProducts.slice(0, 5).map((product, index) => (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-foreground">
                    {index + 1}
                  </span>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {product.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
