// ExpenditurePage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import axios for API calls
import './ExpenditurePage.css'; // Correct CSS import path for this component

const API_BASE_URL = 'http://localhost:5000/api'; // Replace with your backend URL

export default function ExpenditurePage() {
    const [assets, setAssets] = useState([]); // State to hold assets fetched from backend
    const [expendedAssets, setExpendedAssets] = useState([]); // State to hold expenditures fetched from backend
    const [loading, setLoading] = useState(true); // Loading state for initial data fetch
    const [error, setError] = useState(null); // Error state for API calls

    const [expenditureForm, setExpenditureForm] = useState({
        expendedAssetId: '', // This will be the backend's asset.id (e.g., 'AST001')
        expenditureDate: '',
        reason: '',
        amount: '', // <--- ADDED: State for the amount
    });

    // --- Fetch Assets and Expenditures on component mount ---
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Assets
                const assetsResponse = await axios.get(`${API_BASE_URL}/assets`);
                setAssets(assetsResponse.data);

                // Fetch Expenditures
                const expendituresResponse = await axios.get(`${API_BASE_URL}/expenditures`);
                setExpendedAssets(expendituresResponse.data);

                setLoading(false);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch data.");
                setLoading(false);
            }
        };
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const handleExpenditureChange = (e) => {
        const { name, value } = e.target;
        setExpenditureForm(prev => ({ ...prev, [name]: value }));
    };

    // Handles the submission of the expenditure form
    const handleExpendedAsset = async (e) => {
        e.preventDefault();
        const { expendedAssetId, expenditureDate, reason, amount } = expenditureForm; // <--- MODIFIED: Destructure amount

        // Frontend validation: Check all fields, including amount
        if (!expendedAssetId || !expenditureDate || !reason || !amount) { // <--- MODIFIED: Check if amount is present
            alert('Please fill all expenditure fields.');
            return;
        }

        // Validate amount to ensure it's a valid number and positive
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            alert('Please enter a valid positive amount for the expenditure.');
            return;
        }

        try {
            // Check if the asset is already expended (optional, backend should also validate)
            const assetToMarkExpended = assets.find(a => a.id === expendedAssetId);
            if (assetToMarkExpended && assetToMarkExpended.status === 'Retired') { // Assuming 'Retired' is your expended status
                alert('Asset is already marked as retired/expended.');
                return;
            }

            const response = await axios.post(`${API_BASE_URL}/expenditures`, {
                assetId: expendedAssetId, // Send the custom asset ID
                date: expenditureDate,     // Your backend expects 'date' not 'expenditureDate'
                description: reason,       // Your backend expects 'description' not 'reason'
                amount: parsedAmount,      // <--- NEW: Send the parsed amount to the backend
            });

            const newExpenditureRecord = response.data; // The backend returns the new expenditure

            setExpendedAssets(prev => [...prev, newExpenditureRecord]);
            // Clear all form fields after successful submission
            setExpenditureForm({ expendedAssetId: '', expenditureDate: '', reason: '', amount: '' }); // <--- MODIFIED: Clear amount

            // Optional: Update the status of the asset in the local 'assets' state
            // This is good for immediate UI feedback without re-fetching all assets
            setAssets(prevAssets =>
                prevAssets.map(asset =>
                    asset.id === expendedAssetId ? { ...asset, status: 'Retired' } : asset
                )
            );

            alert('Asset marked as expended successfully!');

        } catch (err) {
            console.error("Error creating expenditure:", err.response?.data || err);
            alert(`Error: ${err.response?.data?.message || err.message}`);
        }
    };

    if (loading) {
        return <div className="expenditure-page">Loading assets and expenditures...</div>;
    }

    if (error) {
        return <div className="expenditure-page error-message">Error: {error}</div>;
    }

    return (
        <div className="expenditure-page">
            <h1 className="page-title">
                <span role="img" aria-label="bin">🗑️</span> Asset Expenditures
            </h1>

            <section className="expenditure-section">
                <h2 className="section-title">
                    <span role="img" aria-label="bin">🗑️</span> Mark Asset as Expended
                </h2>
                <form onSubmit={handleExpendedAsset} className="asset-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="expendedAssetId">Asset to Expend:</label>
                            <select
                                id="expendedAssetId"
                                name="expendedAssetId"
                                value={expenditureForm.expendedAssetId}
                                onChange={handleExpenditureChange}
                                required
                            >
                                <option value="">-- Select Asset --</option>
                                {/* Filter out assets that are already 'Retired' or 'Under Maintenance' if desired */}
                                {assets.filter(asset => asset.status !== 'Retired').map(asset => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.name} ({asset.id}) - {asset.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="expenditureDate">Expenditure Date:</label>
                            <input
                                type="date"
                                id="expenditureDate"
                                name="expenditureDate"
                                value={expenditureForm.expenditureDate}
                                onChange={handleExpenditureChange}
                                required
                            />
                        </div>
                        {/* NEW: Amount input field */}
                        <div className="form-group">
                            <label htmlFor="amount">Amount ($):</label>
                            <input
                                type="number" // Use type="number" for numerical input
                                id="amount"
                                name="amount"
                                value={expenditureForm.amount}
                                onChange={handleExpenditureChange}
                                placeholder="e.g., 150.75"
                                step="0.01" // Allows for decimal values (cents)
                                required
                            />
                        </div>
                        <div className="form-group full-width">
                            <label htmlFor="reason">Reason for Expenditure (Description):</label> {/* Clarified label */}
                            <textarea
                                id="reason"
                                name="reason"
                                value={expenditureForm.reason}
                                onChange={handleExpenditureChange}
                                placeholder="e.g., Damaged beyond repair, Lost in action, Consumed"
                                rows="3"
                                required
                            ></textarea>
                        </div>
                    </div>
                    <button type="submit" className="submit-button delete-button">Mark Expended</button>
                </form>

                <h3 className="sub-section-title">Expended Assets History</h3>
                {expendedAssets.length === 0 ? (
                    <p className="empty-state">No assets have been marked as expended.</p>
                ) : (
                    <div className="expenditures-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Asset Name</th>
                                    <th>Expenditure Date</th>
                                    <th>Amount</th> {/* <--- NEW: Table header for Amount */}
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expendedAssets.map(expenditure => (
                                    <tr key={expenditure._id}> {/* Use MongoDB _id as key */}
                                        <td>{expenditure.asset?.id || 'N/A'}</td> {/* Use optional chaining */}
                                        <td>{expenditure.asset?.name || 'N/A'}</td>
                                        <td>{new Date(expenditure.date).toLocaleDateString()}</td> {/* Format date */}
                                        <td>${expenditure.amount ? expenditure.amount.toFixed(2) : '0.00'}</td> {/* <--- NEW: Display amount, formatted to 2 decimal places */}
                                        <td>{expenditure.description}</td> {/* Backend uses 'description' */}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </div>
    );
}