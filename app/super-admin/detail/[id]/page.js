import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export default async function HotelDetailPage({ params }) {

  const { id } = await params;

  // ❌ Invalid ID check
  if (!id || !ObjectId.isValid(id)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Invalid Hotel ID
      </div>
    );
  }

  // ✅ Connect DB
  const client = await clientPromise;
const db = client.db("hotelPMS"); // ✅ correct DB

  // ✅ Fetch hotel directly
  const hotel = await db
    .collection("hotels")
    .findOne({ _id: new ObjectId(id) });

  if (!hotel) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Hotel not found
      </div>
    );
  }

  const expired =
    hotel.expiresAt && new Date(hotel.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8 text-black">

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10 border">

        {/* HEADER */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🏨 Hotel Details
          </h1>
          <p className="text-gray-500">
            Complete overview of the selected hotel
          </p>
        </div>

        {/* MAIN INFO */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div className="bg-gray-50 p-6 rounded-xl border hover:scale-105 transition">
            <p className="text-sm text-gray-500 mb-1">Hotel ID</p>
            <p className="text-xl font-semibold text-blue-600">
              {hotel.hotelId || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border hover:scale-105 transition">
            <p className="text-sm text-gray-500 mb-1">Subscription</p>
            <p className="text-lg font-medium">
              {hotel.sub || "N/A"}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border hover:scale-105 transition">
            <p className="text-sm text-gray-500 mb-1">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                hotel.manualStatus === "Active"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {hotel.manualStatus || "Unknown"}
            </span>
          </div>

          <div className="bg-gray-50 p-6 rounded-xl border hover:scale-105 transition">
            <p className="text-sm text-gray-500 mb-1">Expiry</p>
            <p className={`font-medium ${expired ? "text-red-600" : ""}`}>
              {hotel.expiresAt
                ? new Date(hotel.expiresAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

        </div>

        {/* DATES */}
        <div className="grid md:grid-cols-2 gap-8 mb-10">

          <div className="bg-white border p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Created At</p>
            <p className="font-medium text-gray-800">
              {hotel.createdAt
                ? new Date(hotel.createdAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

          <div className="bg-white border p-6 rounded-xl shadow-sm">
            <p className="text-sm text-gray-500">Expires At</p>
            <p className="font-medium text-gray-800">
              {hotel.expiresAt
                ? new Date(hotel.expiresAt).toLocaleString()
                : "N/A"}
            </p>
          </div>

        </div>

        {/* ACCESS MODULES */}
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            🔐 Access Modules
          </h2>

          <div className="flex flex-wrap gap-3">
            {hotel.access && hotel.access.length > 0 ? (
              hotel.access.map((module, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium hover:scale-110 transition"
                >
                  {module}
                </span>
              ))
            ) : (
              <span className="text-gray-400">
                No modules assigned
              </span>
            )}
          </div>
        </div>

        {/* SUMMARY */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">
            Summary
          </h3>
          <p className="text-gray-700 text-sm">
            This hotel is currently{" "}
            <span className="font-semibold">
              {hotel.manualStatus || "Unknown"}
            </span>{" "}
            with a{" "}
            <span className="font-semibold">
              {hotel.sub || "N/A"}
            </span>{" "}
            subscription plan. Access includes{" "}
            <span className="font-semibold">
              {hotel.access?.length || 0}
            </span>{" "}
            modules.
          </p>
        </div>

      </div>

    </div>
  );
}