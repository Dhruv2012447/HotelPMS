"use client";

import { useState } from "react";

export default function GuestRow({ guest, rowStyle = "bg-white" }) {
  const [status, setStatus] = useState(guest.status || "Checked-In");
  const [checkoutTime, setCheckoutTime] = useState(
    guest.checkoutAt || null
  );
  const [loading, setLoading] = useState(false);

  const isCheckedOut = status === "Checked-Out";

  const handleCheckout = async () => {
    if (isCheckedOut) return;

    const confirmCheckout = confirm(
      "Are you sure you want to checkout this guest?"
    );
    if (!confirmCheckout) return;

    try {
      setLoading(true);

      const res = await fetch("/api/checkout-guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ guestId: guest._id }),
      });

      const data = await res.json();

      if (data.success) {
        const now = new Date();
        setStatus("Checked-Out");
        setCheckoutTime(now);
      } else {
        alert(data.message || "Checkout failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED LOGIC FOR MULTIPLE ROOMS
  const roomTypes =
    guest.rooms?.map((r) => r.roomType).join(", ") || "-";

  const roomCategories =
    guest.rooms?.map((r) => r.roomType).join(", ") || "-";

  const bedTypes =
    guest.rooms?.map((r) => r.bedType).join(", ") || "-";

  const roomsTaken =
    guest.rooms?.map((r) => r.roomNumber).join(", ") || "-";

  return (
    <tr
      className={`${rowStyle} hover:bg-indigo-50/60 transition duration-200 text-center text-gray-700`}
    >
      {/* Guest */}
      <td className="px-5 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">
            {guest.guestName}
          </span>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            ID: {guest._id.slice(-5)}
          </span>
        </div>
      </td>

      {/* Phone */}
      <td className="px-5 py-4 text-gray-600 text-sm">
        {guest.phoneNumber}
      </td>

      {/* Rooms */}
      <td className="px-5 py-4 text-center">
        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
          {roomsTaken}
        </span>
      </td>

      {/* Type */}
      <td className="px-5 py-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
          {roomTypes}
        </span>
      </td>

      {/* Check-In */}
      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
        {guest.createdAt
          ? new Date(guest.createdAt).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </td>

      {/* Check-Out */}
      <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">
        {checkoutTime
          ? new Date(checkoutTime).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-"}
      </td>

      {/* Status */}
      <td className="px-5 py-4 text-center whitespace-nowrap">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isCheckedOut
              ? "bg-gray-200 text-gray-600"
              : "bg-green-100 text-green-700"
          }`}
        >
          {status}
        </span>
      </td>

      {/* Action */}
      <td className="px-5 py-4 text-center">
        <button
          onClick={handleCheckout}
          disabled={loading || isCheckedOut}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
            isCheckedOut
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600 shadow-sm hover:shadow-md"
          }`}
        >
          {loading
            ? "Processing..."
            : isCheckedOut
            ? "Completed"
            : "Check-Out"}
        </button>
      </td>
    </tr>
  );
}