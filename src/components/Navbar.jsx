import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { getWishlist } from "../services/wishlistService";
import { Menu, X } from "lucide-react";

export default function Navbar() {

  const { role, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [wishlistCount, setWishlistCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (role !== "customer") return;

      try {
        const res = await getWishlist();
        setWishlistCount(res.data.length);
      } catch (err) {
        console.log(err);
      }
    };

    fetchWishlist();
  }, [role]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAboutClick = () => {
    navigate("/");
    setTimeout(() => {
      const section = document.getElementById("about-section");
      if (section) section.scrollIntoView({ behavior: "smooth" });
    }, 100);
    setIsOpen(false);
  };

  return (
    <nav className="bg-surface border-b border-default px-4 md:px-8 py-3 relative z-50">

      <div className="flex justify-between items-center">

        {/* LOGO */}
        <Link to="/" className="text-2xl font-bold">
          <span className="text-primary">Track</span>
          <span className="text-strong">Mart</span>
        </Link>

        {/* DESKTOP */}
        <div className="hidden md:flex items-center space-x-6 font-medium">

          {!role && (
            <>
              <Link to="/">Shop</Link>
              <button onClick={handleAboutClick}>About</button>
              <Link to="/login" className="btn-primary">Login</Link>
              <Link to="/register" className="btn-outline">Register</Link>
              <Link to="/apply-vendor">Become Seller</Link>
            </>
          )}

          {role === "customer" && (
            <>
              <Link to="/">Shop</Link>
              <button onClick={handleAboutClick}>About</button>
              <Link to="/profile">Profile</Link>

              {/* LOGIC SAME */}
              <button onClick={() => navigate("/wishlist")} className="relative">
                ❤️
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <Link to="/customer/cart">Cart</Link>
              <Link to="/customer/orders">Orders</Link>

              <NotificationBell />

              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </>
          )}

          {role === "vendor" && (
            <>
              <Link to="/vendor">Dashboard</Link>
              <Link to="/profile">Profile</Link>
              <Link to="/vendor/add-product">Add Product</Link>
              <NotificationBell />
              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </>
          )}

          {role === "admin" && (
            <>
              <Link to="/admin">Admin Panel</Link>
              <NotificationBell />
              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {isOpen && (
        <>
          {/* 🔥 OVERLAY */}
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setIsOpen(false)}
          ></div>

          {/* 🔥 MENU */}
          <div className="absolute top-full left-0 w-full z-50 px-4 mt-2">

            <div
              className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 border"
              onClick={(e) => e.stopPropagation()}
            >

              {!role && (
                <>
                  <Link to="/" onClick={()=>setIsOpen(false)}>Shop</Link>
                  <button onClick={handleAboutClick}>About</button>
                  <Link to="/login">Login</Link>
                  <Link to="/register">Register</Link>
                  <Link to="/apply-vendor">Become Seller</Link>
                </>
              )}

              {role === "customer" && (
                <>
                  <Link to="/" onClick={()=>setIsOpen(false)}>Shop</Link>
                  <button onClick={handleAboutClick}>About</button>

                  <Link to="/profile" onClick={()=>setIsOpen(false)}>
                    Profile
                  </Link>

                  {/* LOGIC SAME */}
                  <button
                    onClick={() => {
                      navigate("/wishlist");
                      setIsOpen(false);
                    }}
                  >
                    Wishlist ({wishlistCount})
                  </button>

                  <Link to="/customer/cart">Cart</Link>
                  <Link to="/customer/orders">Orders</Link>

                  <NotificationBell />

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              )}

              {role === "vendor" && (
                <>
                  <Link to="/vendor">Dashboard</Link>
                  <Link to="/profile">Profile</Link>
                  <Link to="/vendor/add-product">Add Product</Link>

                  <NotificationBell />

                  <button onClick={handleLogout}>Logout</button>
                </>
              )}

              {role === "admin" && (
                <>
                  <Link to="/admin">Admin Panel</Link>
                  <NotificationBell />
                  <button onClick={handleLogout}>Logout</button>
                </>
              )}

            </div>
          </div>
        </>
      )}
    </nav>
  );
}
