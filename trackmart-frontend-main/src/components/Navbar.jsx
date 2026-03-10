import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

export default function Navbar() {

  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-surface border-b border-default px-8 py-4 flex justify-between items-center">

      {/* Logo */}
      <Link to="/" className="text-2xl font-bold font-primary">
        <span className="text-primary">Intake</span>
        <span className="text-strong">Mart</span>
      </Link>

      <div className="flex items-center space-x-6 font-medium">

        {/* ================= GUEST ================= */}

        {!role && (
          <>
            <Link
              to="/"
              className="text-strong hover:text-primary transition"
            >
              Shop
            </Link>

            <Link
              to="/login"
              className="btn-primary"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn-outline"
            >
              Register
            </Link>

            <Link
              to="/apply-vendor"
              className="text-strong hover:text-primary transition"
            >
              Become Seller
            </Link>
          </>
        )}

        {/* ================= CUSTOMER ================= */}

        {role === "customer" && (
          <>
            <Link
              to="/"
              className="text-strong hover:text-primary transition"
            >
              Shop
            </Link>

            <Link
              to="/customer/cart"
              className="text-strong hover:text-primary transition"
            >
              Cart
            </Link>

            <Link
              to="/customer/orders"
              className="text-strong hover:text-primary transition"
            >
              Orders
            </Link>

            {/* Notification */}
            <NotificationBell />

            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              Logout
            </button>
          </>
        )}

        {/* ================= VENDOR ================= */}

        {role === "vendor" && (
          <>
            <Link
              to="/vendor"
              className="text-strong hover:text-primary transition"
            >
              Dashboard
            </Link>

            <Link
              to="/vendor/add-product"
              className="text-strong hover:text-primary transition"
            >
              Add Product
            </Link>

            {/* Notification */}
            <NotificationBell />

            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              Logout
            </button>
          </>
        )}

        {/* ================= ADMIN ================= */}

        {role === "admin" && (
          <>
            <Link
              to="/admin"
              className="text-strong hover:text-primary transition"
            >
              Admin Panel
            </Link>

            {/* Notification */}
            <NotificationBell />

            <button
              onClick={handleLogout}
              className="btn-primary"
            >
              Logout
            </button>
          </>
        )}

      </div>

    </nav>
  );
}