"use client";

import { useState } from "react";

export default function LostFoundForm({ staffId, rooms }) {
  const [form, setForm] = useState({
    itemName: "",
    roomNumber: "",
    category: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");

    const res = await fetch("/api/lost-found", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        staffId,
        ...form,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setSuccess("Lost item recorded successfully.");
      setForm({
        itemName: "",
        roomNumber: "",
        category: "",
        description: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow-2xl p-10 border border-gray-100 max-w-4xl">
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Room Dropdown */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Select Room
          </label>
          <select
            required
            value={form.roomNumber}
            onChange={(e) =>
              setForm({ ...form, roomNumber: e.target.value })
            }
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option value="">Choose Room</option>
            {rooms.map((room) => (
              <option key={room.roomNumber} value={room.roomNumber}>
                Room {room.roomNumber} - {room.roomType}
              </option>
            ))}
          </select>
        </div>

        {/* Item Name */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Item Name
          </label>
          <input
            type="text"
            required
            value={form.itemName}
            onChange={(e) =>
              setForm({ ...form, itemName: e.target.value })
            }
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="e.g. Bath Towel, Hair Dryer, Remote Control"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Category
          </label>
          <select
            required
            value={form.category}
            onChange={(e) =>
              setForm({ ...form, category: e.target.value })
            }
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Documents">Documents</option>
            <option value="Accessories">Accessories</option>
            <option value="Others">Others</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600 mb-2 font-medium">
            Description
          </label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full p-4 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none transition"
            placeholder="Additional details about the item..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition shadow-lg"
        >
          {loading ? "Saving..." : "Record Lost Item"}
        </button>

        {success && (
          <div className="text-green-600 font-medium text-center">
            {success}
          </div>
        )}

      </form>
    </div>
  );
}