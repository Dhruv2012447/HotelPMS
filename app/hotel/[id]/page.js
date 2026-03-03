"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HotelPage() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState(null);
  const [gms, setGMs] = useState([]);
  const [loadingHotel, setLoadingHotel] = useState(true);
  const [loadingGMs, setLoadingGMs] = useState(true);
  const [error, setError] = useState("");

  const [zoomImage, setZoomImage] = useState(null); // ✅ Zoom modal

  // Fetch hotel info
  useEffect(() => {
    if (!id) return;

    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch hotel");
        setHotel(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingHotel(false);
      }
    };

    fetchHotel();
  }, [id]);

  // Fetch GMs for this hotel
  useEffect(() => {
    if (!id) return;

    const fetchGMs = async () => {
      try {
        const res = await fetch(`/api/gms/?hotelId=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch GMs");
        setGMs(data.gms || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingGMs(false);
      }
    };

    fetchGMs();
  }, [id]);

  if (loadingHotel)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading hotel...
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error}
      </div>
    );

  if (!hotel)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Hotel not found
      </div>
    );

  const expired = hotel.expiresAt && new Date(hotel.expiresAt) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-extrabold text-gray-800">
            Hotel: {hotel.hotelId}
          </h1>
        </div>

        {/* Hotel Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Subscription</p>
            <p className="font-semibold text-gray-800">{hotel.sub}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Status</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                hotel.manualStatus === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {hotel.manualStatus}
            </span>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Created</p>
            <p className="font-medium text-gray-800">
              {new Date(hotel.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm uppercase tracking-wide">Expiry</p>
            <p className={`font-medium ${expired ? "text-red-600" : "text-gray-800"}`}>
              {new Date(hotel.expiresAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Access Modules */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm mb-3 uppercase tracking-wide">Access Modules</p>
          <div className="flex flex-wrap gap-3">
            {hotel.access && hotel.access.length > 0 ? (
              hotel.access.map((module, index) => (
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

        {/* GM Table */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">General Managers</h2>

          {loadingGMs ? (
            <p className="text-gray-500">Loading GMs...</p>
          ) : gms.length === 0 ? (
            <p className="text-gray-400">No GMs created yet</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-100 to-blue-200 text-gray-700 sticky top-0">
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">Profile</th>
                    <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">Name</th>
                    <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">Password</th>
                    <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">Access</th>
                    <th className="p-3 text-left text-sm font-semibold uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {gms.map((gm, idx) => (
                    <tr
                      key={gm._id}
                      className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 transition`}
                    >
                      {/* Profile Picture */}
                      <td className="p-3">
                        {gm.profilePic ? (
                          <img
                            src={gm.profilePic}
                            alt={gm.name}
                            className="w-12 h-12 rounded-full object-cover cursor-pointer border border-blue-200"
                            onClick={() => setZoomImage(gm.profilePic)}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                            ?
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-gray-800 font-medium">{gm.name}</td>
                      <td className="p-3 text-gray-800">{gm.password}</td>
                      <td className="p-3 text-gray-800">
                        {gm.access && gm.access.length > 0
                          ? gm.access.join(", ")
                          : "No access"}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          onClick={() => router.push(`/hotel/edit-gm/${gm._id}`)}
                          className="bg-green-600 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => router.push(`/gms/${gm._id}`)}
                          className="bg-blue-600 text-white px-4 py-1 rounded-lg shadow hover:bg-blue-700 transition"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Zoomed Image Modal */}
      {zoomImage && (
        <div
          className="ml-63 max-w-[85%] fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed"
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl animate-fadeIn"
          />
        </div>
      )}
    </div>
  );
}
