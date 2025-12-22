"use client";
import PageHeader from "@/components/PageHeader";
import Table from "@/components/Table";
import React, { useEffect, useState, useContext } from "react";
import { HOST_NAME, API_HOST } from "../../constants"; //added by Nitin
import { LangContext } from "@/components/Container"; //added by Nitin
import Translate from "../../language.json";
const Page = () => {
    const { lang } = useContext(LangContext);
    const [officerData, setOfficerData] = useState([]);
    const [heading, setHeading] = useState("");
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_HOST + "directory/" + lang);
                const result = await response.json();
                if (result.items && result.items.length > 0) {
                    let officersData = result.items.map((officer) => {
                        if (
                            !officer.email ||
                            typeof officer.email !== "string" ||
                            officer.email.startsWith("data:image")
                        ) {
                            return officer; // skip if null or already processed
                        }
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");
                        const fontSize = 30;
                        const paddingX = 10; // No horizontal padding
                        const paddingY = 10; // No vertical padding
                        const fontFamily = "Aerial";

                        // Prepare font and measure text width
                        ctx.font = `${fontSize}px ${fontFamily}`;
                        let formattedEmail = officer.email
                            .replace("@", "[at]")
                            .replaceAll(".", "[dot]");

                        const textMetrics = ctx.measureText(formattedEmail);
                        const textWidth = Math.ceil(textMetrics.width);
                        const textHeight = Math.ceil(fontSize * 1.4); // estimate line height

                        // Set canvas size with scale
                        const scale = window.devicePixelRatio || 1;
                        // Set scaled canvas dimensions
                        canvas.width = (textWidth + paddingX * 2) * scale;
                        canvas.height = (textHeight + paddingY * 2) * scale;
                        // Style canvas for logical dimensions (for layout)
                        canvas.style.width = `${textWidth + paddingX * 2}px`;
                        canvas.style.height = `${textHeight + paddingY * 2}px`;


                        // Scale context
                        ctx.scale(scale, scale);

                        // Optional: make background white for better visibility
                        ctx.fillStyle = "#fff";
                        ctx.fillRect(0, 0, canvas.width / scale, canvas.height / scale);

                        // Set font again (after scale)
                        ctx.font = `${fontSize}px ${fontFamily}`;
                        ctx.fillStyle = "#000";
                        ctx.textBaseline = "top";

                        // Draw text without padding
                        ctx.fillText(formattedEmail, paddingX, paddingY);

                        // Save as image
                        officer.email = canvas.toDataURL("image/png");
                        return officer;
                    });
                    setOfficerData(officersData);
                }
                setHeading(result.heading);
            } catch (err) {
                console.error("Error Fetching content!", err);
            }
        };
        setTimeout(fetchData, 500);
    }, [lang]);
    const columns = [
        { Header: "#", accessor: (row, index) => index + 1 },
        { Header: Translate.officerName[lang], accessor: "name" },
        { Header: Translate.designation[lang], accessor: "designation" },
        { Header: Translate.roomNo[lang], accessor: "room_no" },
        {
            Header: Translate.email[lang],
            accessor: "email",
            Cell: ({ value }) =>
                value && value.startsWith("data:image") ? (
                    <img src={value} alt="email" className="md:h-10 lg:h-10 w-auto email-img" />
                ) : (
                    value
                ),
        },
        { Header: Translate.mobile[lang], accessor: "telephone" },
    ];
    return officerData.length > 0 ? (
        <div className="whos-who-container">
            <PageHeader pageTitle={heading} language={lang} />
            <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
                <div className="w-full px-4">
                    <div
                        className="title-group2 pb-2 lg:pb-5 mb-5"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        <h2 className="themeTitle text-2xl lg:text-4xl font-bold text-center">
                            {heading}
                        </h2>
                    </div>
                </div>
            </div>
            <div className="mb-10 whos-table">
                <Table columns={columns} data={officerData} language={lang} />
            </div>
        </div>
    ) : (
        <h3 className="text-center">Loading.....</h3>
    );
};

export default Page;
