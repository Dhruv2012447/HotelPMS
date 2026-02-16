"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { MdDashboard, MdPersonAdd } from "react-icons/md";

export default function HotelSidebar() {
  const pathname = usePathname();
  const { id } = useParams(); // ✅ Get hotel id from URL

  const links = [
    {
      name: "Dashboard",
      href: `/hotel/${id}`, // ✅ Link to hotel dashboard using id
      icon: <MdDashboard size={20} />,
    },
    {
      name: "Add GM",
      href: `/hotel/${id}/create-gm`,
      icon: <MdPersonAdd size={20} />,
    },
  ];

  return (
    <div className="w-64 h-screen fixed bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl">
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        🏨 Hotel Panel
      </div>

      <div className="p-4 space-y-3">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              pathname === link.href
                ? "bg-blue-600 shadow-lg"
                : "hover:bg-gray-700"
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
