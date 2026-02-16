"use client";
import { useState, useEffect } from "react";

export default function GMTable() {
  const [gms, setGMs] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadGMs = async () => {
    const res = await fetch("/api/gms");
    const data = await res.json();
    setGMs(data);
  };

  useEffect(() => {
    loadGMs();
  }, []);

  const deleteGM = async (id) => {
    await fetch(`/api/gms/${id}`, { method: "DELETE" });
    loadGMs();
  };

  return (
    <div className="bg-white p-8 rounded-3xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6">General Managers</h2>

      {gms.length === 0 ? (
        <p>No GMs added yet</p>
      ) : (
        <div className="space-y-4">
          {gms.map((gm) => (
            <div
              key={gm._id}
              className="p-6 bg-gray-50 rounded-2xl flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-semibold">{gm.name}</h3>
                <p className="text-sm text-gray-500">
                  Status: {gm.status}
                </p>
                <div className="text-sm mt-2">
                  {gm.access.map((a, i) => (
                    <span key={i} className="mr-2">
                      • {a}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setEditing(gm)}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteGM(gm._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
