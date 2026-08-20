import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PopupModal from "../components/PopupModal"; // ✅ Import custom modal
import "../styles/Volunteers.css";

function VolunteerRequest() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
    age: "",
    occupation: "",
    experience: "",
    availability: "",
    skills: "",
    motivation: ""
  });

  // ✅ Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "", redirect: false });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    // Validation
    const requiredFields = ['full_name', 'email', 'phone', 'address', 'age', 'occupation', 'availability', 'motivation'];
    const missingFields = requiredFields.filter(field => !formData[field].trim());

    if (missingFields.length > 0) {
      setModal({ isOpen: true, type: "error", title: "Missing Information", message: `Please fill out all required fields.` });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setModal({ isOpen: true, type: "error", title: "Invalid Email", message: "Please enter a valid email address." });
      return;
    }

    if (formData.phone.length !== 10 || !/^\d+$/.test(formData.phone)) {
      setModal({ isOpen: true, type: "error", title: "Invalid Phone", message: "Phone number must be exactly 10 digits." });
      return;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 18 || age > 80) {
      setModal({ isOpen: true, type: "error", title: "Invalid Age", message: "Age must be between 18 and 80." });
      return;
    }

    if (formData.motivation.length < 20) {
      setModal({ isOpen: true, type: "error", title: "Detail Required", message: "Please provide a more detailed motivation (at least 20 characters)." });
      return;
    }

    try {
      const submitData = {
        ...formData,
        age: age
      };

      await API.post("/volunteers/", submitData);

      setModal({
        isOpen: true,
        type: "success",
        title: "Application Received",
        message: "Your volunteer request was submitted successfully! We will review your application and reach out to you soon.",
        redirect: true
      });
    } catch (err) {
      console.error("Submission error:", err);
      const errorMessage = err.response?.data?.detail || err.message;
      setModal({ isOpen: true, type: "error", title: "Submission Error", message: errorMessage });
    }
  };

  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.redirect) navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <div className="form-card volunteer-form">
        <h2>Volunteer Request Form</h2>
        <p>Join our community service initiative. Help make a difference!</p>

        <div className="form-row">
          <div className="form-group">
            <input
              type="text"
              name="full_name"
              placeholder="Full Name *"
              value={formData.full_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address *"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              maxLength="10"
              placeholder="Phone Number (10 digits) *"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="age"
              placeholder="Age *"
              min="18"
              max="80"
              value={formData.age}
              onChange={handleChange}
            />
          </div>
        </div>

        <input
          type="text"
          name="occupation"
          placeholder="Occupation/Profession *"
          value={formData.occupation}
          onChange={handleChange}
        />

        <select name="availability" value={formData.availability} onChange={handleChange}>
          <option value="">Select Availability *</option>
          <option value="Weekdays">Weekdays</option>
          <option value="Weekends">Weekends</option>
          <option value="Evenings">Evenings</option>
          <option value="Full-time">Full-time</option>
          <option value="Flexible">Flexible</option>
        </select>

        <textarea
          name="address"
          placeholder="Complete Address *"
          value={formData.address}
          onChange={handleChange}
        />

        <textarea
          name="experience"
          placeholder="Previous Volunteer/Community Service Experience (Optional)"
          value={formData.experience}
          onChange={handleChange}
        />

        <textarea
          name="skills"
          placeholder="Skills you can offer (e.g., teaching, medical, technical, etc.) (Optional)"
          value={formData.skills}
          onChange={handleChange}
        />

        <textarea
          name="motivation"
          placeholder="Why do you want to volunteer? What motivates you to help the community? *"
          value={formData.motivation}
          onChange={handleChange}
        />

        <button onClick={handleSubmit} className="btn btn-primary">
          Submit Volunteer Request
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

export default VolunteerRequest;