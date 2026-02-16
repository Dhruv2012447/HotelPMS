import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, access } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();

    // 🔥 TEMP: hardcoded hotelId (replace later with session)
    const hotelId = "H2";

    const newGM = {
      hotelId,
      name,
      email,
      password,
      access,
      createdAt: new Date(),
    };

    await db.collection("gms").insertOne(newGM);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("GM CREATE ERROR:", error);
    return NextResponse.json(
      { error: "Server Error" },
      { status: 500 }
    );
  }
}
