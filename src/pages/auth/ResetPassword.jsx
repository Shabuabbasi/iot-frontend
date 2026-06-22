import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  const handleBack = () => {
    navigate("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!email || !otp) {
      toast.error("Session expired. Please start over.");
      navigate("/forget");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, { 
        email,
        otp,
        newPassword
      });
      toast.success("Password reset successful! You can now login.");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to reset password. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
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
          <h1 className="text-3xl font-bold text-center">Reset Password</h1>

          <p className="text-center text-gray-500 mb-6">
            Enter your new password below
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="text-sm font-semibold mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>
            
            <div className="flex flex-col mb-6">
              <label className="text-sm font-semibold mb-2">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className={`transition text-white py-3 rounded-full text-lg font-semibold w-full ${loading ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
            >
              {loading ? "RESETTING..." : "RESET PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
