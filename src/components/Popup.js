import React from 'react';
import closeIcon from '../../public/close-circle.svg'
import Image from 'next/image';


const Popup = ({ isOpen, onClose, content }) => {
  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={onClose} 
        >
          <div
            className="services-modal bg-white p-8 max-w-sm md:max-w-md lg:max-w-5xl relative rounded-2xl"
            onClick={(e) => e.stopPropagation()} 
            data-aos="zoom-out-down"
            data-aos-duration="300"
          >
            {/* Close button */}
          <button className="absolute top-2 right-2 text-gray-700 mb-5" onClick={onClose}>
                        <Image src={closeIcon} alt='Close' className='w-6 md:w-8 lg:w-10 relative' />
                      </button>

            {/* Popup content */}
            <div className="popup-content text-sm md:text-base m-5">{content}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
