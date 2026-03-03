"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdDashboard, MdPersonAdd } from "react-icons/md";

export default function HotelSidebar({ hotelId, hotelCode }) {
  const pathname = usePathname();

  // If no hotelId passed, don't fetch anything
  if (!hotelId) {
    return (
      <div className="w-64 h-screen fixed bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          🏨 Hotel Panel
        </div>
        <div className="p-4 text-gray-400">Loading...</div>
      </div>
    );
  }

  const links = [
    {
      name: "Dashboard",
      href: `/hotel/${hotelId}`,
      icon: <MdDashboard size={20} />,
    },
    {
      name: "Add GM",
      href: `/hotel/${hotelId}/create-gm`,
      icon: <MdPersonAdd size={20} />,
    },
  ];

  return (
    <div className="w-64 h-screen fixed bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        🏨 {hotelCode || "Hotel Panel"}
      </div>

      <div className="p-4 space-y-3">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              pathname === link.href ? "bg-blue-600 shadow-lg" : "hover:bg-gray-700"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
