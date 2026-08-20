import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Complaint from "./pages/Complaint";
import ViewComplaints from "./pages/ViewComplaints";
import Donation from "./pages/Donation";
import ViewDonations from "./pages/ViewDonations";
import AllComplaints from "./pages/AllComplaints";
import AllDonations from "./pages/AllDonations";
import VolunteerRequest from "./pages/VolunteerRequest";
import MyVolunteerRequests from "./pages/MyVolunteerRequests";
import AllVolunteerRequests from "./pages/AllVolunteerRequests";
import Analytics from "./pages/Analytics";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <ScrollToTop />
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />

        {/* ðŸ” Private Routes */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/complaint" element={token ? <Complaint /> : <Navigate to="/login" />} />
        <Route path="/my-complaints" element={token ? <ViewComplaints /> : <Navigate to="/login" />} />
        <Route path="/donation" element={token ? <Donation /> : <Navigate to="/login" />} />
        <Route path="/my-donations" element={token ? <ViewDonations /> : <Navigate to="/login" />} />
        <Route path="/all-complaints" element={token ? <AllComplaints /> : <Navigate to="/login" />} />
        <Route path="/all-donations" element={token ? <AllDonations /> : <Navigate to="/login" />} />
        <Route path="/volunteer-request" element={token ? <VolunteerRequest /> : <Navigate to="/login" />} />
        <Route path="/my-volunteers" element={token ? <MyVolunteerRequests /> : <Navigate to="/login" />} />
        <Route path="/all-volunteers" element={token ? <AllVolunteerRequests /> : <Navigate to="/login" />} />
        <Route path="/analytics" element={token ? <Analytics /> : <Navigate to="/login" />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;