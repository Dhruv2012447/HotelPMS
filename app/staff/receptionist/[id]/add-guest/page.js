"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ReceptionistSidebar from "../../ReceptionistSidebar";

export default function AddGuestPage() {
  const { id } = useParams();
  const router = useRouter();
  const staffId = id;

  const [form, setForm] = useState({
    guestName: "",
    phoneNumber: "",
  });

  const [selectedRooms, setSelectedRooms] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ ADDED STATE (only logic addition)
  const [hasSearched, setHasSearched] = useState(false);

  /* 🔎 SEARCH ROOMS */
  const handleSearch = async () => {
    if (!searchCategory) {
      alert("Select category first");
      return;
    }

    try {
      setLoading(true);
      setHasSearched(true); // ✅ mark that search button was clicked

      const res = await fetch(
        `/api/hotel-rooms/search?staffId=${staffId}&roomType=${searchCategory}`
      );

      const data = await res.json();

      if (data.success) {
        setRooms(data.rooms || []);
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  /* ✅ TOGGLE ROOM (MULTI SELECT) */
  const selectRoom = (room) => {
    const exists = selectedRooms.find(
      (r) => r.roomNumber === room.roomNumber
    );

    if (exists) {
      setSelectedRooms(
        selectedRooms.filter((r) => r.roomNumber !== room.roomNumber)
      );
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  /* ✅ SUBMIT */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedRooms.length === 0) {
      alert("Please select at least one room");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/add-guest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          staffId,
          guestName: form.guestName,
          phoneNumber: form.phoneNumber,
          rooms: selectedRooms,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Guest Checked-In Successfully ✅");
        router.push(`/staff/receptionist/${staffId}`);
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">
      <ReceptionistSidebar staffId={staffId} />

      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-5xl mx-auto bg-white p-8 rounded-3xl shadow-xl border">

          <h1 className="text-3xl font-bold mb-8">
            Add Guest & Assign Room
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            <InputField
              label="Guest Name"
              value={form.guestName}
              onChange={(e) =>
                setForm({ ...form, guestName: e.target.value })
              }
            />

            <InputField
              label="Phone Number"
              type="tel"
              value={form.phoneNumber}
              onChange={(e) =>
                setForm({ ...form, phoneNumber: e.target.value })
              }
            />

            <div className="border-t pt-6 space-y-4">

              <h2 className="font-semibold text-gray-700">
                Search Room by Category
              </h2>

              <div className="flex gap-4">
                <select
                  value={searchCategory}
                  onChange={(e) => {
                    setSearchCategory(e.target.value);
                    setHasSearched(false); // ✅ reset when category changes
                    setRooms([]); // clear old results
                  }}
                  className="flex-1 border p-3 rounded-xl"
                >
                  <option value="">Select Category</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Normal">Normal</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                </select>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="bg-indigo-600 text-white px-6 rounded-xl"
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>

              {rooms.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {rooms.map((room, index) => {
                    const isSelected = selectedRooms.some(
                      (r) => r.roomNumber === room.roomNumber
                    );

                    return (
                      <div
                        key={index}
                        onClick={() => selectRoom(room)}
                        className={`p-6 rounded-2xl border cursor-pointer transition shadow-sm ${
                          isSelected
                            ? "bg-green-50 border-green-500 shadow-md"
                            : "bg-white hover:shadow-md"
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-3">
                          Room {room.roomNumber}
                        </h3>

                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                          <p><b>Type:</b> {room.roomType}</p>
                          <p><b>Price:</b> ₹ {room.price}</p>
                          <p><b>Bed:</b> {room.bedType}</p>
                          <p><b>Status:</b> {room.status}</p>
                          <p><b>Max Adults:</b> {room.maxAdults}</p>
                          <p><b>Max Children:</b> {room.maxChildren}</p>
                          <p><b>WiFi:</b> {room.wifi ? "Yes" : "No"}</p>
                          <p><b>AC:</b> {room.ac ? "Yes" : "No"}</p>
                          <p><b>TV:</b> {room.tv ? "Yes" : "No"}</p>
                          <p><b>Mini Fridge:</b> {room.miniFridge ? "Yes" : "No"}</p>
                          <p><b>Balcony:</b> {room.balcony ? "Yes" : "No"}</p>
                          <p><b>Geyser:</b> {room.geyser ? "Yes" : "No"}</p>
                          <p><b>Wardrobe:</b> {room.wardrobe ? "Yes" : "No"}</p>
                        </div>

                        {room.description && (
                          <div className="mt-3 text-sm text-gray-600">
                            <b>Description:</b> {room.description}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                hasSearched &&
                !loading &&
                (
                  <p className="text-gray-500 mt-4">
                    No available rooms found.
                  </p>
                )
              )}

              {selectedRooms.length > 0 && (
                <div className="mt-4 p-4 bg-green-50 border rounded-xl">
                  Selected Rooms:{" "}
                  <b>
                    {selectedRooms.map((r) => r.roomNumber).join(", ")}
                  </b>
                </div>
              )}

            </div>

            <button
              type="submit"
              className="w-full py-3 bg-green-600 text-white rounded-xl"
            >
              Assign {selectedRooms.length} Room(s)
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="block mb-2 font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        required
        className="w-full border p-3 rounded-xl"
      />
    </div>
  );
}