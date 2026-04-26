import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const handleBack = () => {
    navigate("/login");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    // Here normally you would call API to send OTP
    // After success navigate to OTP screen
    navigate("/otp-screen");
  };
  const handleForgot = () => {
    navigate("/forget");
  };

  return (
    <div className="h-screen w-full bg-white flex p-0 m-0">
      <div className="flex w-full bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
        {/* LEFT SIDE */}
        <div
          className="w-1/2 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: "#22C55E" }}
        >
          <img
            src={img}
            alt="illustration"
            className="w-[1020px] object-contain animate-float"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="w-1/2 flex flex-col justify-center md:px-12">
          {/* Back */}
          <div
            className="text-green-600 cursor-pointer mt-4"
            onClick={handleBack}
          >
            <ArrowLeft size={26} />
          </div>

          {/* Logo */}
          <div className="flex justify-center">
            <img src={logo} alt="logo" className="w-[220px] mb-[-30px]" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center">Forgot Password</h1>

          <p className="text-center text-gray-500 mb-6">
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
                className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-full text-lg font-semibold w-full"
            >
              SEND RESET LINK
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
