"use client";

import { useState } from "react";

export default function StaffTable({ staffList }) {
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-left">
              <th className="p-4 border">Profile</th>
              <th className="p-4 border">Name</th>
              <th className="p-4 border">Password</th>
              <th className="p-4 border">Role</th>
              <th className="p-4 border">Access</th>
            </tr>
          </thead>

          <tbody>
            {staffList.map((staff) => (
              <tr
                key={staff._id}
                className="hover:bg-gray-50 transition"
              >
                {/* ✅ Profile Image */}
                <td className="p-4 border">
                  {staff.profilePic ? (
                    <img
                      src={staff.profilePic}
                      alt="Profile"
                      onClick={() => setSelectedImage(staff.profilePic)}
                      className="w-12 h-12 rounded-full object-cover cursor-pointer border-2 border-blue-400 hover:scale-110 transition"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">
                      {staff.name?.charAt(0)}
                    </div>
                  )}
                </td>

                <td className="p-4 border font-semibold">
                  {staff.name}
                </td>

                <td className="p-4 border text-gray-600">
                  {staff.password}
                </td>

                <td className="p-4 border text-blue-600 font-medium">
                  {staff.role}
                </td>

                <td className="p-4 border">
                  <div className="flex flex-wrap gap-2">
                    {staff.access?.map((a, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ IMAGE MODAL */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50"
        >
          <img
            src={selectedImage}
            alt="Zoomed"
            className="max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl scale-100 animate-zoomIn"
          />
        </div>
      )}

      {/* Animation */}
      <style jsx>{`
        @keyframes zoomIn {
          from {
            transform: scale(0.7);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-zoomIn {
          animation: zoomIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
