"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CreateGMPage() {
  const router = useRouter();
  const { id } = useParams(); // ✅ Get hotel ID from URL

  const [hotel, setHotel] = useState(null);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch hotel by ID
  useEffect(() => {
    if (!id) return;

    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to load hotel");
        }

        setHotel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
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

    await fetch("/api/gms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hotelId: hotel._id, // ✅ safer to use DB id
        hotelCode: hotel.hotelId,
        name,
        password,
        access: selectedAccess,
      }),
    });

    alert("GM Created Successfully");

    // ✅ Go back to that hotel page
    router.push(`/hotel/${id}`);
  };
  
  if (loading)
    return (
      <p className="text-center mt-20 text-gray-500 text-lg">
        Loading...
      </p>
    );

  if (!hotel)
    return (
      <p className="text-center mt-20 text-red-500 text-lg">
        Hotel not found
      </p>
    );

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Create GM for {hotel.hotelId}
        </h1>

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
          <p className="font-semibold mb-3 text-gray-700">
            Select Access:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hotel.access && hotel.access.length > 0 ? (
              hotel.access.map((item, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg cursor-pointer hover:bg-gray-200"
                >
                  <input
                    type="checkbox"
                    onChange={() => handleCheckbox(item)}
                  />
                  <span className="text-gray-800">{item}</span>
                </label>
              ))
            ) : (
              <p className="text-red-500">
                No access modules found
              </p>
            )}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Save GM
        </button>

      </div>
    </div>
  );
}
