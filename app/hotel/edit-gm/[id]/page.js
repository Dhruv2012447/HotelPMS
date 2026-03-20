"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import HotelSidebar from "./sidebar";
import "@/styles/editGMResponsive.css"; // ✅ extra file

export default function EditGMPage() {
  const { id } = useParams();
  const router = useRouter();

  const [gm, setGm] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchGMAndHotel = async () => {
      try {
        const gmRes = await fetch(`/api/gms/${id}`, { cache: "no-store" });
        const gmData = await gmRes.json();
        if (!gmRes.ok) throw new Error(gmData.error);

        setGm(gmData.gm);
        setName(gmData.gm.name);
        setPassword(gmData.gm.password);
        setSelectedAccess(gmData.gm.access || []);
        setProfilePic(gmData.gm.profilePic || null);

        const hotelRes = await fetch(`/api/hotels/${gmData.gm.hotelId}`);
        const hotelData = await hotelRes.json();
        if (!hotelRes.ok) throw new Error(hotelData.error);

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
      const res = await fetch(`/api/gms/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          password,
          access: selectedAccess,
          profilePic,
        }),
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
    <div className="flex min-h-screen bg-gray-50 edit-gm-container text-black">

      {/* Sidebar */}
      <div className="fixed left-0 top-18 h-screen edit-gm-sidebar">
        <HotelSidebar hotelId={hotel._id} hotelCode={hotel.hotelCode} />
      </div>

      {/* Main */}
      <div className="flex-1 p-6 ml-64 flex justify-center items-start edit-gm-main">
        
        <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg edit-gm-card">

          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center edit-gm-title">
            Edit GM for {hotel.hotelCode}
          </h1>

          {/* Profile */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-blue-200 overflow-hidden mb-3 flex items-center justify-center edit-gm-profile">
              {profilePic ? (
                <img src={profilePic} className="w-full h-full object-cover" />
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
              className="w-full border rounded-lg p-3 text-gray-700 edit-gm-input"
            />
          </div>

          {/* Inputs */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-3 rounded-lg mb-4 edit-gm-input"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-3 rounded-lg mb-6 edit-gm-input"
          />

          {/* Access */}
          <div className="mb-6">
            <p className="font-semibold mb-3">Select Access:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 edit-gm-grid">
              {hotel.access?.map((item, idx) => (
                <label key={idx} className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAccess.includes(item)}
                    onChange={() => handleCheckbox(item)}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 edit-gm-buttons">
            <button
              onClick={handleSave}
              className="w-full bg-blue-600 text-white py-3 rounded-lg"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            <button
              onClick={handleDelete}
              className="w-full bg-red-600 text-white py-3 rounded-lg"
            >
              Delete GM
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}