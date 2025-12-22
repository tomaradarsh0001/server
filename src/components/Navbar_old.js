"use client";
import Link from "next/link";
import React, { Fragment, useState, useEffect, useContext } from "react";
import { Popover, Transition } from "@headlessui/react";
import Image from "next/image";
import LanguageIcon from "../../public/faLanguage.svg";
import AppearanceIcon from "../../public/faUniversalAccess.svg";
import SocialIcon from "../../public/social-media.svg";
import Navigation from "./Navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { LangContext } from "./Container";
import Translate from "@/language.json";

const Navbar = () => {
    // Initiate Animation
    useEffect(() => {
        AOS.init();
    }, []);
    
    const { lang, setLang } = useContext(LangContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [fontSize, setFontSize] = useState(16); // Default font size
    
    useEffect(() => {
        const savedFontSize = localStorage.getItem("fontSize");
        if (savedFontSize) {
            setFontSize(parseInt(savedFontSize));
            document.documentElement.style.fontSize = `${savedFontSize}px`;
        }
    }, []);
    
    const updateFloatListPosition = (rightValue) => {
        const floatList = document.querySelector('.float-ul-list');
        if (floatList) {
            floatList.style.right = `${rightValue}px`;
        }
    };
    
    // Function to set font size to 18px and adjust .float-ul-list position
    const increaseFont = () => {
        setFontSize(18);
        document.documentElement.style.fontSize = "18px";
        localStorage.setItem("fontSize", 18);
        updateFloatListPosition(-104);
    };
    
    // Function to set font size to 14px and adjust .float-ul-list position
    const decreaseFont = () => {
        setFontSize(14);
        document.documentElement.style.fontSize = "14px";
        localStorage.setItem("fontSize", 14);
        updateFloatListPosition(-84);
    };
    
    // Function to reset font size to 16px and adjust .float-ul-list position
    const resetFont = () => {
        setFontSize(16);
        document.documentElement.style.fontSize = "16px";
        localStorage.setItem("fontSize", 16);
        updateFloatListPosition(-96);
    };
    
    
    return (
        <div className="header">
            <div className="topbar">
                <ul className="topbar_list text-xs md:text-sm lg:text-base">
            
                    <li>
                        <Link href={"#maincontent"}>
                            {Translate.skipToMainContent[lang]}
                        </Link>
                    </li>
                    <li>
                        <Link href={"screen-reader-access"}>
                            {Translate.ScreenReaderAccess[lang]}
                        </Link>
                    </li>
                    <li>
                        <Link href={"sitemap"}>
                            {Translate.siteMap[lang]}
                        </Link>
                    </li>

                    <li className="text-white">
                        <a href="#" onClick={increaseFont}>A+</a>
                    </li>
                    <li className="text-white">
                        <a href="#" onClick={resetFont}>A</a> {/* Reset to 16px */}
                    </li>
                    <li className="text-white">
                        <a href="#" onClick={decreaseFont}>A-</a> {/* Set to 14px */}
                    </li>
                </ul>
                
                <div
                    className="relative"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <div
                        className="change-lang"
                        style={{ display: "flex", padding: "5px" }}
                    >
                        <Image
                            src={LanguageIcon}
                            alt="Land and Development Office"
                            className="mt-1 mr-1"
                        />{" "}
                        {lang == "hindi" ? "हिंदी" : "English"}
                    </div>

                    {isDropdownOpen && (
                        <div className="absolute -left-8 top-full z-10 w-max max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
                            <div className="p-4">
                                <div className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-50">
                                    <div className="flex-auto">
                                        <Link
                                            href="#"
                                            className="block font-semibold text-gray-900"
                                            onClick={() => {
                                                setLang("english");
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            English
                                        </Link>
                                    </div>
                                </div>
                                <div className="group relative flex items-center gap-x-6 rounded-lg p-2 text-sm leading-6 hover:bg-gray-50">
                                    <div className="flex-auto">
                                        <Link
                                            href="#"
                                            className="block font-semibold text-gray-900"
                                            onClick={() => {
                                                setLang("hindi");
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            हिंदी
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="navbar-menu">
                <Navigation />
            </div>
     
            <div className="float-ul-list">
                {/* <li className=""> */}
                    <Link
                        href="/faq"
                        className="commonBtns uppercase text-center p-2 px-5 text-m block w-full h-full"
                    >
                        {Translate.faq[lang]}
                    </Link>
                {/* </li> */}
                {/* <li className=""> */}
                    <Link
                        href="tel:1800111705"
                        className="commonBtns uppercase text-center p-2 px-5 text-m block w-full h-full"
                    >
                        {Translate.tollfree[lang]}
                    </Link>
                {/* </li> */}
            </div>
           
        </div>
    );
};

export default Navbar;
