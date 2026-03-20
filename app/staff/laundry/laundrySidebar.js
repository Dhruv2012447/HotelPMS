"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Shirt, ClipboardList } from "lucide-react";

export default function LaundrySidebar({ staffId }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: `/staff/laundry/${staffId}`,
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "New Request",
      href: `/staff/laundry/${staffId}/new`,
      icon: <Shirt size={18} />,
    },
  ];

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 shadow-2xl">
      
      {/* Header */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold tracking-wide">
          Laundry
        </h2>
        <p className="text-gray-400 text-sm mt-1">
          Hotel PMS Panel
        </p>
      </div>

      {/* Menu */}
      <div className="space-y-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium
                ${
                  isActive
                    ? "bg-purple-600 shadow-lg"
                    : "hover:bg-gray-700 text-gray-300 hover:text-white"
                }
              `}
            >
              {item.icon}
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}