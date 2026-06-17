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
  dob: "",
  education: "",
  department: "",
  position: "",
  experience: "",
  address: "",
  profilePic: "",
};

const profileFields = [
  { name: "name", label: "Full Name", type: "text", section: "personal" },
  { name: "dob", label: "Date of Birth", type: "date", section: "personal" },
  { name: "education", label: "Education", type: "text", section: "personal" },
  { name: "department", label: "Department", type: "text", section: "job" },
  { name: "position", label: "Position", type: "text", section: "job" },
  { name: "experience", label: "Experience", type: "number", section: "job" },
  { name: "email", label: "Email", type: "email", section: "contact" },
  { name: "phone", label: "Phone", type: "tel", section: "contact" },
  { name: "address", label: "Address", type: "text", section: "contact" },
];

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

const Profile = () => {
  const [user, setUser] = useState({ ...emptyProfile, ...getStoredUser() });
  const [formData, setFormData] = useState({ ...emptyProfile, ...getStoredUser() });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const imageSrc = useMemo(
    () => previewImage || getImageUrl(user.profilePic),
    [previewImage, user.profilePic]
  );

  const initials = useMemo(() => {
    const source = formData.name || user.name || "User";
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

  const handleProfileChange = (e) => {
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

  const handleEdit = () => {
    setFormData(user);
    setPreviewImage("");
    setSelectedImage(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(user);
    setPreviewImage("");
    setSelectedImage(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login again");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    const payload = new FormData();
    profileFields.forEach((field) => {
      payload.append(field.name, formData[field.name] || "");
    });

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

  const renderFields = (section) =>
    profileFields
      .filter((field) => field.section === section)
      .map((field) => (
        <ProfileField
          key={field.name}
          field={field}
          value={formData[field.name]}
          displayValue={formatDisplayValue(field, user[field.name])}
          isEditing={isEditing}
          onChange={handleInputChange}
        />
      ));

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader
        title="User Profile"
        subtitle="Manage your personal information and account settings"
      />

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-6">
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
              htmlFor="profilePic"
              className="absolute bottom-0 right-0 bg-green-500 text-white p-2 rounded-full cursor-pointer shadow hover:bg-green-600 transition"
              title="Change profile image"
            >
              <Camera size={16} />
            </label>

            <input
              type="file"
              id="profilePic"
              name="profilePic"
              accept="image/*"
              className="hidden"
              onChange={handleProfileChange}
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-black">
              {loading ? "Loading..." : user.name || "Collector"}
            </h1>
            <p className="text-gray-600">{user.email || "No email added"}</p>
            <p className="text-gray-600">{user.phone || "No phone added"}</p>
          </div>
        </div>

        <div className="flex gap-3">
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
              onClick={handleEdit}
              disabled={loading}
              className="px-5 py-2 rounded-full font-semibold text-white bg-green-500 hover:bg-green-600 shadow transition disabled:opacity-60 flex items-center gap-2"
            >
              <Pencil size={16} />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <ProfileSection title="Personal Information">
          {renderFields("personal")}
        </ProfileSection>

        <ProfileSection title="Job Details">
          {renderFields("job")}
        </ProfileSection>
      </div>

      <ProfileSection title="Contact Information">
        {renderFields("contact")}
      </ProfileSection>
    </div>
  );
};

const formatDisplayValue = (field, value) => {
  if (!value) return "Not added";
  if (field.name === "experience") return `${value} Years`;
  return value;
};

const ProfileSection = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const ProfileField = ({ field, value, displayValue, isEditing, onChange }) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-3">
    <label htmlFor={field.name} className="text-gray-500">
      {field.label}
    </label>
    {isEditing ? (
      <input
        id={field.name}
        name={field.name}
        type={field.type}
        value={value || ""}
        onChange={onChange}
        className="w-full sm:w-64 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-green-400"
      />
    ) : (
      <span className="font-medium text-black sm:text-right">{displayValue}</span>
    )}
  </div>
);

export default Profile;
