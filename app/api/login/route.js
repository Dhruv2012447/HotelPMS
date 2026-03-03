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

    // ✅ HOTEL LOGIN
    const hotel = await db.collection("hotels").findOne({
      hotelId: userId,
      password: password,
    });

    if (hotel) {
      if (hotel.manualStatus !== "Active") {
        return NextResponse.json(
          { error: "Hotel inactive" },
          { status: 403 }
        );
      }

      return NextResponse.json({
        role: "hotel",
        redirect: `/hotel/${hotel._id}`,
      });
    }

    // ✅ GM LOGIN
    const gm = await db.collection("gms").findOne({
      name: userId,
      password: password,
    });

    if (gm) {
      return NextResponse.json({
        role: "gm",
        redirect: `/gm/${gm._id}`,
      });
    }
// ✅ STAFF LOGIN (ROLE BASED REDIRECT)
const staff = await db.collection("Staff").findOne({
  name: userId,
  password: password,
});

if (staff) {
  const role = staff.role?.toLowerCase();

  let redirectPath = "";

  if (role === "receptionist") {
    redirectPath = `/staff/receptionist/${staff._id}`;
  } 
  else if (role === "housekeeping") {
    redirectPath = `/staff/Housekeeping/${staff._id}`;
  } 
  else if (role === "security") {
    redirectPath = `/staff/security/${staff._id}`;
  } 
  else {
    return NextResponse.json(
      { error: "Unauthorized staff role" },
      { status: 403 }
    );
  }

  return NextResponse.json({
    role: "staff",
    staffRole: role,
    redirect: redirectPath,
  });
}


  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
