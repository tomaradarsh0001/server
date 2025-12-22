"use client";

import PageHeader from "@/components/PageHeader";

import React, { useEffect, useState, useContext } from "react";
import pdFIcon from "../../../public/pdf_icon.svg";
import Image from "next/image";
import ActTable from "@/components/ActTable";
import Link from "next/link";
import Translate from "../../language.json";
import { HOST_NAME, API_HOST } from "../../constants"; //added by Nitin
import { LangContext } from "@/components/Container"; //added by Nitin
// import Tooltip from "@/components/Tooltip"; // Adjust path if needed
import Popup from "@/components/Popup"; 

const Page = () => {
    const { lang } = useContext(LangContext);
    const [tableData, setTableData] = useState([]);
    const [heading, setHeading] = useState([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupContent, setPopupContent] = useState("");

    const handleOpenPopup = (content) => {
        setPopupContent(content);
        setIsPopupOpen(true);
      };
    
      // Close popup
      const handleClosePopup = () => {
        setIsPopupOpen(false);
      };
     //SwatiMishra changed date format function added on 02052025
      const formatDate = (dateStr) => {
        if (!dateStr) return "NA";
        const date = new Date(dateStr);
        if (isNaN(date)) return "NA";
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
      };
          
    const columns = [
        { Header: "#", accessor: (row, index) => index + 1 },
        { Header: "File No.", accessor: "file_no" },
        { Header: "Case No.", accessor: "case_no" },
        { Header: "Subject", accessor: "subject" },
       
      /*  {
            Header: "Status",
            accessor: (row) => row.status || "NA",
            Cell: ({ value }) => {
              const truncatedValue = value.length > 50 ? value.substring(0, 50) + "..." : value;
              const showReadMore = value.length > 50;
      
              return (
                <div style={{ maxWidth: "600px", height: "60px" }}>
                  <div
                    style={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      WebkitLineClamp: 2,
                      whiteSpace: "normal",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {truncatedValue}
                  </div>
                  {showReadMore && (
                    <button
                      onClick={() => handleOpenPopup(value)}
                      style={{
                        color: "blue",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                      }}
                    >
                      Read more
                    </button>
                  )}
                </div>
              );
            },
          },
          {
            Header: "LDOH-NDOH",
            accessor: (row, index) => {
                return `${row.ldoh ? row.ldoh : "NA"} - ${row.ndoh ? row.ndoh : "NA"}`;
            },
        },        
        { Header: "Section", accessor: "section" }, ///Department removed by adarsh
        { Header: "Commencement Date", accessor: "commencement_date" },*/
{
            Header: "LDOH-NDOH",
            accessor: (row, index) => {
              return `${formatDate(row.ldoh)} - ${formatDate(row.ndoh)}`; ////SwatiMishra changed date format on 02052025
            },
        }, 
        // {
        //     Header: "Closing Date",
        //     accessor: (row, index) =>
        //         row.closing_date ? row.closing_date : "NA",
        // },
       /* {
            Header: "Closing Date/Judgement",
            accessor: (row, index) =>
                row.judgement_link ? (
                    <>
                        <div>{row.closing_date ? row.closing_date : "NA"}</div>
                        <Link
                            target="_blank"
                            href={HOST_NAME + row.judgement_link}
                        >
                            <Image src={pdFIcon} alt="PDF" />
                        </Link>
                    </>
                ) : (
                    "NA"
                ),
        },
        {
            Header: "Active in Court",
            accessor: (row, index) =>
                row.active_in_court ? row.active_in_court : "NA",
        },*/
    ];
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(API_HOST + "esocourt/" + lang);
                const result = await response.json();
                if (result.items.length > 0) {
                    setTableData(result.items);
                    setHeading(result.heading);
                }
            } catch (err) {
                console.error("Error Fetching content!", err);
            }
        };
        fetchData();
    }, [lang]);
    return tableData.length == 0 ? (
        <h3 className="text-center">Loading.....</h3>
    ) : (
        <div className="contact-us">
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
            <ActTable columns={columns} data={tableData} language={lang} totalCountLabel="Total"/>
            <Popup isOpen={isPopupOpen} onClose={handleClosePopup} content={popupContent} />
        </div>
    );
};

export default Page;
