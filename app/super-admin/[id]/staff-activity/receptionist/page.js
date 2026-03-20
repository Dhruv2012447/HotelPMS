export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import HotelSidebar from "@/components/hotel/HotelSidebar";

export default async function ReceptionistPage({ params }) {

  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const staffList = await db
    .collection("Staff")
    .find({ 
hotelId: new ObjectId(id), role: "Receptionist" })
    .project({ role: 1, hotelId: 1 })
    .toArray();

  const hotelId = staffList.length > 0 ? staffList[0].hotelId : null;

  let guests = [];
  let roomsDoc = null;

  if (hotelId) {

    const results = await Promise.all([

      db.collection("GuestData")
        .find({ hotelId })
        .sort({ createdAt: -1 })
        .limit(50)
        .toArray(),

      db.collection("hotelRooms")
        .findOne({ hotelId })

    ]);

    guests = results[0];
    roomsDoc = results[1];
  }

  const rooms = roomsDoc?.rooms ? Object.values(roomsDoc.rooms) : [];

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">



      <div className="flex-1 p-6 md:p-10 space-y-10">

        {/* PAGE HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">

          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
            Receptionist Activity
          </h1>

          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            Hotel Management Dashboard
          </div>

        </div>


        {/* STATS CARDS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Guests</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {guests.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Rooms</p>
            <h2 className="text-3xl font-bold text-green-600">
              {rooms.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Available Rooms</p>
            <h2 className="text-3xl font-bold text-purple-600">
              {rooms.filter(r => r.status === "Available" || r.status === "Cleaned").length}
            </h2>
          </div>

        </div>


        {/* GUEST TABLE */}

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">
              Guest Records
            </h2>
          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">

              <tr>
                <th className="p-4 text-left">Guest</th>
                <th className="p-4 text-left">Phone</th>
                <th className="p-4 text-left">Rooms</th>
                <th className="p-4 text-left">Check In</th>
                <th className="p-4 text-left">Status</th>
              </tr>

            </thead>

            <tbody>

              {guests.map((guest) => (

                <tr
                  key={guest._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {guest.guestName}
                  </td>

                  <td className="p-4">
                    {guest.phoneNumber}
                  </td>

                  <td className="p-4">

                    {guest.rooms?.map((room, i) => (

                      <span
                        key={i}
                        className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded mr-2"
                      >
                        Room {room.roomNumber}
                      </span>

                    ))}

                  </td>

                  <td className="p-4">
                    {guest.checkInDate
                      ? new Date(guest.checkInDate).toLocaleDateString()
                      : "-"
                    }
                  </td>

                  <td className="p-4">

                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {guest.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>



        {/* ROOMS TABLE */}

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">
              Room Inventory
            </h2>
          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">

              <tr>
                <th className="p-4 text-left">Room</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Bed</th>
                <th className="p-4 text-left">Price</th>
                <th className="p-4 text-left">Status</th>
              </tr>

            </thead>

            <tbody>

              {rooms.map((room, i) => (

                <tr
                  key={i}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {room.roomNumber}
                  </td>

                  <td className="p-4">
                    {room.roomType}
                  </td>

                  <td className="p-4">
                    {room.bedType}
                  </td>

                  <td className="p-4 font-semibold text-blue-600">
                    ₹{room.price}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        room.status === "Available"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {room.status}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}