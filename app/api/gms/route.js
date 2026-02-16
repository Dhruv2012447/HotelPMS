import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");

    if (!hotelId) {
      return NextResponse.json({ error: "hotelId query required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const gms = await db
      .collection("gms")
      .find({ hotelId: new ObjectId(hotelId) })
      .toArray();

    return NextResponse.json({ gms }, { status: 200 });
  } catch (error) {
    console.error("GM GET ERROR:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { hotelId, hotelCode, name, password, access } = body;

    if (!hotelId || !name || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    // Check if GM already exists
    const existingGM = await db.collection("gms").findOne({
      hotelId: new ObjectId(hotelId),
      name,
    });

    if (existingGM) {
      return NextResponse.json({ error: "GM already exists for this hotel" }, { status: 400 });
    }

    const newGM = {
      hotelId: new ObjectId(hotelId), // Link to hotel
      hotelCode: hotelCode,
      name,
      password, // ⚠️ In production, hash this!
      access: access || [],
      createdAt: new Date(),
    };

    await db.collection("gms").insertOne(newGM);

    return NextResponse.json({ message: "GM Created Successfully" }, { status: 201 });
  } catch (error) {
    console.error("GM CREATE ERROR:", error);
    return NextResponse.json({ error: "Server error", details: error.message }, { status: 500 });
  }
}
