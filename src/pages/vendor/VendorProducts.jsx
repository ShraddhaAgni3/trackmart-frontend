import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function VendorProducts(){

const [products,setProducts] = useState([]);
const navigate = useNavigate();

const fetchProducts = async()=>{

 try{

  const res = await api.get("/products/vendor");
  setProducts(res.data);

 }catch(err){
  console.log(err);
 }

};

useEffect(()=>{
 fetchProducts();
},[]);


const deleteProduct = async(id)=>{

 if(!window.confirm("Delete this product?")) return;

 await api.delete(`/products/${id}`);

 fetchProducts();

};


const editProduct = (product)=>{
 navigate("/vendor/add-product",{state:product});
};


return(

<>

<Navbar/>

<div className="max-w-7xl mx-auto px-6 py-8">

<h1 className="text-3xl font-bold mb-8">
My Products
</h1>


<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">


{products.map(p=>(

<div
key={p.id}
className="bg-white border rounded-xl shadow-sm hover:shadow-lg transition flex flex-col h-[360px]"
>


{/* IMAGE */}

<div className="h-40 flex items-center justify-center bg-gray-50 rounded-t-xl p-4">

<img
src={p.image_url
? `https://backend-shraddha.onrender.com/uploads/${p.image_url}`
: "/placeholder.png"}
alt={p.title}
className="max-h-full object-contain"
/>

</div>


{/* CONTENT */}

<div className="flex flex-col flex-grow p-4">

<h2 className="font-semibold text-lg line-clamp-1">
{p.title}
</h2>

<p className="text-primary font-bold mt-1">
₹{p.price}
</p>

<p className="text-sm text-gray-600 mt-2 line-clamp-2">
{p.description}
</p>


{/* BUTTONS */}

<div className="mt-auto flex justify-between pt-4">


<button
onClick={()=>deleteProduct(p.id)}
className="text-red-600 font-medium hover:underline"
>
Delete
</button>

</div>

</div>

</div>

))}

</div>

</div>

<Footer/>

</>

);

}
