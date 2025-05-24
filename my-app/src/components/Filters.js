import React, { useState } from 'react';

function Filters({ onFilterChange }) {
  const [date, setDate] = useState('');
  const [base, setBase] = useState('');
  const [equipment, setEquipment] = useState('');

  // This useEffect will trigger onFilterChange whenever date, base, or equipment changes.
  // It's often better to debounce this for performance in a real app,
  // but for simplicity, calling it directly in onChange is fine for now.
  // For this exact scenario where you want immediate feedback, this is acceptable.
  const handleChange = (newDate, newBase, newEquipment) => {
    onFilterChange({ date: newDate, base: newBase, equipment: newEquipment });
  };

  return (
    <div className="filters">
      {/* Date Filter */}
      <div className="filter-group">
        <label htmlFor="date-filter" className="filter-label">Date:</label>
        <input
          type="date"
          id="date-filter"
          value={date}
          onChange={(e) => {
            setDate(e.target.value);
            handleChange(e.target.value, base, equipment);
          }}
        />
      </div>

      {/* Base Filter */}
      <div className="filter-group">
        <label htmlFor="base-filter" className="filter-label">Base:</label>
        <input
          type="text"
          id="base-filter"
          placeholder="Enter Base"
          value={base}
          onChange={(e) => {
            setBase(e.target.value);
            handleChange(date, e.target.value, equipment);
          }}
        />
      </div>

      {/* Equipment Type Filter */}
      <div className="filter-group">
        <label htmlFor="equipment-filter" className="filter-label">Equipment Type:</label>
        <input
          type="text"
          id="equipment-filter"
          placeholder="Enter Equipment Type"
          value={equipment}
          onChange={(e) => {
            setEquipment(e.target.value);
            handleChange(date, base, e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export default Filters;