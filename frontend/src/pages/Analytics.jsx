import React, { useEffect, useState } from "react";
import API from "../services/api";
import { Pie, Bar, Line } from "react-chartjs-2";
import "../styles/Analytics.css";

import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

function Analytics() {
  const [complaints, setComplaints] = useState(null);
  const [donations, setDonations] = useState(null);
  const [volunteers, setVolunteers] = useState(null);
  const [tab, setTab] = useState("complaints");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const c = await API.get("/analytics/complaints");
      const d = await API.get("/analytics/donations");
      const v = await API.get("/analytics/volunteers");

      setComplaints(c.data);
      setDonations(d.data);
      setVolunteers(v.data);
    } catch (err) {
      console.error("Access denied or fetch error:", err);
    }
  };

  // Prevent Cumulative Layout Shift (CLS) by retaining a minimum height while loading
  if (!complaints || !donations || !volunteers) {
    return (
      <div className="analytics-dashboard loading-container">
        <p>Loading analytics data...</p>
      </div>
    );
  }

  // ================= CHART DATA =================

  // A clean, vibrant palette suitable for dashboards
  const palette = [
    "rgba(59, 130, 246, 0.8)", // Blue
    "rgba(16, 185, 129, 0.8)", // Emerald/Green
    "rgba(245, 158, 11, 0.8)", // Amber/Yellow
    "rgba(239, 68, 68, 0.8)",  // Red
    "rgba(139, 92, 246, 0.8)", // Purple
    "rgba(14, 165, 233, 0.8)", // Sky Blue
  ];

  const borderPalette = palette.map(color => color.replace("0.8", "1")); // Solid borders

  // --- Complaints ---
  const complaintPie = {
    labels: Object.keys(complaints.status),
    datasets: [{
      data: Object.values(complaints.status),
      backgroundColor: palette,
      borderColor: borderPalette,
      borderWidth: 1
    }],
  };

  const complaintBar = {
    labels: Object.keys(complaints.category),
    datasets: [{
      label: "Complaints",
      data: Object.values(complaints.category),
      backgroundColor: "rgba(59, 130, 246, 0.7)", // Unified blue for bars
      borderColor: "rgba(59, 130, 246, 1)",
      borderWidth: 1,
      borderRadius: 4 // Rounds the top of the bars slightly
    }],
  };

  const complaintLine = {
    labels: complaints.trend.map((t) => t[0]),
    datasets: [{
      label: "Trend",
      data: complaints.trend.map((t) => t[1]),
      borderColor: "rgba(239, 68, 68, 1)", // Red line
      backgroundColor: "rgba(239, 68, 68, 0.2)", // Light red fill beneath line
      borderWidth: 2,
      fill: true, // Fills the area under the line
      tension: 0.3 // Adds a slight curve to the line
    }],
  };

  // --- Donations ---
  const donationPie = {
    labels: Object.keys(donations.category),
    datasets: [{
      data: Object.values(donations.category),
      backgroundColor: palette.slice(1).concat(palette[0]), // Shift palette slightly
      borderColor: borderPalette,
      borderWidth: 1
    }],
  };

  const donationLine = {
    labels: donations.trend.map((t) => t[0]),
    datasets: [{
      label: "Donation Trend",
      data: donations.trend.map((t) => t[1]),
      borderColor: "rgba(16, 185, 129, 1)", // Green line for money
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      borderWidth: 2,
      fill: true,
      tension: 0.3
    }],
  };

  // --- Volunteers ---
  const volunteerPie = {
    labels: Object.keys(volunteers.status),
    datasets: [{
      data: Object.values(volunteers.status),
      backgroundColor: palette,
      borderWidth: 1
    }],
  };

  const volunteerBar = {
    labels: Object.keys(volunteers.skills),
    datasets: [{
      label: "Skills",
      data: Object.values(volunteers.skills),
      backgroundColor: "rgba(139, 92, 246, 0.7)", // Purple for skills
      borderColor: "rgba(139, 92, 246, 1)",
      borderWidth: 1,
      borderRadius: 4
    }],
  };

  const volunteerLine = {
    labels: volunteers.trend.map((t) => t[0]),
    datasets: [{
      label: "Onboarding Trend",
      data: volunteers.trend.map((t) => t[1]),
      borderColor: "rgba(245, 158, 11, 1)", // Amber line
      backgroundColor: "rgba(245, 158, 11, 0.2)",
      borderWidth: 2,
      fill: true,
      tension: 0.3
    }],
  };

  const activePie = {
    labels: Object.keys(volunteers.active_split),
    datasets: [{
      data: Object.values(volunteers.active_split),
      backgroundColor: ["rgba(16, 185, 129, 0.8)", "rgba(239, 68, 68, 0.8)"], // Green/Red for Active/Inactive
      borderWidth: 1
    }],
  };

  return (
    <div className="analytics-dashboard">
      <h2>📊 Analytics Dashboard</h2>

      {/* Tabs with explicit active states */}
      <div className="analytics-tabs">
        <button
          className={`tab-btn ${tab === "complaints" ? "active" : ""}`}
          onClick={() => setTab("complaints")}
        >
          Complaints
        </button>
        <button
          className={`tab-btn ${tab === "donations" ? "active" : ""}`}
          onClick={() => setTab("donations")}
        >
          Donations
        </button>
        <button
          className={`tab-btn ${tab === "volunteers" ? "active" : ""}`}
          onClick={() => setTab("volunteers")}
        >
          Volunteers
        </button>
      </div>

      {/* ================= COMPLAINTS ================= */}
      {tab === "complaints" && (
        <div className="tab-content">
          <h3>Complaint Analytics</h3>

          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Total</span>
              <span className="kpi-value">{complaints.kpis.total}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Resolved</span>
              <span className="kpi-value">{complaints.kpis.resolved}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Pending</span>
              <span className="kpi-value">{complaints.kpis.pending}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Rate</span>
              <span className="kpi-value">{complaints.kpis.resolution_rate}%</span>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-wrapper"><Pie data={complaintPie} /></div>
            <div className="chart-wrapper"><Bar data={complaintBar} /></div>
            <div className="chart-wrapper"><Line data={complaintLine} /></div>
          </div>
        </div>
      )}

      {/* ================= DONATIONS ================= */}
      {tab === "donations" && (
        <div className="tab-content">
          <h3>Donation Analytics</h3>

          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Total</span>
              <span className="kpi-value">{donations.kpis.total}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Amount</span>
              <span className="kpi-value">₹{donations.kpis.total_amount}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Average</span>
              <span className="kpi-value">₹{donations.kpis.average}</span>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-wrapper"><Pie data={donationPie} /></div>
            <div className="chart-wrapper"><Line data={donationLine} /></div>
          </div>
        </div>
      )}

      {/* ================= VOLUNTEERS ================= */}
      {tab === "volunteers" && (
        <div className="tab-content">
          <h3>Volunteer Analytics</h3>

          <div className="kpi-grid">
            <div className="kpi-card">
              <span className="kpi-label">Total</span>
              <span className="kpi-value">{volunteers.kpis.total}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Active</span>
              <span className="kpi-value">{volunteers.kpis.active}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Approved</span>
              <span className="kpi-value">{volunteers.kpis.approved}</span>
            </div>
            <div className="kpi-card">
              <span className="kpi-label">Pending</span>
              <span className="kpi-value">{volunteers.kpis.pending}</span>
            </div>
          </div>

          <div className="chart-grid">
            <div className="chart-wrapper"><Pie data={volunteerPie} /></div>
            <div className="chart-wrapper"><Bar data={volunteerBar} /></div>
            <div className="chart-wrapper"><Line data={volunteerLine} /></div>
            <div className="chart-wrapper"><Pie data={activePie} /></div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;