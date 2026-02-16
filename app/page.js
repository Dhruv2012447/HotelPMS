export default function Home() {
  return (
    <div className="h-[85vh] flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-3xl px-6">
        <h2 className="text-5xl font-semibold text-gray-800 mb-6 leading-tight">
          Smart Hotel Management <br /> Powered by PMS
        </h2>

        <p className="text-gray-600 text-lg mb-8">
          Manage bookings, rooms, staff, billing and reports — all in one
          powerful hotel management system.
        </p>

        <a
          href="/login"
          className="bg-gray-800 text-white px-8 py-3 rounded-md hover:bg-black transition"
        >
          Access Dashboard
        </a>
      </div>
    </div>
  );
}
