export const dynamic = "force-dynamic";

import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import HotelSidebar from "@/components/hotel/HotelSidebar";

export default async function LaundryPage({ params }) {

  const { id } = await params;

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const staffList = await db
    .collection("Staff")
    .find({ 
hotelId: new ObjectId(id), role: "Laundry" })
    .project({ hotelId: 1 })
    .toArray();

  const hotelId = staffList.length > 0 ? staffList[0].hotelId : null;

  let laundry = [];

  if (hotelId) {

    laundry = await db.collection("laundry")
      .find({ hotelId })
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();
  }

  return (
    <div className="flex min-h-screen bg-gray-100 text-gray-800">


      <div className="flex-1 p-6 md:p-10 space-y-10">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between">

          <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
            Laundry Activity
          </h1>

          <div className="text-sm text-gray-500 mt-2 md:mt-0">
            Laundry Management
          </div>

        </div>


        {/* STATS */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Total Laundry Orders</p>
            <h2 className="text-3xl font-bold text-blue-600">
              {laundry.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Completed</p>
            <h2 className="text-3xl font-bold text-green-600">
              {laundry.filter(i => i.status === "Completed").length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <p className="text-gray-500 text-sm">Pending</p>
            <h2 className="text-3xl font-bold text-red-600">
              {laundry.filter(i => i.status !== "Completed").length}
            </h2>
          </div>

        </div>


        {/* TABLE */}

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <div className="p-5 border-b">
            <h2 className="text-xl font-semibold">
              Laundry Records
            </h2>
          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-600 uppercase text-xs">

              <tr>
                <th className="p-4 text-left">Room</th>
                <th className="p-4 text-left">Item</th>
                <th className="p-4 text-left">Quantity</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Date</th>
              </tr>

            </thead>

            <tbody>

              {laundry.map((item) => (

                <tr
                  key={item._id}
                  className="border-t hover:bg-gray-50 transition"
                >

                  <td className="p-4 font-medium">
                    {item.roomNumber}
                  </td>

                  <td className="p-4">
                    {item.itemName}
                  </td>

                  <td className="p-4">
                    {item.itemsCount}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {item.status}
                    </span>

                  </td>

                  <td className="p-4">

                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"
                    }

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}