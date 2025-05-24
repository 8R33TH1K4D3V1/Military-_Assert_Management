import React, { useState, useEffect } from 'react';
import './AssignmentsPage.css';

// Dummy data for initial state or fallback in case backend is not ready
const initialDummyAssets = [
    { id: 'AST001', name: 'M16 Rifle', status: 'Available' },
    { id: 'AST002', name: 'Humvee', status: 'Available' },
    { id: 'AST003', name: 'Night Vision Goggles', status: 'Available' },
    { id: 'AST004', name: 'First Aid Kit', status: 'Available' },
];

const initialDummyPersonnel = [
    { id: 'P001', name: 'John Doe', rank: 'Captain' },
    { id: 'P002', name: 'Jane Smith', rank: 'Sergeant' },
    { id: 'P003', name: 'Mike Johnson', rank: 'Specialist' },
];

export default function AssignmentsPage() {
    const API_BASE_URL = 'http://localhost:5000/api'; // Ensure this matches your backend port

    // State for assets (fetched from backend, or initialDummyAssets as fallback)
    const [assets, setAssets] = useState(initialDummyAssets);
    // State for personnel (fetched from backend, or initialDummyPersonnel as fallback)
    const [personnel, setPersonnel] = useState(initialDummyPersonnel);
    // State for assigned assets (fetched from backend)
    const [assignedAssets, setAssignedAssets] = useState([]);

    const [assignmentForm, setAssignmentForm] = useState({
        assetId: '',       // This will hold the custom ID (e.g., 'AST001')
        personnelId: '',   // This will hold the custom ID (e.g., 'P001')
        assignmentDate: '',
    });

    // --- Fetch Data on Component Mount and after actions ---
    const fetchData = async () => {
        try {
            // Fetch Assets
            const assetsResponse = await fetch(`${API_BASE_URL}/assignments/assets`); // Use the new asset route
            if (!assetsResponse.ok) {
                console.warn('Failed to fetch assets from backend, using dummy data.');
                setAssets(initialDummyAssets);
            } else {
                const assetsData = await assetsResponse.json();
                setAssets(assetsData);
            }

            // Fetch Personnel
            const personnelResponse = await fetch(`${API_BASE_URL}/assignments/personnel`); // Use the new personnel route
            if (!personnelResponse.ok) {
                console.warn('Failed to fetch personnel from backend, using dummy data.');
                setPersonnel(initialDummyPersonnel);
            } else {
                const personnelData = await personnelResponse.json();
                setPersonnel(personnelData);
            }

            // Fetch Assignments
            const assignmentsResponse = await fetch(`${API_BASE_URL}/assignments`);
            if (!assignmentsResponse.ok) {
                console.warn('Failed to fetch assignments from backend. Initializing as empty.');
                setAssignedAssets([]);
            } else {
                const assignmentsData = await assignmentsResponse.json();
                setAssignedAssets(assignmentsData);
            }

        } catch (error) {
            console.error('Error during initial data fetch:', error);
            alert('An error occurred while loading data. Please ensure the backend server and MongoDB are running.');
            // Fallback to dummy data on critical error
            setAssets(initialDummyAssets);
            setPersonnel(initialDummyPersonnel);
            setAssignedAssets([]);
        }
    };

    useEffect(() => {
        fetchData();
    }, []); // Empty dependency array means this runs once on mount

    const handleAssignmentChange = (e) => {
        const { name, value } = e.target;
        setAssignmentForm(prev => ({ ...prev, [name]: value }));
    };

    // --- Handle Asset Assignment (POST request to backend) ---
    const handleAssignAsset = async (e) => {
        e.preventDefault();
        const { assetId, personnelId, assignmentDate } = assignmentForm;

        if (!assetId || !personnelId || !assignmentDate) {
            alert('Please fill all assignment fields.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/assignments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ assetId, personnelId, assignmentDate }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to assign asset.');
            }

            // After successful assignment, re-fetch all data to ensure consistency
            // This is simpler than manually updating multiple state slices
            await fetchData();

            setAssignmentForm({ assetId: '', personnelId: '', assignmentDate: '' });
            alert(data.message); // Show success message from backend

        } catch (error) {
            console.error('Error assigning asset:', error);
            alert(`Error: ${error.message}`); // Show error message to user
        }
    };

    // --- Handle Asset Return (PUT request to backend) ---
    const handleReturnAsset = async (assignmentId) => {
        if (!window.confirm('Are you sure you want to mark this asset as returned?')) {
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/return`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to return asset.');
            }

            // After successful return, re-fetch all data to ensure consistency
            await fetchData();

            alert(data.message); // Show success message from backend

        } catch (error) {
            console.error('Error returning asset:', error);
            alert(`Error: ${error.message}`); // Show error message to user
        }
    };


    return (
        <div className="assignments-page">
            <h1 className="page-title">
                <span role="img" aria-label="clipboard">📝</span> Asset Assignments
            </h1>

            <section className="assignment-section">
                <h2 className="section-title">🙋‍♂️ Assign Asset to Personnel</h2>
                <form onSubmit={handleAssignAsset} className="asset-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label htmlFor="assignAssetId">Asset:</label>
                            <select
                                id="assignAssetId"
                                name="assetId"
                                value={assignmentForm.assetId}
                                onChange={handleAssignmentChange}
                                required
                            >
                                <option value="">-- Select Asset --</option>
                                {/* Filter available assets for assignment */}
                                {assets.filter(asset => asset.status === 'Available').map(asset => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.name} (ID: {asset.id}) - {asset.status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="personnelId">Personnel:</label>
                            <select
                                id="personnelId"
                                name="personnelId"
                                value={assignmentForm.personnelId}
                                onChange={handleAssignmentChange}
                                required
                            >
                                <option value="">-- Select Personnel --</option>
                                {personnel.map(person => (
                                    <option key={person.id} value={person.id}>
                                        {person.name} (Rank: {person.rank})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="assignmentDate">Assignment Date:</label>
                            <input
                                type="date"
                                id="assignmentDate"
                                name="assignmentDate"
                                value={assignmentForm.assignmentDate}
                                onChange={handleAssignmentChange}
                                required
                            />
                        </div>
                    </div>
                    <button type="submit" className="submit-button">Assign Asset</button>
                </form>

                <h3 className="sub-section-title">Current Assignments</h3>
                {assignedAssets.length === 0 ? (
                    <p className="empty-state">No assets currently assigned.</p>
                ) : (
                    <div className="assignments-table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Asset ID</th>
                                    <th>Asset Name</th>
                                    <th>Assigned To</th>
                                    <th>Rank</th>
                                    <th>Assignment Date</th>
                                    <th>Return Date</th> {/* New column for return date */}
                                    <th>Actions</th> {/* New column for actions */}
                                </tr>
                            </thead>
                            <tbody>
                                {assignedAssets.map(assignment => (
                                    <tr key={assignment._id}>
                                        <td>{assignment.asset ? assignment.asset.id : 'N/A'}</td>
                                        <td>{assignment.asset ? assignment.asset.name : 'N/A'}</td>
                                        <td>{assignment.personnel ? assignment.personnel.name : 'N/A'}</td>
                                        <td>{assignment.personnel ? assignment.personnel.rank : 'N/A'}</td>
                                        <td>{new Date(assignment.assignmentDate).toLocaleDateString()}</td>
                                        <td>
                                            {assignment.returnDate
                                                ? new Date(assignment.returnDate).toLocaleDateString()
                                                : 'Pending'}
                                        </td>
                                        <td>
                                            {!assignment.returnDate && ( // Show button only if not yet returned
                                                <button
                                                    className="return-button"
                                                    onClick={() => handleReturnAsset(assignment._id)}
                                                >
                                                    Return
                                                </button>
                                            )}
                                        </td>
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