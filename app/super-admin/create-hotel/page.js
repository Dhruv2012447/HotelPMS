"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@fontsource/poppins";

export default function CreateHotel() {
  const router = useRouter();

  const [hotelId, setHotelId] = useState("");
  const [password, setPassword] = useState("");
  const [sub, setSub] = useState("Basic");
  const [duration, setDuration] = useState("1Y");
  const [customAccess, setCustomAccess] = useState([]);

  /* =====================================
     FEATURE CATEGORIES
  ===================================== */

  const FEATURE_GROUPS = {
    "Channel Manager": [
      "Channel Manager – 5 OTAs",
      "Channel Manager – 10 OTAs",
      "Channel Manager – Unlimited OTAs",
    ],
    PMS: ["PMS – Basic", "PMS – Full", "PMS – Multi-property"],
    "Front Office": ["Front Desk"],
    Housekeeping: [
      "Housekeeping – Basic",
      "Housekeeping – Live board",
      "Housekeeping – Auto task assign",
    ],
    Laundry: [
      "Laundry – Guest only",
      "Laundry – Guest + Vendor",
      "Laundry – Full linen tracking",
    ],
    HR: [
      "HR – Staff profile",
      "HR – Attendance + Payroll",
      "HR – KPI + Appraisal",
    ],
    Payroll: ["Payroll – Advanced"],
    Reports: [
      "Reports – Basic",
      "Reports – Advanced analytics",
      "Reports – BI Dashboard",
    ],
    "Mobile App": ["Mobile App – Owner", "Mobile App – Full staff"],
    CRM: ["CRM – Email/WhatsApp", "CRM – Automation + Loyalty"],
    "Booking Engine": ["Website Booking Engine"],
    MultiProperty: ["Multi-Property"],
    API: ["API Access – Limited", "API Access – Full"],
    Support: [
      "Support – Email",
      "Support – Priority",
      "Support – Dedicated Manager",
    ],
  };

  const ALL_FEATURES = Object.values(FEATURE_GROUPS).flat();

  /* =====================================
     PLAN CONFIG (SINGLE ACCESS)
  ===================================== */

  const PLAN_FEATURES = {
    Basic: [
      "Channel Manager – 5 OTAs",
      "PMS – Basic",
      "Front Desk",
      "Housekeeping – Basic",
      "Laundry – Guest only",
      "HR – Staff profile",
      "Reports – Basic",
      "Website Booking Engine",
      "Support – Email",
    ],
    Pro: [
      "Channel Manager – 10 OTAs",
      "PMS – Full",
      "Front Desk",
      "Housekeeping – Live board",
      "Laundry – Guest + Vendor",
      "HR – Attendance + Payroll",
      "Payroll – Advanced",
      "Reports – Advanced analytics",
      "Mobile App – Owner",
      "CRM – Email/WhatsApp",
      "Website Booking Engine",
      "API Access – Limited",
      "Support – Priority",
    ],
    Enterprise: ALL_FEATURES,
    Custom: [],
  };

  /* =====================================
     SMART TOGGLE (REMOVE DUPLICATE TIERS)
  ===================================== */

  const toggleFeature = (feature) => {
    setCustomAccess((prev) => {
      let updated = [...prev];

      Object.values(FEATURE_GROUPS).forEach((group) => {
        if (group.includes(feature)) {
          updated = updated.filter((f) => !group.includes(f));
        }
      });

      if (updated.includes(feature)) {
        return updated.filter((f) => f !== feature);
      }

      return [...updated, feature];
    });
  };

  /* =====================================
     SAVE HOTEL (ONE ACCESS FIELD)
  ===================================== */

  const handleSave = async () => {
    if (!hotelId || !password) {
      alert("Please fill all fields");
      return;
    }

    const access =
      sub === "Custom"
        ? [...customAccess]
        : PLAN_FEATURES[sub];

    const payload = {
      hotelId,
      password,
      sub,
      duration,
      access,
      createdAt: new Date(),
    };

    const res = await fetch("/api/hotels", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      alert("Error saving hotel");
      return;
    }

    alert("Hotel Created Successfully ✅");
    router.push("/super-admin");
  };

  /* =====================================
     UI
  ===================================== */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-10 font-poppins">
      <div className="max-w-7xl mx-auto bg-white p-12 rounded-3xl shadow-2xl">

        <h1 className="text-4xl font-bold text-gray-900 mb-10">
          Create New Hotel
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <input
            placeholder="Hotel ID"
            value={hotelId}
            onChange={(e) => setHotelId(e.target.value)}
            className="border-2 border-gray-300 p-4 rounded-xl text-gray-900 focus:border-indigo-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border-2 border-gray-300 p-4 rounded-xl text-gray-900 focus:border-indigo-500"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <select
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            className="border-2 border-gray-300 p-4 rounded-xl text-gray-900"
          >
            <option>Basic</option>
            <option>Pro</option>
            <option>Enterprise</option>
            <option>Custom</option>
          </select>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border-2 border-gray-300 p-4 rounded-xl text-gray-900"
          >
            <option value="1M">1 Month</option>
            <option value="3M">3 Months</option>
            <option value="1Y">1 Year</option>
          </select>
        </div>

        {/* ACCESS SECTION */}

        <div className="bg-indigo-50 p-8 rounded-2xl shadow">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">
            Module Access
          </h2>

          {sub === "Custom"
            ? Object.entries(FEATURE_GROUPS).map(([category, features]) => (
                <div key={category} className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {category}
                  </h3>

                  {features.map((feature, i) => (
                    <label
                      key={i}
                      className="flex items-start gap-3 mb-2 text-gray-900 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mt-1"
                        checked={customAccess.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                      />
                      <span className="break-words">{feature}</span>
                    </label>
                  ))}
                </div>
              ))
            : PLAN_FEATURES[sub].map((item, i) => (
                <div key={i} className="text-gray-900 mb-2">
                  ✔ {item}
                </div>
              ))}
        </div>

        <button
          onClick={handleSave}
          className="mt-10 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl text-lg shadow-lg w-full"
        >
          Create Hotel
        </button>
      </div>
    </div>
  );
}
