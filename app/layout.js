import "./globals.css";
import Navbar from "../components/Navbar";
import { HotelProvider } from "@/context/HotelContext";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <HotelProvider>
          <Navbar />
          {children}
        </HotelProvider>
      </body>
    </html>
  );
}
