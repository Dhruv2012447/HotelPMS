"use client";

import { useState } from "react";
import { Save, Shirt } from "lucide-react";

export default function LaundryForm({ staffId, rooms }) {
  const [form, setForm] = useState({
    roomNumber: "",
    itemName: "",
    itemsCount: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSave = async () => {
    setMessage("");
    setIsError(false);

    if (!form.roomNumber || !form.itemName || !form.itemsCount) {
      setMessage("Please fill all fields.");
      setIsError(true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/createLaundry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId,
          roomNumber: form.roomNumber,
          itemName: form.itemName,
          itemsCount: Number(form.itemsCount),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Laundry request saved successfully ✅");
        setForm({
          roomNumber: "",
          itemName: "",
          itemsCount: "",
        });
      } else {
        setMessage("Error saving laundry ❌");
        setIsError(true);
      }
    } catch (error) {
      setMessage("Server error ❌");
      setIsError(true);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-3xl border border-gray-200 p-10">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Shirt className="text-gray-700" size={28} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900">
            Create Laundry Request
          </h2>
          <p className="text-gray-500 mt-2">
            Fill in the details and click save to create a new request.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">

          {/* Room */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Select Room
            </label>
            <select
              value={form.roomNumber}
              onChange={(e) =>
                setForm({ ...form, roomNumber: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            >
              <option value="">Choose Room</option>
              {rooms?.map((room) => (
                <option key={room.roomNumber} value={room.roomNumber}>
                  Room {room.roomNumber} - {room.roomType}
                </option>
              ))}
            </select>
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Item Name
            </label>
            <input
              type="text"
              value={form.itemName}
              onChange={(e) =>
                setForm({ ...form, itemName: e.target.value })
              }
              placeholder="Shirt, Towel, Bedsheet..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 mb-2 font-medium">
              Number of Items
            </label>
            <input
              type="number"
              min="1"
              value={form.itemsCount}
              onChange={(e) =>
                setForm({ ...form, itemsCount: e.target.value })
              }
              placeholder="Enter quantity"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white focus:ring-2 focus:ring-gray-400 focus:outline-none transition"
            />
          </div>

          {/* Save Button */}
        <button
  type="button"
  onClick={handleSave}
  disabled={loading}
  className="w-full bg-blue-600 text-white py-4 rounded-lg"
>
  {loading ? "Saving..." : "Save Laundry Request"}
</button>

          {/* Message */}
          {message && (
            <div
              className={`text-center text-sm font-medium mt-3 p-3 rounded-lg ${
                isError
                  ? "bg-gray-100 text-gray-700 border border-gray-200"
                  : "bg-black text-black"
              }`}
            >
              {message}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}