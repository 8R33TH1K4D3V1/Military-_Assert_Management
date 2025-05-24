import React from 'react';

function NetMovementModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Net Movement Details</h2>
        <ul>
          <li>Purchases: 40</li>
          <li>Transfer In: 30</li>
          <li>Transfer Out: 10</li>
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

export default NetMovementModal;
