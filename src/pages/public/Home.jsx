import { useEffect, useState, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getProducts } from "../../services/productService";
import { getCategories } from "../../services/categoryService";
import { getCart, updateCartItem } from "../../services/cartService";
import { getWishlist, toggleWishlist } from "../../services/wishlistService";
import { Heart } from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

export default function Home() {

  const navigate = useNavigate();
  const { role, loading: authLoading } = useContext(AuthContext);

  const [products,setProducts] = useState([]);
  const [categories,setCategories] = useState([]);
  const [cartItems,setCartItems] = useState([]);
  const [wishlistIds,setWishlistIds] = useState([]);

  const [category,setCategory] = useState("");
  const [care,setCare] = useState("");
  const [concern,setConcern] = useState("");
  const [price,setPrice] = useState(1000);
  const [sort,setSort] = useState("featured");

  const [searchText,setSearchText] = useState("");
  const [loading,setLoading] = useState(false); // ✅ added

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const canAddToCart = role === null || role === "customer";


  /* ================= FETCH PRODUCTS ================= */

  useEffect(()=>{

    const fetchProducts = async()=>{

      try{
        setLoading(true); // ✅ start

        const res = await getProducts({
          search:searchQuery,
          category,
          care,
          concern,
          price,
          sort
        });

        setProducts(res.data);

      }catch(err){
        console.log(err);
      }finally{
        setLoading(false); // ✅ stop
      }

    };

    fetchProducts();

  },[searchQuery,category,care,concern,price,sort]);


  /* ================= FETCH CATEGORIES ================= */

  useEffect(()=>{

    const fetchCategories = async()=>{

      try{
        const res = await getCategories();
        setCategories(res.data);
      }catch(err){
        console.log(err);
      }

    };

    fetchCategories();

  },[]);


  /* ================= FETCH CART ================= */

  useEffect(()=>{

    if(authLoading) return;
    if(role!=="customer") return;

    const fetchCart = async()=>{

      try{
        const res = await getCart();
        setCartItems(res.data);
      }catch(err){
        console.log(err);
      }

    };

    fetchCart();

  },[authLoading,role]);


  /* ================= FETCH WISHLIST ================= */

  useEffect(()=>{

    if(authLoading) return;
    if(role!=="customer") return;

    const fetchWishlist = async()=>{

      try{
        const res = await getWishlist();
        setWishlistIds(res.data.map(i=>String(i.product_id)));
      }catch(err){
        console.log(err);
      }

    };

    fetchWishlist();

  },[authLoading,role]);


  const handleSearch = ()=>{
    navigate(`/?search=${searchText}`);
  };


  const getQuantity = (productId)=>{
    const item = cartItems.find(i=>i.id===productId);
    return item ? item.quantity : 0;
  };


  const toggleWishlistItem = async(productId)=>{

    if(!role){
      navigate("/login");
      return;
    }

    await toggleWishlist(productId);

    const res = await getWishlist();
    setWishlistIds(res.data.map(i=>String(i.product_id)));
  };


  const increaseQty = async(product)=>{

    if(!role){
      navigate("/login");
      return;
    }

    await updateCartItem(product.id,1);

    setCartItems(prev=>{
      const existing = prev.find(p=>p.id===product.id);

      if(existing){
        return prev.map(p =>
          p.id===product.id ? {...p,quantity:p.quantity+1} : p
        );
      }

      return [...prev,{...product,quantity:1}];
    });
  };


  const decreaseQty = async(product)=>{

    await updateCartItem(product.id,-1);

    setCartItems(prev =>
      prev
      .map(p =>
        p.id===product.id
        ? {...p,quantity:p.quantity-1}
        : p
      )
      .filter(p=>p.quantity>0)
    );
  };


  return (

    <div className="space-y-16">

      {/* HERO */}
      <section className="text-center py-20 bg-surface-alt rounded-2xl">
        <h1 className="text-5xl font-primary font-bold text-strong leading-tight">
          Discover Smarter
          <span className="text-primary"> Healthy Choices</span>
        </h1>
        <p className="text-muted mt-6 text-lg max-w-2xl mx-auto">
          Explore curated products with real nutrition insights.
        </p>
      </section>


      {/* SEARCH + FILTER */}
      <section className="flex flex-wrap gap-4 items-center justify-center">

        <div className="flex border border-default rounded-xl overflow-hidden">
          <input
            type="text"
            placeholder="Search products..."
            value={searchText}
            onChange={(e)=>setSearchText(e.target.value)}
            className="px-4 py-2 outline-none w-72"
          />
          <button onClick={handleSearch} className="bg-primary text-white px-5">
            Search
          </button>
        </div>

        <select value={care} onChange={(e)=>setCare(e.target.value)} className="border rounded-xl px-3 py-2">
          <option value="">Care</option>
          <option value="Skin Care">Skin Care</option>
          <option value="Hair Care">Hair Care</option>
        </select>

        <select value={concern} onChange={(e)=>setConcern(e.target.value)} className="border rounded-xl px-3 py-2">
          <option value="">Concern</option>
          <option value="Immunity">Immunity</option>
          <option value="Digestion">Digestion</option>
        </select>

        <select value={sort} onChange={(e)=>setSort(e.target.value)} className="border rounded-xl px-3 py-2">
          <option value="featured">Featured</option>
          <option value="price_low">Price Low → High</option>
          <option value="price_high">Price High → Low</option>
        </select>

      </section>


      {/* SIDEBAR + PRODUCTS */}
      <section className="flex gap-10 h-[80vh] overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-64 sticky top-0 h-fit">
          <h3 className="font-semibold mb-4">Categories</h3>

          {categories.map(cat => (
            <label key={cat.id} className="flex gap-2">
              <input
                type="radio"
                value={cat.id}
                checked={category==cat.id}
                onChange={(e)=>setCategory(e.target.value)}
              />
              {cat.name}
            </label>
          ))}
        </aside>


        {/* PRODUCTS */}
        <div className="flex-1 overflow-y-auto pr-2">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            {loading ? (

              <div className="col-span-full text-center py-20 text-gray-500">
                Loading products...
              </div>

            ) : products.length === 0 ? (

              <div className="col-span-full text-center py-20 text-gray-500">
                No products found
              </div>

            ) : (

              products.map(product => {

                const quantity = getQuantity(product.id);

                return (
                  <div key={product.id} className="border p-4 rounded-xl">

                    <h3>{product.title}</h3>
                    <p>₹{product.price}</p>

                    {quantity === 0 ? (
                      <button onClick={()=>increaseQty(product)}>Add</button>
                    ) : (
                      <div>
                        <button onClick={()=>decreaseQty(product)}>-</button>
                        {quantity}
                        <button onClick={()=>increaseQty(product)}>+</button>
                      </div>
                    )}

                  </div>
                )

              })

            )}

          </div>

        </div>

      </section>

    </div>
  );
}
