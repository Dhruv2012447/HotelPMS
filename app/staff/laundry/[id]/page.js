import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import LaundrySidebar from "../laundrySidebar";
import LaundryTable from "./LaundryTable";

export const dynamic = "force-dynamic";

export default async function LaundryPage({ params }) {
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

  // ✅ Fetch Laundry Records
  const laundryRecords = await db
    .collection("laundry")
    .find({ hotelId })
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black">
      <LaundrySidebar staffId={id} />

      <div className="flex-1 p-12">
        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome back, {staff.name}
          </h1>
          <p className="text-gray-500 text-lg">
            Manage hotel laundry operations efficiently.
          </p>
        </div>

        {/* TOTAL LAUNDRY COUNT */}
        <div className="bg-white rounded-3xl shadow-xl p-10 mb-12 border border-gray-100">
          <h2 className="text-lg text-gray-500 mb-3 uppercase tracking-wide">
            Total Laundry Requests
          </h2>
          <p className="text-6xl font-extrabold text-purple-600">
            {laundryRecords.length}
          </p>
        </div>

        {/* LAUNDRY TABLE */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">
            Laundry Records
          </h2>

          <LaundryTable
            hotelId={hotelId.toString()}
            records={JSON.parse(JSON.stringify(laundryRecords))}
          />
        </div>
      </div>
    </div>
  );
}