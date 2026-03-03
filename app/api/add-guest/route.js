import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("BODY RECEIVED:", body);

    const { staffId, guestName, phoneNumber, rooms } = body;

    /* ==============================
       ✅ BASIC VALIDATION
    ============================== */

    if (!staffId || !guestName || !phoneNumber) {
      return Response.json(
        { success: false, message: "Basic fields missing" },
        { status: 400 }
      );
    }

    if (!rooms || !Array.isArray(rooms) || rooms.length === 0) {
      return Response.json(
        { success: false, message: "Rooms not selected properly" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    /* ==============================
       🔥 FIND STAFF
    ============================== */

    let staff = null;

    if (ObjectId.isValid(staffId)) {
      staff = await db.collection("Staff").findOne({
        _id: new ObjectId(staffId),
      });
    }

    if (!staff) {
      staff = await db.collection("Staff").findOne({
        _id: staffId,
      });
    }

    if (!staff) {
      return Response.json(
        { success: false, message: "Staff not found" },
        { status: 404 }
      );
    }

    const hotelId = staff.hotelId;

    /* ==============================
       🔥 INSERT GUEST
    ============================== */

    await db.collection("GuestData").insertOne({
      hotelId,
      staffId,
      guestName,
      phoneNumber,

      roomsTaken: rooms.length,
      rooms: rooms.map((r) => ({
        roomNumber: r.roomNumber,
        roomType: r.roomType,
        bedType: r.bedType,
        price: r.price,
      })),

      status: "Checked-In",
      checkInDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    /* ==============================
       🔥 UPDATE ALL SELECTED ROOMS STATUS
    ============================== */

    const hotelRoomDoc = await db.collection("hotelRooms").findOne({
      hotelId: hotelId,
    });

    if (hotelRoomDoc?.rooms) {
      const updatedRooms = { ...hotelRoomDoc.rooms };

      Object.keys(updatedRooms).forEach((key) => {
        rooms.forEach((selectedRoom) => {
          if (
            updatedRooms[key].roomNumber == selectedRoom.roomNumber
          ) {
            updatedRooms[key].status = "Occupied";
            updatedRooms[key].updatedAt = new Date();
          }
        });
      });

      await db.collection("hotelRooms").updateOne(
        { _id: hotelRoomDoc._id },
        { $set: { rooms: updatedRooms, updatedAt: new Date() } }
      );
    }

    return Response.json({ success: true });

  } catch (error) {
    console.error("ADD GUEST ERROR:", error);
    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}