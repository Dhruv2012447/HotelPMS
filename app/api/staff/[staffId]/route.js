import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  try {
    // ✅ Await params (IMPORTANT)
    const { staffId } = await context.params;

    if (!staffId || !ObjectId.isValid(staffId)) {
      return NextResponse.json(
        { success: false, message: "Invalid Staff ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const staff = await db
      .collection("Staff") // Capital S
      .findOne({ _id: new ObjectId(staffId) });

    if (!staff) {
      return NextResponse.json(
        { success: false, message: "Staff Not Found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      staff,
    });

  } catch (error) {
    console.error("GET STAFF ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}
