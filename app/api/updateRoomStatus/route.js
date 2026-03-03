import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { hotelId, roomNumber, status } =
      await req.json();

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    await db.collection("hotelRooms").updateOne(
      {
        hotelId: new ObjectId(hotelId),
      },
      {
        $set: {
          [`rooms.${roomNumber}.status`]: status,
          [`rooms.${roomNumber}.updatedAt`]:
            new Date(),
        },
      }
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false },
      { status: 500 }
    );
  }
}