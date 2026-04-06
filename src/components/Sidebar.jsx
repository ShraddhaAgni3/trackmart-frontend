import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Sidebar({ role }) {

  const [isOpen, setIsOpen] = useState(false);

  const baseLink =
    "block px-4 py-3 rounded-xl transition font-medium hover:bg-gray-100";

  const activeLink =
    "bg-gray-100 text-primary font-semibold shadow-sm";

  return (
    <>
      {/* MOBILE BUTTON */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-white p-2 rounded-lg shadow"
        onClick={() => setIsOpen(true)}
      >
        <Menu />
      </button>

      {/* OVERLAY (only mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
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

        {/* CLOSE BUTTON (mobile only) */}
        <div className="md:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)}>
            <X />
          </button>
        </div>

        {/* TITLE */}
        <h2 className="text-xl font-bold mb-6">
          {role === "vendor" && "Vendor Panel"}
          {role === "admin" && "Admin Panel"}
          {role === "customer" && "My Account"}
        </h2>

        {/* VENDOR */}
        {role === "vendor" && (
          <div className="space-y-2">
            <NavLink to="/vendor" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Dashboard
            </NavLink>

            <NavLink to="/vendor/add-product" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Add Product
            </NavLink>

            <NavLink to="/vendor/products" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              My Products
            </NavLink>

            <NavLink to="/vendor/orders" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Orders
            </NavLink>
          </div>
        )}

        {/* ADMIN */}
        {role === "admin" && (
          <div className="space-y-2">
            <NavLink to="/admin" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/approve-vendors" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Approve Vendors
            </NavLink>

            <NavLink to="/admin/vendors" onClick={()=>setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`}>
              Vendors
            </NavLink>
          </div>
        )}

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

      </div>
    </>
  );
}
