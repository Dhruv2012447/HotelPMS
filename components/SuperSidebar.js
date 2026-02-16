"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { MdDashboard, MdHotel, MdMenu, MdClose } from "react-icons/md";

// Import Poppins font in your globals.css or here
import "@fontsource/poppins"; // Make sure to install: npm install @fontsource/poppins

export default function SuperSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Remember sidebar state
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
      {/* ===== Mobile Top Bar ===== */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-gray-900 text-white flex items-center justify-between px-4 shadow-lg z-50 font-poppins">
        <h1 className="font-bold text-lg tracking-wide">Super Admin</h1>
        {open ? (
          <MdClose size={28} className="cursor-pointer" onClick={() => setOpen(false)} />
        ) : (
          <MdMenu size={28} className="cursor-pointer" onClick={() => setOpen(true)} />
        )}
      </div>

      {/* ===== Overlay for mobile ===== */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ===== Sidebar ===== */}
      <div
        className={`
          fixed z-50
          top-0 lg:top-20
          left-0
          h-[calc(100vh-0px)] lg:h-[calc(100vh-60px)]
          w-64
          bg-gradient-to-b from-gray-800 to-gray-900
          text-white
          p-6
          flex flex-col justify-between
          shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          rounded-tr-2xl rounded-br-2xl
          font-poppins
        `}
      >
        <div>
          <h2 className="text-2xl font-bold mb-10 text-center border-b border-gray-700 pb-4 tracking-wide">
            Super Admin
          </h2>

          <nav className="flex flex-col gap-4 mt-6">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 relative
                    group
                    ${isActive
                      ? "bg-gray-700 text-white font-semibold shadow-lg"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white hover:shadow-md"}
                  `}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-indigo-400 rounded-tr-lg rounded-br-lg"></span>
                  )}
                  {link.icon}
                  <span className="group-hover:translate-x-2 transition-transform duration-200">
                    {link.name}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="text-center text-gray-400 text-sm mt-10">
          &copy; {new Date().getFullYear()} Hotel PMS
        </div>
      </div>
    </>
  );
}
