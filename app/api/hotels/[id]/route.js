import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

async function safeJson(res) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

export async function GET(req, context) {
  try {
    const { id } = await context.params;

    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) });

    if (!hotel)
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("GET HOTEL ERROR:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

export async function PUT(req, context) {
  try {
    const { id } = await context.params;

    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });

    const body = await req.json();
    const { sub, access, manualStatus, expiresAt } = body;

    if (!sub || !access || !manualStatus)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const updateResult = await db.collection("hotels").updateOne(
      { _id: new ObjectId(id) },
      { $set: { sub, access, manualStatus, expiresAt: expiresAt ? new Date(expiresAt) : null } }
    );

    if (updateResult.matchedCount === 0)
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    return NextResponse.json({ message: "Hotel updated successfully" });
  } catch (error) {
    console.error("UPDATE HOTEL ERROR:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  try {
    const { id } = await context.params;

    if (!id || !ObjectId.isValid(id))
      return NextResponse.json({ error: "Invalid hotel ID" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const deleteResult = await db.collection("hotels").deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0)
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });

    // Always return JSON to avoid JSON.parse errors
    return NextResponse.json({ message: "Hotel deleted successfully" });
  } catch (error) {
    console.error("DELETE HOTEL ERROR:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
