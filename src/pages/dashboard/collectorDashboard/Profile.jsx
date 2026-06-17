import React, { useState } from "react";
import DashboardHeader from "../../../components/DashboardHeader";

const Profile = () => {
  const [user, setUser] = useState({
    Name: "Salahudin Abbasi",
    Email: "salahudinabbasi733@gmail.com",
    Phone: "03438840285",
    Dob: "11-05-2003",
    Education: "Bachelor",
    Department: "Software Engineering",
    Position: "Full Stack Developer",
    Experience: "2 Years",
    Address: "Rawalpindi, Pakistan",
    ProfilePic: null,
  });

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUser((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader
        title="User Profile"
        subtitle="Manage your personal information and account settings"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-6">

        {/* LEFT */}
        <div className="flex items-center gap-5">

          {/* Profile Image */}
          <div className="relative">
            <img
              src={
                user.profilePic
                  ? user.profilePic
                  : "https://via.placeholder.com/100"
              }
              alt="profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
            />

            {/* Upload */}
            <label
              htmlFor="upload"
              className="absolute bottom-0 right-0 bg-green-500 text-black p-2 rounded-full cursor-pointer shadow"
            >
              ✎
            </label>

            <input
              type="file"
              id="upload"
              className="hidden"
              onChange={handleProfileChange}
            />
          </div>

          {/* USER INFO */}
          <div>
            <h1 className="text-2xl font-bold text-black">{user.name}</h1>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
          </div>
        </div>

        {/* EDIT BUTTON */}
        <button className="px-5 py-2 rounded-full font-semibold text-white bg-green-500 shadow"
        >
          Edit Profile
        </button>

      </div>

      {/* INFO GRID */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">

        {/* PERSONAL INFO */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Personal Information</h2>

          </div>

          <div className="space-y-3">
            <Info label="Full Name" value={user.name} />
            <Info label="Date of Birth" value={user.dob} />
            <Info label="Education" value={user.education} />
          </div>
        </div>

        {/* JOB DETAILS */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Job Details</h2>

          </div>

          <div className="space-y-3">
            <Info label="Department" value={user.department} />
            <Info label="Position" value={user.position} />
            <Info label="Experience" value={user.experience + " Years"} />
          </div>
        </div>

      </div>

      {/* CONTACT INFO */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Contact Information</h2>

        </div>

        <div className="space-y-3">
          <Info label="Phone" value={user.phone} />
          <Info label="Address" value={user.address} />
        </div>
      </div>

    </div>
  );
};

/* Reusable Component */
const Info = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-black">{value}</span>
  </div>
);

export default Profile;