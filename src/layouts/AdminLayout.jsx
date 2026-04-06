import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {

  return (
    <div className="flex min-h-screen bg-bgApp">

      {/* 🔥 Sidebar (always render, control inside component) */}
      <Sidebar role="admin" />

      {/* Main Area */}
      <div className="flex-1 flex flex-col">

        {/* Navbar */}
        <div className="sticky top-0 z-10">
          <Navbar />
        </div>

        {/* Content */}
        <div className="flex-1 p-4 md:p-10">
          <div className="bg-bgSurface border rounded-2xl shadow p-4 md:p-8">
            <Outlet />
          </div>
        </div>

        <Footer />
      </div>

    </div>
  );
}
