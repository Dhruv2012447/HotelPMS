"use client";
import { useState } from "react";

export default function AddGMForm({ refreshGMs }) {
  const [name, setName] = useState("");
  const [access, setAccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !access) return;

    setLoading(true);

    const res = await fetch("/api/gms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, access: access.split(",") }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.success) {
      setName("");
      setAccess("");
      refreshGMs(); // reload GMs list
    } else {
      alert(data.error || "Error adding GM");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded-lg mb-6">
      <h3 className="font-bold mb-2">Add General Manager</h3>
      <input
        type="text"
        placeholder="GM Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <input
        type="text"
        placeholder="Access (comma separated)"
        value={access}
        onChange={(e) => setAccess(e.target.value)}
        className="border p-2 rounded w-full mb-2"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add GM"}
      </button>
    </form>
  );
}
