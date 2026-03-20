import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { staffId, roomNumber, itemName, itemsCount } = await req.json();

    if (!staffId || !roomNumber || !itemName || !itemsCount) {
      return Response.json({ success: false });
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const staff = await db.collection("Staff").findOne({
      _id: new ObjectId(staffId),
    });

    if (!staff) {
      return Response.json({ success: false });
    }

    await db.collection("laundry").insertOne({
      hotelId: new ObjectId(staff.hotelId),
      roomNumber,
      itemName,
      itemsCount,
      status: "Pending",
      createdAt: new Date(),
    });

    return Response.json({ success: true });

  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}