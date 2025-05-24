import React, { useState, useEffect } from "react";
import "./PurchasesPage.css"; // Assuming you have this CSS file

const baseOptions = ["Base A", "Base B", "Base C"];
const equipmentOptions = ["Weapons", "Vehicles", "Other"];

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [formData, setFormData] = useState({
    base: "",
    equipmentType: "",
    assetName: "",
    quantity: 1,
    purchaseDate: "",
  });

  const [filters, setFilters] = useState({
    date: "",
    equipmentType: "",
  });

  // Fetch filtered purchases from backend
  const fetchFilteredPurchases = async () => {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`http://localhost:5000/api/purchases?${query}`);
      if (!res.ok) throw new Error("Failed to fetch purchases");
      const data = await res.json();
      setPurchases(data);
    } catch (error) {
      console.error("Error fetching purchases:", error);
    }
  };

  // Fetch purchases on component mount and filter change
  useEffect(() => {
    fetchFilteredPurchases();
  }, [filters]); // Dependency array: re-run when filters change

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Submit new purchase record
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { base, equipmentType, assetName, quantity, purchaseDate } = formData;
    if (!base || !equipmentType || !assetName || !purchaseDate || quantity <= 0) {
      alert("Please fill all required fields and ensure quantity is at least 1.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/purchases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to add purchase");

      const newPurchase = await res.json();
      // Optimistically add the new purchase to the list
      // Or, better, re-fetch all purchases to ensure data consistency with backend
      fetchFilteredPurchases(); // Re-fetch to ensure the list is updated correctly with potential server-side changes (like timestamps)

      setFormData({ // Clear form after successful submission
        base: "",
        equipmentType: "",
        assetName: "",
        quantity: 1,
        purchaseDate: "",
      });
    } catch (error) {
      console.error("Error adding purchase:", error);
      alert("Failed to add purchase. Please try again.");
    }
  };

  return (
    <div className="purchases-page" role="main" aria-label="Purchases Page">
      <h1>
        <span role="img" aria-label="shopping cart" className="icon">🛒</span> Asset Purchase Management
      </h1>

      {/* Form to record new purchase */}
      <form className="purchase-form" onSubmit={handleSubmit} aria-label="Record Purchase Form">
        <fieldset>
          <legend>Record New Purchase</legend>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="base">Select Base</label>
              <select
                id="base"
                name="base"
                value={formData.base}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Base --</option>
                {baseOptions.map((base) => (
                  <option key={base} value={base}>
                    {base}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="equipmentType">Equipment Type</label>
              <select
                id="equipmentType"
                name="equipmentType"
                value={formData.equipmentType}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Equipment Type --</option>
                {equipmentOptions.map((equip) => (
                  <option key={equip} value={equip}>
                    {equip}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assetName">Asset Name</label>
              <input
                type="text"
                id="assetName"
                name="assetName"
                value={formData.assetName}
                onChange={handleChange}
                placeholder="e.g., M16 Rifle"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="purchaseDate">Purchase Date</label>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" aria-label="Add Purchase">
            Add Purchase
          </button>
        </fieldset>
      </form>

      {/* Filters */}
      <section className="filters" aria-label="Filter Purchases">
        <h2>Filter Historical Purchases</h2>
        <div className="filter-grid">
          <div className="filter-group">
            <label htmlFor="filterDate">Filter by Date</label>
            <input
              type="date"
              id="filterDate"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="filterEquip">Filter by Equipment Type</label>
            <select
              id="filterEquip"
              name="equipmentType"
              value={filters.equipmentType}
              onChange={handleFilterChange}
            >
              <option value="">-- All Types --</option>
              {equipmentOptions.map((equip) => (
                <option key={equip} value={equip}>
                  {equip}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Purchases List */}
      <section className="purchases-list" aria-label="List of Purchases">
        <h2><span role="img" aria-label="list" className="icon">📋</span> Historical Purchases</h2>
        {purchases.length === 0 ? (
          <p className="no-purchases-message">No purchases found matching your criteria.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Base</th>
                <th>Equipment Type</th>
                <th>Asset Name</th>
                <th>Quantity</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              {purchases.map(({ _id, base, equipmentType, assetName, quantity, purchaseDate }) => (
                <tr key={_id}>
                  <td>{base}</td>
                  <td>{equipmentType}</td>
                  <td>{assetName}</td>
                  <td>{quantity}</td>
                  <td>{purchaseDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}