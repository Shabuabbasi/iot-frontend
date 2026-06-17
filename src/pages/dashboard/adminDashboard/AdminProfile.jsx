import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Camera, Pencil, Save, X } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";

const API_URL = import.meta.env.VITE_API_URL;

const emptyProfile = {
  name: "",
  email: "",
  phone: "",
  address: "",
  role: "admin",
  profilePic: "",
};

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    return {};
  }
};

const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("data:") || path.startsWith("http")) return path;
  return `${API_URL}${path}`;
};

const AdminProfile = () => {
  const [user, setUser] = useState({ ...emptyProfile, ...getStoredUser() });
  const [formData, setFormData] = useState({ ...emptyProfile, ...getStoredUser() });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const imageSrc = previewImage || getImageUrl(user.profilePic);

  const initials = useMemo(() => {
    const source = formData.name || user.name || "Admin";
    return source
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [formData.name, user.name]);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const profile = { ...emptyProfile, ...response.data.user };
        setUser(profile);
        setFormData(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (error) {
        const message = error.response?.data?.message || "Could not load profile";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setSelectedImage(file);
    setPreviewImage(URL.createObjectURL(file));
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setSelectedImage(null);
    setPreviewImage("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Name and email are required");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone || "");
    payload.append("address", formData.address || "");

    if (selectedImage) {
      payload.append("profilePic", selectedImage);
    }

    setSaving(true);
    try {
      const response = await axios.put(`${API_URL}/api/users/me`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = { ...emptyProfile, ...response.data.user };
      setUser(updatedUser);
      setFormData(updatedUser);
      setSelectedImage(null);
      setPreviewImage("");
      setIsEditing(false);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("user-updated"));
      toast.success("Profile updated successfully");
    } catch (error) {
      const message = error.response?.data?.message || "Profile update failed";
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader
        title="Admin Profile"
        subtitle="Manage your admin account details"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <div className="relative">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-green-500"
              />
            ) : (
              <div className="w-24 h-24 rounded-full border-4 border-green-500 bg-green-100 text-green-700 flex items-center justify-center text-2xl font-bold">
                {initials}
              </div>
            )}

            <label
              htmlFor="adminProfilePic"
              className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer shadow hover:bg-green-600 transition"
              title="Change profile image"
            >
              <Camera size={16} />
            </label>
            <input
              id="adminProfilePic"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? "Loading..." : user.name || "Admin"}
            </h2>
            <p className="text-gray-600">{user.email || "No email added"}</p>
            <p className="text-sm font-semibold text-green-600 uppercase mt-1">
              {user.role || "admin"}
            </p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={handleCancel}
                disabled={saving}
                className="px-4 py-2 rounded-full font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition disabled:opacity-60 flex items-center gap-2"
              >
                <X size={16} />
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="px-5 py-2 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 shadow transition disabled:opacity-60 flex items-center gap-2"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              disabled={loading}
              className="px-5 py-2 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 shadow transition disabled:opacity-60 flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>
        <div className="space-y-3">
          <ProfileField label="Full Name" name="name" value={formData.name} isEditing={isEditing} onChange={handleInputChange} />
          <ProfileField label="Email" name="email" type="email" value={formData.email} isEditing={isEditing} onChange={handleInputChange} />
          <ProfileField label="Phone" name="phone" type="tel" value={formData.phone} isEditing={isEditing} onChange={handleInputChange} />
          <ProfileField label="Address" name="address" value={formData.address} isEditing={isEditing} onChange={handleInputChange} />
        </div>
      </div>
    </div>
  );
};

const ProfileField = ({ label, name, type = "text", value, isEditing, onChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3">
    <label htmlFor={name} className="text-gray-500">
      {label}
    </label>
    {isEditing ? (
      <input
        id={name}
        name={name}
        type={type}
        value={value || ""}
        onChange={onChange}
        className="w-full sm:w-80 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
      />
    ) : (
      <span className="font-medium text-black sm:text-right">{value || "Not added"}</span>
    )}
  </div>
);

export default AdminProfile;
