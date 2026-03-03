import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import HousekeepingSidebar from "../../HousekeepingSidebar";
import LostFoundForm from "./LostFoundForm";

export const dynamic = "force-dynamic";

export default async function LostFoundPage({ params }) {
  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    return <div>Invalid Staff ID</div>;
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const staff = await db.collection("Staff").findOne({
    _id: new ObjectId(id),
  });

  if (!staff) {
    return <div>Staff Not Found</div>;
  }

  const hotelRooms = await db.collection("hotelRooms").findOne({
    hotelId: new ObjectId(staff.hotelId),
  });

  const rooms = hotelRooms?.rooms
    ? Object.values(hotelRooms.rooms)
    : [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black">
      <HousekeepingSidebar staffId={id} />

      <div className="flex-1 p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Lost & Found
          </h1>
          <p className="text-gray-500 text-lg">
            Record items found inside hotel rooms.
          </p>
        </div>

        <LostFoundForm staffId={id} rooms={rooms} />
      </div>
    </div>
  );
}