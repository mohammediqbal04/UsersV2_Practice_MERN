import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { toast } from "react-toastify";
import { getUserAxios, putUserAxios } from "../helper/axiosInstense";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const View = () => {
  const { id } = useParams();
  const [viewUser, setViewUser] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    age: "",
    city: "",
    gender: "",
    pincode: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const handleAddOpen = () => {
    if (viewUser) {
      setUserData({
        name: viewUser.name || "",
        age: viewUser.age || "",
        city: viewUser.city || "",
        gender: viewUser.gender || "",
        pincode: viewUser.pincode || "",
      });
    }
    setAddOpen(true);
  };
  const handleAddClose = () => setAddOpen(false);
  const handleImageOpen = () => setImageOpen(true);
  const handleImageClose = () => setImageOpen(false);

  const getUser = async () => {
    try {
      const res = await getUserAxios(`users/${id}`);
      setViewUser(res);
    } catch (err) {
      console.log("Error fetching user:", err);
      if (err.response?.status === 403) {
        toast.error("Session expired, please login again");
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await putUserAxios(`users/${id}`, userData);
      toast.success("User updated successfully");
      setAddOpen(false);
      getUser();
    } catch (err) {
      toast.error("Error updating user");
      console.error(err);
    }
  };

  // ✅ Upload Image Handler
  const handleImageUpload = async () => {
    if (!selectedFile) {
      toast.warn("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.put(`http://localhost:3000/users/${id}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success("Image uploaded successfully");
      setImageOpen(false);
      getUser();
    } catch (err) {
      toast.error("Failed to upload image");
      console.error(err);
    }
  };

  if (!viewUser) return <div>Loading user details...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Details</h2>

      <img
        src={
          viewUser.image
            ? `http://localhost:3000/${viewUser.image}`
            : ""
        }
        alt="User"
        width="150"
        style={{ borderRadius: "8px", marginBottom: "10px" }}
      />

      <p><strong>Name:</strong> {viewUser.name}</p>
      <p><strong>Age:</strong> {viewUser.age}</p>
      <p><strong>City:</strong> {viewUser.city}</p>
      <p><strong>Gender:</strong> {viewUser.gender || "—"}</p>
      <p><strong>Pincode:</strong> {viewUser.pincode || "—"}</p>

      <button
        onClick={() => navigate("/userdetail")}
        className="border bg-black text-white p-2 w-50 mr-10 cursor-pointer"
      >
        Back to User List
      </button>

      <button
        className="border bg-black text-white p-2 w-50 mr-10 cursor-pointer"
        onClick={handleAddOpen}
      >
        Edit Fields
      </button>

      <button
        className="border bg-blue-600 text-white p-2 w-50 cursor-pointer"
        onClick={handleImageOpen}
      >
        Upload Image
      </button>

      {/* Edit Modal */}
      <Modal open={addOpen} onClose={handleAddClose}>
        <Box sx={style}>
          <Typography variant="h6">Edit User</Typography>
          <div className="space-y-3">
            <input value={userData.name} type="text" id="name" onChange={handleChange} placeholder="Name" className="border p-2 w-full" />
            <input value={userData.age} type="number" id="age" onChange={handleChange} placeholder="Age" className="border p-2 w-full" />
            <input value={userData.city} type="text" id="city" onChange={handleChange} placeholder="City" className="border p-2 w-full" />
            <input value={userData.gender} type="text" id="gender" onChange={handleChange} placeholder="Gender" className="border p-2 w-full" />
            <input value={userData.pincode} type="number" id="pincode" onChange={handleChange} placeholder="Pincode" className="border p-2 w-full" />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="border p-2 w-full mt-3"
            />
            <div className="gap-5">
              <Button onClick={handleSubmit} variant="contained">Submit</Button>
              <Button onClick={handleImageUpload} variant="contained">Upload</Button>
            </div>
          </div>
        </Box>
      </Modal>

      {/* Image Upload Modal */}
      <Modal open={imageOpen} onClose={handleImageClose}>
        <Box sx={style}>
          <Typography variant="h6">Upload User Image</Typography>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files[0])}
            className="border p-2 w-full mt-3"
          />
          <Button variant="contained" onClick={handleImageUpload} sx={{ mt: 2 }}>
            Upload
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default View;
