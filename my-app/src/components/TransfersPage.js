// src/components/TransfersPage.js
import React, { useState, useEffect } from "react";
import "./TransferPage.css";

const TransferPage = () => {
  const [transferData, setTransferData] = useState({
    fromBase: "",
    toBase: "",
    assetId: "",
    quantity: "",
  });

  const [transferHistory, setTransferHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_BASE_URL = "http://localhost:5000/api/transfers";

  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setTransferHistory(data);
      } catch (err) {
        console.error("Error fetching transfers:", err);
        setError("Failed to load transfer history.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransfers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransferData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const { fromBase, toBase, assetId, quantity } = transferData;

    if (!fromBase || !toBase || !assetId || !quantity) {
      alert("Please fill in all transfer details.");
      return;
    }
    if (fromBase === toBase) {
      alert("From Base and To Base cannot be the same.");
      return;
    }

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(transferData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const newTransfer = await response.json();
      setTransferHistory([newTransfer, ...transferHistory]);
      setTransferData({ fromBase: "", toBase: "", assetId: "", quantity: "" });
      alert("Transfer successful!");
    } catch (err) {
      console.error("Error during transfer:", err);
      alert(`Transfer failed: ${err.message}`);
    }
  };

  return (
    <div className="transfer-page">
      <h1 className="title"><span role="img" aria-label="truck" className="emoji">🚚</span> Asset Transfer Management</h1>

      <section className="transfer-form-section">
        <h2>Initiate Asset Transfer</h2>
        <form onSubmit={handleTransfer} className="transfer-form">
          <div className="form-group">
            <label htmlFor="fromBase">From Base:</label>
            <select id="fromBase" name="fromBase" value={transferData.fromBase} onChange={handleChange} required>
              <option value="">Select Origin Base</option>
              <option value="Base A">Base A</option>
              <option value="Base B">Base B</option>
              <option value="Base C">Base C</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="toBase">To Base:</label>
            <select id="toBase" name="toBase" value={transferData.toBase} onChange={handleChange} required>
              <option value="">Select Destination Base</option>
              <option value="Base A">Base A</option>
              <option value="Base B">Base B</option>
              <option value="Base C">Base C</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="assetId">Asset ID:</label>
            <input id="assetId" type="text" name="assetId" value={transferData.assetId} onChange={handleChange} placeholder="e.g., ASSET-12345" required />
          </div>

          <div className="form-group">
            <label htmlFor="quantity">Quantity:</label>
            <input id="quantity" type="number" name="quantity" value={transferData.quantity} onChange={handleChange} placeholder="Enter quantity" min="1" required />
          </div>

          <button type="submit" className="transfer-button">Transfer Asset</button>
        </form>
      </section>

      <section className="history-section">
        <h2><span role="img" aria-label="scroll" className="emoji">📜</span> Transfer History</h2>
        {loading ? (
          <p>Loading transfer history...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : transferHistory.length === 0 ? (
          <p className="no-transfers">No transfers recorded yet. Start by transferring an asset!</p>
        ) : (
          <ul className="history-list">
            {transferHistory.map((entry) => (
              <li key={entry._id || entry.timestamp} className="history-item">
                <div><strong>{entry.assetId}</strong> ({entry.quantity} units)</div>
                <div className="transfer-details">{entry.fromBase} <span className="arrow">➡️</span> {entry.toBase}</div>
                <div className="timestamp"><span role="img" aria-label="clock">⏱</span> {new Date(entry.timestamp).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default TransferPage;
