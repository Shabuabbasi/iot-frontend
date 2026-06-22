import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const OtpScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || "";

  const handleBack = () => {
    navigate("/login");
  };

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      toast.error("Please enter complete OTP");
      return;
    }

    if (!email) {
      toast.error("Session expired. Please try again.");
      navigate("/forget");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/verify-otp`, {
        email,
        otp: enteredOtp
      });
      toast.success("OTP Verified!");
      navigate("/reset-password", { state: { email, otp: enteredOtp } });
    } catch (error) {
      const message = error.response?.data?.message || "Invalid OTP. Please try again.";
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
          {/* Back Button */}
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
          <h1 className="text-2xl sm:text-3xl font-bold text-center mt-4">OTP Verification</h1>

          <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
            Enter the 4-digit code sent to your email
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-3 sm:gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              />
            ))}
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`transition text-white py-3 rounded-full text-base sm:text-lg font-semibold w-full ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
          >
            {loading ? "VERIFYING..." : "VERIFY OTP"}
          </button>

          {/* Resend */}
          <div className="text-center mt-4 text-sm">
            Didn't receive code?{" "}
            <span
              className="text-green-600 cursor-pointer font-semibold"
              onClick={() => navigate("/forget")}
            >
              Resend
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
