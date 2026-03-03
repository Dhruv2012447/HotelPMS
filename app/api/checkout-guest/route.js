import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    const { guestId } = await req.json();

    /* ==============================
       ✅ VALIDATION
    ============================== */

    if (!guestId || !ObjectId.isValid(guestId)) {
      return Response.json(
        { success: false, message: "Invalid Guest ID" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    /* ==============================
       🔎 FIND GUEST
    ============================== */

    const guest = await db.collection("GuestData").findOne({
      _id: new ObjectId(guestId),
    });

    if (!guest) {
      return Response.json(
        { success: false, message: "Guest not found" },
        { status: 404 }
      );
    }

    if (guest.status === "Checked-Out") {
      return Response.json(
        { success: false, message: "Guest already checked out" },
        { status: 400 }
      );
    }

    /* ==============================
       🔎 FIND HOTEL ROOM DOCUMENT
    ============================== */

    const hotelRoomDoc = await db.collection("hotelRooms").findOne({
      hotelId: guest.hotelId,
    });

    if (!hotelRoomDoc || !hotelRoomDoc.rooms) {
      return Response.json(
        { success: false, message: "Hotel rooms not found" },
        { status: 404 }
      );
    }

    const updatedRooms = { ...hotelRoomDoc.rooms };

    /* ==============================
       🔥 SET ALL GUEST ROOMS TO AVAILABLE
    ============================== */

    if (Array.isArray(guest.rooms)) {
      Object.keys(updatedRooms).forEach((key) => {
        guest.rooms.forEach((guestRoom) => {
          if (
            updatedRooms[key].roomNumber == guestRoom.roomNumber
          ) {
            updatedRooms[key].status = "Available";
            updatedRooms[key].updatedAt = new Date();
          }
        });
      });
    }

    /* ==============================
       🔥 UPDATE ROOM DOCUMENT
    ============================== */

    await db.collection("hotelRooms").updateOne(
      { _id: hotelRoomDoc._id },
      {
        $set: {
          rooms: updatedRooms,
          updatedAt: new Date(),
        },
      }
    );

    /* ==============================
       🔥 UPDATE GUEST STATUS
    ============================== */

    await db.collection("GuestData").updateOne(
      { _id: guest._id },
      {
        $set: {
          status: "Checked-Out",
          checkoutAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    return Response.json({
      success: true,
      message: "Guest checked out successfully",
    });

  } catch (error) {
    console.error("CHECKOUT ERROR:", error);

    return Response.json(
      { success: false, message: "Server Error" },
      { status: 500 }
    );
  }
}