import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req, context) {
  try {
    const { staffId } = await context.params;
    const body = await req.json();

    const client = await clientPromise;
    const db = client.db("hotelPMS");

   await db.collection("Staff").updateOne(
  { _id: new ObjectId(staffId) },
  {
    $set: {
      name: body.name,
      password: body.password,
      role: body.role,
      access: body.access,
      profilePicture: body.profilePicture,
    },
  }
);


    return NextResponse.json({ success: true });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false });
  }
}
