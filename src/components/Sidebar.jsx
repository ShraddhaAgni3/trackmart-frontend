import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ role }) {

  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState(null);

  const baseLink =
    "block px-4 py-3 rounded-xl transition font-medium hover:bg-gray-100";

  const activeLink =
    "bg-gray-100 text-primary font-semibold shadow-sm";

  /* ================= SWIPE LOGIC ================= */

  const handleTouchStart = (e) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (!touchStart) return;

    const touchEnd = e.touches[0].clientX;
    const diff = touchStart - touchEnd;

    // 👉 swipe LEFT → open
    if (touchStart < 50 && diff < -50) {
      setIsOpen(true);
    }

    // 👉 swipe RIGHT → close
    if (diff > 50) {
      setIsOpen(false);
    }
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      {/* MOBILE BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </button>

      {/* OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white border-r p-6 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        {/* CLOSE BUTTON */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        <h2 className="text-xl font-bold mb-6">
          {role === "vendor" && "Vendor Panel"}
          {role === "admin" && "Admin Panel"}
          {role === "customer" && "My Account"}
        </h2>

        {/* CUSTOMER */}
        {role === "customer" && (
          <div className="space-y-2">
            <NavLink to="/customer" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Dashboard
            </NavLink>

            <NavLink to="/customer/orders" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Orders
            </NavLink>
          </div>
        )}

        {/* Vendor & Admin same as before */}

      </div>
    </div>
  );
}
