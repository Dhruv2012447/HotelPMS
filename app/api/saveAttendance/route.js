import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {

    const { hotelId, gmId, attendance } = await req.json();

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    await db.collection("attendance").insertOne({

      hotelId,

      gmId: new ObjectId(gmId),

      date: new Date(),

      staff: attendance.map((s) => ({
        staffId: new ObjectId(s.staffId),
        name: s.name,
        role: s.role,

        status: s.present
          ? "Present"
          : "Absent",

        time: s.time || null
      }))

    });

    return Response.json({ success: true });

  } catch (error) {

    console.error(error);

    return Response.json(
      { success: false },
      { status: 500 }
    );

  }
}