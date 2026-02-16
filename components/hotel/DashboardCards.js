"use client";
import { MdWorkspacePremium, MdVerified, MdEvent } from "react-icons/md";

export default function DashboardCards({ hotel }) {
  const expiryDate = new Date(hotel.expiresAt);
  const today = new Date();
  const diffDays = Math.ceil(
    (expiryDate - today) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

      {/* 🔹 Subscription Card */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-blue-600 
                      text-white p-8 rounded-3xl shadow-xl 
                      hover:scale-105 transition-all duration-300">
        <MdWorkspacePremium size={40} className="opacity-80 mb-4" />
        <p className="text-sm opacity-90">Subscription Plan</p>
        <h2 className="text-3xl font-bold mt-2">{hotel.sub}</h2>
      </div>

      {/* 🔹 Status Card */}
      <div className={`relative p-8 rounded-3xl shadow-xl 
                      hover:scale-105 transition-all duration-300
                      ${
                        hotel.manualStatus === "Active"
                          ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                          : "bg-gradient-to-br from-red-500 to-pink-600 text-white"
                      }`}>
        <MdVerified size={40} className="opacity-80 mb-4" />
        <p className="text-sm opacity-90">Current Status</p>
        <h2 className="text-3xl font-bold mt-2">
          {hotel.manualStatus}
        </h2>
      </div>

      {/* 🔹 Expiry Card */}
      <div className="relative bg-gradient-to-br from-purple-600 to-indigo-700 
                      text-white p-8 rounded-3xl shadow-xl 
                      hover:scale-105 transition-all duration-300">
        <MdEvent size={40} className="opacity-80 mb-4" />
        <p className="text-sm opacity-90">Plan Expiry</p>
        <h2 className="text-xl font-bold mt-2">
          {expiryDate.toDateString()}
        </h2>

        <div className="mt-3 text-sm bg-white/20 px-3 py-1 rounded-full inline-block">
          {diffDays > 0
            ? `${diffDays} days remaining`
            : "Expired"}
        </div>
      </div>

    </div>
  );
}
