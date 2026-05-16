import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("collector");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name) {
      toast.error("Name is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role,
      });

      toast.success(response.data.message || "Account created successfully!");
      navigate("/login");
    } catch (error) {
      const message = error.response?.data?.message || "Signup failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
  const handleLogin = () => {
    navigate("/login");
  };
  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row">
      {/* LEFT SIDE (Illustration) */}
      <div
        className="w-full md:w-1/2 h-64 md:h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundColor: "#22C55E" }}
      >
        <img
          src={img}
          alt="illustration"
          className="w-full h-full md:w-[1020px] object-contain animate-float p-6"
        />
      </div>

      {/* RIGHT SIDE (Form) */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-6 py-10 md:px-12 bg-white">
        {/* Back Button */}
        <div
          className="text-green-600 cursor-pointer mb-4"
          onClick={handleBack}
        >
          <ArrowLeft size={26} />
        </div>

        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-[180px] md:w-[220px]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-center">Join Us</h1>

        <p className="text-center text-gray-500 mb-8">
          Create your account to get started
        </p>

        {/* UserName */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-semibold mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Name"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col mb-4">
          <label className="text-sm font-semibold mb-2">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col mb-6">
          <label className="text-sm font-semibold mb-2 text-gray-700">Create Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 bg-gray-50/50 transition-all"
          />
        </div>

        {/* Role Selection (Improved with Toggle Buttons) */}
        <div className="flex flex-col mb-8">
          <label className="text-sm font-semibold mb-3 text-gray-700">Register As</label>
          <div className="flex p-1 bg-gray-100 rounded-xl gap-1">
            <button
              type="button"
              onClick={() => setRole("collector")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === "collector"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Collector
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                role === "admin"
                  ? "bg-white text-green-600 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Signup Button (Improved) */}
        <div className="flex flex-col items-center">
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full md:w-auto md:min-w-[200px] bg-green-600 hover:bg-green-700 transition-all text-white py-3 px-8 rounded-xl text-md font-bold shadow-lg shadow-green-100 disabled:opacity-50 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Processing...
              </span>
            ) : (
              "SIGN UP"
            )}
          </button>
        </div>

        {/* Login Link */}
        <div className="flex justify-center items-center gap-2 mt-8">
          <p className="text-sm">Already have an account?</p>
          <span
            onClick={handleLogin}
            className="text-green-600 text-sm font-medium cursor-pointer hover:underline"
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
