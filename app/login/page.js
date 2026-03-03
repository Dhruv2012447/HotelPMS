"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
        return;
      }

      // SUPER ADMIN
      if (data.role === "superadmin") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "superadmin");
        router.push(data.redirect);
        return;
      }

      // HOTEL
      if (data.role === "hotel") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "hotel");
        router.push(data.redirect);
        return;
      }

      // GM
      if (data.role === "gm") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("role", "gm");
        router.push(data.redirect);
        return;
      }

    if (data.role === "staff") {
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", data.staffRole); // store real role
  router.push(data.redirect);
  return;
}



    } catch (error) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-200">
      <form
        onSubmit={handleLogin}
        className="bg-white w-[420px] p-10 rounded-2xl shadow-lg border"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          Hotel PMS Login
        </h2>

        <div className="mb-5">
          <label className="block mb-2 text-gray-700 font-medium">
            User ID
          </label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="Enter Username / Hotel ID"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-gray-700 font-medium">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full p-3 border border-gray-300 rounded-md bg-gray-50 text-gray-900"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-800 text-white p-3 rounded-md hover:bg-black transition"
        >
          Login
        </button>

        {message && (
          <p className="text-center mt-5 text-red-600 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
