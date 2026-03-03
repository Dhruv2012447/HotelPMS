"use client";

import { useState } from "react";

export default function LostItemsTable({ items }) {
  const [lostItems, setLostItems] = useState(items);

  const markAsFound = async (itemId) => {
    const res = await fetch("/api/lost-found/mark-found", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId }),
    });

    const data = await res.json();

    if (data.success) {
      setLostItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, status: "Found" }
            : item
        )
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* Header */}
          <thead className="bg-gray-50">
            <tr className="text-left text-gray-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4">Item</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Room</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Action</th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-100">
            {lostItems.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-12 text-gray-400"
                >
                  No lost hotel property items recorded
                </td>
              </tr>
            ) : (
              lostItems.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition duration-200"
                >
                  {/* Item */}
                  <td className="px-6 py-4 font-semibold text-gray-800">
                    {item.itemName}
                  </td>

                  {/* Category */}
                  <td className="px-6 py-4 text-gray-600">
                    {item.category}
                  </td>

                  {/* Room */}
                  <td className="px-6 py-4 text-center font-medium text-gray-700">
                    {item.roomNumber}
                  </td>

                  {/* Description */}
                  <td className="px-6 py-4 text-gray-500 max-w-xs truncate">
                    {item.description}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-center">
                    {item.status === "Found" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                        ✓ Found
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        • Lost
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="px-6 py-4 text-center">
                    {item.status === "Found" ? (
                      <button
                        disabled
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                      >
                        Found
                      </button>
                    ) : (
                      <button
                        onClick={() => markAsFound(item._id)}
                        className="px-4 py-2 text-sm font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition duration-200"
                      >
                        Mark as Found
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}