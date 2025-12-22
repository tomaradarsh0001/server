import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { HOST_NAME, API_HOST } from "../constants";
import { LangContext } from "./Container";

// Skeleton Loading Component create by Adarsh on 03 febuary 2025
const SkeletonLoader = () => {
    return (
        <div className="portal-group-container px-4 md:px-4 py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
            <div className="portal-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-14 p-4">
                {[...Array(7)].map((_, ind) => (
                    <div key={ind} className="animate-pulse">
                        <div className="mb-5 sm:mb-0 flex flex-col gap-3 flex justify-between opacity-50 items-center">
                            <div className="icon_group circle relative">
                                <div className="icons_circle circle-sm circle2 relative w-20 h-20 m-auto rounded-full bg-gray-300 flex items-center justify-center"></div>
                                <span className="circle__back-1"></span>
                                <span className="circle__back-2"></span>
                            </div>
                            <h4 className="font-medium text-lg text-center mt-4 bg-gray-300 h-6 w-48 mx-auto rounded"></h4>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const PortalGroup = () => {
    const { lang } = useContext(LangContext);
    const [componentContent, setComponentContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(
                    `${API_HOST}componentData/E-Portal/${lang}`
                );
                const result = await response.json();
                if (result.code === 200) {
                    setComponentContent(result);
                    setIsError(false);
                    setTimeout(() => setIsLoading(false), 0);
                } else {
                    setIsError(true);
                }
            } catch (err) {
                console.error("Error Fetching content:", err);
                setIsError(true);
            }
        };
        fetchData();
        const timer = setTimeout(() => {
            if (isError) {
                setIsLoading(true);
            }
        }, 5000);
        return () => {
            clearTimeout(timer);
        };
    }, [lang, isError]);

    if (isLoading) {
        return <SkeletonLoader />;
    }
    return (
        <div className="portal-group-container px-4 md:px-4 py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
            <div className="portal-container grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-14">
                {componentContent.sections.map((item, ind) => {
                    let itemLink = item.link ?? "#";
                    let linkType = item.link_type;
                    if (linkType === 3) {
                        itemLink = `${HOST_NAME}${itemLink}`;
                    }
                    return (
                        <div key={ind} className="grid-item mb-5 sm:mb-0">
                            <Link
                                href={itemLink.replace('/admin', '')}
                                className="portal-link"
                                target={linkType > 1 ? "_blank" : ""}
                            >
                                <div className="icon_group circle relative">
                                    <div className="icons_circle circle-sm circle2 relative w-20 h-20 m-auto rounded-full bg-white flex items-center justify-center">
                                        <Image
                                             src={`${HOST_NAME.replace('/admin', '')}${item.image}`}
                                            alt={item.title}
                                            className="w-50"
                                            width={50}
                                            height={50}
                                        />
                                    </div>
                                    <span className="circle__back-1"></span>
                                    <span className="circle__back-2"></span>
                                </div>
                                <h4 className="font-medium text-lg text-center mt-2 md:mt-2">
                                    {item.title}
                                </h4>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PortalGroup;
