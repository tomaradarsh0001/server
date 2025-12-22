import React from 'react';
import BreadCrumbSkeleton from './BreadCrumbSkeleton';
import NewsSlider from './NewsSlider';

const PageHeaderSkeleton = () => {
    return (
        <div className='page-header'>
            <div className='dashboard-facts-container px-4 md:px-4 py-3 lg:px-8 xl:py-4 xl:px-10'>
                <div className='bg-black/20 py-5 px-10 rounded-[10px] text-white'>
                    <div className='internalTitle-group pb-3 md:pb-5 animate-pulse'>
                        <div className='h-8 lg:h-12 w-[250px] bg-gray-200 opacity-40 rounded'></div>
                    </div>
                    <BreadCrumbSkeleton />
                </div>
            </div>
            <NewsSlider/>
        </div>
    );
};

export default PageHeaderSkeleton;
