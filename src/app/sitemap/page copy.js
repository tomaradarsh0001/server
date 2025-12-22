'use client'

import PageHeader from "@/components/PageHeader"
import PageHeaderSkeleton from "@/components/PageHeaderSkeleton"
import React, { useState, useEffect, useContext } from 'react'
import { LangContext } from '@/components/Container'; //added by Nitin


const SkeletonLoader = () => {
  return (
    <div className="contact-us">
       <PageHeaderSkeleton />
      <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
        <div className="w-full px-4">
          <div className="title-group2 pb-2 lg:pb-5 mb-5 animate-pulse">
            <h2 className="themeTitle text-2xl lg:text-4xl font-bold text-center bg-gray-200 h-14 w-[250px] mx-auto rounded"></h2>
          </div>
        </div>
      </div>

      {/* Header and Footer Menus in Row */}
      <div className="menus flex justify-between mb-[130px] mt-6 mr-6 ml-6 gap-8">
        {/* Header Menu Skeleton */}
        <div className="header-section w-1/2 p-4 bg-gray-50 rounded-lg shadow-md animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-[250px] mb-4"></div>
          <ul className="space-y-3">
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>        
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>        
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>        
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>

          </ul>
        </div>

        {/* Footer Menu Skeleton */}
        <div className="footer-section w-1/2 p-4 bg-gray-50 rounded-lg shadow-md animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-[250px] mb-4"></div>
          <ul className="space-y-3">
          <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>        
            <li className="h-6 bg-gray-200 rounded w-1/5"></li>        
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>        
            <li className="h-6 bg-gray-200 rounded w-1/4"></li>
            <li className="h-6 bg-gray-200 rounded w-1/6"></li>      
          </ul>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  const { lang } = useContext(LangContext);
  const [footerData, setFooterData] = useState(null);
  const [headerData, setHeaderData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [footerResponse, headerResponse] = await Promise.all([
          fetch(`http://ec2-13-39-110-15.eu-west-3.compute.amazonaws.com/api/footerMenu/${lang}`),
          fetch(`http://ec2-13-39-110-15.eu-west-3.compute.amazonaws.com/api/headerMenu/${lang}`)
        ]);

        if (!footerResponse.ok || !headerResponse.ok) {
          throw new Error("Failed to fetch data");
        }

        const footerJson = await footerResponse.json();
        const headerJson = await headerResponse.json();

        if (footerJson.data && headerJson.data) {
          setFooterData(footerJson.data);
          setHeaderData(headerJson.data);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching menu data:", error);
      }
    };

    fetchData();
  }, [lang]);

  if (isLoading || footerData === null || headerData === null) {
    return <SkeletonLoader />;
  }
  // Recursive function to render menu items and submenus with tree structure and links
  // Recursive function to render menu items and submenus with tree structure and links
const renderMenu = (menuItems) => {
  return (
    <ul className="list-disc pl-6 space-y-2">
      {menuItems.map((item, index) => (
        <li key={index} className="menu-item">
          <a
            href={item.link || "#"} // Set to '#' if no link exists
            target={item.new_tab ? "_blank" : "_self"} 
            className="text-blue-600 text-base hover:underline rounded px-2 py-1 transition duration-300"
          >
            {item.name}
          </a>
          {item.submenus && item.submenus.length > 0 && (
            <div className="ml-4 mt-2">
              {renderMenu(item.submenus)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

// Recursive function for footer menu
const renderMenu2 = (menuItems) => {
  return (
    <ul>
      {menuItems.map((item, index) => (
        <li key={index} className="menu-item">
          {item.submenus && item.submenus.length > 0 ? (
            <ul className="ml-4 mt-2 list-disc pl-6 space-y-2">
              {item.submenus.map((submenu, subIndex) => (
                <li key={subIndex}>
                  <a
                    href={submenu.link || "#"}
                    target={submenu.new_tab ? "_blank" : "_self"}
                    className="text-blue-600 text-base hover:underline rounded px-2 py-1 transition duration-300"
                  >
                    {submenu.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
};

  
  return (
    <div className="contact-us ">
      <PageHeader pageTitle={lang === "hindi" ? "साइट मानचित्र" : "Sitemap"} language={lang} />
      <div className="whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10">
        <div className="w-full px-4">
          <div className="title-group2 pb-2 lg:pb-5 mb-5" data-aos="fade-up" data-aos-duration="1000">
            <h2 className="themeTitle text-2xl lg:text-4xl font-bold text-center">
              {lang === "hindi" ? "साइट मानचित्र" : "Sitemap"}
            </h2>
          </div>
        </div>
      </div>

      {/* Header and Footer Menus in Row */}
      <div className="menus flex justify-between mb-[130px] mt-6 mr-6 ml-6 gap-8">
        {/* Header Menu */}
        <div className="header-section w-1/2 p-4 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">{lang === "hindi" ? "हेडर लिंक" : "Header Links"}</h3>
          {renderMenu(headerData)}
        </div>

        {/* Footer Menu */}
        <div className="footer-section w-1/2 p-4 bg-gray-50 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4">{lang === "hindi" ? "पाद लेख लिंक" : "Footer Links"}</h3>
          {renderMenu2(footerData)} {/* Corrected footerData2 to footerData */}
        </div>
      </div>

    </div>
  );
};

export default Page;
