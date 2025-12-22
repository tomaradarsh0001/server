import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import CountUp from "react-countup";
import { LangContext } from "./Container";
import Translate from "@/language.json";
import { HOST_NAME, API_HOST } from "../constants"; // Added by Nitin

import citiesIcon from "../../public/facts/faMountainCity.svg";
import propertiesIndiaIcon from "../../public/facts/faPropertiesIndia.svg";
import propertiesDelhiIcon from "../../public/facts/faPropertiesDelhi.svg";
import residentialPropertiesIcon from "../../public/facts/faPropertiesResidential.svg";
import commercialPropertiesIcon from "../../public/facts/faPropertiesCommercial.svg";
import institutionalIcon from "../../public/facts/faInstitutional.svg";
import industrialIcon from "../../public/facts/faIndustrial.svg";
import governmentIcon from "../../public/facts/faGovernment.svg";
import foreignMissionsIcon from "../../public/facts/faForeignMissions.svg";
import visitorsCountIcon from "../../public/facts/faVisitorsCount.svg";
import fileCheckIcon from "../../public/facts/fileCheckmark.svg";

const SkeletonLoader = () => {
    return (
        <div id="maincontent" className="dashboard-facts-container px-4 md:px-4 py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-24">
            <div className="facts-row grid grid-cols-2 gap-2 xl:grid-cols-4 xl:gap-6 lg:grid-cols-4 lg:gap-4 md:grid-cols-3 md:gap-3">
                {[...Array(8)].map((_, index) => (
                    <div key={index} className="facts-card text-center w-full animate-pulse bg-gray-400 p-4 rounded-lg">
                        <div className="facts-icon opacity-60 bg-gray-200 h-24 w-24 rounded-full mx-auto mb-3"></div>
                        <div className="facts-value opacity-60 my-2 bg-gray-300 h-12 w-24 mx-auto rounded"><h3></h3></div>
                        <div className="facts-title opacity-60 bg-gray-300 h-4 w-64 mx-auto rounded"><p></p></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardFacts = () => {
    const { lang } = useContext(LangContext);

    // State for fetched API data
    const [apiData, setApiData] = useState(null);
    const [visitorCount, setVisitorCount] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const formatToCrores = (value) => (value / 10000000).toFixed(2) + " Cr.";

    useEffect(() => {
        let timeout;

        const fetchPropertyData = async () => {
            try {
                const response = await fetch("https://ldo.mohua.gov.in/edharti/api/property-count/summary");
                const data = await response.json();

                if (response.ok) {
                    setApiData(data);
                } else {
                    setError(data.message || "Failed to fetch data");
                    setIsError(true);
                }
            } catch (err) {
                console.error("Fetch Error:", err.message || "Something went wrong");
                setError(err.message || "Something went wrong");
                setIsError(true);
            }
        };

        const fetchVisitorCount = async () => {
            try {
                const response = await fetch(API_HOST + "visitor-count");
                const data = await response.json();

                if (response.ok) {
                    setVisitorCount(data.visitor_count);
                } else {
                    setError(data.message || "Failed to fetch visitor count");
                    setIsError(true);
                }
            } catch (err) {
                console.error("Fetch Error:", err.message || "Something went wrong");
                setError(err.message || "Something went wrong");
                setIsError(true);
            }
        };

        Promise.all([fetchPropertyData(), fetchVisitorCount()])
            .then(() => {
                timeout = setTimeout(() => {
                    setLoading(false);
                    setIsLoading(false);
                }, 0);
            })
            .catch(() => {
                setIsError(true);
            });

        return () => clearTimeout(timeout);
    }, []);


    // Handle loading and error states
    if (loading) return <SkeletonLoader />;

    if (error) {
        return <SkeletonLoader />;
    }

    const factsData = [
        {
            factsIcon: propertiesDelhiIcon,
            factsTitle: Translate.totalProperties[lang],
            factsValue: (
                <CountUp
                    start={0}
                    end={apiData.total_property_count}
                    duration={5}
                    useEasing={true}
                    separator=","
                    enableScrollSpy={true}
                />
            )
        },
        {
            factsIcon: residentialPropertiesIcon,
            factsTitle: Translate.totalPlotArea[lang],
            factsValue: (
                <CountUp
                    start={0}
                    end={apiData.total_plot_area}
                    duration={5}
                    useEasing={true}
                    separator=","
                    suffix=" Sqm."  // <-- Added suffix here
                    enableScrollSpy={true}
                />
            )
        },
        {
            factsIcon: fileCheckIcon,
            factsTitle: Translate.Apply[lang],
            factsValue: (
                <a
                    href="https://ldo.mohua.gov.in/edharti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-opacacity-50 hover:text-orange-500"
                >
                    {Translate.Mutation[lang]}
                </a>
            )
        },
        {
            factsIcon: fileCheckIcon,
            factsTitle: Translate.Apply[lang],
            factsValue: (
                <a
                    href="https://ldo.mohua.gov.in/edharti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-opacacity-50 hover:text-orange-500"
                >
                    {Translate.Conversion[lang]}
                </a>
            )
        },
        {
            factsIcon: fileCheckIcon,
            factsTitle: Translate.Apply[lang],
            factsValue: (
                <a
                    href="https://ldo.mohua.gov.in/edharti"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-opacacity-50   hover:text-orange-500"
                >
                    {Translate.NOC[lang]}
                </a>
            )
        },
        {
            factsIcon: fileCheckIcon,
            factsTitle: Translate.Apply[lang],
            factsValue: (
                <a
                    href="https://ldo.gov.in/edharti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-opacacity-50  hover:text-orange-500"
                >
                    {Translate.LUC[lang]}
                </a>
            )
        },
        {
            factsIcon: fileCheckIcon,
            factsTitle: Translate.Apply[lang],
            factsValue: (
                <a
                    href="https://ldo.mohua.gov.in/edharti/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-semibold hover:text-opacacity-50   hover:text-orange-500"
                >
                    {Translate.DOA[lang]}
                </a>
            )
        },
        {
            factsIcon: visitorsCountIcon,
            factsTitle: Translate.VisitorsCount[lang],
            factsValue: (
                <CountUp
                    start={0}
                    end={visitorCount || 0} // Use fetched visitor count
                    duration={5}
                    useEasing={true}
                    separator=","
                    enableScrollSpy={true}
                />
            )
        }
    ];

    return (
        <div
            className="dashboard-facts-container px-4 md:px-4 py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-24"
            id="maincontent"
        >
            <div className="facts-row grid grid-cols-2 gap-2 xl::grid-cols-4 xl:gap-6 lg:grid-cols-4 lg:gap-4 md:grid-cols-3 md:gap-3">
                {factsData.map((item, index) => {
                    return (
                        <div
                            key={index}
                            className="facts-card text-center w-full"
                            data-aos="fade-up"
                        >
                            <div className="facts-icon text-center">
                                <Image
                                    src={item.factsIcon}
                                    alt={item.factsTitle}
                                    className="w-auto h-auto m-auto"
                                />
                            </div>
                            <div className="facts-value my-2">
                                <h3 className="text-base 2xl:text-3xl font-bold">
                                    {item.factsValue}
                                </h3>
                            </div>
                            <div className="facts-title">
                                <p className="text-base text-white mb-0">
                                    {item.factsTitle}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardFacts;
