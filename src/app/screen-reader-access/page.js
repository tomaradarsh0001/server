"use client";

import PageHeader from "@/components/PageHeader";
import PageHeaderSkeleton from "@/components/PageHeaderSkeleton";
import React, { useState, useEffect, useContext } from "react";
import { LangContext } from "@/components/Container"; //added by Nitin
import Translate from "@/language.json";

const SkeletonLoader = () => {
    return (
        <div className="contact-us">
            <PageHeaderSkeleton />
            <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
                <div className="w-full px-4">
                    <div className="title-group2 pb-2 lg:pb-5 mb-5 animate-pulse">
                        <h2 className="themeTitle text-2xl lg:text-4xl font-bold text-center bg-gray-200 h-14 w-[500px] mx-auto rounded"></h2>
                    </div>
                </div>
            </div>

            <div className="flex justify-center w-full px-4">
                <div className="overflow-x-auto w-full lg:w-1/2">
                    <p className="h-10 w-100 bg-gray-200 animate-pulse opacity-50"></p>
                    <div className="h-[500px] w-[1350px] bg-gray-200 mb-[150px] animate-pulse opacity-50"></div>
                </div>
            </div>
        </div>
    );
};
const Page = () => {
    const { lang } = useContext(LangContext);
    const [screenReaders, setScreenReaders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://ldo.mohua.gov.in/admin/api/screen-readers-access`
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch data");
                }

                const jsonData = await response.json();
                setScreenReaders(jsonData);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [lang]);

    if (isLoading) {
        return <SkeletonLoader />;
    }

    return (
        <div className="contact-us">
            <PageHeader
                pageTitle={
                    lang === "hindi"
                        ? "स्क्रीन रीडर एक्सेस"
                        : "Screen Reader Access"
                }
                language={lang}
            />
            <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
                <div className="w-full px-4">
                    <div
                        className="title-group2 pb-2 lg:pb-5 mb-5"
                        data-aos="fade-up"
                        data-aos-duration="1000"
                    >
                        <h2 className="themeTitle text-2xl lg:text-4xl font-bold text-center">
                            {lang === "hindi"
                                ? "स्क्रीन रीडर सूची"
                                : "Screen Reader List"}
                        </h2>
                    </div>
                    <p>{Translate.ReaderAccessHeading[lang]}</p>
                </div>
            </div>

            {/* Centered Responsive Table */}
            <div className="flex justify-center w-fully px-4">
                <div className="overflow-x-auto w-full lg:w-1/1">
                    <table className="min-w-full border border-gray-300 mb-[130px]">
                        <thead>
                            <tr className="bg-gray-200 text-left">
                                <th className="border border-gray-300 px-3 py-1">
                                    #
                                </th>
                                <th className="border border-gray-300 px-3 py-1">
                                    {lang === "hindi"
                                        ? "स्क्रीन रीडर"
                                        : "Screen Reader"}
                                </th>
                                <th className="border border-gray-300 px-3 py-1">
                                    {lang === "hindi" ? "वेबसाइट" : "Website"}
                                </th>
                                <th className="border border-gray-300 px-3 py-1">
                                    {lang === "hindi" ? "प्रकार" : "Type"}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {screenReaders.map((reader, index) => (
                                <tr
                                    key={reader.id}
                                    className="hover:bg-gray-100"
                                >
                                    <td className="border border-gray-300 px-4 py-2">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {lang === "hindi"
                                            ? reader.screen_reader_hin
                                            : reader.screen_reader_eng}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <a
                                            href={reader.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            {reader.website}
                                        </a>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {reader.type}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Page;
