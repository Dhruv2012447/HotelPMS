import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import AttendanceForm from "./AttendanceForm";
import GMSidebar from "../../components/GMSidebar";

export default async function AttendancePage({ params }) {
  const { id } = await params; // ✅ correct
  const gmId = id;

  if (!ObjectId.isValid(gmId)) {
    return (
      <div className="p-10 text-red-600">
        Invalid GM ID
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  // 1️⃣ Find GM
  const gm = await db.collection("gms").findOne({
    _id: new ObjectId(gmId),
  });

  if (!gm) {
    return (
      <div className="p-10 text-red-600">
        GM Not Found
      </div>
    );
  }

  // 2️⃣ Fetch staff where gmId is ObjectId
  const staff = await db
    .collection("Staff")
    .find({ gmId: new ObjectId(gmId) })
    .toArray();

  const serializedStaff = staff.map((s) => ({
    _id: s._id.toString(),
    name: s.name,
    role: s.role,
  }));

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <GMSidebar id={id} />

      {/* Main Content */}
      <div className="flex-1 p-10">
        <AttendanceForm
          staffList={serializedStaff}
          hotelId={gm.hotelId}
          gmId={gmId}
        />
      </div>
    </div>
  );
}