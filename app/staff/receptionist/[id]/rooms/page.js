"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReceptionistSidebar from "../../ReceptionistSidebar";

export default function HotelRoomManagementPage() {
  const { id } = useParams();
  const staffId = id;

  const [totalRooms, setTotalRooms] = useState("");
  const [rooms, setRooms] = useState([]);
  const [generated, setGenerated] = useState(false);
  const [editingTotal, setEditingTotal] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD EXISTING ROOMS
  =============================== */

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await fetch(`/api/hotel-rooms?staffId=${staffId}`);
      const data = await res.json();

      if (data.success && data.rooms?.length > 0) {
        setRooms(data.rooms);
        setTotalRooms(data.totalRooms);
        setGenerated(true);
      }
    };

    if (staffId) fetchRooms();
  }, [staffId]);

  /* ===============================
     CREATE DEFAULT ROOM
  =============================== */

  const createRoomObject = (number) => ({
    roomNumber: number,
    price: "",
    roomType: "Normal",
    bedType: "King",
    maxAdults: 2,
    maxChildren: 0,
    wifi: true,
    ac: true,
    tv: true,
    miniFridge: false,
    balcony: false,
    geyser: true,
    wardrobe: true,
    description: "",
    status: "Available",
  });

  /* ===============================
     GENERATE ROOMS FIRST TIME
  =============================== */

  const generateRooms = () => {
    if (!totalRooms || totalRooms <= 0) {
      alert("Enter valid total rooms");
      return;
    }

    const newRooms = Array.from(
      { length: Number(totalRooms) },
      (_, i) => createRoomObject(i + 1)
    );

    setRooms(newRooms);
    setGenerated(true);
  };

  /* ===============================
     EDIT TOTAL ROOMS
  =============================== */

  const updateTotalRooms = () => {
    const newTotal = Number(totalRooms);

    if (!newTotal || newTotal <= 0) return;

    let updatedRooms = [...rooms];

    if (newTotal > rooms.length) {
      // ADD ROOMS
      for (let i = rooms.length + 1; i <= newTotal; i++) {
        updatedRooms.push(createRoomObject(i));
      }
    } else if (newTotal < rooms.length) {
      // REMOVE EXTRA ROOMS
      updatedRooms = updatedRooms.slice(0, newTotal);
    }

    setRooms(updatedRooms);
    setEditingTotal(false);
  };

  /* ===============================
     UPDATE ROOM FIELD
  =============================== */

  const updateRoom = (index, field, value) => {
    const updated = [...rooms];

    updated[index][field] =
      typeof updated[index][field] === "boolean"
        ? value.target.checked
        : value.target.value;

    setRooms(updated);
  };

  /* ===============================
     SAVE ROOMS
  =============================== */

  const saveRooms = async () => {
    if (rooms.some((r) => !r.price)) {
      alert("Fill price for all rooms");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/hotel-rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        staffId,
        totalRooms,
        rooms,
      }),
    });

    const data = await res.json();
    alert(data.success ? "Rooms Saved Successfully ✅" : data.message);

    setLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">
      <ReceptionistSidebar staffId={staffId} />

      <div className="flex-1 p-10">
        <div className="max-w-7xl mx-auto bg-white p-10 rounded-3xl shadow-xl">

          <h1 className="text-3xl font-bold mb-8">
            Hotel Room Management
          </h1>

          {/* FIRST TIME */}
          {!generated && (
            <div className="space-y-4 max-w-md">
              <input
                type="number"
                min="1"
                value={totalRooms}
                onChange={(e) => setTotalRooms(e.target.value)}
                className="w-full border p-3 rounded-xl"
                placeholder="Enter Total Rooms"
              />

              <button
                onClick={generateRooms}
                className="w-full bg-indigo-600 text-white p-3 rounded-xl"
              >
                Generate Rooms
              </button>
            </div>
          )}

          {/* EDIT MODE */}
          {generated && (
            <>
              {/* TOTAL ROOM EDIT SECTION */}
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-8">

                {!editingTotal ? (
                  <>
                    <h2 className="font-semibold text-lg">
                      Total Rooms: {totalRooms}
                    </h2>

                    <button
                      onClick={() => setEditingTotal(true)}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg"
                    >
                      Edit Total
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="number"
                      value={totalRooms}
                      onChange={(e) => setTotalRooms(e.target.value)}
                      className="border p-2 rounded-lg w-32"
                    />

                    <button
                      onClick={updateTotalRooms}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg"
                    >
                      Update
                    </button>
                  </>
                )}
              </div>

              {/* ROOM CARDS */}
              <div className="grid md:grid-cols-2 gap-6">
                {rooms.map((room, index) => (
                  <div key={index}
                    className="border rounded-2xl p-6 space-y-4">

                    <h3 className="font-bold text-lg">
                      Room {room.roomNumber}
                    </h3>

                    <Input label="Price" type="number"
                      value={room.price}
                      onChange={(e)=>updateRoom(index,"price",e)} />

                    <Select label="Room Type"
                      value={room.roomType}
                      onChange={(e)=>updateRoom(index,"roomType",e)}
                      options={["Normal","Deluxe","Luxury","Suite"]} />

                    <Select label="Bed Type"
                      value={room.bedType}
                      onChange={(e)=>updateRoom(index,"bedType",e)}
                      options={["King","Queen","Twin","Single"]} />

                    <Input label="Max Adults" type="number"
                      value={room.maxAdults}
                      onChange={(e)=>updateRoom(index,"maxAdults",e)} />

                    <Input label="Max Children" type="number"
                      value={room.maxChildren}
                      onChange={(e)=>updateRoom(index,"maxChildren",e)} />

                    <textarea
                      placeholder="Description"
                      value={room.description}
                      onChange={(e)=>updateRoom(index,"description",e)}
                      className="w-full border p-3 rounded-xl"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={saveRooms}
                disabled={loading}
                className="w-full mt-10 bg-green-600 text-white p-4 rounded-xl"
              >
                {loading ? "Saving..." : "Save Rooms"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* COMPONENTS */

function Input({label,type,value,onChange}) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <input type={type} value={value} onChange={onChange}
        className="w-full border p-2 rounded-xl"/>
    </div>
  );
}

function Select({label,value,onChange,options}) {
  return (
    <div>
      <label className="block mb-1">{label}</label>
      <select value={value} onChange={onChange}
        className="w-full border p-2 rounded-xl">
        {options.map((opt,i)=>
          <option key={i}>{opt}</option>
        )}
      </select>
    </div>
  );
}