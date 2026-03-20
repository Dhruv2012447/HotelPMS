import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {

    const { searchParams } = new URL(req.url);

    const staffId = searchParams.get("staffId");
    const roomType = searchParams.get("roomType");

    if (!staffId) {
      return Response.json(
        { success: false, message: "StaffId required" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("hotelPMS");

    /* =========================
       🔹 FIND STAFF
    ========================== */

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

    /* =========================
       🔹 GET HOTEL ROOMS
    ========================== */

    const hotelRoomDoc = await db.collection("hotelRooms").findOne({
      hotelId: hotelId,
    });

    if (!hotelRoomDoc || !hotelRoomDoc.rooms) {
      return Response.json({
        success: true,
        rooms: [],
      });
    }

    /* =========================
       🔹 GET ROOM STATUS
    ========================== */

    const roomStatusDoc = await db.collection("roomStatus").findOne({
      hotelId: hotelId,
    });

    const statusArray = roomStatusDoc?.rooms || [];

    /* =========================
       🔹 FILTER ROOMS
    ========================== */

    const updatedRooms = { ...hotelRoomDoc.rooms };

    let updateNeeded = false;
    const availableRooms = [];

    Object.keys(updatedRooms).forEach((key) => {

      const room = updatedRooms[key];

      if (!room) return;

      const normalizedStatus = (room.status || "")
        .toLowerCase()
        .replace("-", "")
        .replace(" ", "");

      /* =========================
         🔹 AUTO FIX CHECKEDOUT
      ========================== */

      if (normalizedStatus === "checkedout") {

        updatedRooms[key].status = "Available";
        updatedRooms[key].updatedAt = new Date();

        updateNeeded = true;
      }

      /* =========================
         🔹 FIND ROOM STATUS ENTRY
      ========================== */

      const roomStatusEntry = statusArray.find(
        (r) => Number(r.roomNumber) === Number(room.roomNumber)
      );

      const roomCleanStatus = roomStatusEntry?.status?.toLowerCase();

      /* =========================
         🔹 CHECK AVAILABLE STATUS
      ========================== */

      const isAvailableStatus =
        ["available", "clean", "cleaned"].includes(
          (updatedRooms[key].status || "").toLowerCase()
        );

      const isCleaned =
        ["clean", "cleaned"].includes(roomCleanStatus);

      /* =========================
         🔹 FINAL FILTER
      ========================== */

      if (
        isAvailableStatus &&
        isCleaned &&
        (!roomType || updatedRooms[key].roomType === roomType)
      ) {
        availableRooms.push(updatedRooms[key]);
      }

    });

    /* =========================
       🔹 SAVE IF UPDATED
    ========================== */

    if (updateNeeded) {

      await db.collection("hotelRooms").updateOne(
        { _id: hotelRoomDoc._id },
        {
          $set: {
            rooms: updatedRooms,
            updatedAt: new Date(),
          },
        }
      );

    }

    /* =========================
       🔹 RESPONSE
    ========================== */

    return Response.json({
      success: true,
      rooms: availableRooms,
    });

  } catch (error) {

    console.error("SEARCH ERROR:", error);

    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );

  }
}