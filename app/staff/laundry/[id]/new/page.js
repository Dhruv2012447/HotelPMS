import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import LaundrySidebar from "../../laundrySidebar";
import LaundryForm from "./LaundryForm";

export const dynamic = "force-dynamic";

export default async function NewLaundryPage({ params }) {
  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    return <div>Invalid Staff ID</div>;
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const staff = await db.collection("Staff").findOne({
    _id: new ObjectId(id),
  });

  if (!staff || !staff.hotelId) {
    return <div>Staff not linked to hotel</div>;
  }

  const hotelId = new ObjectId(staff.hotelId);

  const hotelRooms = await db.collection("hotelRooms").findOne({
    hotelId,
  });

  const roomsArray = hotelRooms?.rooms
    ? Object.values(hotelRooms.rooms)
    : [];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black">
      <LaundrySidebar staffId={id} />

      <div className="flex-1 p-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Create Laundry Request
          </h1>
          <p className="text-gray-500 text-lg">
            Enter room and number of items.
          </p>
        </div>

        <LaundryForm staffId={id} rooms={roomsArray} />
      </div>
    </div>
  );
}