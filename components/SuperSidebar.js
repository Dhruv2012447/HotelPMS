"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  MdDashboard,
  MdHotel,
  MdMenu,
  MdClose,
  MdPeople,
} from "react-icons/md";

import "@fontsource/poppins";

export default function SuperSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const match =
    pathname.match(/\/super-admin\/detail\/(.+)/) ||
    pathname.match(/\/super-admin\/(.+)\/staff-activity/);
  const id = match ? match[1] : null;

  const isStaffPage = pathname.includes(`/super-admin/${id}/staff-activity`);

  // Load sidebar state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("superSidebarOpen");
    if (savedState) setOpen(JSON.parse(savedState));
  }, []);

  useEffect(() => {
    localStorage.setItem("superSidebarOpen", JSON.stringify(open));
  }, [open]);

  const links = [
    { name: "Dashboard", href: "/super-admin", icon: <MdDashboard size={22} /> },
    { name: "Create New Hotel", href: "/super-admin/create-hotel", icon: <MdHotel size={22} /> },
  ];

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center justify-between px-4 shadow z-50 font-poppins">
        <h1 className="font-semibold text-lg">Super Admin</h1>
        {open ? (
          <MdClose size={28} className="cursor-pointer" onClick={() => setOpen(false)} />
        ) : (
          <MdMenu size={28} className="cursor-pointer" onClick={() => setOpen(true)} />
        )}
      </div>

      {/* OVERLAY FOR MOBILE */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed z-50 top-50 lg:top-0 left-0 h-screen w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-xl
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 lg:relative lg:rounded-none rounded-tr-2xl rounded-br-2xl font-poppins
        `}
      >
        <div>
          {/* HEADER */}
          <h2 className="text-xl font-semibold mb-8 text-center border-b border-gray-700 pb-3">
            Super Admin
          </h2>

          {/* NAV LINKS */}
          <nav className="flex flex-col gap-2">

            {/* DEFAULT LINKS */}
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                    isActive
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              );
            })}

            {/* STAFF ACTIVITY DROPDOWN */}
            {id && (
              <div
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                {/* BUTTON */}
                <div
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition ${
                    isStaffPage
                      ? "bg-gray-700 text-white"
                      : "bg-gray-800 hover:bg-gray-700"
                  }`}
                >
                  <MdPeople size={22} />
                  <span className="font-medium">Staff Activity</span>
                </div>

                {/* DROPDOWN ITEMS */}
                <div
                  className={`ml-6 mt-2 flex flex-col gap-1 transition-all duration-300 ${
                    hover || isStaffPage
                      ? "opacity-100 max-h-60"
                      : "opacity-0 max-h-0 overflow-hidden"
                  }`}
                >
                  {["GM", "receptionist", "housekeeping", "laundry"].map((role) => (
                    <Link
                      key={role}
                      href={`/super-admin/${id}/staff-activity/${role}`}
                      className={`ml-4 text-sm px-2 py-1 rounded transition ${
                        pathname.includes(role)
                          ? "text-white bg-gray-700"
                          : "text-gray-400 hover:text-white hover:bg-gray-800"
                      }`}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </div>

        {/* FOOTER */}
        <div className="text-center text-gray-500 text-xs mt-10 lg:mt-0">
          &copy; {new Date().getFullYear()} Hotel PMS
        </div>
      </aside>
    </>
  );
}