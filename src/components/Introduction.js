"use client";

import React, { useEffect, useState, useContext } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import ReadMoreBtn from './ReadMoreBtn';
import { HOST_NAME, API_HOST } from '../constants'; // added by Nitin
import { LangContext } from './Container'; // added by Nitin

const SkeletonLoader = () => {
    return (
        <div className="introduction-container px-4 md:px-4 py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
            <div className="block lg:flex items-center w-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative">
                        <div className="pb-5 bg-gray-300 h-16 w-3/4 animate-pulse"></div>
                        <div className="section_image mb-5 mt-5 gdn-img bdrs-hidn bg-gray-300 h-[1050px] w-full animate-pulse"></div>
                        <div className="orange-content-bg p-5 mb-5 lg:mb-0 h-[282px] opacity-60 text-white rounded-[10px] -mt-10 lg:mt-5 w-full lg:w-1/2 relative lg:absolute right-0 -bottom-0 bg-gray-300 h-24 animate-pulse"></div>
                    </div>
                </div>
                <div className="w-full lg:w-2/4 px-4 mt-10 lg:mt-0">
                    <div className="bg-gray-300 h-[360px] w-full animate-pulse"></div>
                    <div className="mt-5 bg-gray-300 h-[48px] w-[170px] animate-pulse"></div>
                </div>
            </div>
        </div>
    );
};
const Introduction = () => {
    const { lang } = useContext(LangContext);
    const [componentContent, setComponentContent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`${API_HOST}componentData/Introduction/${lang}`);
                const result = await response.json();
                if (result.code === 200) {
                    setComponentContent(result);
                }
            } catch (err) {
                console.error("Error Fetching content!", err);
            }
        };

        fetchData();

        const loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 0); 

        return () => clearTimeout(loadingTimeout);
    }, [lang]);

    if (loading || !componentContent?.sections) {
        return <SkeletonLoader />;
    }
    return (
        <div className="introduction-container px-4 md:px-4 py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
            <div className="block lg:flex items-center w-full">
                <div className="w-full lg:w-2/4 px-4">
                    <div className="relative">
                        <div className="title-group pb-5">
                            <h2 className="themeTitle text-2xl lg:text-4xl font-bold" data-aos="fade-right" data-aos-duration="1000">
                                {componentContent.heading}
                            </h2>
                        </div>
                        <div className="section_image mb-5 mt-5 gdn-img bdrs-hidn" data-aos="zoom-out-right" data-aos-duration="1000">
                            <Image
                                src={componentContent.sections[0]?.image ? HOST_NAME.replace('/admin', '') + componentContent.sections[0].image : "/images/introduction.jpg"}
                                alt="Introduction"
                                className="w-full rounded-[10px]"
                                width={500}
                                height={500}
                            />
                        </div>
                        {/* <div className="orange-content-bg p-5 mb-5 lg:mb-0 text-white rounded-[10px] -mt-10 lg:mt-5 w-full lg:w-1/2 relative lg:absolute right-0 -bottom-0" data-aos="flip-left" data-aos-duration="1000">
                            <div className="subtitle-group pb-2">
                                <h4 className="md:text-2xl font-bold">{componentContent.sections[0]?.title || ''}</h4>
                            </div>
                            <p className="text-white mt-5 text-sm md:text-base">{componentContent.sections[0]?.content || ''}</p>
                        </div> */}
                    </div>
                </div>
                <div className="w-full lg:w-2/4 px-4 mt-10 lg:mt-0">
                    <div className="para-border" data-aos="fade-left" data-aos-duration="1000">
                        <p className="md:text-2xl">{componentContent.sections[1]?.content || ''}</p>
                    </div>
                    <div data-aos="fade-left" data-aos-duration="1000">
                        <ReadMoreBtn link="/history-and-mandate" language={lang} className="mt-5" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Introduction
