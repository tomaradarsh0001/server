"use client";

import React, { useEffect, useRef } from "react";
import { getLocation } from "current-location-geo";
import Hero from "@/components/ResponsiveHero";
import DashboardFacts from "@/components/DashboardFacts";
import Introduction from "@/components/Introduction";
import WhatWeDo from "@/components/WhatWeDo";
import PortalGroup from "@/components/PortalGroup";
import NewsSlider from "@/components/NewsSlider";
import SlickSlider from "@/components/SlickSlider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EmbassyContainer from "@/components/EmbassyContainer";
import { HOST_NAME, API_HOST } from "../constants";
import NoticeMarquee from "@/components/NoticeMarquee";

export default function Home() {
    const isScrollingRef = useRef(false);
    const scrollTimeout = useRef(null);

    useEffect(() => {
        // Fetch the visitor's IP and send it to the backend
        const sendVisitorIP = async () => {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                const visitorIP = data.ip;

                await fetch(API_HOST + "store-visitor-ip", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-Visitor-IP": visitorIP
                    }
                });
            } catch (error) {
                console.error("Failed to send visitor IP:", error);
            }
        };

        sendVisitorIP();

        // Get user's geolocation
        getLocation((err, position) => {
            if (err) {
                console.error("Error getting location:", err);
            } else {
                console.log("Location data:", position);
            }
        });

        // Scroll behavior with debounce
        const handleScroll = (event) => {
            event.preventDefault();

            if (isScrollingRef.current) return;

            isScrollingRef.current = true;

            const screenWidth = window.innerWidth;
            const scrollAmount = screenWidth >= 1950 && screenWidth <= 2800 ? 898 : 760;
            const direction = event.deltaY > 0 ? 1 : -1;

            window.scrollBy({
                top: scrollAmount * direction,
                behavior: "smooth"
            });

            // Debounce to handle continuous scrolling
            clearTimeout(scrollTimeout.current);
            scrollTimeout.current = setTimeout(() => {
                isScrollingRef.current = false;
            }, 500); // Increased timeout for smoother scrolling
        };

        window.addEventListener("wheel", handleScroll, { passive: false });

        return () => {
            window.removeEventListener("wheel", handleScroll);
            clearTimeout(scrollTimeout.current); // Cleanup timeout
        };
    }, []);

    return (
        <div className="Homepage">
            <NoticeMarquee />
            <NewsSlider />
            <Hero />
            <PortalGroup />
            <DashboardFacts />
            <Introduction />
            <SlickSlider />
            <WhatWeDo />
            <EmbassyContainer />
        </div>
    );
}
