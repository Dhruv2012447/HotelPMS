import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(req, context) {
  try {
    const { staffId } = await context.params;

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    await db.collection("Staff").deleteOne({
      _id: new ObjectId(staffId),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
