import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import HousekeepingSidebar from "../HousekeepingSidebar";
import RoomTable from "./RoomTable";
import LostItemsTable from "./LostItemsTable";
export const dynamic = "force-dynamic"; // Always fetch fresh DB data

export default async function HousekeepingPage({ params }) {
  const { id } = await params;

  // ✅ Validate Staff ID
  if (!id || !ObjectId.isValid(id)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-red-600 text-lg font-semibold">
          Invalid Staff ID
        </div>
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  // ✅ Find Staff
  const staff = await db.collection("Staff").findOne({
    _id: new ObjectId(id),
  });

  if (!staff) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-red-600 text-lg font-semibold">
          Staff Not Found
        </div>
      </div>
    );
  }

  if (!staff.hotelId) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-red-600 text-lg font-semibold">
          Hotel Not Linked
        </div>
      </div>
    );
  }

  const hotelId = new ObjectId(staff.hotelId);

  // ✅ Get Real Hotel Rooms Config
  const hotelRooms = await db.collection("hotelRooms").findOne({
    hotelId,
  });

  if (!hotelRooms) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white shadow-xl rounded-2xl p-8 text-red-600 text-lg font-semibold">
          No Room Configuration Found
        </div>
      </div>
    );
  }

  const totalRooms = hotelRooms.totalRooms || 0;

  // ✅ Convert rooms object → array
  const roomsArray = hotelRooms.rooms
    ? Object.values(hotelRooms.rooms)
    : [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black">
      <HousekeepingSidebar staffId={id} />

      <div className="flex-1 p-12">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {staff.name}
          </h1>
          <p className="text-gray-500 text-lg">
            Manage room cleaning and housekeeping status efficiently.
          </p>
        </div>

        {/* TOTAL ROOM CARD */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-12 border border-gray-100 transition hover:shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg text-gray-500 mb-3 uppercase tracking-wide">
                Total Rooms
              </h2>
              <p className="text-6xl font-extrabold text-blue-600">
                {totalRooms}
              </p>
            </div>

            <div className="bg-blue-100 p-6 rounded-2xl">
              <svg
                className="w-12 h-12 text-blue-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path d="M3 10h18M5 6h14M4 14h16M6 18h12" />
              </svg>
            </div>
          </div>
        </div>

        {/* ROOM TABLE */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Room Status Overview
          </h2>

          <RoomTable
            hotelId={hotelId.toString()}
            rooms={roomsArray}
          />
        </div>
        {/* LOST & FOUND TABLE */}
<div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 mt-20">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">
    Lost & Found Records
  </h2>

  {(() => {
    const lostItemsPromise = db
      .collection("lost&found")
      .find({ hotelId })
      .sort({ foundAt: -1 })
      .toArray();

    return lostItemsPromise.then((lostItems) => (
      <LostItemsTable
        items={JSON.parse(JSON.stringify(lostItems))}
      />
    ));
  })()}
</div>
      </div>
    </div>
  );
}