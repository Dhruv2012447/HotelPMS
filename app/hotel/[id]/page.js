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

  const [zoomImage, setZoomImage] = useState(null);

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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-2xl md:rounded-3xl p-4 md:p-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-3">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-800">
            Hotel: {hotel.hotelId}
          </h1>
        </div>

        {/* Hotel Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div>
            <p className="text-gray-500 text-xs md:text-sm uppercase">Subscription</p>
            <p className="font-semibold text-gray-800 text-sm md:text-base">
              {hotel.sub}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs md:text-sm uppercase">Status</p>
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
            <p className="text-gray-500 text-xs md:text-sm uppercase">Created</p>
            <p className="text-sm md:text-base text-gray-800">
              {new Date(hotel.createdAt).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs md:text-sm uppercase">Expiry</p>
            <p className={`text-sm md:text-base ${expired ? "text-red-600" : "text-gray-800"}`}>
              {new Date(hotel.expiresAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Access Modules */}
        <div className="mb-8">
          <p className="text-gray-500 text-xs md:text-sm mb-3 uppercase">
            Access Modules
          </p>
          <div className="flex flex-wrap gap-2 md:gap-3">
            {hotel.access?.length > 0 ? (
              hotel.access.map((module, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 text-xs md:text-sm rounded-full"
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
        <div className="mt-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            General Managers
          </h2>

          {loadingGMs ? (
            <p className="text-gray-500">Loading GMs...</p>
          ) : gms.length === 0 ? (
            <p className="text-gray-400">No GMs created yet</p>
          ) : (
            <div className="overflow-x-auto rounded-lg shadow">
              <table className="min-w-[700px] w-full divide-y divide-gray-200">
                <thead className="bg-blue-100 text-gray-700">
                  <tr>
                    <th className="p-3 text-left text-xs md:text-sm">Profile</th>
                    <th className="p-3 text-left text-xs md:text-sm">Name</th>
                    <th className="p-3 text-left text-xs md:text-sm">Password</th>
                    <th className="p-3 text-left text-xs md:text-sm">Access</th>
                    <th className="p-3 text-left text-xs md:text-sm">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {gms.map((gm, idx) => (
                    <tr key={gm._id} className="border-b hover:bg-gray-50">

                      {/* Profile */}
                      <td className="p-3">
                        {gm.profilePic ? (
                          <img
                            src={gm.profilePic}
                            alt={gm.name}
                            className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover cursor-pointer"
                            onClick={() => setZoomImage(gm.profilePic)}
                          />
                        ) : (
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            ?
                          </div>
                        )}
                      </td>

                      <td className="p-3 text-sm md:text-base">{gm.name}</td>
                      <td className="p-3 text-sm">{gm.password}</td>
                      <td className="p-3 text-sm">
                        {gm.access?.join(", ") || "No access"}
                      </td>

                      <td className="p-3">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => router.push(`/hotel/edit-gm/${gm._id}`)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => router.push(`/gms/${gm._id}`)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs md:text-sm"
                          >
                            Details
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Zoom Modal */}
      {zoomImage && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setZoomImage(null)}
        >
          <img
            src={zoomImage}
            alt="Zoomed"
            className="max-h-[90vh] max-w-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}