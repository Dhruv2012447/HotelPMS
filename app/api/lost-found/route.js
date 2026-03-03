import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { staffId, itemName, roomNumber, category, description } =
      await req.json();

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const staff = await db.collection("Staff").findOne({
      _id: new ObjectId(staffId),
    });

    if (!staff) {
      return Response.json({ success: false }, { status: 404 });
    }

    const hotelId = new ObjectId(staff.hotelId);

    // ✅ Validate Room belongs to hotel
    const hotelRooms = await db.collection("hotelRooms").findOne({
      hotelId,
    });

    if (!hotelRooms?.rooms?.[roomNumber]) {
      return Response.json(
        { success: false, message: "Invalid Room" },
        { status: 400 }
      );
    }

    await db.collection("lost&found").insertOne({
      hotelId,
      staffId: new ObjectId(staffId),
      roomNumber: Number(roomNumber),
      itemName,
      category,
      description,
      status: "Unclaimed",
      foundAt: new Date(),
      updatedAt: new Date(),
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json({ success: false }, { status: 500 });
  }
}