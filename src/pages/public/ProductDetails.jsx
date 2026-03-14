import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../services/productService";
import { updateCartItem, getCart } from "../../services/cartService";
import { ArrowLeft } from "lucide-react";

export default function ProductDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [quantity, setQuantity] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const [role, setRole] = useState("");

  /* ===== LOAD ROLE ===== */

  useEffect(() => {

    const userRole = localStorage.getItem("role");

    if(userRole){
      setRole(userRole.toLowerCase());
    }

  }, []);

  /* ===== FETCH PRODUCT ===== */

  useEffect(() => {

    const fetchData = async () => {

      try {

        const productRes = await getProducts();
        const found = productRes.data.find(p => p.id === id);
        setProduct(found);

        const token = localStorage.getItem("token");

        if(token){

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

  }, [id]);



  /* ===== ADD TO CART ===== */

  const handleAddToCart = async () => {

    const token = localStorage.getItem("token");

    /* GUEST USER */

    if(!token){
      navigate("/login");
      return;
    }

    try {

      await updateCartItem(product.id, 1);

      setIsAdded(true);
      setQuantity(1);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
      }, 3000);

    } catch (err) {
      console.log(err);
    }

  };


  /* ===== UPDATE QTY ===== */

  const updateQuantity = async (newQty) => {

    if (newQty < 1) return;

    const token = localStorage.getItem("token");

    if(!token){
      navigate("/login");
      return;
    }

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

{/* BACK BUTTON */}

<button
 onClick={() => navigate(-1)}
 className="absolute top-4 left-4 p-2 rounded-full hover:bg-gray-100"
>
 <ArrowLeft className="w-6 h-6 text-gray-700"/>
</button>


<div className="grid md:grid-cols-2 gap-8 lg:gap-12">

{/* IMAGE */}

<div className="bg-bgSurface border rounded-2xl p-6 flex items-center justify-center">

{product.image_url ? (

<img
 src={product.image_url}
 alt={product.title}
 className="max-h-[420px] object-contain"
/>

) : (

<div>No Image</div>

)}

</div>


{/* DETAILS */}

<div className="space-y-5">

<h1 className="text-3xl font-bold">
{product.title}
</h1>

<div className="text-3xl font-semibold text-green-600">
₹{product.price}
</div>

<div>
Weight: <span className="font-semibold">{product.size}</span>
</div>


{product.stock === 0 ? (

<span className="bg-red-100 px-3 py-1 rounded-full text-sm">
Out of Stock
</span>

) : (

<span className="bg-green-100 px-3 py-1 rounded-full text-sm">
In Stock ({product.stock})
</span>

)}



{/* ADD TO CART */}

{product.stock > 0 && role !== "vendor" && (

<div className="pt-3">

{!isAdded ? (

<button
 onClick={handleAddToCart}
 className="bg-primary text-white px-6 py-2 rounded-lg"
>
Add to Cart
</button>

) : (

<div className="flex items-center border rounded-lg overflow-hidden">

<button
 onClick={() => updateQuantity(quantity - 1)}
 className="px-3 py-2 bg-gray-100"
>
-
</button>

<span className="px-4">{quantity}</span>

<button
 onClick={() => updateQuantity(quantity + 1)}
 className="px-3 py-2 bg-gray-100"
>
+
</button>

</div>

)}

</div>

)}



{/* DESCRIPTION */}

<div className="border rounded-xl p-5">

<h2 className="font-semibold mb-2">
Description
</h2>

<p>{product.description}</p>

</div>

</div>

</div>



{/* CART POPUP */}

{showPopup && (

<div className="fixed bottom-6 right-6 bg-white border shadow-lg rounded-xl p-4 flex gap-4">

<p>Item added to cart</p>

<button
 onClick={() => navigate("/cart")}
 className="bg-primary text-white px-4 py-1 rounded"
>
View Cart
</button>

<button
 onClick={() => setShowPopup(false)}
>
✕
</button>

</div>

)}

</div>

);
}
