
import React, { useState, useContext, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LangContext } from "./Container";
import Translate from "@/language.json";

function Heroo() {
  const { lang } = useContext(LangContext);

  const sliderTexts = [
    Translate.SliderTextHeading1[lang],
    Translate.SliderTextHeading2[lang],
    Translate.SliderTextHeading3[lang],
    Translate.SliderTextHeading4[lang],
    Translate.SliderTextHeading5[lang],
  ];

  const slides = [
    { id: 1, image: "/images/banner/slider-1.jpg", },
    { id: 2, image: "/images/banner/slider-2.jpg",  },
    { id: 3, image: "/images/banner/slider-3.jpg",  },
    { id: 4, image: "/images/banner/slider-4.jpg",  },
    { id: 5, image: "/images/banner/slider-5.png",  }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="w-full max-w-4xl relative">
      <div className="h-[400px] relative group">
        {/* Main Image */}
        <div
          className="w-full h-full bg-center bg-cover transition-all duration-500"
          style={{ backgroundImage: `url(${slides[currentIndex].image})` }}
        >
          {/* Content Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 flex items-center justify-center">
            <h2 className="text-white text-2xl font-bold mb-0 text-center">
              {sliderTexts[currentIndex]}
            </h2>
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6 text-dark" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/30 hover:bg-white/50 p-2 backdrop-blur-sm transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6 text-dark" />
        </button>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((_, slideIndex) => (
          <button
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className={`w-3 h-3 transition-all duration-200 ${
              currentIndex === slideIndex
                ? "bg-gray-500 rounded-full"
                : "bg-gray-200/50 hover:bg-gray-200/70 rounded-full"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Heroo;
