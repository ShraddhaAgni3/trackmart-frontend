import { useEffect, useState } from "react";
import api from "../services/api";

export default function TrackingModal({ itemId, onClose }) {

  const [item, setItem] = useState(null);

  useEffect(() => {
    if (!itemId) return;

    const fetchTracking = async () => {
      try {
        const res = await api.get(`/track/${itemId}`);
        setItem(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTracking();
  }, [itemId]);

  if (!itemId) return null;

  // 🔥 timeline steps
  const steps = ["PLACED", "CONFIRMED", "ASSIGNED", "SHIPPED", "DELIVERED"];

  // 🔥 step logic
  const getCurrentStep = () => {
    if (item?.item_status === "delivered") return 4;
    if (item?.item_status === "shipped") return 3;
    if (item?.item_status === "confirmed") return 2; // assigned auto
    return 1;
  };

  const currentStep = getCurrentStep();

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={onClose}
    >

      {/* MODAL BOX */}
      <div
        className="bg-white w-[90%] max-w-md p-6 rounded-xl shadow-xl relative"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ❌ CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-lg"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">
          Order Tracking
        </h2>

        {!item ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* 📦 PRODUCT INFO */}
            <div className="mb-4">
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-500">
                Vendor: {item.vendor_name}
              </p>
            </div>

            {/* 🚚 TIMELINE */}
            <div className="space-y-3">
              {steps.map((step, index) => {

                const done = index <= currentStep;

                return (
                  <div key={step} className="flex items-center gap-3">

                    <div className={`w-3 h-3 rounded-full ${
                      done ? "bg-green-500" : "bg-gray-300"
                    }`} />

                    <p className={done ? "font-medium" : "text-gray-400"}>
                      {step}
                    </p>

                  </div>
                );
              })}
            </div>

            {/* 📊 DETAILS */}
            <div className="mt-5 text-sm border-t pt-3 space-y-1">
              <p><b>Status:</b> {item.item_status}</p>
              <p><b>Delivery Date:</b> {item.delivery_date || "Not set"}</p>
            </div>

          </>
        )}

      </div>
    </div>
  );
}
