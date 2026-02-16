import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  const { userId, password } = await req.json();

  // 🔐 SUPER ADMIN
  if (userId === "s1" && password === "s1234") {
    return NextResponse.json({
      role: "superadmin",
      redirect: "/super-admin",
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const hotel = await db.collection("hotels").findOne({
      hotelId: userId,
      password: password,
    });

    if (!hotel) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (hotel.manualStatus !== "Active") {
      return NextResponse.json(
        { error: "Hotel inactive" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      role: "hotel",
      redirect: `/hotel/${hotel._id}`,  // ✅ FIXED
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
