"use client";

import { useState } from "react";

export default function AttendanceForm({
  staffList,
  hotelId,
  gmId,
}) {
  const today = new Date().toISOString().split("T")[0];

  const [attendance, setAttendance] = useState(
    staffList.map((staff) => ({
      staffId: staff._id,
      name: staff.name,
      role: staff.role,
      present: false,
      time: "",
    }))
  );

  const [loading, setLoading] = useState(false);

  const toggleStatus = (id) => {
    setAttendance((prev) =>
      prev.map((staff) =>
        staff.staffId === id
          ? { ...staff, present: !staff.present }
          : staff
      )
    );
  };

  const updateTime = (id, value) => {
    setAttendance((prev) =>
      prev.map((staff) =>
        staff.staffId === id
          ? { ...staff, time: value }
          : staff
      )
    );
  };

  const totalPresent = attendance.filter(
    (s) => s.present
  ).length;

  const saveAttendance = async () => {
    setLoading(true);

    const res = await fetch("/api/saveAttendance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hotelId,
        gmId,
        date: today,
        attendance,
      }),
    });

    if (res.ok) {
      alert("Attendance Saved Successfully ✅");
    } else {
      alert("Error Saving Attendance ❌");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-6xl mx-auto bg-white shadow-xl border rounded-2xl p-10 text-black">

      {/* Header */}
      <div className="flex justify-between mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Staff Attendance
        </h2>

        <div className="text-gray-600">
          Date: <span className="font-semibold">{today}</span>
          <br />
          Present:{" "}
          <span className="text-green-600 font-semibold">
            {totalPresent}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-blue-50">
              <th className="p-4">Name</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Arrival Time</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((staff) => (
              <tr key={staff.staffId} className="border-t">
                <td className="p-4 font-semibold">
                  {staff.name}
                </td>

                <td className="p-4 text-gray-600">
                  {staff.role}
                </td>

                <td className="p-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={staff.present}
                      onChange={() =>
                        toggleStatus(staff.staffId)
                      }
                      className="accent-green-600"
                    />
                    {staff.present
                      ? "Present"
                      : "Absent"}
                  </label>
                </td>

                <td className="p-4">
                  <input
                    type="time"
                    value={staff.time}
                    onChange={(e) =>
                      updateTime(
                        staff.staffId,
                        e.target.value
                      )
                    }
                    className="border px-3 py-1 rounded-lg"
                    disabled={!staff.present}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Save Button */}
      <button
        onClick={saveAttendance}
        disabled={loading}
        className="mt-10 w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow-md border border-blue-700 transition disabled:opacity-50"
      >
        {loading ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}