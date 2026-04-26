import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function EditProduct() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    size: ""
  });

  // 🔥 fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setForm(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  // 🔥 update product
  const handleUpdate = async () => {
    try {
      await api.put(`/products/${id}`, form);
      alert("Product updated");
      navigate("/vendor/products");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">

      <h1 className="text-2xl font-bold">Edit Product</h1>

      <input
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="w-full border p-2"
        placeholder="Title"
      />

      <textarea
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        className="w-full border p-2"
        placeholder="Description"
      />

      <input
        type="number"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
        className="w-full border p-2"
        placeholder="Price"
      />

      <input
        type="number"
        value={form.stock}
        onChange={(e) => setForm({ ...form, stock: e.target.value })}
        className="w-full border p-2"
        placeholder="Stock"
      />

      <input
        value={form.size}
        onChange={(e) => setForm({ ...form, size: e.target.value })}
        className="w-full border p-2"
        placeholder="Size"
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-6 py-2 rounded"
      >
        Update Product
      </button>

    </div>
  );
}
