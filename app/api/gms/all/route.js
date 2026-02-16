import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const { hotelId } = context.params;

    if (!hotelId) {
      return NextResponse.json(
        { error: "HotelId missing" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    // IMPORTANT: hotelId stored as STRING in GMs collection
    const gms = await db
      .collection("gms")
      .find({ hotelId: hotelId })
      .toArray();

    return NextResponse.json({ gms });

  } catch (error) {
    console.error("GM API ERROR:", error);

    return NextResponse.json(
      { error: "Failed to fetch GMs" },
      { status: 500 }
    );
  }
}
