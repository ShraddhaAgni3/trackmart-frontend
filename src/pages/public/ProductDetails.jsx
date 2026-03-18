import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getProducts } from "../../services/productService";
import { updateCartItem, getCart } from "../../services/cartService";
import { ArrowLeft } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  // Get role from AuthContext to control button visibility
  const { role } = useContext(AuthContext);

  const [product, setProduct]     = useState(null);
  const [loading, setLoading]     = useState(true);
  const [quantity, setQuantity]   = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isAdded, setIsAdded]     = useState(false);
const [showIngredient, setShowIngredient] = useState(false);
  // Button should show only when:
  // 1. Not logged in (role === null)  → show button, clicking redirects to login
  // 2. Logged in as customer          → show button, clicking adds to cart
  // 3. Logged in as vendor or admin   → hide button completely
  const canAddToCart = role === null || role === "customer";

  useEffect(() => {

    const fetchData = async () => {
      try {

        const productRes = await getProducts();
        const found = productRes.data.find(p => p.id === id);
        setProduct(found);

        // Only fetch cart if user is a customer (others don't have a cart)
        if (role === "customer") {
          const cartRes = await getCart();
          const cartItem = cartRes.data.find(
            item => (item.product_id?.id || item.product_id) === id
          );
          if (cartItem) {
            setIsAdded(true);
            setQuantity(cartItem.quantity);
          }
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

  }, [id, role]);


  const handleAddToCart = async () => {

    // If not logged in → redirect to login page
    if (!role) {
      navigate("/login");
      return;
    }

    // If customer → add to cart normally
    try {
      await updateCartItem(product.id, 1);
      setIsAdded(true);
      setQuantity(1);
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 3000);
    } catch (err) {
      console.log(err);
    }
  };


  const updateQuantity = async (newQty) => {
    if (newQty < 1) return;
    try {
      setQuantity(newQty);
      await updateCartItem(product.id, newQty);
    } catch (err) {
      console.log(err);
    }
  };


  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!product) return <p className="text-center mt-10">Product not found</p>;

  return (
    <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-10">

      {/* BACK ARROW */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100 transition"
      >
        <ArrowLeft className="w-6 h-6 text-gray-700" />
      </button>


      {/* TOP SECTION */}
<div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">

  {/* LEFT → IMAGE (smaller controlled) */}
  <div className="bg-bgSurface border border-borderDefault rounded-2xl shadow-card p-4 flex justify-center">

    <img
      src={product.image_url}
      alt={product.title}
      className="h-[250px] sm:h-[320px] object-contain"
    />

  </div>


  {/* RIGHT → MAIN INFO */}
  <div className="space-y-4">

    <h1 className="text-2xl sm:text-3xl font-bold text-primary">
      {product.title}
    </h1>

    <p className="text-2xl font-semibold text-green-600">
      ₹{product.price}
    </p>

    {/* STOCK */}
    <p className={`text-sm font-semibold ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
      {product.stock > 0 ? `In Stock (${product.stock})` : "Out of Stock"}
    </p>

    {/* CALORIES */}
    <p className="text-sm text-textMuted">
      Calories: <span className="font-semibold">{product.calories}</span>
    </p>

    {/* ADD TO CART */}
    {canAddToCart && product.stock > 0 && (
      !isAdded ? (
        <button
          onClick={handleAddToCart}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
        >
          Add to Cart
        </button>
      ) : (
        <div className="flex items-center border rounded-lg w-fit">
          <button onClick={() => updateQuantity(quantity - 1)} className="px-3 py-2">-</button>
          <span className="px-4">{quantity}</span>
          <button onClick={() => updateQuantity(quantity + 1)} className="px-3 py-2">+</button>
        </div>
      )
    )}
{/* INGREDIENT MODAL */}
{showIngredient && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

    <div className="relative">

      <img
        src={product.ingredient_image_url}
        alt="ingredients"
        className="max-h-[80vh] rounded-lg shadow-lg"
      />

      <button
        onClick={() => setShowIngredient(false)}
        className="absolute top-2 right-2 bg-white rounded-full px-3 py-1"
      >
        ✕
      </button>

    </div>

  </div>
)}
    {/* INGREDIENT PREVIEW */}
    {product.ingredient_image_url && (
      <div className="mt-4">
        <p className="text-sm font-medium mb-2">Ingredients</p>

        <img
          src={product.ingredient_image_url}
          alt="ingredients"
          onClick={() => setShowIngredient(true)}
          className="w-20 h-20 object-cover rounded-lg cursor-pointer border hover:scale-105 transition"
        />
      </div>
    )}

  </div>
</div>
{/* HOW TO USE */}

{product.how_to_use && (
  <div className="bg-bgSurface border border-borderDefault rounded-xl p-4 sm:p-5 shadow-card">
    
    <h2 className="text-base sm:text-lg font-semibold text-black mb-2">
      How to Use
    </h2>

    <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base text-textStrong">
      {product.how_to_use.split("\n").map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

  </div>
)}
{/* MAKING PROCESS */}

{product.making_process && (
  <div className="bg-bgSurface border border-borderDefault rounded-xl p-4 sm:p-6 shadow-card">

    <h2 className="text-base sm:text-lg font-semibold text-black mb-3">
      Making Process
    </h2>

    <ul className="list-disc pl-5 sm:pl-6 space-y-2 text-sm sm:text-base text-textStrong">
      {product.making_process.split("\n").map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

  </div>
)}{/* BENEFITS */}

{product.benefits && product.benefits.length > 0 && (

  <div className="space-y-8">

    <h2 className="text-2xl sm:text-3xl font-bold text-center">
      Benefits
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">

      {product.benefits.map((benefit, index) => (

        <div
          key={index}
          className="bg-bgSurface border border-borderDefault rounded-xl shadow-card overflow-hidden hover:shadow-lg transition"
        >

          <img
            src={benefit.image}
            alt={benefit.title}
            className="w-full h-44 sm:h-52 object-cover"
          />

          <div className="p-4 sm:p-6 space-y-2">

            <h3 className="text-base sm:text-lg font-semibold text-textStrong">
              {benefit.title}
            </h3>

            <p className="text-sm text-textStrong leading-relaxed">
              {benefit.description}
            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

)}
      {/* VIEW CART POPUP */}
      {showPopup && (
        <div className="fixed bottom-6 right-6 bg-white border border-borderDefault shadow-lg rounded-xl p-4 flex items-center gap-4 z-50">
          <p className="text-sm font-medium">Item added to cart</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-primary text-white px-4 py-1 rounded"
          >
            View Cart
          </button>
          <button onClick={() => setShowPopup(false)} className="text-gray-500">
            ✕
          </button>
        </div>
      )}

    </div>
  );
}
