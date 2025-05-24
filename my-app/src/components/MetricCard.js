import React from 'react';

function MetricCard({ title, value, onClick, clickable }) {
  return (
    <div
      className={`card ${clickable ? 'clickable' : ''}`}
      onClick={clickable ? onClick : undefined}
    >
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}

export default MetricCard;
