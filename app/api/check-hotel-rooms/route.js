import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const staffId = searchParams.get("staffId");

  if (!staffId || !ObjectId.isValid(staffId)) {
    return Response.json({ exists: false });
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const existing = await db.collection("hotelRooms").findOne({
    staffId: new ObjectId(staffId),
  });

  return Response.json({
    exists: !!existing,
  });
}