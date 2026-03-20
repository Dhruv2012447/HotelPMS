"use client";

import Link from "next/link";
import { usePathname, useParams } from "next/navigation";
import { MdDashboard, MdPersonAdd, MdPeople } from "react-icons/md";
import { useState } from "react";

export default function HotelSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const { id } = useParams();

  const [dropdown, setDropdown] = useState(false);
  const isStaffPage = pathname.includes("staff-activity");

  const handleClick = () => {
    if (setOpen) setOpen(false); // auto close on mobile
  };

  return (
    <div
      className={`
        fixed top-50 left-0 h-screen w-64 z-50
        bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl
        transform ${open ? "translate-x-0" : "-translate-x-full"}
        transition-transform duration-300
        lg:translate-x-0
      `}
    >

      {/* Header */}
      <div className="p-6 text-2xl font-bold border-b border-gray-700">
        🏨 Hotel Panel
      </div>

      <div className="p-4 space-y-3">

        {/* Dashboard */}
        <Link
          href={`/hotel/${id}`}
          onClick={handleClick}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            pathname === `/hotel/${id}`
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          <MdDashboard size={20} />
          Dashboard
        </Link>

        {/* Add GM */}
        <Link
          href={`/hotel/${id}/create-gm`}
          onClick={handleClick}
          className={`flex items-center gap-3 p-3 rounded-lg ${
            pathname.includes("create-gm")
              ? "bg-blue-600"
              : "hover:bg-gray-700"
          }`}
        >
          <MdPersonAdd size={20} />
          Add GM
        </Link>

        {/* Staff Activity */}
        <div>
          <div
            onClick={() => setDropdown(!dropdown)}
            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
              isStaffPage ? "bg-blue-600" : "hover:bg-gray-700"
            }`}
          >
            <MdPeople size={20} />
            Staff Activity
          </div>

          {(dropdown || isStaffPage) && (
            <div className="ml-6 mt-2 space-y-1">
              {["GM", "receptionist", "housekeeping", "laundry"].map((role) => (
                <Link
                  key={role}
                  href={`/hotel/${id}/staff-activity/${role}`}
                  onClick={handleClick}
                >
                  <div
                    className={`px-3 py-2 text-sm rounded ${
                      pathname.includes(role)
                        ? "bg-blue-500"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {role}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}