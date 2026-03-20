"use client";

import { useState } from "react";

export default function LaundryTable({ records }) {
  const [laundryList, setLaundryList] =
    useState(records || []);

  const updateStatus = async (id) => {
    const res = await fetch(
      "/api/updateLaundryStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    if (res.ok) {
      setLaundryList((prev) =>
        prev.map((item) =>
          item._id === id
            ? { ...item, status: "Completed" }
            : item
        )
      );
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-xl border p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Laundry Requests
      </h2>

      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-4">Room</th>
            <th className="p-4">Item</th>
            <th className="p-4">Qty</th>
            <th className="p-4">Date & Time</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {laundryList.map((item) => (
            <tr key={item._id} className="border-b">
              <td className="p-4">
                {item.roomNumber}
              </td>

              <td className="p-4">
                {item.itemName}
              </td>

              <td className="p-4">
                {item.itemsCount}
              </td>

              <td className="p-4 text-gray-500">
  {new Date(item.createdAt).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}
</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    item.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {item.status || "Pending"}
                </span>
              </td>

             <td className="p-4">
  {item.status === "Completed" ? (
    <button
      disabled
      className="bg-gray-300 text-gray-600 px-3 py-2 rounded-lg text-xs cursor-not-allowed"
    >
      Completed
    </button>
  ) : (
    <button
      onClick={() => updateStatus(item._id)}
      className="bg-blue-600 text-white px-3 py-2 rounded-lg text-xs hover:bg-blue-700"
    >
      Done
    </button>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}