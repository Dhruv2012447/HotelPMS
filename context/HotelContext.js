"use client";
import { createContext, useContext, useEffect, useState } from "react";

const HotelContext = createContext();
export const useHotels = () => useContext(HotelContext);

export function HotelProvider({ children }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Load hotels
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("hotels")) || [];
    setHotels(data);
    setLoading(false);
  }, []);

  const saveHotels = (data) => {
    setHotels(data);
    localStorage.setItem("hotels", JSON.stringify(data));
  };

  // ✅ Add hotel with subscription duration & dates
  const addHotel = (hotel) => {
  const now = new Date();

  let expiry = new Date();
  if (hotel.duration === "1M") expiry.setMonth(now.getMonth() + 1);
  if (hotel.duration === "3M") expiry.setMonth(now.getMonth() + 3);
  if (hotel.duration === "1Y") expiry.setFullYear(now.getFullYear() + 1);

  const updated = [
    ...hotels,
    {
      ...hotel,
      createdAt: now.toISOString(),
      expiresAt: expiry.toISOString(),
      info: {},
      staff: [],
    },
  ];

  saveHotels(updated);
};


  // ✅ Update hotel (Super Admin edit)
  // ✅ Update hotel (Super Admin edit)
const updateHotel = (index, data) => {
  const updated = hotels.map((h, i) =>
    i === index ? { ...h, ...data } : h
  );
  saveHotels(updated);
};

  // ✅ Delete hotel
 const deleteHotel = (index) => {
  const updated = hotels.filter((_, i) => i !== index);
  saveHotels(updated);
};


  // ✅ Owner updates hotel info
  const updateHotelInfo = (hotelId, info) => {
    const updated = hotels.map((h) =>
      h.hotelId === hotelId ? { ...h, info } : h
    );
    saveHotels(updated);
  };

  // ✅ Owner adds staff
  const addStaff = (hotelId, staffMember) => {
    const updated = hotels.map((h) =>
      h.hotelId === hotelId
        ? { ...h, staff: [...h.staff, staffMember] }
        : h
    );
    saveHotels(updated);
  };

  // ✅ Owner login
  const findHotel = (hotelId, password) => {
    return hotels.find(
      (h) => h.hotelId === hotelId && h.password === password
    );
  };
// ✅ Status from expiry date
const getStatus = (hotel) => {
  // 🔥 If manual status is set, use it
  if (hotel.manualStatus) return hotel.manualStatus;

  if (!hotel.expiresAt) return "Active";

  const now = new Date();
  const expiry = new Date(hotel.expiresAt);

  return now > expiry ? "Due" : "Active";
};


  return (
    <HotelContext.Provider
      value={{
        hotels,
        loading,
        addHotel,
        updateHotel,
        deleteHotel,
        updateHotelInfo,
        addStaff,
        findHotel,
        getStatus,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
}
