// frontend/src/pages/VendorManagement.jsx
import React, { useState, useEffect } from "react";
import api from "../services/api";

const VendorManagement = () => {
  const [vendors, setVendors] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      const response = await api.get("/vendors");
      setVendors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/vendors", formData);
      alert("Vendor added successfully!");
      setFormData({
        name: "",
        contact_name: "",
        email: "",
        phone: "",
        address: "",
      });
      fetchVendors();
    } catch (error) {
      alert("Failed to add vendor.");
    }
  };

  return (
    <div>
      <h1>Vendor Management</h1>

      {/* --- Add Vendor Form --- */}
      <div className="card">
        <h3>Add New Vendor</h3>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          <input
            name="name"
            placeholder="Company Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            name="contact_name"
            placeholder="Contact Person"
            value={formData.contact_name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            style={{ gridColumn: "span 2" }}
          />

          <div style={{ gridColumn: "span 2", marginTop: "10px" }}>
            <button type="submit" className="btn-primary">
              Add Vendor
            </button>
          </div>
        </form>
      </div>

      {/* --- Vendor List --- */}
      <h3>Registered Vendors</h3>
      <div className="card" style={{ padding: "0", overflow: "hidden" }}>
        {loading ? (
          <p style={{ padding: "20px" }}>Loading...</p>
        ) : (
          <table>
            <thead>
              <tr style={{ backgroundColor: "#252525" }}>
                <th>Company</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {vendors.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No vendors found.
                  </td>
                </tr>
              ) : (
                vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.contact_name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.phone}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
