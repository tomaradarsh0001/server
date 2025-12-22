import React, { useEffect, useState, useContext } from "react";
import SubstitutionImage from "../../public/images/introduction.jpg";
import CheckIcon from "../../public/CheckIcon.svg";
import Image from "next/image";
import Link from "next/link";
import ReadMoreBtn from "./ReadMoreBtn";
import { ChevronRightIcon } from '@heroicons/react/24/outline' //added by Swati on 06052025
import { HOST_NAME, API_HOST } from "../constants"; //added by Nitin
import { LangContext } from "./Container"; //added by Nitin
import Translate from "@/language.json"; //added by Swati

const SkeletonLoader = () => (
    <div className="overflow-x-hidden">
      <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
        <div className="w-full px-4">
          <div className="title-group2 pb-2 lg:pb-5 mb-5" data-aos="fade-up">
            <div className=" h-14 w-[500px] skeleton bg-gray-300 animate-pulse mx-auto rounded"></div>
          </div>
        </div>
      </div>
  
      <div className="whatwedo section-bg-0 px-4 py-4 md:px-6 md:py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
        <div className="block md:flex items-center w-full py-4 md:py-6 lg:py-8">
          <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0 md:hidden">
            <div className="section_image" data-aos="fade-left">
              <div className="animate-pulse skeleton bg-gray-300 h-40 w-full rounded"></div>
            </div>
          </div>
          <div className="w-full md:w-2/4 px-4">
            <div className="section-content">
              <div className="title-group-subtitle pb-2 lg:pb-5 mb-5" data-aos="fade-right">
                <div className="animate-pulse skeleton bg-gray-300 h-14 w-1/4 mb-2"></div>
              </div>
              <div className="animate-pulse skeleton bg-gray-300 h-48 w-4/4 mb-4"></div>
              <div className="more-info-link mt-4" data-aos="fade-right">
                <div className="animate-pulse rounded skeleton bg-gray-300 h-10 w-32  inline-block"></div>
                <div className="animate-pulse rounded skeleton bg-gray-300 h-10 w-32 ml-3 inline-block"></div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0 hidden md:block">
            <div className="bdrs-hidn" data-aos="fade-left">
              <div className="animate-pulse skeleton bg-gray-300 h-[765px] w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="whatwedo section-bg-1 px-4 py-4 md:px-6 md:py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
        <div className="block md:flex items-center w-full py-4 md:py-6 lg:py-8">
          <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0">
            <div className="bdrs-hidn" data-aos="fade-right">
              <div className="animate-pulse skeleton bg-gray-300 h-[765px] w-full rounded"></div>
            </div>
          </div>
          <div className="w-full md:w-2/4 px-4">
            <div className="section-content">
              <div className="title-group-subtitle pb-2 lg:pb-5 mb-5" data-aos="fade-left">
                <div className="animate-pulse skeleton bg-gray-300 h-14 w-1/4 mb-2"></div>
              </div>
              <div className="animate-pulse skeleton bg-gray-300 h-48 w-4/4 mb-4"></div>
              <div className="more-info-link mt-4" data-aos="fade-left">
                <div className="animate-pulse rounded skeleton bg-gray-300 h-10 w-32 inline-block"></div>
                <div className="animate-pulse rounded skeleton bg-gray-300 h-10 w-32 ml-3 inline-block"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <div className="whatwedo section-bg-0 px-4 py-4 md:px-6 md:py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
        <div className="block md:flex items-center w-full py-4 md:py-6 lg:py-8">
          <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0 md:hidden">
            <div className="section_image" data-aos="fade-left">
              <div className="skeleton bg-gray-300 h-40 w-full rounded"></div>
            </div>
          </div>
          <div className="w-full md:w-2/4 px-4">
            <div className="section-content">
              <div className="title-group-subtitle pb-2 lg:pb-5 mb-5" data-aos="fade-right">
                <div className="animate-pulse skeleton bg-gray-300 h-14 w-1/4 mb-2"></div>
              </div>
              <div className="animate-pulse skeleton bg-gray-300 h-48 w-4/4 mb-4"></div>
              <div className="more-info-link mt-4" data-aos="fade-right">
                <div className="animate-pulse rounded skeleton bg-gray-300 h-10 w-32 inline-block"></div>
                <div className="animate-pulse rounded skeleton bg-gray-300 h-10 w-32 ml-3 inline-block"></div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-2/4 px-4 mt-10 lg:mt-0 hidden md:block">
            <div className="bdrs-hidn" data-aos="fade-left">
              <div className="animate-pulse skeleton bg-gray-300 h-[765px] w-full rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
const WhatWeDo = () => {
    const { lang } = useContext(LangContext);
    const [componentContent, setComponentContent] = useState("");
    const [expandedSections, setExpandedSections] = useState([]);//added by Swati on 06052025

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    API_HOST + "componentData/What We Do/" + lang
                );
                const result = await response.json();
                if (result.code == 200) {
                    setComponentContent(result);
                }
            } catch (err) {
                console.error("Error Fetching content!", err);
            }
        };
      
          
        // setTimeout(fetchData, 2055500);
        fetchData();
    }, [lang]);
      //added by Swati on 06052025 for read more toggle 
    const toggleReadMore = (index) => {
        setExpandedSections((prev) => {
          const updated = [...prev];
          updated[index] = !updated[index];
          return updated;
        });
      };
      

    return componentContent.sections == undefined ? (
        <SkeletonLoader />
    ) : (
        <div className="overflow-x-hidden">
            <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
                <div className="w-full px-4">
                    <div
                        className="title-group2 pb-2 lg:pb-5 mb-5"
                        data-aos="fade-up" 
                    >
                        <h2 className="themeTitle text-2xl lg:text-4xl font-bold text-center">
                            {componentContent.heading}
                        </h2>
                    </div>
                </div>
            </div>

            <div className="whatwedo section-bg-0 px-4 py-4 md:px-6 md:py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
                <div className="block md:flex items-center w-full py-4 md:py-6 lg:py-8">
                    <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0 md:hidden">
                        <div
                            className="section_image"
                            data-aos="fade-left"
                        >
                            <Image
                                src={
                                    HOST_NAME.replace('/admin', '') +
                                    componentContent.sections[0].image
                                }
                                target="_blank"
                                alt="Substitution Image"
                                className="w-full relative gradient_img"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-2/4 px-4">
                        <div className="section-content">
                            <div
                                className="title-group-subtitle pb-2 lg:pb-5 mb-5"
                                data-aos="fade-right"
                            >
                                <h2 className="themeTitle text-xl lg:text-3xl font-bold">
                                    {componentContent.sections[0].title}
                                </h2>
                            </div>
                            <p
                                className="text-sm md:text-base lg:text-lg"
                                data-aos="fade-right"
                            >
                                {/* {componentContent.sections[0].content} */}
                                {/* added by Swati on 06052025 for read more toggle  */}
                                {expandedSections[0]
                                    ? componentContent.sections[0].content
                                    : componentContent.sections[0].content.substring(0, 500) + (componentContent.sections[0].content.length > 500 ? "..." : "")
                                }
                                {componentContent.sections[0].content.length > 500 && (
                                <button
                                    onClick={() => toggleReadMore(0)}
                                    className="readmore-btn animation-btn text-sm md:text-lg px-4 text-blue-600 inline-flex items-center mt-2"
                                >
                                    {expandedSections[0]
                                    ? Translate.ReadLess?.[lang] || "Read Less"
                                    : Translate.readMore?.[lang] || "Read More"}
                                    <ChevronRightIcon className="ml-2 w-4 md:w-5" />
                                </button>
                                )}
                            </p>
                            <div
                                className="more-info-link mt-4"
                                data-aos="fade-right"
                            >
                              
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0 hidden md:block">
                        <div
                            className="section_image bdrs-hidn"
                            data-aos="fade-left"
                        >
                            <Image
                                src={
                                    HOST_NAME.replace('/admin', '') +
                                    componentContent.sections[0].image
                                }
                                alt="Substitution Image"
                                className="w-full relative gradient_img"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="whatwedo section-bg-1 px-4 py-4 md:px-6 md:py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
                <div className="block md:flex items-center w-full py-4 md:py-6 lg:py-8">
                    <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0">
                        <div
                            className="section_image bdrs-hidn"
                            data-aos="fade-right"
                        >
                            <Image
                                src={
                                    HOST_NAME.replace('/admin', '') +
                                    componentContent.sections[1].image
                                }
                                alt="Substitution Image"
                                className="w-full relative gradient_img"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-2/4 px-4">
                        <div className="section-content">
                            <div
                                className="title-group-subtitle pb-2 lg:pb-5 mb-5"
                                data-aos="fade-left"
                            >
                                <h2 className="themeTitle text-xl lg:text-3xl font-bold">
                                    {componentContent.sections[1].title}
                                </h2>
                            </div>
                            <p
                                className="text-sm md:text-base lg:text-lg"
                                data-aos="fade-left"
                            >
                                {/* {componentContent.sections[1].content} */}
                                {/* added by Swati on 06052025 for read more toggle */}
                                {expandedSections[1]
                                    ? componentContent.sections[1].content
                                    : componentContent.sections[1].content.substring(0, 500) + (componentContent.sections[1].content.length > 500 ? "..." : "")
                                }
                                {componentContent.sections[1].content.length > 500 && (
                                <button
                                    onClick={() => toggleReadMore(1)}
                                    className="readmore-btn animation-btn text-sm md:text-lg px-4 text-blue-600 inline-flex items-center mt-2"
                                >
                                    {expandedSections[1]
                                    ? Translate.ReadLess?.[lang] || "Read Less"
                                    : Translate.readMore?.[lang] || "Read More"}
                                    <ChevronRightIcon className="ml-2 w-4 md:w-5" />
                                </button>
                                )}
                            </p>
                        
                            <div
                                className="more-info-link mt-4"
                                data-aos="fade-left"
                            >
                               
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="whatwedo section-bg-0 px-4 py-4 md:px-6 md:py-10 lg:px-8 xl:py-20 xl:px-10 2xl:px-24 2xl:py-10">
                <div className="block md:flex items-center w-full py-4 md:py-6 lg:py-8">
                    <div className="w-full md:w-2/4 px-4 mb-5 lg:mb-0 md:hidden">
                        <div
                            className="section_image"
                            data-aos="fade-left"
                        >
                            <Image
                                src={
                                    HOST_NAME.replace('/admin', '') +
                                    componentContent.sections[2].image
                                }
                                alt="Substitution Image"
                                className="w-full relative gradient_img"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                    <div className="w-full md:w-2/4 px-4">
                        <div className="section-content">
                            <div
                                className="title-group-subtitle pb-2 lg:pb-5 mb-5"
                                data-aos="fade-right"
                            >
                                <h2 className="themeTitle text-xl lg:text-3xl font-bold">
                                    {componentContent.sections[2].title}
                                </h2>
                            </div>
                            <p
                                className="text-sm md:text-base lg:text-lg"
                                data-aos="fade-right"
                            >
                                {/* {componentContent.sections[2].content} */}
                                {/* added by Swati on 06052025 for read more toggle  */}
                                {expandedSections[2]
                                    ? componentContent.sections[2].content
                                    : componentContent.sections[2].content.substring(0, 500) + (componentContent.sections[2].content.length > 500 ? "..." : "")
                                }
                                {componentContent.sections[2].content.length > 500 && (
                                <button
                                    onClick={() => toggleReadMore(2)}
                                    className="readmore-btn animation-btn text-sm md:text-lg px-4 text-blue-600 inline-flex items-center mt-2"
                                >
                                    {expandedSections[2]
                                    ? Translate.ReadLess?.[lang] || "Read Less"
                                    : Translate.readMore?.[lang] || "Read More"}
                                    <ChevronRightIcon className="ml-2 w-4 md:w-5" />
                                </button>
                                )}
                            </p>
                            <div
                                className="more-info-link mt-4"
                                data-aos="fade-right"
                            >
                               
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-2/4 px-4 mt-10 lg:mt-0 hidden md:block">
                        <div
                            className="section_image bdrs-hidn"
                            data-aos="fade-left"
                        >
                            <Image
                                src={
                                    HOST_NAME.replace('/admin', '') +
                                    componentContent.sections[2].image
                                }
                                alt="Substitution Image"
                                className="w-full relative gradient_img"
                                width={150}
                                height={150}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhatWeDo;
