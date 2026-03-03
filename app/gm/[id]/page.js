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

  // ✅ Fetch GM
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

  // ✅ FIXED: Convert gmId to ObjectId
  const staffList = await db
    .collection("Staff")
    .find({ gmId: new ObjectId(id) }) // 🔥 THIS WAS THE PROBLEM
    .toArray();

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <GMSidebar id={id} />

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">

        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-10 border border-blue-100">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome, <span className="text-blue-600">{gm.name}</span>
          </h1>
          <p className="text-gray-500 text-lg">
            General Manager Dashboard
          </p>
        </div>

        {/* INFO CARDS */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-blue-600 uppercase mb-3">
              Hotel Code
            </h2>
            <p className="text-2xl font-bold text-gray-800">
              {gm.hotelCode}
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-sm font-semibold text-blue-600 uppercase mb-3">
              Account Created
            </h2>
            <p className="text-md font-semibold text-gray-800">
              {gm.createdAt
                ? new Date(gm.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>
{/* Access Modules */}
        <div className="mb-8 mt-8">
          <p className="text-gray-500 text-sm mb-3 uppercase tracking-wide">Access Modules</p>
          <div className="flex flex-wrap gap-3">
            {gm.access && gm.access.length > 0 ? (
              gm.access.map((module, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-4 py-1 text-sm font-medium rounded-full shadow-sm"
                >
                  {module}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No access assigned</span>
            )}
          </div>
        </div>
        </div>
 
       {/* ⭐ PREMIUM STAFF TABLE */}
<div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-xl border border-blue-100">

  {/* Header */}
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-3xl font-bold text-gray-800">
      Staff Members
    </h2>

    <div className="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold shadow-sm">
      Total: {staffList.length}
    </div>
  </div>

  {staffList.length === 0 ? (
    <div className="text-center py-16">
      <div className="text-6xl mb-4">👥</div>
      <p className="text-gray-500 text-lg font-medium">
        No staff members added yet.
      </p>
    </div>
  ) : (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">

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
              className="border-t hover:bg-blue-50/60 transition-all duration-300 hover:shadow-sm"
            >
              {/* Profile */}
              <td className="p-5">
                {staff.profilePicture ? (
                  <ZoomImage
  src={`data:image/png;base64,${staff.profilePicture}`}
/>

                ) : (
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                    {staff.name?.charAt(0)}
                  </div>
                )}
              </td>

              {/* Name */}
              <td className="p-5 font-semibold text-gray-800 text-lg">
                {staff.name}
              </td>

              {/* Password */}
              <td className="p-5 text-gray-500">
                <span className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                  {staff.password}
                </span>
              </td>

              {/* Role */}
              <td className="p-5">
                <span className="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold shadow-sm">
                  {staff.role}
                </span>
              </td>

              {/* Access */}
              <td className="p-5">
                <div className="flex flex-wrap gap-2">
                  {staff.access?.length > 0 ? (
                    staff.access.map((a, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-medium shadow-md hover:scale-105 transition"
                      >
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No Access
                    </span>
                  )}
                </div>
              </td>
              {/* Actions */}
<td className="p-5 text-center">
  <a
    href={`/gm/${id}/staff/${staff._id}/edit`}
    className="inline-block px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
  >
    ✏️ Edit
  </a>
</td>

            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )}
</div>

      </div>
    </div>
  );
}
