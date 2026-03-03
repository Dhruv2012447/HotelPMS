"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CreateGMPage() {
  const router = useRouter();
  const { id } = useParams(); // Hotel ID

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  // ✅ Fetch hotel data
  useEffect(() => {
    if (!id) return;

    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();

        if (res.ok) setHotel(data);
        else setHotel(null);
      } catch (err) {
        console.error(err);
        setHotel(null);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id]);

  const handleAccessChange = (item) => {
    if (selectedAccess.includes(item)) {
      setSelectedAccess(selectedAccess.filter((a) => a !== item));
    } else {
      setSelectedAccess([...selectedAccess, item]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      hotelId: hotel._id,
      hotelCode: hotel.hotelId,
      name,
      password,
      access: selectedAccess,
      profilePic,
    };

    try {
      const res = await fetch("/api/gms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ GM Created Successfully!");
        router.push(`/hotel/${id}`);
      } else {
        alert("❌ " + (data.error || "Failed to create GM"));
      }
    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  if (!hotel)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Hotel Not Found
      </div>
    );

  return (
    <div className="flex min-h-screen bg-gray-50 justify-center p-10 text-black">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-10 border border-blue-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Create GM for <span className="text-blue-600">{hotel.hotelId}</span>
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-blue-200 overflow-hidden mb-3 flex items-center justify-center">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-400 text-4xl">+</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => setProfilePic(reader.result);
                reader.readAsDataURL(file);
              }}
              className="w-full border rounded-lg p-3 text-gray-700"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block font-semibold mb-2">GM Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg p-3"
            />
          </div>

          {/* Access Permissions */}
          <div>
            <label className="block font-semibold mb-4">Access Permissions</label>
            <div className="grid grid-cols-2 gap-4">
              {(hotel.access || []).map((item, index) => (
                <label
                  key={index}
                  className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-200 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedAccess.includes(item)}
                    onChange={() => handleAccessChange(item)}
                    className="w-4 h-4 accent-blue-600"
                  />
                  <span className="text-gray-700 font-medium">{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
          >
            Create GM
          </button>
        </form>
      </div>
    </div>
  );
}
