import React, { useState, useEffect } from 'react';
import Hero from "@/components/Hero";
import Heroo from "@/components/HeroMobile";

const ResponsiveHero = () => {
  const [isMobile, setIsMobile] = useState(false);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 999); 
  };

  useEffect(() => {
    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isMobile ? <Heroo /> : <Hero />}
    </>
  );
};

export default ResponsiveHero;
