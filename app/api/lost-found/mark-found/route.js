import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req) {
  const { itemId } = await req.json();

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  await db.collection("lost&found").updateOne(
    { _id: new ObjectId(itemId) },
    { $set: { status: "Found" } }
  );

  return Response.json({ success: true });
}