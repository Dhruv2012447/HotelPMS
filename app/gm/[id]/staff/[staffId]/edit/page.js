"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import GMSidebar from "../../../../components/GMSidebar";

export default function EditStaffPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;
  const staffId = params?.staffId;

  const [staff, setStaff] = useState(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Receptionist");
  const [selectedAccess, setSelectedAccess] = useState([]);
  const [profilePicture, setProfilePicture] = useState(null); // new image
  const [currentImage, setCurrentImage] = useState(null); // existing image
 const handleCheckbox = (value) => {
    if (selectedAccess.includes(value)) {
      setSelectedAccess(selectedAccess.filter((a) => a !== value));
    } else {
      setSelectedAccess([...selectedAccess, value]);
    }
  };
  useEffect(() => {
    if (!staffId) return;

    const fetchStaff = async () => {
      try {
        const res = await fetch(`/api/staff/${staffId}`);
        const data = await res.json();

        if (data.success) {
          const s = data.staff;
          setStaff(s);
          setName(s.name || "");
          setPassword(s.password || "");
          setRole(s.role || "Receptionist");
          setSelectedAccess(s.access || []);
          setCurrentImage(s.profilePicture || null);
        }

        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchStaff();
  }, [staffId]);

  // Convert file to base64
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result.split(",")[1]); // remove data:image/... prefix
    };
    reader.readAsDataURL(file);
  };

  // ✅ SAVE STAFF
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`/api/staff/${staffId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          password,
          role,
          access: selectedAccess,
          profilePicture: profilePicture || currentImage, // keep old if not changed
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Staff Updated Successfully!");
        router.push(`/gm/${id}`);
      } else {
        alert("❌ Update Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Server Error");
    }
  };

  // ✅ DELETE STAFF
  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this staff?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/staff/${staffId}/delete`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        alert("🗑 Staff Deleted Successfully!");
        router.push(`/gm/${id}`);
      } else {
        alert("❌ Delete Failed");
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

  if (!staff) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-bold">
        Staff Not Found
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-black">
      <GMSidebar id={id} />

      <div className="flex-1 p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-10 border">
          <h1 className="text-3xl font-bold mb-6">
            Edit Staff
          </h1>

          <form onSubmit={handleSave} className="space-y-6">

            {/* Profile Picture */}
            <div>
              <label className="block mb-2 font-semibold">
                Profile Picture
              </label>

              {currentImage && (
                <img
                  src={`data:image/png;base64,${profilePicture || currentImage}`}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full mb-4 border"
                />
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full border p-3 rounded"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block mb-2 font-semibold">Name</label>
              <input
                className="w-full border p-3 rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block mb-2 font-semibold">Password</label>
              <input
                className="w-full border p-3 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role */}
            <div>
              <label className="block mb-2 font-semibold">Role</label>
              <select
                className="w-full border p-3 rounded"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option>Receptionist</option>
                <option>Housekeeping</option>
                <option>Manager</option>
                <option>Accountant</option>
                <option>Chef</option>
                <option>Security</option>
              </select>
            </div>
 {/* Access Modules */}
          <div className="mb-6">
            <p className="font-semibold mb-3 text-gray-700">Select Access:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {staff.access && staff.access.length > 0 ? (
                staff.access.map((item, idx) => (
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
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>

              <button
                type="button"
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700"
              >
                Delete Staff
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
