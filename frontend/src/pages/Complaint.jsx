import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PopupModal from "../components/PopupModal"; // ✅ Import custom modal
import "../styles/Complaints.css";

function Complaint() {
  const [title, setTitle] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // ✅ Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "", redirect: false });

  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setModal({ isOpen: true, type: "error", title: "Invalid File", message: "Please upload an image file (PNG, JPG, JPEG, or GIF)." });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setModal({ isOpen: true, type: "error", title: "File Too Large", message: "Image size must be less than 5MB." });
        return;
      }

      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!title || !contactNumber || !category || !description || !location) {
      setModal({ isOpen: true, type: "error", title: "Missing Information", message: "Please fill out all the fields before submitting." });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("contact_number", contactNumber);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("location", location);

      if (image) {
        formData.append("file", image);
      }

      await API.post("/complaints/", formData);

      setModal({ isOpen: true, type: "success", title: "Complaint Raised", message: "Your issue has been submitted successfully.", redirect: true });
    } catch (err) {
      console.error("Submission error:", err);
      setModal({ isOpen: true, type: "error", title: "Submission Error", message: err.response?.data?.detail || err.message });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.redirect) navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Raise a Complaint</h2>
        <p>Fill in the details about the sanitation issue</p>

        <input
          type="text"
          placeholder="Complaint Title"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="tel"
          maxLength="10"
          placeholder="Contact Number (10 digits)"
          onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))}
        />

        <select onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Garbage Collection Issue">Garbage Collection Issue</option>
          <option value="Drainage Problem">Drainage Problem</option>
          <option value="Street Cleaning">Street Cleaning</option>
          <option value="Dead Animal Removal">Dead Animal Removal</option>
          <option value="Illegal Dumping">Illegal Dumping</option>
          <option value="Other">Other</option>
        </select>

        <textarea
          placeholder="Describe the issue in detail..."
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Location (Area, Landmark, Street)"
          onChange={(e) => setLocation(e.target.value)}
        />

        <div className="file-upload-section">
          <label htmlFor="image-input" className="file-label">
            📸 Upload Image (Optional)
          </label>
          <input
            id="image-input"
            type="file"
            accept="image/png,image/jpg,image/jpeg,image/gif"
            onChange={handleImageChange}
            className="file-input"
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button
                type="button"
                onClick={() => {
                  setImage(null);
                  setImagePreview(null);
                }}
                className="remove-btn"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <button onClick={handleSubmit} className="btn btn-primary">
          Submit Complaint
        </button>
      </div>

      {/* ✅ Render Modal */}
      <PopupModal
        isOpen={modal.isOpen}
        onClose={handleCloseModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
}

export default Complaint;