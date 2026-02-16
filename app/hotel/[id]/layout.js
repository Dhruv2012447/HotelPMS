import HotelSidebar from "@/components/hotel/HotelSidebar";

export default function HotelLayout({ children }) {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      < HotelSidebar />
      <div className="ml-64 w-full p-8">{children}</div>
    </div>
  );
}
