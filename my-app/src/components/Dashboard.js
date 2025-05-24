import React, { useState } from "react"; // Corrected syntax: 'from' instead of '=>'
import './Dashboard.css'; // Contains modal styles now
import '../styles/App.css'; // Corrected import path for App.css
import { useNavigate } from "react-router-dom";
import {
    FaBalanceScaleLeft,
    FaBalanceScaleRight,
    FaChartLine,
    FaBoxes,
    FaShoppingCart,
    FaExchangeAlt,
    FaSignOutAlt,
} from "react-icons/fa";

const DashboardCard = ({ title, icon: Icon, value, clickable, onClick, progress, selected }) => {
    // We'll pass progress directly as a CSS variable for the fill
    const progressStyle = { '--progress': progress };

    return (
        <div
            className={`card ${clickable ? "clickable" : ""} ${selected ? "selected" : ""}`}
            onClick={clickable ? onClick : undefined}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={clickable ? (e) => e.key === "Enter" && onClick() : undefined}
            aria-pressed={selected ? "true" : "false"}
            aria-label={title}
        >
            <div className="card-header">
                <Icon className="icon" />
                <h3>{title}</h3>
            </div>
            <p className="value">{value}</p>
            {progress && (
                <div className="progress-bar">
                    <div className="progress-fill" style={progressStyle}></div>
                </div>
            )}
        </div>
    );
};

const Filter = ({ id, label, options, value, onChange }) => (
    <div className="filter-group">
        <label htmlFor={id} className="filter-label">{label}</label>
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}>
            <option value="">{label}</option>
            {options.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
            ))}
        </select>
    </div>
);

export default function Dashboard() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState("Admin");
    const [dateFilter, setDateFilter] = useState("");
    const [baseFilter, setBaseFilter] = useState("");
    const [equipFilter, setEquipFilter] = useState("");
    const [selectedCard, setSelectedCard] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const rolePermissions = {
        Admin: ["opening", "closing", "netMovement", "assignedAssets", "expendedAssets", "warehouseStock", "ordersPending", "returns", "logout"],
        BaseCommander: ["opening", "closing", "netMovement", "assignedAssets", "expendedAssets", "ordersPending", "returns", "logout"],
        LogisticsOfficer: ["netMovement", "warehouseStock", "ordersPending", "returns", "logout"]
    };

    // Example data (values are kept for Net Movement calculation, but not displayed for other cards)
    const openingBalance = 125000;
    const closingBalance = 143500;
    const purchases = 15000;
    const transferIn = 8000;
    const transferOut = 12000;
    const netMovement = purchases + transferIn - transferOut;
    const assignedAssets = 320; // Value kept for potential future use or calculation, but display removed
    const expendedAssets = 45; // Value kept for potential future use or calculation, but display removed
    const warehouseStock = 1000; // Value kept for potential future use or calculation, but display removed
    const ordersPending = 75; // Value kept for potential future use or calculation, but display removed
    const returns = 12; // Value kept for potential future use or calculation, but display removed

    const dateOptions = ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025", "Jun 2025", "Jul 2025", "Aug 2025", "Sep 2025", "Oct 2025", "Nov 2025", "Dec 2025"];
    const baseOptions = ["Base A", "Base B", "Base C"];
    const equipOptions = ["Weapon", "Vehicle", "Others"];

    const handleCardClick = (key, onClick) => {
        if (!rolePermissions[userRole]?.includes(key)) return; // Restrict unpermitted actions
        setSelectedCard(key); // Visually select the card
        if (key === "netMovement") {
            setShowPopup(true); // Show popup for Net Movement
        } else {
            setShowPopup(false); // Hide popup for other clicks
            if (onClick) onClick(); // Navigate if an onClick function is provided
        }
    };

    const cards = [
        { key: "opening", title: "Opening Balance", icon: FaBalanceScaleLeft, value: `$${openingBalance.toLocaleString()}`, progress: "70%" },
        { key: "closing", title: "Closing Balance", icon: FaBalanceScaleRight, value: `$${closingBalance.toLocaleString()}`, progress: "85%" },
        { key: "netMovement", title: "Net Movement", icon: FaChartLine, value: `$${netMovement.toLocaleString()}`, progress: "65%", clickable: true },
        // Modified cards to not display specific values and progress bars
        { key: "assignedAssets", title: "Assigned Assets", icon: FaBoxes, value: "-", progress: undefined, clickable: true, onClick: () => navigate("/assignments") },
        { key: "expendedAssets", title: "Expended Assets", icon: FaBoxes, value: "-", progress: undefined, clickable: true, onClick: () => navigate("/expenditure") },
        { key: "warehouseStock", title: "Purchase", icon: FaBoxes, value: "-", progress: undefined, clickable: true, onClick: () => navigate("/purchases") },
        { key: "ordersPending", title: "Transfer", icon: FaShoppingCart, value: "-", progress: undefined, clickable: true, onClick: () => navigate("/transfers") },
        { key: "returns", title: "Returns", icon: FaExchangeAlt, value: "-", progress: undefined, clickable: true, onClick: () => navigate("/returns") },
        { key: "logout", title: "Logout", icon: FaSignOutAlt, value: "-", clickable: true, onClick: () => navigate("/logout") },
    ];

    return (
        <div className="App" role="main">
            <h1 className="title">🌟 Military Asset Management Dashboard</h1>

            <div className="role-switcher">
                <label htmlFor="role">Select Role: </label>
                <select id="role" value={userRole} onChange={(e) => setUserRole(e.target.value)}>
                    {Object.keys(rolePermissions).map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>
            </div>

            <div className="filters" role="region" aria-label="Filters">
                <Filter id="date-filter" label="Date" options={dateOptions} value={dateFilter} onChange={setDateFilter} />
                <Filter id="base-filter" label="Base" options={baseOptions} value={baseFilter} onChange={setBaseFilter} />
                <Filter id="equip-filter" label="Equipment Type" options={equipOptions} value={equipFilter} onChange={setEquipFilter} />
            </div>

            <div className="dashboard" role="list">
                {cards
                    .filter(({ key }) => rolePermissions[userRole]?.includes(key))
                    .map(({ key, title, icon, value, clickable, onClick, progress }) => (
                        <DashboardCard
                            key={key}
                            title={title}
                            icon={icon}
                            value={value}
                            clickable={clickable}
                            onClick={() => handleCardClick(key, onClick)}
                            progress={progress}
                            selected={selectedCard === key}
                        />
                    ))}
            </div>

            {showPopup && (
                <div className="modal-backdrop" onClick={() => setShowPopup(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="netMovementTitle">
                        <div className="modal-header">
                            <h2 id="netMovementTitle">📊 Net Movement Details</h2>
                            <button className="close-button" onClick={() => setShowPopup(false)} aria-label="Close popup">&times;</button>
                        </div>
                        <div className="modal-content">
                            <ul>
                                <li><strong>Purchases:</strong> <span>${purchases.toLocaleString()}</span></li>
                                <li><strong>Transfer In:</strong> <span>${transferIn.toLocaleString()}</span></li>
                                <li><strong>Transfer Out:</strong> <span>${transferOut.toLocaleString()}</span></li>
                                <li><strong>Net Movement:</strong> <span>${netMovement.toLocaleString()}</span></li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
