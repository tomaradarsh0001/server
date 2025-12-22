// Worked on to add Search Filter by Diwakar Sinha at 26-12-2024
import React, { useState } from "react";
import GridViewWithCategories from "./GridViewWithCategories";
import Image from "next/image";
import searchIcon from "../../public/searchIcon.svg";
import Translate from "../language.json";

function GridView({ columns, data, language, isMedia }) {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = data.filter((item) => {
        return Object.values(item)
            .join(" ")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
    });

    return (
        <div>
            <div
                    className="filter-container flex items-center"
                data-aos="fade-up"
                data-aos-duration="1000"
            >
                <h3 className="mr-3 text-lg lg:text-xl">
                    {Translate.searchBy[language]}
                </h3>
                <div className="relative w-1/3 rounded-full bg-white border-zinc-500 dropdown-filter">
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={Translate.searchPlaceholder[language]}
                        className="bg-transparent w-full outline-none pl-10 md:pl-16 text-base pr-2 py-2 lg:py-3"
                    />
                    {/* <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="bg-transparent w-full outline-none pl-16 text-base pr-2 py-2 lg:py-3"
            /> */}
                    <Image
                        src={searchIcon}
                        alt="Search"
                        className="w-5 h-5 md:w-8 md:h-8 absolute top-1/2 -translate-y-1/2 left-4"
                    />
                </div>
            </div>
            
            <GridViewWithCategories
                data={filteredData}
                language={language}
                isMedia={isMedia}
            />
        </div>
    );
}

export default GridView;
