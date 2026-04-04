import { useEffect,useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function AdminVendorPayments(){

const [vendors,setVendors] = useState([]);
const navigate = useNavigate();

useEffect(()=>{

const fetchData = async()=>{

try{

const res = await api.get("/admin/vendor-earnings");
setVendors(res.data);

}catch(err){
console.log(err);
}

};

fetchData();

},[]);
const clearPayment = async (vendorId) => {
  try {
    console.log("clicked", vendorId);

    const { data } = await api.post("/payment/create-vendor-order", {
      vendorId
    });

    console.log("order data:", data);

    const options = {
      key: data.key,
      amount: data.order.amount,
      order_id: data.order.id,

      handler: async function (response) {
        console.log("payment response:", response);

        await api.post("/api/payment/verify-vendor", {
          ...response,
          vendorId
        });

        alert("Payment Successful ✅");
      }
    };

    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded ❌");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.log("ERROR:", err);
  }
};

return(

<div className="space-y-8">

<h1 className="text-3xl font-bold">
Vendor Weekly Payments
</h1>


{vendors.length===0 && (
<p className="text-textMuted">
No pending payouts
</p>
)}


{vendors.map(v=>(

<div
key={v.vendor_id}
onClick={()=>navigate(`/admin/vendors/${v.vendor_id}`)}
className="bg-bgSurface border border-borderDefault rounded-xl p-6 flex justify-between items-center cursor-pointer hover:bg-bgSurfaceAlt"
>

<div>

<h2 className="font-semibold text-lg">
{v.business_name}
</h2>

<p className="text-green-600 font-semibold text-lg">
₹{Number(v.total_earning || 0)}
</p>

</div>


<button
onClick={(e)=>{
e.stopPropagation();
clearPayment(v.vendor_id);
}}
className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primaryHover"
>
Clear Weekly Payment
</button>

</div>

))}

</div>

);

}
