// frontend/src/pages/RFPDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

const RFPDetail = () => {
  const { id } = useParams();

  const [rfp, setRFP] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [proposals, setProposals] = useState([]); // NEW
  const [loading, setLoading] = useState(true);

  // Fetch RFP + Vendors + Proposals
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rfpRes, vendorRes, proposalRes] = await Promise.all([
          api.get(`/rfps/${id}`),
          api.get("/vendors"),
          api.get(`/rfps/${id}/proposals`),
        ]);
        setRFP(rfpRes.data);
        setVendors(vendorRes.data);
        setProposals(proposalRes.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Handle Vendor Checkbox
  const handleCheckboxChange = (vendorId) => {
    setSelectedVendors((prev) =>
      prev.includes(vendorId)
        ? prev.filter((id) => id !== vendorId)
        : [...prev, vendorId]
    );
  };

  // Send RFP to Selected Vendors
  const handleSend = async () => {
    if (selectedVendors.length === 0)
      return alert("Please select at least one vendor.");

    try {
      await api.post(`/rfps/${id}/send`, { vendorIds: selectedVendors });
      alert("✅ RFP Sent to selected vendors!");
      setRFP({ ...rfp, status: "SENT" });
      setSelectedVendors([]);
    } catch (error) {
      console.error(error);
      alert("Failed to send emails.");
    }
  };

  // NEW: Check Inbox for Vendor Replies
  const handleCheckInbox = async () => {
    try {
      setLoading(true);
      const res = await api.post("/rfps/check-replies");
      alert(res.data.message);

      const updatedProposals = await api.get(`/rfps/${id}/proposals`);
      setProposals(updatedProposals.data);

      setLoading(false);
    } catch (error) {
      console.error(error);
      alert("Error checking inbox");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!rfp) return <p>RFP Not Found</p>;

  return (
    <div>
      {/* ---------------- RFP INFO CARD ---------------- */}
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2>{rfp.title}</h2>
          <span
            style={{
              padding: "5px 10px",
              borderRadius: "4px",
              background: rfp.status === "SENT" ? "#10B981" : "#F59E0B",
              color: "black",
              fontWeight: "bold",
              fontSize: "12px",
            }}
          >
            {rfp.status}
          </span>
        </div>

        <p
          style={{
            color: "#A0A0A0",
            whiteSpace: "pre-wrap",
            marginBottom: "20px",
          }}
        >
          <strong>Original Request:</strong>
          <br />
          {rfp.natural_language_input}
        </p>

        {/* ---------- AI Extracted Information ----------- */}
        {rfp.procurement_details && (
          <div
            style={{
              backgroundColor: "#2A2A2A",
              padding: "15px",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <h4 style={{ marginTop: 0, color: "#3B82F6" }}>
              🤖 AI-Extracted Requirements
            </h4>

            {/* Items List */}
            {rfp.procurement_details.items &&
              rfp.procurement_details.items.length > 0 && (
                <ul style={{ paddingLeft: "20px", color: "#E0E0E0" }}>
                  {rfp.procurement_details.items.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: "5px" }}>
                      <strong>
                        {item.quantity}x {item.name}
                      </strong>
                      <span style={{ color: "#A0A0A0" }}> ({item.specs})</span>
                    </li>
                  ))}
                </ul>
              )}

            {/* Item Summary */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <div>
                <span
                  style={{
                    display: "block",
                    color: "#A0A0A0",
                    fontSize: "12px",
                  }}
                >
                  BUDGET
                </span>
                <strong>{rfp.budget ? `$${rfp.budget}` : "N/A"}</strong>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    color: "#A0A0A0",
                    fontSize: "12px",
                  }}
                >
                  DEADLINE
                </span>
                <strong>{rfp.delivery_deadline || "N/A"}</strong>
              </div>

              <div>
                <span
                  style={{
                    display: "block",
                    color: "#A0A0A0",
                    fontSize: "12px",
                  }}
                >
                  WARRANTY
                </span>
                <strong>{rfp.warranty_req || "N/A"}</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Vendor Selection ---------------- */}
      <h3>Select Vendors to Invite</h3>
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table>
          <thead>
            <tr style={{ backgroundColor: "#252525" }}>
              <th style={{ width: "50px" }}>Select</th>
              <th>Company</th>
              <th>Contact</th>
              <th>Email</th>
            </tr>
          </thead>

          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor.id}>
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selectedVendors.includes(vendor.id)}
                    onChange={() => handleCheckboxChange(vendor.id)}
                    style={{ width: "18px", height: "18px", cursor: "pointer" }}
                  />
                </td>
                <td>{vendor.name}</td>
                <td>{vendor.contact_name}</td>
                <td>{vendor.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        className="btn-primary"
        onClick={handleSend}
        disabled={selectedVendors.length === 0}
        style={{ opacity: selectedVendors.length === 0 ? 0.5 : 1 }}
      >
        Send RFP to {selectedVendors.length} Vendor(s)
      </button>

      {/* ---------------- PROPOSAL COMPARISON SECTION ---------------- */}
      <div
        style={{
          marginTop: "40px",
          borderTop: "1px solid #333",
          paddingTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3>📢 Vendor Proposals</h3>
          <button
            onClick={handleCheckInbox}
            style={{
              padding: "10px",
              background: "#2563EB",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            🔄 Check for New Replies
          </button>
        </div>

        {proposals.length === 0 ? (
          <p style={{ color: "#A0A0A0" }}>
            No proposals received yet. Click "Check for New Replies".
          </p>
        ) : (
          <div className="card" style={{ padding: 0, overflowX: "auto" }}>
            <table>
              <thead>
                <tr style={{ backgroundColor: "#252525" }}>
                  <th>Vendor</th>
                  <th>Total Price</th>
                  <th>Delivery Time</th>
                  <th>Warranty</th>
                  <th>Deviations</th>
                </tr>
              </thead>

              <tbody>
                {proposals.map((prop) => {
                  const data = prop.ai_extracted_data || {};
                  return (
                    <tr key={prop.id}>
                      <td>
                        <strong>
                          {prop.Vendor ? prop.Vendor.name : "Unknown"}
                        </strong>
                      </td>

                      <td style={{ color: "#10B981", fontWeight: "bold" }}>
                        {data.total_price
                          ? `${data.currency || "$"} ${data.total_price}`
                          : "N/A"}
                      </td>

                      <td>{data.delivery_time || "N/A"}</td>
                      <td>{data.warranty_offered || "N/A"}</td>

                      <td
                        style={{
                          color:
                            data.key_deviations === "None"
                              ? "#A0A0A0"
                              : "#EF4444",
                        }}
                      >
                        {data.key_deviations || "None"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RFPDetail;
