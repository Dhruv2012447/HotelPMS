"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReceptionistSidebar({ staffId }) {
  const pathname = usePathname();

  const menuItems = [
    {
      name: "Dashboard",
      href: `/staff/receptionist/${staffId}`,
      icon: "📊",
    },
    {
      name: "Add / Edit Rooms",
      href: `/staff/receptionist/${staffId}/rooms`,
      icon: "🏨",
    },
    {
      name: "Add Guest",
      href: `/staff/receptionist/${staffId}/add-guest`,
      icon: "🧾",
    },
  ];

  return (
    <div className="w-64 bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-gray-200 min-h-screen px-5 py-6 shadow-xl flex flex-col border-r border-gray-800">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white">
          🏨 Reception
        </h2>
        <p className="text-xs text-gray-400 mt-1">
          Hotel PMS
        </p>
      </div>

      {/* MENU */}
      <ul className="space-y-2 flex-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl
                  text-sm font-medium
                  transition-all duration-200
                  ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-md"
                      : "hover:bg-gray-800 hover:text-white"
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* FOOTER */}
      <div className="pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
        © {new Date().getFullYear()} Hotel PMS
      </div>
    </div>
  );
}