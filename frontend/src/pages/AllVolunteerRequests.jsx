import React, { useEffect, useState } from "react";
import API from "../services/api";
import PopupModal from "../components/PopupModal"; // ✅ 1. Import custom modal
import "../styles/Volunteers.css";

function AllVolunteerRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminReply, setAdminReply] = useState("");

  // ✅ 2. Add Modal State
  const [modal, setModal] = useState({ isOpen: false, type: "", title: "", message: "", redirect: false });

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      // Immediate redirect for security so non-admins don't see the page flash
      window.location.href = "/dashboard";
      return;
    }
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

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending": return "badge pending";
      case "Approved": return "badge approved";
      case "Rejected": return "badge rejected";
      case "Contacted": return "badge contacted";
      default: return "badge";
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

  const updateStatus = async (requestId, newStatus) => {
    try {
      await API.put(`/volunteers/${requestId}`, {
        status: newStatus,
        admin_reply: adminReply || undefined
      });

      setRequests(prev =>
        prev.map(req =>
          req.id === requestId
            ? { ...req, status: newStatus, admin_reply: adminReply || req.admin_reply }
            : req
        )
      );

      setSelectedRequest(null);
      setAdminReply("");

      // ✅ 3. Trigger Success Modal
      setModal({
        isOpen: true,
        type: "success",
        title: "Status Updated",
        message: `The volunteer request has been ${newStatus.toLowerCase()} successfully!`
      });

    } catch (err) {
      console.error(err);
      // ✅ 4. Trigger Error Modal
      setModal({
        isOpen: true,
        type: "error",
        title: "Update Failed",
        message: "There was an error updating the request status. Please try again."
      });
    }
  };

  const deleteRequest = async (requestId) => {
    // We keep window.confirm here because deleting needs a Yes/No choice!
    if (!window.confirm("Are you sure you want to delete this volunteer request?")) return;

    try {
      await API.delete(`/volunteers/${requestId}`);
      setRequests(prev => prev.filter(req => req.id !== requestId));

      // Optional: Add a success modal for deletion if you want!
      setModal({
        isOpen: true,
        type: "success",
        title: "Request Deleted",
        message: "The volunteer request was successfully removed from the system."
      });

    } catch (err) {
      setModal({
        isOpen: true,
        type: "error",
        title: "Deletion Failed",
        message: "There was an error deleting this request."
      });
    }
  };

  // ✅ 5. Modal Close Handler
  const handleCloseModal = () => {
    setModal({ ...modal, isOpen: false });
  };

  if (localStorage.getItem("role") !== "admin") {
    return null;
  }

  return (
    <div className="volunteer-requests-page">
      <h2 className="page-title">All Volunteer Requests</h2>

      {requests.length === 0 ? (
        <div className="empty-box">
          <p>No volunteer requests found.</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map((request) => (
            <div key={request.id} className="request-card admin-card">
              <div className="card-header">
                <h3>{request.full_name}</h3>
                <div className="status-controls">
                  <span className={`status-badge ${request.status.toLowerCase()}`}>
                    {request.status}
                  </span>
                  <select
                    className="status-dropdown"
                    value={request.status}
                    onChange={(e) => updateStatus(request.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Contacted">Contacted</option>
                  </select>
                </div>
              </div>

              <div className="request-details">
                <p><strong>Email:</strong> {request.email}</p>
                <p><strong>Phone:</strong> {request.phone}</p>
                <p><strong>Age:</strong> {request.age}</p>
                <p><strong>Occupation:</strong> {request.occupation}</p>
                <p><strong>Availability:</strong> {request.availability}</p>
                <p><strong>Submitted:</strong> {formatDate(request.submitted_at)}</p>
              </div>

              <div className="request-section">
                <strong>Address:</strong>
                <p>{request.address}</p>
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

              <div className="admin-actions">
                <button
                  className="reply-btn"
                  onClick={() => setSelectedRequest(selectedRequest === request.id ? null : request.id)}
                >
                  {selectedRequest === request.id ? "Cancel Reply" : "Add Reply"}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => deleteRequest(request.id)}
                >
                  Delete
                </button>
              </div>

              {selectedRequest === request.id && (
                <div className="reply-section">
                  <textarea
                    placeholder="Add a reply or note for this volunteer..."
                    value={adminReply}
                    onChange={(e) => setAdminReply(e.target.value)}
                    rows="3"
                  />
                  <div className="reply-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => updateStatus(request.id, request.status)}
                    >
                      Save Reply
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => {
                        setSelectedRequest(null);
                        setAdminReply("");
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ✅ 6. Render the Modal at the bottom of the page */}
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

export default AllVolunteerRequests;