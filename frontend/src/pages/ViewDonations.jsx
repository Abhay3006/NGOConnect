import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Donations.css";

function ViewDonations() {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await API.get("/donations/");
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/donations/${id}/status?status=${newStatus}`);

      setDonations((prev) =>
        prev.map((d) =>
          d.id === id ? { ...d, status: newStatus } : d
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  const deleteDonation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this donation request?")) return;

    try {
      await API.delete(`/donations/${id}`);
      setDonations((prev) => prev.filter((d) => d.id !== id));
      alert("Donation deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Error deleting donation.");
    }
  };

  return (
    <div className="donations-page">
      <h2 className="page-title">My Donations</h2>

      {donations.length === 0 ? (
        <div className="empty-box">
          <p>You haven't made any donations yet.</p>
        </div>
      ) : (
        <div className="donation-grid">
          {donations.map((d) => (
            <div key={d.id} className="donation-card">

              <div className="card-header">
                <h3>{d.title}</h3>
                <span className={`status-badge ${d.status.toLowerCase()}`}>
                  {d.status}
                </span>

                {localStorage.getItem("role") === "admin" && (
                  <select
                    className="status-dropdown"
                    value={d.status}
                    onChange={(e) => updateStatus(d.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                )}

                <button
                  className="delete-btn"
                  onClick={() => deleteDonation(d.id)}
                >
                  Delete
                </button>
              </div>

              <p className="category">
                <strong>Category:</strong> {d.category}
              </p>

              {d.amount && (
                <p className="amount">
                  <strong>Amount:</strong> ₹{d.amount}
                </p>
              )}

              {localStorage.getItem("role") === "admin" && (
                <p className="donor">
                  <strong>Donated by:</strong> {d.user_name} ({d.user_email})
                </p>
              )}

              {d.location && (
                <p className="location">
                  📍 {d.location}
                </p>
              )}

              <p className="contact">
                📞 {d.contact_number}
              </p>

              <p className="description">
                {d.description}
              </p>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewDonations;