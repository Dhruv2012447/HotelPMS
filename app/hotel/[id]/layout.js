"use client";

import { useState } from "react";
import HotelSidebar from "@/components/hotel/HotelSidebar";
import ResponsiveHandler from "@/components/hotel/ResponsiveWrapper";

export default function HotelLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex bg-gray-100 min-h-screen text-black">

      {/* Sidebar */}
      <HotelSidebar open={open} setOpen={setOpen} />

      {/* Mobile handler */}
      <ResponsiveHandler open={open} setOpen={setOpen} />

      {/* Content (DESKTOP SAME) */}
      <div className="ml-64 w-full p-8 mobile-spacing">
        {children}
      </div>

    </div>
  );
}