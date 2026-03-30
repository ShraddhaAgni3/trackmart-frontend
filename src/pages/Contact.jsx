import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  User,
  Send,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ContactPage = () => {

  const navigate = useNavigate();

  // ✅ STATE FIX
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
  }, []);

  // ✅ AUTO FILL (logged-in user)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }));
    }
  }, []);

  const goBack = () => {
    navigate(-1);
  };

  const contactInfo = [
    {
      icon: <User className="w-6 h-6" />,
      label: "Name",
      value: "Yeshwant Maheshram",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      textColor: "text-blue-600 dark:text-blue-400"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      label: "Phone",
      value: "+91 78986 22813",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      textColor: "text-green-600 dark:text-green-400"
    },
    {
      icon: <Mail className="w-6 h-6" />,
      label: "Email",
      value: "it.trackintake@gmail.com",
      bgColor: "bg-amber-100 dark:bg-amber-900/20",
      textColor: "text-amber-600 dark:text-amber-400"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: "Address",
      value: "1-Snehalata ganj Indore,Madhya Pradesh",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      textColor: "text-purple-600 dark:text-purple-400"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: "Working Hours",
      value: "Mon - Sat, 10:00 AM - 7:00 PM",
      bgColor: "bg-red-100 dark:bg-red-900/20",
      textColor: "text-red-600 dark:text-red-400"
    }
  ];

  // ✅ SUBMIT FIX
  const handleSubmit = async (e) => {
    e.preventDefault();

    // validation
    if (!form.name || !form.email || !form.message) {
      alert("Please fill required fields");
      return;
    }

    try {
      await axios.post(
        "https://trackmart-backend.onrender.com/api/contact",
        form
      );

      alert("Message sent successfully!");

      setForm({
        name: "",
        email: "",
        phone: "",
        message: ""
      });

    } catch (err) {
      alert("Error sending message");
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-page)] py-8 md:py-16 px-4 sm:px-6 lg:px-8">

      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-4 md:mb-6">
        <button
          onClick={goBack}
          className="flex items-center gap-2 text-[var(--color-text-default)] hover:text-[var(--color-primary)] transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>
      </div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 md:mb-12"
      >
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
          <span className="text-[var(--color-primary)]">Contact</span>
          <span className="text-[var(--color-text-strong)]"> Us</span>
        </h1>
        <p className="text-[var(--color-text-default)] max-w-2xl mx-auto">
          Get in touch with us for any queries or support.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto">

        {/* FORM */}
        <div className="bg-[var(--color-bg-surface)] p-6 md:p-8 rounded-2xl border-2">

          <h2 className="text-2xl font-bold mb-6">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <input
              type="text"
              value={form.name}
              onChange={(e)=>setForm({...form,name:e.target.value})}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Email */}
            <input
              type="email"
              value={form.email}
              onChange={(e)=>setForm({...form,email:e.target.value})}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Phone */}
            <input
              type="tel"
              value={form.phone}
              onChange={(e)=>setForm({...form,phone:e.target.value})}
              placeholder="Enter phone"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Message */}
            <textarea
              rows="4"
              value={form.message}
              onChange={(e)=>setForm({...form,message:e.target.value})}
              placeholder="Message"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Button */}
            <button className="w-full bg-primary text-white py-3 rounded-xl flex justify-center gap-2">
              <Send className="w-5 h-5" />
              Send Message
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
