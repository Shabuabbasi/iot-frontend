import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import logo from "../../assets/auth/Login_Logo.png";
import img from "../../assets/auth/Right_Img.png";
import "../../style/auth.css";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validate = () => {
    if (!name) {
      toast.error("Name is required");
      return false;
    }
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    if (validate()) {
      toast.success("Account created successfully!");
      navigate("/login");
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
        <div className="flex flex-col mb-8">
          <label className="text-sm font-semibold mb-2">Create Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="border border-gray-300 rounded-full px-4 py-3 outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        {/* Signup Button */}
        <button
          onClick={handleSignup}
          className="bg-green-600 hover:bg-green-700 transition text-white py-3.5 rounded-2xl text-lg font-bold shadow-lg shadow-green-100"
        >
          SIGN UP
        </button>

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
