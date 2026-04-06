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

  /* FETCH WISHLIST */
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
    <nav className="bg-surface border-b px-4 md:px-8 py-3 overflow-x-hidden">

      <div className="flex items-center justify-between w-full">

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
            </>
          )}

          {role === "customer" && (
            <>
              <Link to="/">Shop</Link>
              <button onClick={handleAboutClick}>About</button>
              <Link to="/profile">Profile</Link>

              {/* ✅ FIXED WISHLIST */}
              <Link to="/wishlist" className="relative">
                ❤️
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </Link>

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

      {/* MOBILE MENU */}
      {isOpen && (
        <div className="md:hidden mt-3 w-full">

          <div className="w-full bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4 border">

            {/* TOP */}
            <div className="flex flex-col gap-3 text-sm">
              <Link to="/" onClick={() => setIsOpen(false)}>Shop</Link>
              <button onClick={handleAboutClick}>About</button>
            </div>

            {/* CUSTOMER */}
            {role === "customer" && (
              <>
                <div className="border-t pt-3">

                  <p className="text-xs text-gray-400 mb-2">Account</p>

                  <div className="flex flex-col gap-3 text-sm">

                    <Link
                      to="/profile"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-between"
                    >
                      Profile <span>›</span>
                    </Link>

                    {/* ✅ FIXED WISHLIST */}
                    <Link
                      to="/wishlist"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-between"
                    >
                      Wishlist <span>{wishlistCount}</span>
                    </Link>

                    <Link
                      to="/customer/cart"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-between"
                    >
                      Cart <span>›</span>
                    </Link>

                    <Link
                      to="/customer/orders"
                      onClick={() => setIsOpen(false)}
                      className="flex justify-between"
                    >
                      Orders <span>›</span>
                    </Link>

                  </div>
                </div>

                <div className="border-t pt-3">
                  <NotificationBell />
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="border-t pt-3 text-red-500"
                >
                  Logout
                </button>
              </>
            )}

            {/* GUEST */}
            {!role && (
              <div className="border-t pt-3 flex flex-col gap-3">
                <Link to="/login" className="btn-primary text-center">Login</Link>
                <Link to="/register" className="btn-outline text-center">Register</Link>
              </div>
            )}

            {/* VENDOR */}
            {role === "vendor" && (
              <>
                <div className="border-t pt-3">
                  <Link to="/vendor">Dashboard</Link>
                  <Link to="/profile">Profile</Link>
                  <Link to="/vendor/add-product">Add Product</Link>
                </div>

                <button onClick={handleLogout} className="text-red-500 border-t pt-3">
                  Logout
                </button>
              </>
            )}

            {/* ADMIN */}
            {role === "admin" && (
              <>
                <Link to="/admin">Admin Panel</Link>
                <button onClick={handleLogout} className="text-red-500 border-t pt-3">
                  Logout
                </button>
              </>
            )}

          </div>
        </div>
      )}
    </nav>
  );
}
