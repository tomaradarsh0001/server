"use client";
import React, { useEffect, useState, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import ReadMoreBtn from "./ReadMoreBtn";
import { HOST_NAME, API_HOST } from "../constants";
import { LangContext } from "@/components/Container";
import Translate from "../language.json";

const leftIcon = "/faCircleArrowLeft.svg";
const pauseIcon = "/Pause-icon.svg";
const playIcon = "/Play-icon.svg";
const rightIcon = "/faCircleArrowRight.svg";

// Skeleton Loading Component create by Adarsh on 03 febuary 2025
const SkeletonLoader = () => (
    <div className="news-cont items-center overflow-hidden w-full md:w-[80%] lg:w-[70%]">
        <div className="flex gap-2 animate-pulse">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="w-96 h-9 bg-gray-300 rounded-md"></div>
            ))}
        </div>
    </div>
);

const NewsSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [newsCount, setNewsCount] = useState(0);
    const { lang } = useContext(LangContext);
    const [news, setNews] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_HOST}headerNews/${lang}`);
                const result = await response.json();

                setTimeout(() => {
                    setNews(result);
                    setNewsCount(result.length || 0);
                    setIsLoading(false);
                }, 0);
            } catch (err) {
                console.error("Error Fetching News Data!", err);
                setIsLoading(false);
            }
        };

        fetchData();
        
    }, [lang]);

    useEffect(() => {
        let interval;
        if (isPlaying && newsCount > 0) {
            interval = setTimeout(() => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % newsCount);
            }, 2000);
        }
        return () => clearTimeout(interval);
    }, [currentIndex, isPlaying, newsCount]);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + newsCount) % newsCount);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % newsCount);
    };

    const togglePlayPause = () => {
        setIsPlaying((prevState) => !prevState);
    };

    return (
        <div
            className="news-container md:flex md:items-center md:justify-between p-2 lg:px-8"
            data-aos="zoom-out-up"
            data-aos-duration="1000"
        >
            <div className="keyUpdate w-full md:w-[108px] border-b-2 md:border-b-0 md:border-r-2">
                <p className="font-semibold text-center md:text-left text-base mb-0">
                    {Translate.keyUpdate[lang]}
                </p>
            </div>

            <div className="news-data mt-2 md:mt-0 md:w-[calc(100%-108px)]">
                {isLoading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="news-cont items-center overflow-hidden w-full md:w-[80%] lg:w-[70%]">
                        <div
                            style={{
                                display: "flex",
                                transition: "transform 0.3s ease",
                                width: `${newsCount * 50}%`,
                                transform: `translateX(-${(currentIndex / newsCount) * 100}%)`,
                            }}
                        >
                            {news.map((text, index) => (
                                <Link
                                    key={index}
                                    href={`/whats-news/${text.id}`}
                                    className="news_datalist"
                                    style={{
                                        width: `${100 / newsCount}%`,
                                        flexShrink: 0,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    {text.title}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="news-controller flex items-center justify-end sm:w-[252px] md:w-[300px] lg:w-[262px] border-l-2">
                    <div className="controller-group flex md:gap-2 md:mr-[10px]">
                        <button onClick={prevSlide}>
                            <Image src={leftIcon} alt="Left Icon" width={24} height={24} />
                        </button>
                        <button onClick={togglePlayPause}>
                            {isPlaying ? (
                                <Image src={pauseIcon} alt="Pause Icon" width={24} height={24} />
                            ) : (
                                <Image src={playIcon} alt="Play Icon" width={24} height={24} />
                            )}
                        </button>
                        <button onClick={nextSlide}>
                            <Image src={rightIcon} alt="Right Icon" width={24} height={24} />
                        </button>
                    </div>
                    <ReadMoreBtn link="/whats-news" language={lang} />
                </div>
            </div>
        </div>
    );
};

export default NewsSlider;
