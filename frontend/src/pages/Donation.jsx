import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import PopupModal from "../components/PopupModal"; // ✅ 1. Import our custom modal
import "../styles/Donations.css";

function Donation() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [location, setLocation] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  // ✅ 2. Set up the Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "", redirect: false });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  useEffect(() => {
    if (category !== "Money") {
      setAmount("");
      setIsPaid(false);
    }
  }, [category]);

  const handlePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setModal({ isOpen: true, type: "error", title: "Hold on", message: "Please enter a valid amount." });
      return;
    }

    try {
      const order = await API.post("/donations/create-order", { amount: parseFloat(amount) });
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.data.amount,
        currency: "INR",
        name: "NGOConnect",
        description: "Donation Payment",
        order_id: order.data.id,
        handler: function () {
          setModal({ isOpen: true, type: "success", title: "Payment Successful", message: "Thank you for your generosity!" });
          setIsPaid(true);
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setModal({ isOpen: true, type: "error", title: "Payment Failed", message: "Something went wrong with the gateway." });
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !category || !contactNumber) {
      setModal({ isOpen: true, type: "error", title: "Missing Info", message: "Please fill out all required fields." });
      return;
    }

    if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
      setModal({ isOpen: true, type: "error", title: "Invalid Number", message: "Contact number must be exactly 10 digits." });
      return;
    }

    if (category === "Money" && !isPaid) {
      setModal({ isOpen: true, type: "error", title: "Payment Required", message: "Please complete the payment before submitting." });
      return;
    }

    try {
      const donationData = {
        title, description, category,
        amount: category === "Money" ? parseFloat(amount) : null,
        contact_number: contactNumber,
        location: location || null,
      };

      await API.post("/donations/", donationData);

      // ✅ 3. Trigger Success Modal and tell it to redirect when closed
      setModal({
        isOpen: true,
        type: "success",
        title: "Donation Submitted!",
        message: "Thank you for making a difference today.",
        redirect: true
      });

    } catch (err) {
      setModal({ isOpen: true, type: "error", title: "Submission Error", message: err.response?.data?.detail || err.message });
    }
  };

  // ✅ 4. Handle Modal Close Action
  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
    if (modal.redirect) navigate("/dashboard");
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Make a Donation</h2>

        <input type="text" placeholder="Donation Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />

        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Clothes">Clothes</option>
          <option value="Money">Money</option>
          <option value="Medical Supplies">Medical Supplies</option>
          <option value="Educational Materials">Educational Materials</option>
          <option value="Other">Other</option>
        </select>

        {category === "Money" && (
          <div style={{ marginBottom: "20px" }}>
            <input type="number" placeholder="Enter Amount (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} style={{ marginBottom: "15px" }} />
            <button type="button" onClick={handlePayment} className="btn btn-secondary">Pay Now</button>
            {isPaid && <p style={{ color: "green", marginTop: "10px", marginBottom: "0" }}>✅ Payment Completed</p>}
          </div>
        )}

        <input type="tel" maxLength="10" placeholder="Contact Number" value={contactNumber} onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, ""))} />
        <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />

        <button onClick={handleSubmit} className="btn btn-primary">Submit Donation</button>
      </div>

      {/* ✅ 5. Render the Modal */}
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

export default Donation;