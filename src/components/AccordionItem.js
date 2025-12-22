'use client'
import React, { useState } from 'react';


const AccordionItem = ({ title, description, subItems = [], lang = 'english' }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [openSubIndex, setOpenSubIndex] = useState(null);

    const toggleCollapse = () => {
        setIsExpanded(!isExpanded);
    };

     // Toggle sub-accordion
     const toggleSubAccordion = (index) => {
        setOpenSubIndex(openSubIndex === index ? null : index);
    };

    //Added by Swati Mishra to display ordered list in answer on 24-03-2025 start
    const renderLink = (link) => {
        if (!link) return null;
        const linkText = lang === 'hindi' ? 'यहाँ क्लिक करें' : 'Click here';
    
        return (
            <span className="ml-1">
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 font-medium hover:underline"
                >
                    {linkText}
                </a>
            </span>
        );
    };
    const renderAnswerContent = (answerType, answerData, link = null) => {
        if (answerType === 'mixed') {
            return (
                <>
                    <div dangerouslySetInnerHTML={{ __html: answerData.description }} />
                    <ol type="1" className="list-decimal pl-5 mt-2">
                        {answerData.list.map((item, idx) => (
                            <li key={idx} className="mb-1">{item}</li>
                        ))}
                    </ol>
                    {renderLink(link)}
                </>
            );
        }
    
        if (answerType === 'list') {
            return (
                <>
                    <ol type="1" className="list-decimal pl-5">
                        {answerData.map((item, idx) => (
                            <li key={idx} className="mb-1">{item}</li>
                        ))}
                    </ol>
                    {renderLink(link)}
                </>
            );
        }
    
        // HTML/plain answer — append inline
        let answerHTML = answerData;
        if (link) {
            answerHTML += ` <a href="${link}" target="_blank" rel="noopener noreferrer" class="text-blue-600 font-medium hover:underline">${lang === 'hindi' ? 'यहाँ क्लिक करें' : 'Click here'}</a>`;
        }
    
        return <div dangerouslySetInnerHTML={{ __html: answerHTML }} />;
    };
    //Added by Swati Mishra to display ordered list in answer on 24-03-2025 end
    

    return (
        <div className='accordion-items p-6 rounded-md my-2' data-aos="fade-up" data-aos-duration="1000">
            <div className={isExpanded ? 'Collapse custom-transition' : 'Expand custom-transition'} onClick={toggleCollapse} style={{ cursor: 'pointer', fontWeight: 'bold', paddingRight: '50px' }}
            >
                <h3 className='text-2xl font-medium'>{title}</h3>
                {/* Show the category description here */}
                <div className='mt-0'>
                    {description && (
                        <p className='accordion-description font-medium mb-0'>{description}</p>
                    )}

                </div>
                
            </div>
            {isExpanded && (
                <div className='mt-4'>
                    
                    {/* <p className='mb-0'>{content}</p> */}

                    {/* Sub-Accordion (if available) */}

                    {subItems.length > 0 && (
                        <div className='mt-4 pl-4'>
                            {subItems.map((subItem, index) => (
                                <div key={index} className={`sub-accordion-items mb-3 transition-all duration-300 ease-in-out ${ openSubIndex === index ? 'active' : '' }`}>
                                    <div
                                        className='sub-accordion-head cursor-pointer py-2 px-4'
                                        onClick={() => toggleSubAccordion(index)}
                                    >
                                        <div className='icon-sub-accordion'></div>
                                        <h4 className='text-lg font-medium'>{subItem.title}</h4>
                                    </div>

                                    {/* Sub-Content */}
                                    {openSubIndex === index && (
                                        <div className='sub-accordion-body  p-3'>
                                            {/* <p className='m-0'>{subItem.content}</p> */}
                                            {/* Added by Swati Mishra to display ordered list in answer on 24-03-2025 */}
                                            {renderAnswerContent(subItem.answerType, subItem.answerData, subItem.link)}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AccordionItem;
