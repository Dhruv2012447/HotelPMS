"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import HotelSidebar from "./sidebar"; // adjust path if needed

export default function EditGMPage() {
  const { id } = useParams(); // GM ID
  const router = useRouter();

  const [gm, setGm] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [profilePic, setProfilePic] = useState(null); // ✅ profile pic
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch GM and hotel
  useEffect(() => {
    if (!id) return;

    const fetchGMAndHotel = async () => {
      try {
        const gmRes = await fetch(`/api/gms/${id}`, { cache: "no-store" });
        const gmData = await gmRes.json();
        if (!gmRes.ok) throw new Error(gmData.error || "Failed to load GM");

        setGm(gmData.gm);
        setName(gmData.gm.name);
        setPassword(gmData.gm.password);
        setSelectedAccess(gmData.gm.access || []);
        setProfilePic(gmData.gm.profilePic || null); // ✅ load existing pic

        const hotelId = gmData.gm.hotelId;
        const hotelRes = await fetch(`/api/hotels/${hotelId}`, { cache: "no-store" });
        const hotelData = await hotelRes.json();
        if (!hotelRes.ok) throw new Error(hotelData.error || "Failed to load hotel");

        setHotel(hotelData);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGMAndHotel();
  }, [id]);

  const handleCheckbox = (value) => {
    if (selectedAccess.includes(value)) {
      setSelectedAccess(selectedAccess.filter((a) => a !== value));
    } else {
      setSelectedAccess([...selectedAccess, value]);
    }
  };

  const handleSave = async () => {
    if (!name || !password) {
      alert("Please fill all fields");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const body = {
        name,
        password,
        access: selectedAccess,
        profilePic, // ✅ send profile pic
      };

      const res = await fetch(`/api/gms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      alert("GM updated successfully");
      router.push(`/hotel/${gm.hotelId}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this GM?")) return;

    try {
      const res = await fetch(`/api/gms/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      router.push(`/hotel/${gm.hotelId}`);
    } catch (err) {
      console.error(err);
      setError(err.message);
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-gray-500 text-lg">Loading...</p>;
  if (error)
    return <p className="text-center mt-20 text-red-500 text-lg">{error}</p>;
  if (!gm || !hotel)
    return <p className="text-center mt-20 text-red-500 text-lg">Data not found</p>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-18 h-screen">
        <HotelSidebar hotelId={hotel._id} hotelCode={hotel.hotelCode} />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 ml-64 flex justify-center items-start">
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">

          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            Edit GM for {hotel.hotelCode}
          </h1>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
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

          {/* GM Name */}
          <input
            type="text"
            placeholder="GM Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 text-gray-800"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="GM Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-6 text-gray-800"
          />

          {/* Access Modules */}
          <div className="mb-6">
            <p className="font-semibold mb-3 text-gray-700">Select Access:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {hotel.access && hotel.access.length > 0 ? (
                hotel.access.map((item, idx) => (
                  <label
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccess.includes(item)}
                      onChange={() => handleCheckbox(item)}
                    />
                    <span className="text-gray-800">{item}</span>
                  </label>
                ))
              ) : (
                <p className="text-red-500">No access modules found</p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Delete GM
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
