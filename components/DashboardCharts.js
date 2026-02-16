"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "@fontsource/poppins"; // Ensure installed: npm install @fontsource/poppins

export default function DashboardCharts({ hotels }) {
  const basic = hotels.filter((h) => h.sub === "Basic").length;
  const pro = hotels.filter((h) => h.sub === "Pro").length;
  const custom = hotels.filter((h) => h.sub === "Custom").length;

  const barData = [
    { name: "Total Hotels", value: hotels.length },
    { name: "Basic Plan", value: basic },
    { name: "Pro Plan", value: pro },
    { name: "Custom Plan", value: custom },
  ];

  const pieData = [
    { name: "Basic", value: basic },
    { name: "Pro", value: pro },
    { name: "Custom", value: custom },
  ];

  const COLORS = ["#6366F1", "#22C55E", "#F97316"]; // Indigo, Green, Orange

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-poppins">
      {/* ===== Bar Chart Card ===== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Hotels Overview</h3>
          <p className="text-sm text-gray-500 mt-1">
            Distribution of hotels by subscription plan
          </p>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={barData}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: "#4B5563" }}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#4B5563" }}
              axisLine={{ stroke: "#D1D5DB" }}
              tickLine={false}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {barData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ===== Pie Chart Card ===== */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Subscription Distribution</h3>
          <p className="text-sm text-gray-500 mt-1">
            Percentage of plans used by hotels
          </p>
        </div>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={5}
              label={{ fontSize: 14, fontFamily: "Poppins" }}
            >
              {pieData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend iconType="circle" wrapperStyle={{ fontFamily: "Poppins", color: "#374151" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
