import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { hotelId, roomNumber, roomType, status } = await req.json();

    if (!hotelId || !roomNumber) {
      return Response.json({ success: false, message: "Missing data" });
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    await db.collection("roomStatus").updateOne(
      {
        hotelId: new ObjectId(hotelId),
        roomNumber,
      },
      {
        $set: {
          roomType,
          status,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return Response.json({ success: true });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}