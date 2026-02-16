"use client";

import { useHotels } from "@/context/HotelContext";
import { useParams } from "next/navigation";

export default function HotelDetail() {
  const { hotels, loading } = useHotels();
  const { id } = useParams();

  if (loading) {
    return <div className="p-10 text-xl">Loading...</div>;
  }

  const hotel = hotels.find((h) => h.hotelId === id);
  if (!hotel) {
    return <div className="p-10 text-xl text-red-600">Hotel not found</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-10 space-y-10">
      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow border">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          {hotel.hotelId} — Details
        </h1>
        <p className="text-gray-600">
          Subscription:{" "}
          <span className="font-semibold text-black">{hotel.sub}</span>
        </p>
      </div>

      {/* Hotel Info */}
      <div className="bg-white p-8 rounded-2xl shadow border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Hotel Information
        </h2>

        {hotel.info && Object.keys(hotel.info).length > 0 ? (
          <div className="grid grid-cols-2 gap-6 text-gray-700 text-lg">
            {Object.entries(hotel.info).map(([key, value], i) => (
              <div
                key={i}
                className="border rounded-lg p-4 bg-gray-50"
              >
                <b className="capitalize">{key}:</b> {value}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No information added by owner yet.</p>
        )}
      </div>

      {/* Staff */}
      <div className="bg-white p-8 rounded-2xl shadow border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Staff Members
        </h2>

        {hotel.staff.length > 0 ? (
          <div className="grid grid-cols-2 gap-6">
            {hotel.staff.map((s, i) => (
              <div
                key={i}
                className="border rounded-lg p-5 bg-gray-50"
              >
                <p className="text-lg font-semibold text-gray-800">
                  {s.name}
                </p>
                <p className="text-gray-600">{s.role}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No staff added yet.</p>
        )}
      </div>
    </div>
  );
}
