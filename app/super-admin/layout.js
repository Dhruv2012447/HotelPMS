import SuperSidebar from "@/components/SuperSidebar";
import { HotelProvider } from "@/context/HotelContext";

export default function SuperLayout({ children }) {
  return (
    <HotelProvider>
      <div className="flex">
        <SuperSidebar />
        <div className="ml-64 w-full bg-gray-100 min-h-screen p-10">
          {children}
        </div>
      </div>
    </HotelProvider>
  );
}
