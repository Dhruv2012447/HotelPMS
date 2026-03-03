import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import ReceptionistSidebar from "../ReceptionistSidebar";
import GuestRow from "./GuestRow";

export default async function ReceptionistPage({ params }) {
  const { id } = await params;

  if (!ObjectId.isValid(id)) {
    return <div className="p-10 text-red-600">Invalid Staff ID</div>;
  }

  const client = await clientPromise;
  const db = client.db("hotelPMS");

  const staff = await db.collection("Staff").findOne({
    _id: new ObjectId(id),
  });

  if (!staff) {
    return <div className="p-10 text-red-600">Staff not found</div>;
  }

  if (staff.role?.toLowerCase() !== "receptionist") {
    return (
      <div className="p-10 text-red-600 font-bold">
        Access Denied – Not a Receptionist
      </div>
    );
  }

  const roomDetails = await db.collection("hotelRooms").findOne({
    $or: [{ staffId: id }, { staffId: new ObjectId(id) }],
  });

  const guests = await db
    .collection("GuestData")
    .find({ staffId: id })
    .sort({ createdAt: -1 })
    .toArray();

 return (
  <div className="min-h-screen flex bg-gray-100 overflow-x-hidden ">

    <ReceptionistSidebar staffId={id} />

    <div className="flex-1 px-4 sm:px-6 md:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-10">

        {/* HEADER */}
        <div className="w-280 relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-8 shadow-xl text-white">
          <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Welcome back, {staff.name}
            </h1>

            <div className="mt-4 flex flex-col sm:flex-row sm:gap-10 gap-2 text-sm opacity-90">
              <p><span className="font-medium">Hotel Code:</span> {staff.hotelCode}</p>
              <p><span className="font-medium">Role:</span> {staff.role}</p>
            </div>
          </div>

          {/* Decorative blur circle */}
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* ROOM STATS */}
        {roomDetails && (
          <section>
            <h2 className="text-lg font-semibold text-gray-700 mb-6 tracking-wide">
              Room Overview
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-280">
              <Card title="Total Rooms" value={roomDetails.totalRooms} icon="🏨" />
            </div>
          </section>
        )}

        {/* ROOM CONFIG
        {roomDetails && (
          <section className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 w-280">
            <h2 className="text-xl font-semibold text-gray-800 mb-8 tracking-tight">
              Room Configuration
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              <InfoBox label="King Beds" value={roomDetails.kingBeds} />
              <InfoBox label="Queen Beds" value={roomDetails.queenBeds} />
              <InfoBox label="Twin Beds" value={roomDetails.twinBeds} />
              <InfoBox label="Standard Rooms" value={roomDetails.standardRooms} />
              <InfoBox label="Deluxe Rooms" value={roomDetails.deluxeRooms} />
              <InfoBox label="Suite Rooms" value={roomDetails.suiteRooms} />
              <InfoBox label="Single Rooms" value={roomDetails.singleOccupancy} />
              <InfoBox label="Double Rooms" value={roomDetails.doubleOccupancy} />
              <InfoBox label="Family Rooms" value={roomDetails.tripleOccupancy} />
              <InfoBox label="Quad Rooms" value={roomDetails.quadOccupancy} />
            </div>
          </section>
        )} */}

        {/* GUEST TABLE */}
        
          <section className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 w-280">
            <h2 className="text-xl font-semibold text-gray-800 mb-8">
              Guest Records
            </h2>

            {guests.length === 0 ? (
              <div className="text-center text-gray-400 py-10 text-lg">
                No Guests Added Yet
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-gray-200">
                <table className="min-w-[1100px] w-full text-sm">
                  <thead className="bg-blue-100 text-gray-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-4 text-left">Guest</th>
                      <th className="px-5 py-4 text-left">Phone</th>
                      <th className="px-5 py-4 text-center">Rooms</th>
                      <th className="px-5 py-4">Type</th>
                      <th className="px-5 py-4">Check-In</th>
                      <th className="px-5 py-4">Check-Out</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4 text-center">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 bg-white">
                    {guests.map((guest, index) => (
                      <GuestRow
                        key={guest._id.toString()}
                        guest={{
                          ...guest,
                          _id: guest._id.toString(),
                        }}
                        rowStyle={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>

      </div>
    </div>
  </div>
);
}

/* COMPONENTS */

function Card({ title, value, icon }) {
  return (
    <div className="bg-white p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm uppercase tracking-wide">
            {title}
          </p>
          <h3 className="text-4xl font-semibold mt-3 text-gray-800 tracking-tight">
            {value ?? 0}
          </h3>
        </div>
        <div className="bg-indigo-50 text-indigo-600 p-4 rounded-2xl text-3xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <p className="text-xs uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <h3 className="text-2xl font-semibold mt-2 text-gray-800">
        {value ?? 0}
      </h3>
    </div>
  );
}

function Badge({ color, text }) {
  const colors = {
    purple: "bg-purple-100 text-purple-700",
    blue: "bg-blue-100 text-blue-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <span
      className={` px-3 py-1 rounded-full text-xs font-semibold ${colors[color]}`}
    >
      {text}
    </span>
  );
}