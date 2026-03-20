import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import HotelSidebar from "@/components/hotel/HotelSidebar";

export default async function HotelDashboard({ params }) {

  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    return <div className="p-10 text-red-600 text-xl">Invalid Hotel ID</div>;
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const gms = await db
    .collection("gms")
    .find({ hotelId: new ObjectId(id) })
    .toArray();

  const gmIds = gms.map(gm => gm._id);

  const staffList = await db
    .collection("Staff")
    .find({ gmId: { $in: gmIds } })
    .toArray();

  const attendanceRecords = await db
    .collection("attendance")
    .find({ gmId: { $in: gmIds } })
    .sort({ date: -1 })
    .limit(30)
    .toArray();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-black">

      {/* MAIN */}
      <div className="flex-1 p-10">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-lg p-10 mb-10 border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏨 Hotel Dashboard
          </h1>
          <p className="text-gray-500">
            Manage all GMs, staff and attendance in one place
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border">
            <p className="text-gray-500 text-sm">Total GMs</p>
            <h2 className="text-4xl font-bold text-blue-600 mt-2">
              {gms.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border">
            <p className="text-gray-500 text-sm">Total Staff</p>
            <h2 className="text-4xl font-bold text-green-600 mt-2">
              {staffList.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border">
            <p className="text-gray-500 text-sm">Attendance Records</p>
            <h2 className="text-4xl font-bold text-purple-600 mt-2">
              {attendanceRecords.length}
            </h2>
          </div>

        </div>


        {/* GM LIST */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-12 border">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            👨‍💼 General Managers
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            {gms.map(gm => (
              <div
                key={gm._id}
                className="p-5 rounded-xl border hover:shadow-lg hover:-translate-y-1 transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-3">
                  {gm.name?.charAt(0)}
                </div>

                <p className="font-semibold text-lg text-gray-800">
                  {gm.name}
                </p>

                <p className="text-gray-500 text-sm">
                  Code: {gm.hotelCode}
                </p>
              </div>
            ))}

          </div>
        </div>


        {/* STAFF TABLE */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-12 border">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            👥 Staff Members
          </h2>

          <div className="overflow-x-auto rounded-xl border">

            <table className="w-full">

              <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 text-sm">
                <tr>
                  <th className="p-4 text-left">Name</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">GM</th>
                </tr>
              </thead>

              <tbody>

                {staffList.map(staff => {
                  const gm = gms.find(g => g._id.toString() === staff.gmId.toString());

                  return (
                    <tr
                      key={staff._id}
                      className="border-t hover:bg-blue-50 transition"
                    >
                      <td className="p-4 font-medium">
                        {staff.name}
                      </td>

                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700">
                          {staff.role}
                        </span>
                      </td>

                      <td className="p-4 text-gray-600">
                        {gm?.name || "N/A"}
                      </td>
                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        </div>


        {/* ATTENDANCE */}
        <div className="bg-white rounded-3xl p-8 shadow-lg border">

          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            📅 Attendance
          </h2>

          {attendanceRecords.length === 0 ? (
            <p className="text-gray-500">No records found</p>
          ) : (

            <div className="space-y-6">

              {attendanceRecords.map(record => (

                <div
                  key={record._id}
                  className="border rounded-xl overflow-hidden hover:shadow-md transition"
                >

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-3 flex justify-between items-center">
                    <span className="font-semibold text-blue-700">
                      {new Date(record.date).toLocaleDateString()}
                    </span>

                    <span className="text-sm bg-white px-3 py-1 rounded-full shadow">
                      {record.staff.length} Staff
                    </span>
                  </div>

                  <div className="p-4 space-y-2">

                    {record.staff.map((s, i) => (

                      <div
                        key={i}
                        className="flex justify-between items-center border-b pb-2 text-sm"
                      >
                        <span>{s.name}</span>

                        <span
                          className={`font-semibold ${
                            s.status === "Present"
                              ? "text-green-600"
                              : "text-red-500"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>

                    ))}

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>
    </div>
  );
}