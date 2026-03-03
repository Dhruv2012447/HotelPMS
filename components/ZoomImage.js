"use client";

import { useState, useEffect } from "react";

export default function ZoomImage({ src }) {
  const [open, setOpen] = useState(false);

  // Optional: close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <>
      {/* Thumbnail */}
      <img
        src={src}
        onClick={() => setOpen(true)}
        className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow-md hover:scale-110 transition duration-300 cursor-pointer"
      />

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <img
            src={src}
            onClick={(e) => e.stopPropagation()}
            className="max-w-[100%] max-h-[100%] rounded-2xl shadow-2xl transition-transform duration-300 scale-100"
          />
        </div>
      )}
    </>
  );
}
