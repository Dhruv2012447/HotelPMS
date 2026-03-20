import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { id } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return Response.json(
        { success: false, message: "Invalid ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const existing = await db.collection("laundry").findOne({
      _id: new ObjectId(id),
    });

    if (!existing) {
      return Response.json(
        { success: false, message: "Laundry not found" },
        { status: 404 }
      );
    }

    await db.collection("laundry").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "Completed" } }
    );

    return Response.json({
      success: true,
      newStatus: "Completed",
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}