// components/DashboardLayout.js

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-50">

      {/* Main content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
