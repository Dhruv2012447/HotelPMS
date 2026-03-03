import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const gmId = formData.get("gmId");
    const name = formData.get("name");
    const password = formData.get("password");
    const role = formData.get("role");
    const hotelId = formData.get("hotelId");
    const hotelCode = formData.get("hotelCode");
    const gmName = formData.get("gmName");
    const access = JSON.parse(formData.get("access") || "[]");

    const profilePicFile = formData.get("profilePic");

    let profilePicture = "";

    if (profilePicFile && profilePicFile.size > 0) {
      const bytes = await profilePicFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      profilePicture = buffer.toString("base64");
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const result = await db.collection("Staff").insertOne({
      hotelId: new ObjectId(hotelId),
      gmId: new ObjectId(gmId),
      name,
      password,
      role,
      hotelCode,
      gmName,
      access,
      profilePicture,
      createdAt: new Date(),
    });

    return Response.json({
      success: true,
      message: "Staff created successfully",
      id: result.insertedId,
    });

  } catch (error) {
    console.error("STAFF CREATE ERROR:", error);
    return Response.json(
      { success: false, message: "Error creating staff" },
      { status: 500 }
    );
  }
}
