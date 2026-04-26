import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
// import axios from "axios";
import { UploadCloud, Trash2, Download, CheckCircle } from "lucide-react";
import DashboardHeader from "../../../components/DashboardHeader";

const UploadProofs = () => {
  const [proofs, setProofs] = useState([]);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const employeeId = localStorage.getItem("employeeId");
    if (token && employeeId) setUser({ token, employeeId });
  }, []);

  const fetchProofs = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await axios.get("/api/proofs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProofs(res.data || []);
    } catch {
      toast.error("Failed to fetch proofs");
    }
  };

  useEffect(() => {
    if (user) fetchProofs();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select an image file");

    const token = localStorage.getItem("accessToken");
    const employeeId = localStorage.getItem("employeeId");

    // Restrict to images
    if (!file.type.startsWith("image/")) {
      return toast.error("Only image files allowed");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("remarks", remarks);
    formData.append("employee", employeeId);

    try {
      setLoading(true);
      await axios.post("/api/proofs/upload", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Image proof uploaded");
      setFile(null);
      setRemarks("");
      fetchProofs();
    } catch {
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.delete(`/api/proofs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Deleted");
    fetchProofs();
  };

  const handleVerify = async (id) => {
    const token = localStorage.getItem("accessToken");
    await axios.patch(`/api/proofs/verify/${id}`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Marked as Verified");
    fetchProofs();
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <DashboardHeader
        title="Upload Image Proof"
        subtitle="Submit photographic evidence of waste collection for verification"
      />

      <div className="space-y-6">

        {/* UPLOAD FORM */}
        <form
          onSubmit={handleUpload}
          className="bg-white p-6 rounded-2xl shadow-md space-y-4 border"
        >
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-800">
            <UploadCloud /> Upload New Proof
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Remarks (optional)"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#80A615]"
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="border px-3 py-2 rounded-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition"
          >
            {loading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        {/* IMAGE PROOFS GRID */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="text-xl font-bold mb-4"> Submitted Proofs</h3>

          {proofs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {proofs.map((proof) => (
                <div
                  key={proof._id}
                  className="bg-gray-50 border rounded-xl p-4 hover:shadow-lg transition"
                >
                  <img
                    src={proof.fileUrl}
                    alt={proof.remarks || "Proof image"}
                    className="rounded-lg w-full h-48 object-cover mb-3"
                  />
                  <p className="text-gray-700 mb-2">{proof.remarks}</p>
                  <p className={`text-sm font-semibold ${proof.verified ? "text-green-600" : "text-gray-500"}`}>
                    {proof.verified ? "✔ Verified" : "Pending Verification"}
                  </p>

                  <div className="flex gap-2 mt-4">
                    {!proof.verified && (
                      <button
                        onClick={() => handleVerify(proof._id)}
                        className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-md text-sm"
                      >
                        <CheckCircle size={16} /> Verify
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(proof._id)}
                      className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No image proofs uploaded yet</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default UploadProofs;
