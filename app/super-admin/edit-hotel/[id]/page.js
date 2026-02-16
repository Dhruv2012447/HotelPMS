"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "@fontsource/poppins";

export default function EditHotel() {
  const { id } = useParams();
  const router = useRouter();

  const [hotel, setHotel] = useState(null);
  const [sub, setSub] = useState("Basic");
  const [access, setAccess] = useState([]);
  const [status, setStatus] = useState("Active");
  const [duration, setDuration] = useState("1M");

  // =========================
  // FEATURE / ACCESS GROUPS
  // =========================
  const ACCESS_CATEGORIES = {
    "Channel Manager": [
      "Channel Manager – 5 OTAs",
      "Channel Manager – 10 OTAs",
      "Channel Manager – Unlimited OTAs",
    ],
    PMS: ["PMS – Basic", "PMS – Full", "PMS – Multi-property"],
    Operations: [
      "Front Desk",
      "Housekeeping – Basic status",
      "Housekeeping – Live board",
      "Housekeeping – Auto task assign",
      "Laundry – Guest laundry only",
      "Laundry – Guest + Vendor",
      "Laundry – Full linen tracking",
    ],
    HR: [
      "HR – Staff profile only",
      "HR – Attendance + Payroll",
      "HR – KPI + Appraisal",
      "Payroll – Enabled",
      "Payroll – Advanced",
    ],
    Reports: [
      "Reports – Basic revenue",
      "Reports – Advanced analytics",
      "Reports – BI dashboard",
    ],
    CRM: ["CRM – Email/WhatsApp", "CRM – Automation + Loyalty"],
    Others: [
      "Mobile App – Owner app",
      "Mobile App – Full staff app",
      "Website Booking Engine",
      "Multi-Property",
      "API Access – Limited",
      "API Access – Full",
      "Support – Priority",
      "Support – Dedicated Manager",
    ],
  };

  // =========================
  // PLAN ACCESS
  // =========================
  const PLAN_ACCESS = {
    Basic: [
      "Channel Manager – 5 OTAs",
      "PMS – Basic",
      "Front Desk",
      "Housekeeping – Basic status",
      "Laundry – Guest laundry only",
      "HR – Staff profile only",
      "Reports – Basic revenue",
    ],
    Pro: [
      "Channel Manager – 10 OTAs",
      "PMS – Full",
      "Front Desk",
      "Housekeeping – Live board",
      "Laundry – Guest + Vendor",
      "HR – Attendance + Payroll",
      "Payroll – Enabled",
      "Reports – Advanced analytics",
      "Mobile App – Owner app",
      "CRM – Email/WhatsApp",
      "Website Booking Engine",
      "API Access – Limited",
      "Support – Priority",
    ],
    Enterprise: Object.values(ACCESS_CATEGORIES).flat(),
    Custom: [],
  };

  // =========================
  // FETCH HOTEL
  // =========================
  useEffect(() => {
    if (!id) return;

    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${id}`);
        const data = await res.json();

        if (!res.ok && data.error) throw new Error(data.error);

        setHotel(data);
        setSub(data.sub || "Basic");
        setAccess(data.access || []);
        setStatus(data.manualStatus || "Active");
      } catch (err) {
        console.error("Fetch Hotel Error:", err);
      }
    };

    fetchHotel();
  }, [id]);

  // =========================
  // AUTO UPDATE ACCESS ON PLAN CHANGE
  // =========================
  useEffect(() => {
    if (sub !== "Custom") {
      setAccess(PLAN_ACCESS[sub] || []);
    }
  }, [sub]);

  if (!hotel) {
    return (
      <div className="h-[60vh] flex items-center justify-center text-2xl font-poppins text-gray-700">
        Loading Hotel...
      </div>
    );
  }

  // =========================
  // TOGGLE ACCESS FOR CUSTOM PLAN
  // =========================
  const toggleAccess = (item, category) => {
    // Only one Channel Manager allowed
    if (category === "Channel Manager") {
      setAccess((prev) => [
        ...prev.filter((a) => !ACCESS_CATEGORIES["Channel Manager"].includes(a)),
        item,
      ]);
      return;
    }

    setAccess((prev) =>
      prev.includes(item)
        ? prev.filter((a) => a !== item)
        : [...prev, item]
    );
  };

  // =========================
  // CALCULATE EXPIRY DATE
  // =========================
  const calculateExpiry = () => {
    const now = new Date();
    if (duration === "1M") now.setMonth(now.getMonth() + 1);
    if (duration === "3M") now.setMonth(now.getMonth() + 3);
    if (duration === "1Y") now.setFullYear(now.getFullYear() + 1);
    return now.toISOString();
  };

  // =========================
  // UPDATE HOTEL
  // =========================
  const handleUpdate = async () => {
    try {
      const res = await fetch(`/api/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sub,
          access,
          manualStatus: status,
          expiresAt: calculateExpiry(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      alert("Hotel Updated Successfully ✅");
      router.push("/super-admin");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/hotels/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");

      alert("Hotel Deleted ❌");
      router.push("/super-admin");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 py-12 font-poppins">
      <div className="max-w-6xl mx-auto bg-white p-12 rounded-3xl shadow-2xl border text-gray-900">

        <h1 className="text-4xl font-bold mb-2">Edit Hotel</h1>
        <p className="mb-10 text-lg">
          Hotel ID: <span className="font-semibold">{hotel.hotelId}</span>
        </p>

        {/* Subscription */}
        <label className="block font-semibold mb-2 text-gray-800">Subscription Plan</label>
        <select
          value={sub}
          onChange={(e) => setSub(e.target.value)}
          className="border-2 border-gray-300 p-4 rounded-xl w-full mb-8 bg-white text-gray-900"
        >
          <option>Basic</option>
          <option>Pro</option>
          <option>Enterprise</option>
          <option>Custom</option>
        </select>

        {/* Custom Access Section */}
        {sub === "Custom" && (
          <>
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Custom Module Access</h2>
            {Object.entries(ACCESS_CATEGORIES).map(([category, modules]) => (
              <div key={category} className="mb-8">
                <h3 className="text-lg font-bold mb-3 text-indigo-700">{category}</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {modules.map((item) => (
                    <label
                      key={item}
                      className={`flex gap-3 p-4 border rounded-xl cursor-pointer transition
                        ${access.includes(item)
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-white text-gray-900 border-gray-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={access.includes(item)}
                        onChange={() => toggleAccess(item, category)}
                        className="w-5 h-5 accent-indigo-500"
                      />
                      <span className="font-medium">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}

        {/* Duration */}
        <label className="block font-semibold mb-2 text-gray-800">Extend Duration</label>
        <select
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="border-2 border-gray-300 p-4 rounded-xl w-full mb-8 bg-white text-gray-900"
        >
          <option value="1M">1 Month</option>
          <option value="3M">3 Months</option>
          <option value="1Y">1 Year</option>
        </select>

        {/* Status */}
        <label className="block font-semibold mb-2 text-gray-800">Manual Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border-2 border-gray-300 p-4 rounded-xl w-full mb-10 bg-white text-gray-900"
        >
          <option value="Active">Active</option>
          <option value="Due">Due</option>
        </select>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-6">
          <button
            onClick={handleUpdate}
            className="flex-1 bg-indigo-600 text-white px-10 py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg"
          >
            Update Hotel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 bg-red-600 text-white px-10 py-4 rounded-xl text-lg hover:bg-red-700 transition shadow-lg"
          >
            Delete Hotel
          </button>
        </div>
      </div>
    </div>
  );
}
