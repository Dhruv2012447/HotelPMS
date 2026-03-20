"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DashboardCharts from "@/components/DashboardCharts";
import "@fontsource/poppins"; // Make sure installed: npm install @fontsource/poppins

export default function SuperAdminDashboard() {
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const loadHotels = async () => {
      try {
        const res = await fetch("/api/hotels");
        const data = await res.json();
        setHotels(Array.isArray(data.hotels) ? data.hotels : []);
      } catch {
        setHotels([]);
      }
    };
    loadHotels();
  }, []);

  const getStatus = (hotel) => {
    if (hotel.manualStatus) return hotel.manualStatus;
    if (!hotel?.expiresAt) return "Active";
    return new Date() > new Date(hotel.expiresAt) ? "Due" : "Active";
  };

  const activeHotels = hotels.filter((h) => getStatus(h) === "Active").length;
  const dueHotels = hotels.filter((h) => getStatus(h) === "Due").length;

  return (
    <div className="px-4 md:px-10 py-8 bg-gradient-to-b from-[#f8fafc] to-[#eef2f7] min-h-screen font-poppins">
      {/* ===== Header ===== */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight">
          Super Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-2">
          Monitor all hotels, plans, and platform activity
        </p>
      </div>

      {/* ===== KPI Cards ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        <KpiCard title="Total Hotels" value={hotels.length} />
        <KpiCard title="Active Hotels" value={activeHotels} color="green" />
        <KpiCard title="Due Hotels" value={dueHotels} color="red" />
      </div>

      {/* ===== Charts ===== */}
      <div className="bg-white rounded-3xl shadow-md border p-6 md:p-10 mb-12 hover:shadow-xl transition">
        <DashboardCharts hotels={hotels} />
      </div>

      {/* ===== Hotels Table ===== */}
      <div className="bg-white rounded-3xl shadow-md border overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Hotels Overview</h2>
          <span className="text-sm text-gray-500">{hotels.length} Registered Hotels</span>
        </div>

        <div className="max-h-[560px] overflow-y-auto">
          <table className="w-full text-left border-collapse text-gray-700">
            <thead className="sticky top-0 bg-white z-10 shadow-sm">
              <tr className="text-xs uppercase tracking-wider border-b text-gray-500">
                <th className="px-6 py-4">Hotel</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4 hidden md:table-cell">Created</th>
                <th className="px-6 py-4 hidden md:table-cell">Expiry</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 hidden lg:table-cell text-center">Modules</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {hotels.map((h) => (
                <tr
                  key={h._id}
                  className="group border-b hover:bg-indigo-50/40 transition duration-200"
                >
                  {/* Hotel */}
                  <td className="px-6 py-5">
                    <div className="font-semibold text-gray-800 group-hover:text-indigo-700 transition">
                      {h.hotelId}
                    </div>
                    <div className="text-xs text-gray-400 break-all">{h.password}</div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
                      {h.sub}
                    </span>
                  </td>

                  {/* Dates */}
                  <td className="px-6 py-5 hidden md:table-cell">
                    {new Date(h.createdAt).toDateString()}
                  </td>
                  <td className="px-6 py-5 hidden md:table-cell">
                    {new Date(h.expiresAt).toDateString()}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <StatusBadge status={getStatus(h)} />
                  </td>

                  {/* Modules */}
                  <td className="px-6 py-5 hidden lg:table-cell text-center font-medium">
                    {h.access?.length || 0}
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5 text-right space-x-2">
                    <Link
                      href={`/super-admin/edit-hotel/${h._id}`}
                      className="inline-block px-4 py-2 bg-gray-900 text-white rounded-lg text-xs hover:scale-105 hover:shadow-lg transition"
                    >
                      Edit
                    </Link>
<Link
  href={`/super-admin/detail/${h._id}`}
  className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs hover:scale-105 hover:shadow-lg transition"
>
  Detail
</Link>
                  </td>
                </tr>
              ))}

              {hotels.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-14 text-gray-400">
                    No hotels added yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===== Components ===== */
function KpiCard({ title, value, color }) {
  const styles = {
    green: "from-green-50 to-white border-green-200",
    red: "from-red-50 to-white border-red-200",
    default: "from-white to-white",
  };

  return (
    <div
      className={`p-6 rounded-3xl border bg-gradient-to-br ${styles[color] || styles.default}
      shadow-sm hover:shadow-xl hover:-translate-y-1 transition duration-300`}
    >
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-4xl font-bold mt-3 text-gray-800">{value}</h2>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Active: "bg-green-100 text-green-700",
    Due: "bg-red-100 text-red-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${map[status]} shadow-sm`}
    >
      {status}
    </span>
  );
}
