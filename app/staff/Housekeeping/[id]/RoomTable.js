"use client";

import { useState } from "react";

export default function RoomTable({ hotelId, rooms }) {
  const [roomList, setRoomList] = useState(rooms || []);

  const toggleStatus = async (roomNumber, currentStatus) => {
    const newStatus =
      currentStatus === "Dirty" ? "Cleaned" : "Dirty";

    const res = await fetch("/api/updateRoomStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hotelId,
        roomNumber,
        status: newStatus,
      }),
    });

    const data = await res.json();

    if (data.success) {
      setRoomList((prev) =>
        prev.map((room) =>
          room.roomNumber === roomNumber
            ? { ...room, status: newStatus }
            : room
        )
      );
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg text-black">
      <h2 className="text-2xl font-semibold mb-6">
        All Hotel Rooms
      </h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-4">Room</th>
            <th className="p-4">Type</th>
            <th className="p-4">Occupancy</th>
            <th className="p-4">Bed</th>
            <th className="p-4">Price</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>

        <tbody>
          {roomList.length > 0 ? (
            roomList.map((room) => (
              <tr key={room.roomNumber} className="border-b">
                <td className="p-4 font-medium">
                  {room.roomNumber}
                </td>
                <td className="p-4">{room.roomType}</td>
                <td className="p-4">
                  {room.maxAdults} Adults /{" "}
                  {room.maxChildren} Children
                </td>
                <td className="p-4">{room.bedType}</td>
                <td className="p-4">₹{room.price}</td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white font-medium ${
                      room.status === "Dirty"
                        ? "bg-red-500"
                        : room.status === "Occupied"
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                  >
                    {room.status}
                  </span>
                </td>

                <td className="p-4">
                  {room.status !== "Occupied" && (
                    <button
                      onClick={() =>
                        toggleStatus(
                          room.roomNumber,
                          room.status
                        )
                      }
                      className={`px-4 py-2 rounded-lg text-white transition ${
                        room.status === "Dirty"
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {room.status === "Dirty"
                        ? "Mark Cleaned"
                        : "Mark Dirty"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="p-6 text-center text-gray-500"
              >
                No Rooms Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}