"use client";

import { MdMenu } from "react-icons/md";

export default function ResponsiveHandler({ open, setOpen }) {
  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-50 left-0 right-0 bg-white shadow z-50 flex items-center p-4">
        <button onClick={() => setOpen(true)}>
          <MdMenu size={26} />
        </button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile spacing fix */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .ml-64 {
            margin-left: 0 !important;
          }
          .mobile-spacing {
            margin-top: 64px;
          }
        }
      `}</style>
    </>
  );
}