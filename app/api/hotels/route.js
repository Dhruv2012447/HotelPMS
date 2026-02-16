import clientPromise from "@/lib/mongodb";

// ✅ GET all hotels
export async function GET() {
  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const hotels = await db.collection("hotels").find().toArray();

  return Response.json({ hotels });
}

// ✅ Add new hotel
export async function POST(req) {
  const body = await req.json();

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const now = new Date();
  let expiry = new Date();

  if (body.duration === "1M") expiry.setMonth(now.getMonth() + 1);
  if (body.duration === "3M") expiry.setMonth(now.getMonth() + 3);
  if (body.duration === "1Y") expiry.setFullYear(now.getFullYear() + 1);

  await db.collection("hotels").insertOne({
    hotelId: body.hotelId,
    password: body.password,
    sub: body.sub,
    manualStatus: "Active",
    access: body.access,
    createdAt: now,
    expiresAt: expiry,
  });

  return Response.json({ message: "Hotel Created" });
}
