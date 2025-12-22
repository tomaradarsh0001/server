import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import tailwindConfig from "../../tailwind.config";

export default function NoticeMarquee() {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-gray-100 py-2 marquee-bar">
      <div className="inline-block text-md text-black marquee hover:marquee-paused">
        This portal is only for Conversion and NOC applications. &nbsp; | &nbsp; For other applications, visit <a href="https://ldo.gov.in/" target="_blank" className="blink">ldo.gov.in</a>.
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 15s linear infinite;
        }
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

