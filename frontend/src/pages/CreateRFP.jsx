// frontend/src/pages/CreateRFP.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const CreateRFP = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/rfps", {
        title,
        natural_language_input: content,
      });
      // Redirect to the "Detail/Send" page for this new RFP
      navigate(`/rfps/${response.data.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create RFP");
    }
  };

  return (
    <div>
      <h1>Create New RFP</h1>
      <div className="card">
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "20px" }}
        >
          <div>
            <label
              style={{
                color: "#A0A0A0",
                marginBottom: "5px",
                display: "block",
              }}
            >
              RFP Title
            </label>
            <input
              type="text"
              placeholder="e.g. Office Laptops 2024"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label
              style={{
                color: "#A0A0A0",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Describe what you need (Natural Language)
            </label>
            <textarea
              rows="6"
              placeholder="I need 20 laptops with 16GB RAM..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ alignSelf: "flex-start" }}
          >
            Next: Select Vendors
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateRFP;
