import React from 'react';

const Tooltip = ({ children, text }) => {
  return (
    <div className="tooltip-container">
      {children}
      <div className="tooltip-content">
        {text}
      </div>

      <style jsx>{`
        .tooltip-container {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }

        .tooltip-content {
          visibility: hidden;
          width: auto;
          max-width: 250px; /* Adjust width as necessary */
          background-color: black;
          color: white;
          text-align: left;
          border-radius: 15px;
          padding: 10px;
          position: absolute;
          z-index: 1;
          bottom: 125%; /* Position above the element */
          left: 50%;
          margin-left: -125px; /* Centers the tooltip */
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          transform: translateY(10px); /* Tooltip initially appears slightly lower */
        }

        .tooltip-container:hover .tooltip-content {
          visibility: visible;
          opacity: 1;
          transform: translateY(0); /* Tooltip smoothly moves up */
        }

        /* Optional: Arrow to make it look like a chat message */
        .tooltip-content::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          margin-left: -5px; /* Center the arrow */
          border-width: 5px;
          border-style: solid;
          border-color: black transparent transparent transparent; /* Arrow pointing down */
        }
      `}</style>
    </div>
  );
};

export default Tooltip;
