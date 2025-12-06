// frontend/src/App.jsx
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import VendorManagement from "./pages/vendorManagement";
import CreateRFP from "./pages/CreateRFP"; // Import
import RFPDetail from "./pages/RFPDetail"; // Import
import api from "./services/api";
import "./App.css";

// ... NavLink component remains same ...
const NavLink = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className={isActive ? "active" : ""}>
      {children}
    </Link>
  );
};

// --- Updated Dashboard Component ---
const Dashboard = () => {
  const [rfps, setRfps] = useState([]);

  useEffect(() => {
    api
      .get("/rfps")
      .then((res) => setRfps(res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1>Dashboard</h1>
        <Link to="/create-rfp">
          <button className="btn-primary">+ Create New RFP</button>
        </Link>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <table>
          <thead>
            <tr style={{ backgroundColor: "#252525" }}>
              <th>RFP Title</th>
              <th>Date Created</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rfps.map((rfp) => (
              <tr key={rfp.id}>
                <td>{rfp.title}</td>
                <td>{new Date(rfp.createdAt).toLocaleDateString()}</td>
                <td>{rfp.status}</td>
                <td>
                  <Link
                    to={`/rfps/${rfp.id}`}
                    style={{ color: "#3B82F6", textDecoration: "none" }}
                  >
                    View & Manage
                  </Link>
                </td>
              </tr>
            ))}
            {rfps.length === 0 && (
              <tr>
                <td
                  colSpan="4"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No RFPs found. Create one!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav>
          <div
            style={{
              marginRight: "auto",
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "white",
            }}
          >
            AI-RFP System
          </div>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/vendors">Manage Vendors</NavLink>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vendors" element={<VendorManagement />} />
          <Route path="/create-rfp" element={<CreateRFP />} />
          <Route path="/rfps/:id" element={<RFPDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
