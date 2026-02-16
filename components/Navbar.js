"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/poppins"; // Ensure installed: npm install @fontsource/poppins

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);

    const checkAuth = () => {
      const status = localStorage.getItem("isLoggedIn");
      setLoggedIn(status === "true");
    };

    checkAuth(); // Run once after mount
    window.addEventListener("authChange", checkAuth);

    return () => window.removeEventListener("authChange", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");

    window.dispatchEvent(new Event("authChange"));
    router.push("/login");
  };

  // ❗ Prevent SSR mismatch
  if (!mounted) return null;

  return (
    <nav className="sticky top-0 z-50 flex justify-between items-center px-6 md:px-10 py-4 bg-white shadow-md border-b font-poppins transition-all">
      {/* Logo / Brand */}
      <h1
        onClick={() => router.push("/")}
        className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-indigo-600 transition-colors"
      >
        Hotel PMS
      </h1>

      {/* Menu Links */}
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="text-gray-700 font-medium hover:text-indigo-600 transition-colors"
        >
          Home
        </Link>

        {!loggedIn ? (
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-medium
                       hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded-lg font-medium
                       hover:bg-red-700 transition-all shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
