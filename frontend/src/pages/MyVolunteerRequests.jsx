import React, { useEffect, useState } from "react";
import API from "../services/api";
import "../styles/Volunteers.css";

function MyVolunteerRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await API.get("/volunteers/");
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this volunteer request?")) return;

    try {
      await API.delete(`/volunteers/${id}`);
      setRequests((prev) => prev.filter((r) => r.id !== id));
      alert("Volunteer request deleted successfully.");
    } catch (err) {
      console.error(err);
      alert("Error deleting volunteer request.");
    }
  };

  return (
    <div className="volunteer-requests-page">
      <h2 className="page-title">My Volunteer Requests</h2>

      {requests.length === 0 ? (
        <div className="empty-box">
          <p>You haven't submitted any volunteer requests yet.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card">
              <div className="card-header">
                <h3>{request.full_name}</h3>
                <span className={`status-badge ${request.status.toLowerCase()}`}>
                  {request.status}
                </span>
              </div>

              <div className="request-details">
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Phone:</strong> {request.phone}</p>
                <p><strong>Age:</strong> {request.age}</p>
                <p><strong>Occupation:</strong> {request.occupation}</p>
                <p><strong>Availability:</strong> {request.availability}</p>
                <p><strong>Submitted:</strong> {formatDate(request.submitted_at)}</p>
              </div>

              {request.experience && (
                <div className="request-section">
                  <strong>Experience:</strong>
                  <p>{request.experience}</p>
                </div>
              )}

              {request.skills && (
                <div className="request-section">
                  <strong>Skills:</strong>
                  <p>{request.skills}</p>
                </div>
              )}

              <div className="request-section">
                <strong>Motivation:</strong>
                <p>{request.motivation}</p>
              </div>

              {request.admin_reply && (
                <div className="admin-reply">
                  <strong>Admin Reply:</strong>
                  <p>{request.admin_reply}</p>
                </div>
              )}

              <div className="request-actions">
                <button
                  className="delete-btn"
                  onClick={() => deleteRequest(request.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyVolunteerRequests;