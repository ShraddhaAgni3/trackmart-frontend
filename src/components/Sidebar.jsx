import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Sidebar({ role }) {

  const [isOpen, setIsOpen] = useState(false);

  const baseLink =
    "block px-4 py-3 rounded-xl transition font-medium hover:bg-gray-100";

  const activeLink =
    "bg-gray-100 text-primary font-semibold";

  return (
    <>
      {/* 🔥 EDGE TRIGGER (mobile only) */}
      <div
        className="md:hidden fixed top-0 left-0 h-full w-3 z-40"
        onClick={() => setIsOpen(true)}
      />

      {/* 🔥 OVERLAY */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* 🔥 SIDEBAR */}
      <div
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white border-r p-6 z-50
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-6">
          {role === "customer" && "My Account"}
          {role === "vendor" && "Vendor Panel"}
          {role === "admin" && "Admin Panel"}
        </h2>

        {/* CUSTOMER */}
        {role === "customer" && (
          <div className="space-y-2">

            <NavLink
              to="/customer"
              onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/customer/orders"
              onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              Orders
            </NavLink>

          </div>
        )}

      </div>
    </>
  );
}
