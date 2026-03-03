import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// ✅ GET → fetch GM
export async function GET(req, context) {
  try {
    const { id } = await context.params; // ✅ FIX HERE

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const gm = await db
      .collection("gms")
      .findOne({ _id: new ObjectId(id) });

    if (!gm) {
      return NextResponse.json(
        { error: "GM not found" },
        { status: 404 }
      );
    }

    gm._id = gm._id.toString();
    gm.hotelId = gm.hotelId?.toString();

    return NextResponse.json({ gm });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ PATCH → update GM
export async function PATCH(req, context) {
  try {
    const { id } = await context.params; // ✅ FIX HERE
    const { name, password, access, profilePic } = await req.json(); // ✅ added profilePic

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const result = await db.collection("gms").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...(name && { name }),
          ...(password && { password }),
          ...(access && { access }),
          ...(profilePic && { profilePic }), // ✅ ONLY this line added
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "GM not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}

// ✅ DELETE → delete GM
export async function DELETE(req, context) {
  try {
    const { id } = await context.params; // ✅ FIX HERE

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const result = await db
      .collection("gms")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "GM not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
