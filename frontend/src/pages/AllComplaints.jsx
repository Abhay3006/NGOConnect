import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import "../styles/Complaints.css";

function AllComplaints() {
  const [complaints, setComplaints] = useState([]);
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role !== "admin") {
      alert("Access denied. Admin privileges required.");
      window.location.href = "/dashboard";
      return;
    }
    fetchComplaints();
  }, [role]);

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/");
      setComplaints(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusClass = (status) => {
    if (status === "Pending") return "badge pending";
    if (status === "Resolved") return "badge resolved";
    if (status === "In Progress") return "badge progress";
    return "badge";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return;

    try {
      await API.delete(`/complaints/${id}`);
      setComplaints(complaints.filter((c) => c.id !== id));
    } catch (err) {
      alert("Error deleting complaint");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/complaints/${id}/status?status=${newStatus}`);

      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: newStatus } : c
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  if (role !== "admin") {
    return null; // Don't render anything if not admin
  }

  return (
    <div className="complaints-page">
      <h2 className="page-title">All Complaints</h2>

      {complaints.length === 0 ? (
        <div className="empty-box">
          <p>No complaints found.</p>
        </div>
      ) : (
        <div className="complaint-grid">
          {complaints.map((c) => (
            <div key={c.id} className="complaint-card">

              <div className="card-header">
                <h3>{c.title}</h3>
                <span className={`status-badge ${c.status.toLowerCase()}`}>
                  {c.status}
                </span>

                <select
                  className="status-dropdown"
                  value={c.status}
                  onChange={(e) => updateStatus(c.id, e.target.value)}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <p className="category">
                <strong>Category:</strong> {c.category}
              </p>

              <p className="reporter">
                <strong>Reported by:</strong> {c.user_name} ({c.user_email})
              </p>

              <p className="location">
                📍 {c.location}
              </p>

              <p className="contact">
                📞 {c.contact_number}
              </p>

              <p className="description">
                {c.description}
              </p>

              {c.image_filename && (
                <div className="image-display">
                  <strong>📸 Attached Image:</strong>
                  <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/complaints/${c.image_filename}`}
                    alt="Complaint"
                    className="complaint-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              <button
                className="delete-btn"
                onClick={() => handleDelete(c.id)}
              >
                Delete
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AllComplaints;
