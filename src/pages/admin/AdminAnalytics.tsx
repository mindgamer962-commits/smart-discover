import { AdminLayout } from "@/components/layout/AdminLayout";
import { mockAnalytics, mockProducts } from "@/data/mockData";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const categoryData = [
  { name: "Electronics", value: 35, color: "hsl(217, 91%, 60%)" },
  { name: "Fashion", value: 28, color: "hsl(142, 71%, 45%)" },
  { name: "Beauty", value: 18, color: "hsl(38, 92%, 50%)" },
  { name: "Home", value: 12, color: "hsl(280, 70%, 50%)" },
  { name: "Other", value: 7, color: "hsl(220, 9%, 46%)" },
];

export default function AdminAnalytics() {
  return (
    <AdminLayout title="Analytics">
      <div className="space-y-6">
        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Clicks Over Time */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Daily Clicks</h3>
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

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-2xl p-6 shadow-sm border border-border"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">Category Distribution</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(0, 0%, 100%)",
                      border: "1px solid hsl(220, 13%, 91%)",
                      borderRadius: "12px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-sm text-muted-foreground">{cat.name}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Weekly Performance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockAnalytics.clicksByDay}>
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
                <Bar
                  dataKey="clicks"
                  fill="hsl(217, 91%, 60%)"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Clicked Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Most Clicked Products</h3>
          <div className="space-y-4">
            {mockProducts.slice(0, 5).map((product, index) => (
              <div key={product.id} className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                  {index + 1}
                </span>
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{product.title}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {(Math.random() * 1000 + 500).toFixed(0)} clicks
                  </p>
                  <p className="text-sm text-success">+{(Math.random() * 20 + 5).toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
