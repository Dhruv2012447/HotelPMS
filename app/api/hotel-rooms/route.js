import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

/* ===============================
   GET ROOMS
=============================== */

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const staffId = searchParams.get("staffId");

    if (!staffId || !ObjectId.isValid(staffId)) {
      return Response.json({ success: false });
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const data = await db.collection("hotelRooms").findOne({
      staffId: new ObjectId(staffId),
    });

    if (!data) {
      return Response.json({ success: false });
    }

    return Response.json({
      success: true,
      totalRooms: data.totalRooms,
      rooms: Object.values(data.rooms || {}),
    });

  } catch (error) {
    return Response.json({ success: false });
  }
}

/* ===============================
   SAVE / UPDATE ROOMS
=============================== */

export async function POST(req) {
  try {
    const { staffId, totalRooms, rooms } = await req.json();

    if (!staffId || !ObjectId.isValid(staffId)) {
      return Response.json({
        success: false,
        message: "Invalid Staff ID",
      });
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    const staffObjectId = new ObjectId(staffId);

    const staff = await db.collection("Staff").findOne({
      _id: staffObjectId,
    });

    if (!staff) {
      return Response.json({
        success: false,
        message: "Staff not found",
      });
    }

    const hotelObjectId = ObjectId.isValid(staff.hotelId)
      ? new ObjectId(staff.hotelId)
      : staff.hotelId;

    const formattedRooms = {};

    rooms.forEach((room) => {
      formattedRooms[room.roomNumber] = {
        ...room,
        roomNumber: Number(room.roomNumber),
        price: Number(room.price),
        maxAdults: Number(room.maxAdults),
        maxChildren: Number(room.maxChildren),
        status: room.status || "Available",
        updatedAt: new Date(),
      };
    });

    const existing = await db.collection("hotelRooms").findOne({
      staffId: staffObjectId,
    });

    if (existing) {
      await db.collection("hotelRooms").updateOne(
        { _id: existing._id },
        {
          $set: {
            rooms: formattedRooms,
            totalRooms: Number(totalRooms),
            updatedAt: new Date(),
          },
        }
      );
    } else {
      await db.collection("hotelRooms").insertOne({
        staffId: staffObjectId,
        hotelId: hotelObjectId,
        totalRooms: Number(totalRooms),
        rooms: formattedRooms,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return Response.json({
      success: true,
      message: "Rooms saved successfully",
    });

  } catch (error) {
    return Response.json({
      success: false,
      message: error.message,
    });
  }
}