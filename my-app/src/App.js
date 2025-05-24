import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import PurchasesPage from "./components/PurchasesPage";
import TransfersPage from "./components/TransfersPage";
import AssignmentsPage from "./components/AssignmentsPage";
import ExpenditurePage from "./components/ExpenditurePage";
import "./styles/App.css";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/purchases" element={<PurchasesPage />} />
        <Route path="/transfers" element={<TransfersPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} /> {/* Correctly mapped */}
        <Route path="/expenditure" element={<ExpenditurePage />} />
      </Routes>
    </Router>
  );
}