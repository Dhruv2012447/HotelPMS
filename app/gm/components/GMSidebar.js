"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function GMSidebar({ id }) {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: `/gm/${id}` },
    { name: "Add Staff", href: `/gm/${id}/add-staff` },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 shadow-sm p-6">

      <h2 className="text-2xl font-bold text-blue-600 mb-10">
        Hotel PMS
      </h2>

      <div className="space-y-3">
        {links.map((link, index) => {
          const isActive = pathname === link.href;

          return (
            <Link key={index} href={link.href}>
              <div
                className={`px-4 py-3 rounded-lg cursor-pointer font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }
                `}
              >
                {link.name}
              </div>
            </Link>
          );
        })}
      </div>

    </div>
  );
}
