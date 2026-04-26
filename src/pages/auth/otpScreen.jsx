import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const OtpScreen = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", ""]);

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

  const handleSubmit = () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      alert("Please enter complete OTP");
      return;
    }

    alert("OTP Verified!");
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
          {/* Back Button */}
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
          <h1 className="text-3xl font-bold text-center">OTP Verification</h1>

          <p className="text-center text-gray-500 mb-6">
            Enter the 4-digit code sent to your email
          </p>

          {/* OTP Inputs */}
          <div className="flex justify-center gap-4 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                className="w-14 h-14 text-center text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleSubmit}
            className="bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-full text-lg font-semibold"
          >
            VERIFY OTP
          </button>

          {/* Resend */}
          <div className="text-center mt-4 text-sm">
            Didn't receive code?{" "}
            <span className="text-green-600 cursor-pointer">Resend</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;
