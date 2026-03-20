import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import GMSidebar from "../components/GMSidebar";
import ZoomImage from "@/components/ZoomImage";

export default async function GMPage({ params }) {
  const { id } = await params;

  if (!id || !ObjectId.isValid(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-600">
        Invalid GM ID
      </div>
    );
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const gm = await db.collection("gms").findOne({
    _id: new ObjectId(id),
  });

  if (!gm) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold text-red-600">
        GM Not Found
      </div>
    );
  }

  const staffList = await db
    .collection("Staff")
    .find({ gmId: new ObjectId(id) })
    .toArray();

  const attendanceRecords = await db
    .collection("attendance")
    .find({ gmId: new ObjectId(id) })
    .sort({ date: -1 })
    .limit(20)
    .toArray();

  return (
    <div className="flex min-h-screen bg-gray-100 text-black">

      {/* SIDEBAR */}
      <GMSidebar id={id} />

      {/* MAIN */}
      <div className="flex-1 p-12">

        {/* HEADER */}
        <div className="bg-white rounded-3xl shadow-lg p-10 mb-12 border border-gray-200">

          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, <span className="text-blue-600">{gm.name}</span>
          </h1>

          <p className="text-gray-500 text-lg">
            General Manager Dashboard
          </p>

        </div>


        {/* HOTEL INFO */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">

          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition">

            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              Hotel Code
            </p>

            <p className="text-3xl font-bold text-blue-600">
              {gm.hotelCode}
            </p>

          </div>


          <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 hover:shadow-lg transition">

            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              Account Created
            </p>

            <p className="text-lg font-semibold text-gray-700">
              {gm.createdAt
                ? new Date(gm.createdAt).toLocaleString()
                : "N/A"}
            </p>

          </div>

        </div>


        {/* STAFF TABLE */}

        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200 mb-14">

          <div className="flex items-center justify-between mb-8">

            <h2 className="text-3xl font-bold text-gray-800">
              Staff Members
            </h2>

            <div className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
              Total: {staffList.length}
            </div>

          </div>


          <div className="overflow-x-auto rounded-2xl border border-gray-200">

            <table className="w-full text-left">

              <thead>

                <tr className="bg-gradient-to-r from-blue-50 to-blue-100 text-gray-700 uppercase text-sm tracking-wider">

                  <th className="p-5">Profile</th>
                  <th className="p-5">Name</th>
                  <th className="p-5">Password</th>
                  <th className="p-5">Role</th>
                  <th className="p-5">Access</th>
                  <th className="p-5 text-center">Actions</th>

                </tr>

              </thead>

              <tbody>

                {staffList.map((staff) => (

                  <tr
                    key={staff._id.toString()}
                    className="border-t hover:bg-blue-50 transition-all duration-200"
                  >

                    <td className="p-5">

                      {staff.profilePicture ? (

                        <ZoomImage
                          src={`data:image/png;base64,${staff.profilePicture}`}
                        />

                      ) : (

                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                          {staff.name?.charAt(0)}
                        </div>

                      )}

                    </td>


                    <td className="p-5 font-semibold text-lg">
                      {staff.name}
                    </td>


                    <td className="p-5">
                      <span className="bg-gray-100 px-3 py-1 rounded-lg text-sm">
                        {staff.password}
                      </span>
                    </td>


                    <td className="p-5">
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {staff.role}
                      </span>
                    </td>


                    <td className="p-5">

                      {staff.access?.length ? (

                        <div className="flex flex-wrap gap-2">

                          {staff.access.map((a, index) => (
                            <span
                              key={index}
                              className="bg-gray-100 px-3 py-1 text-xs rounded-full"
                            >
                              {a}
                            </span>
                          ))}

                        </div>

                      ) : (
                        <span className="text-gray-400">
                          No Access
                        </span>
                      )}

                    </td>


                    <td className="p-5 text-center">

                      <a
                        href={`/gm/${id}/staff/${staff._id}/edit`}
                       className="px-3 py-1 text-xs rounded-full 
bg-blue-100 text-blue-700 
border border-gray-200 shadow-sm"
                      >
                        ✏️ Edit
                      </a>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </div>



        {/* ATTENDANCE */}

        <div className="bg-white rounded-3xl p-10 shadow-xl border border-gray-200 mt-20">

          <h2 className="text-3xl font-bold text-gray-800 mb-10">
            Attendance Records
          </h2>

          {attendanceRecords.length === 0 ? (

            <p className="text-gray-500">
              No attendance records found
            </p>

          ) : (

            <div className="space-y-10">

              {attendanceRecords.map((record) => (

                <div
                  key={record._id.toString()}
                  className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition"
                >

                  {/* DATE HEADER */}

                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 rounded-t-2xl flex justify-between items-center">

                    <h3 className="text-xl font-bold text-blue-700">
                      {new Date(record.date).toLocaleDateString()}
                    </h3>

                    <span className="bg-white px-3 py-1 rounded-full text-sm text-gray-600 shadow">
                      Staff: {record.staff.length}
                    </span>

                  </div>


                  {/* STAFF ATTENDANCE TABLE */}

                  <div className="overflow-x-auto">

                    <table className="w-full text-left">

                      <thead>

                        <tr className="bg-gray-50 text-sm text-gray-700">

                          <th className="p-4">Name</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Status</th>
                          <th className="p-4">Arrival Time</th>

                        </tr>

                      </thead>


                      <tbody>

                        {record.staff.map((staff, index) => (

                          <tr
                            key={index}
                            className="border-t hover:bg-gray-50"
                          >

                            <td className="p-4 font-semibold">
                              {staff.name}
                            </td>

                            <td className="p-4">
                              {staff.role}
                            </td>

                            <td className="p-4">

                              {staff.status === "Present" ? (

                                <span className="text-green-600 font-semibold">
                                  Present
                                </span>

                              ) : (

                                <span className="text-red-500 font-semibold">
                                  Absent
                                </span>

                              )}

                            </td>

                            <td className="p-4">
                              {staff.time || "-"}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

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