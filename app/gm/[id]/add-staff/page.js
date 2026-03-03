"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GMSidebar from "../../components/GMSidebar";

export default function AddStaffPage() {
  const { id } = useParams(); // GM ID
  const router = useRouter();

  const [gm, setGm] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Receptionist");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  // ✅ Fetch GM CORRECTLY
  useEffect(() => {
    if (!id) return;

    const fetchGM = async () => {
      try {
        const res = await fetch(`/api/gms/${id}`);
        const data = await res.json();

        console.log("GM API RESPONSE:", data);

        if (data.gm) {
          setGm(data.gm); // ✅ FIXED HERE
        } else {
          setGm(null);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchGM();
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

  const formData = new FormData();
  formData.append("gmId", id);
  formData.append("hotelId", gm.hotelId);      // ✅ ADD THIS
  formData.append("hotelCode", gm.hotelCode);  // ✅ ADD THIS
  formData.append("gmName", gm.name);          // ✅ ADD THIS

  formData.append("name", name);
  formData.append("password", password);
  formData.append("role", role);
  formData.append("access", JSON.stringify(selectedAccess));

  if (profilePic) {
    formData.append("profilePic", profilePic);
  }

  try {
    const res = await fetch("/api/staff/create", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Staff Created Successfully!");
      router.push(`/gm/${id}`);
    } else {
      alert("❌ Failed to create staff");
    }
  } catch (error) {
    console.error(error);
    alert("Server Error");
  }
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!gm) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        GM Not Found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <GMSidebar id={id} /> 

      <div className="flex-1 p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-10 border border-blue-100">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Add Staff -{" "}
            <span className="text-blue-600">
              {gm.hotelCode}
            </span>
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Profile Picture */}
            <div>
              <label className="block font-semibold mb-2">
                Profile Picture (Optional)
              </label>
              <input
                type="file"
                onChange={(e) => setProfilePic(e.target.files[0])}
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block font-semibold mb-2">
                Staff Name
              </label>
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
              <label className="block font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block font-semibold mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border rounded-lg p-3"
              >
                <option>Receptionist</option>
                <option>Housekeeping</option>
                <option>Manager</option>
                <option>Accountant</option>
                <option>Chef</option>
                <option>Security</option>
              </select>
            </div>

            {/* ✅ Access Permissions */}
            <div>
              <label className="block font-semibold mb-4">
                Access Permissions
              </label>

              <div className="grid grid-cols-2 gap-4">
                {(gm.access || []).map((item, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-200"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAccess.includes(item)}
                      onChange={() => handleAccessChange(item)}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span className="text-gray-700 font-medium">
                      {item}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
            >
              Create Staff
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
