// app/api/hotels/[id]/route.js (Next.js App Router style)

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req, context) {
  const { id } = context.params;

  if (!ObjectId.isValid(id)) {
    return new Response(JSON.stringify({ error: "Invalid hotel ID" }), {
      status: 400,
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const hotel = await db.collection("hotels").findOne({ _id: new ObjectId(id) });

    if (!hotel) {
      return new Response(JSON.stringify({ error: "Hotel not found" }), { status: 404 });
    }

    // Only return hotelId and access
    const response = {
      hotelId: hotel.hotelId,
      access: hotel.access || [],
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (err) {
    console.error("Error fetching hotel:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
