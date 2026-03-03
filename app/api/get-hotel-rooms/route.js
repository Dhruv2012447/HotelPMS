import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId || !ObjectId.isValid(staffId)) {
      return Response.json(null);
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const staffObjectId = new ObjectId(staffId);

    // Get Staff → Then fetch hotel rooms using hotelId
    const staff = await db.collection("Staff").findOne({
      _id: staffObjectId,
    });

    if (!staff) return Response.json(null);

    const hotelId = new ObjectId(staff.hotelId);

    const room = await db.collection("hotelRooms").findOne({
      hotelId: hotelId,
      staffId: staffObjectId,
    });

    return Response.json(room || null);

  } catch (error) {
    console.error("GET ROOM ERROR:", error);
    return Response.json(null);
  }
}