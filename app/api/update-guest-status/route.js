import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { guestId } = await req.json();

    if (!guestId || !ObjectId.isValid(guestId)) {
      return Response.json(
        { success: false, message: "Invalid Guest ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const guest = await db.collection("GuestData").findOne({
      _id: new ObjectId(guestId),
    });

    if (!guest) {
      return Response.json(
        { success: false, message: "Guest not found" },
        { status: 404 }
      );
    }

    const newStatus =
      guest.status === "checked-in"
        ? "checked-out"
        : "checked-in";

    await db.collection("GuestData").updateOne(
      { _id: new ObjectId(guestId) },
      { $set: { status: newStatus } }
    );

    return Response.json({
      success: true,
      newStatus,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}