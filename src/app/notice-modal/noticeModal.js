"use client";

import { useEffect, useState } from "react";

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);

  useEffect(() => {
    // Show modal on page load
    setIsOpen(true);

    // Show close button after 5 seconds
    const timer = setTimeout(() => {
      setShowClose(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6 text-center -mt-10 sm:mt-0">

        {/* Close Button (top-right) */}
        {/* <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button> */}

        {/* Close Button (top-right, appears after 5s) */}
        <button
          className={`absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg transition-opacity duration-700
            ${showClose ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          `}
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>

        {/* Title */}
        <h2 className="text-2xl font-semibold mb-4">Notice</h2>

        {/* Body */}
        <p className="text-gray-700 mb-6">
          This site is under construction. Please click the link
          below to visit ldo.gov.in.
        </p>

        {/* Footer */}
        <a
          href="https://ldo.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Older Portal
        </a>
      </div>
    </div>
  );
}
