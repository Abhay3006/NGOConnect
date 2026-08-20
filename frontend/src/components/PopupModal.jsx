import React from "react";
import "../styles/Modal.css";

function PopupModal({ isOpen, onClose, type, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box animate-scale-in">
        <div className={`modal-icon ${type}`}>
          {type === "success" ? (
            /* Checkmark Icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
          ) : (
            /* X Icon */
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          )}
        </div>
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="btn btn-primary full-btn" onClick={onClose}>
          Got it
        </button>
      </div>
    </div>
  );
}

export default PopupModal;