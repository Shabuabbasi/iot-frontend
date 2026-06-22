import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/forgot-password`, { email });
      toast.success("OTP sent successfully to your email");
      navigate("/otp-Screen", { state: { email } });
    } catch (error) {
      const message = error.response?.data?.message || "Failed to send OTP. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex p-0 m-0">
      <div className="flex flex-col md:flex-row w-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">

        {/* LEFT SIDE — hidden on mobile */}
        <div
          className="hidden md:flex w-1/2 items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#22C55E" }}
        >
          <img
            src={img}
            alt="illustration"
            className="w-[1020px] object-contain animate-float"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-6 sm:px-10 md:px-12 py-10">
          {/* Back */}
          <div
            className="text-green-600 cursor-pointer mb-4"
            onClick={handleBack}
          >
            <ArrowLeft size={26} />
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-[160px] sm:w-[200px] mb-[-20px]" />
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4">Forgot Password</h1>

          <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
            Enter your email to receive password reset link
          </p>

          {/* Email */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-6">
              <label className="text-sm font-semibold mb-2">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`transition text-white py-3 rounded-full text-base sm:text-lg font-semibold w-full ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? "SENDING..." : "SEND RESET LINK"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
