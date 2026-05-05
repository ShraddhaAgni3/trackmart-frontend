import { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getCategories } from "../../services/categoryService";
import { createProduct } from "../../services/productService";
import Footer from "../../components/Footer";
import api from "../../services/api";

export default function AddProduct() {

  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const isEdit = !!id;

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category_id: "",
    care_type: "",
    concern_type: "",
    ingredients: "",
    price: "",
    stock: "",
    size: "",
    calories: "",
    sugar: "",
    fat: "",
    protein: "",
    how_to_use: "",
    making_process: "",
    product_image: null,
    ingredients_image: null
  });

  /* ================= FETCH PRODUCT ================= */

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);

        setForm({
          ...res.data,
          product_image: null,
          ingredients_image: null
        });

      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [id]);

  /* ================= FETCH CATEGORIES ================= */

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  /* ================= IMAGE UPLOAD FUNCTION (NEW) ================= */

  const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const res = await api.post("/products/upload-image", formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.data.url;
  };

  /* ================= HEALTH ================= */

  const calculateHealth = () => {
    if (Number(form.sugar) > 20 || Number(form.fat) > 20) {
      return "Unhealthy";
    }
    return "Healthy";
  };

  /* ================= MULTI SELECT ================= */

  const handleMultiSelect = (field, value, checked) => {
    let values = form[field] ? form[field].split(",") : [];

    if (checked) {
      if (!values.includes(value)) values.push(value);
    } else {
      values = values.filter(v => v !== value);
    }

    setForm({
      ...form,
      [field]: values.join(",")
    });
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    if (loading) return;

    try {
      if (!form.title || !form.price || !form.stock || !form.size) {
        alert("Please fill required fields");
        return;
      }

      setLoading(true);

      let productImageUrl = form.product_image;
      let ingredientsImageUrl = form.ingredients_image;

      // 🔥 upload only if file selected
      if (form.product_image instanceof File) {
        productImageUrl = await uploadImage(form.product_image);
      }

      if (form.ingredients_image instanceof File) {
        ingredientsImageUrl = await uploadImage(form.ingredients_image);
      }

      const payload = {
        ...form,
        product_image: productImageUrl,
        ingredients_image: ingredientsImageUrl,
        vendor_claimed_health: calculateHealth()
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        alert("Product updated successfully");
      } else {
        await createProduct(payload, token);
        alert("Product added successfully");
      }

      

      setForm({
        title: "",
        description: "",
        category_id: "",
        care_type: "",
        concern_type: "",
        ingredients: "",
        price: "",
        stock: "",
        size: "",
        calories: "",
        sugar: "",
        fat: "",
        protein: "",
        how_to_use: "",
        making_process: "",
        product_image: null,
        ingredients_image: null
      });

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  };

  /* ================= BULK UPLOAD (NEW, NO UI CHANGE) ================= */

  const handleBulkUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("file", file);

      await api.post("/products/bulk-upload", formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Bulk upload successful");

    } catch (err) {
      alert("Bulk upload failed");
    }
  };

  return (

    <div className="max-w-4xl mx-auto px-4 md:px-0 space-y-8 md:space-y-10">

      <h1 className="text-2xl md:text-3xl font-bold">
        Add New Product
      </h1>

     <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
  <p className="text-sm font-semibold mb-2">
    Bulk Upload via Excel
  </p>

  <input
    type="file"
    accept=".xlsx,.xls"
    onChange={handleBulkUpload}
    className="w-full border rounded-xl px-3 py-2"
  />
</div>

      {/* PRODUCT INFO */}
      <div className="bg-white border rounded-2xl shadow p-4 sm:p-6 md:p-8 space-y-6">

        <input
          value={form.title}
          placeholder="Product Title"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          value={form.description}
          placeholder="Description"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          value={form.category_id}
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, category_id: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* CARE TYPE */}
        <div>
          <p className="text-sm font-semibold mb-2">Select Care Type</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {["Skin Care","Hair Care","Digestive Care","Immunity Care","Heart Care"].map(item => (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={form.care_type?.split(",").includes(item)}
                  onChange={(e) =>
                    handleMultiSelect("care_type", item, e.target.checked)
                  }
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* CONCERN */}
        <div>
          <p className="text-sm font-semibold mb-2">Select Concern</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
            {["Immunity","Digestion","Skin Health","Weight Loss","Energy Boost"].map(item => (
              <label key={item} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={form.concern_type?.split(",").includes(item)}
                  onChange={(e) =>
                    handleMultiSelect("concern_type", item, e.target.checked)
                  }
                />
                {item}
              </label>
            ))}
          </div>
        </div>

        {/* PRICE + STOCK */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          <input
            type="number"
            value={form.price}
            placeholder="Price"
            className="border rounded-xl px-3 md:px-4 py-2.5 md:py-3 w-full"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <input
            type="number"
            value={form.stock}
            placeholder="Stock"
            className="border rounded-xl px-3 md:px-4 py-2.5 md:py-3 w-full"
            onChange={(e) => setForm({ ...form, stock: e.target.value })}
          />
        </div>

        <input
          type="text"
          value={form.size}
          placeholder="Size (100g / 250g)"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, size: e.target.value })}
        />

        <textarea
          value={form.how_to_use}
          placeholder="How to Use"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, how_to_use: e.target.value })}
        />

        <textarea
          value={form.making_process}
          placeholder="Making Process"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, making_process: e.target.value })}
        />

        <p>Product Image</p>

        <input
          type="file"
          accept="image/*"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) =>
            setForm({ ...form, product_image: e.target.files[0] })
          }
        />

      </div>

      {/* NUTRITION */}
      <div className="bg-white border rounded-2xl shadow p-4 sm:p-6 md:p-8 space-y-6">

        <textarea
          value={form.ingredients}
          placeholder="Ingredients"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) => setForm({ ...form, ingredients: e.target.value })}
        />

        <p className="text-sm text-gray-500">
          Take photo of ingredients label
        </p>

        <input
          type="file"
          accept="image/*"
          capture="environment"
          className="w-full border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
          onChange={(e) =>
            setForm({ ...form, ingredients_image: e.target.files[0] })
          }
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
          <input type="number" value={form.calories} placeholder="Calories"
            className="border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
            onChange={(e) => setForm({ ...form, calories: e.target.value })}
          />
          <input type="number" value={form.sugar} placeholder="Sugar"
            className="border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
            onChange={(e) => setForm({ ...form, sugar: e.target.value })}
          />
          <input type="number" value={form.fat} placeholder="Fat"
            className="border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
            onChange={(e) => setForm({ ...form, fat: e.target.value })}
          />
          <input type="number" value={form.protein} placeholder="Protein"
            className="border rounded-xl px-3 md:px-4 py-2.5 md:py-3"
            onChange={(e) => setForm({ ...form, protein: e.target.value })}
          />
        </div>

        <span className={`px-4 py-2 rounded-full text-sm font-semibold
        ${calculateHealth() === "Healthy"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"}`}>
          Health Rating: {calculateHealth()}
        </span>

      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-green-600 text-white w-full sm:w-auto px-6 md:px-10 py-3 rounded-xl 
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading
            ? "Saving..."
            : isEdit
              ? "Update Product"
              : "Add Product"}
        </button>
      </div>

      <Footer />
    </div>
  );
}
