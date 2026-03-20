"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function GMSidebar({ id }) {

  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isStaffPage = pathname.includes("staff-activity");

  const links = [
    { name: "Dashboard", href: `/gm/${id}` },
    { name: "Add Staff", href: `/gm/${id}/add-staff` },
    { name: "Attendance", href: `/gm/${id}/attendance` },
  ];

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 shadow-sm">

      {/* 🔥 INLINE ANIMATION (NO EXTRA FILE) */}
      <style jsx>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animateFade {
          animation: fadeSlide 0.25s ease-in-out;
        }
      `}</style>

      {/* TITLE */}
      <h2 className="text-xl font-semibold text-gray-800 mb-8 tracking-tight">
        Hotel PMS
      </h2>

      <div className="space-y-2">

        {/* MAIN LINKS */}
        {links.map((link, index) => {

          const isActive = pathname === link.href;

          return (
            <Link key={index} href={link.href}>
              <div
                className={`relative px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200
                ${
                  isActive
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:scale-[1.02]"
                }`}
              >

                {isActive && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-blue-800 rounded-r"></span>
                )}

                {link.name}
              </div>
            </Link>
          );
        })}


        {/* STAFF ACTIVITY */}
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >

          {/* TITLE */}
          <div
            className={`px-4 py-2 rounded-md text-sm font-medium cursor-pointer transition-all duration-200 flex justify-between items-center
            ${
              isStaffPage
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-gray-100 hover:scale-[1.02]"
            }`}
          >

            <span>Staff Activity</span>


          </div>

          {/* DROPDOWN */}
          {(open || isStaffPage) && (

            <div className="ml-4 mt-2 space-y-1 border-l pl-3 animateFade">

              <Link href={`/gm/${id}/staff-activity/receptionist`}>
                <div
                  className={`px-3 py-2 text-sm rounded cursor-pointer transition-all duration-200
                  ${
                    pathname.includes("receptionist")
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                  }`}
                >
                  Receptionist
                </div>
              </Link>

              <Link href={`/gm/${id}/staff-activity/housekeeping`}>
                <div
                  className={`px-3 py-2 text-sm rounded cursor-pointer transition-all duration-200
                  ${
                    pathname.includes("housekeeping")
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                  }`}
                >
                  Housekeeping
                </div>
              </Link>

              <Link href={`/gm/${id}/staff-activity/laundry`}>
                <div
                  className={`px-3 py-2 text-sm rounded cursor-pointer transition-all duration-200
                  ${
                    pathname.includes("laundry")
                      ? "bg-blue-100 text-blue-600"
                      : "text-gray-600 hover:bg-gray-100 hover:translate-x-1"
                  }`}
                >
                  Laundry
                </div>
              </Link>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}