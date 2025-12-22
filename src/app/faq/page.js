// import Accordion from '@/components/Accordion';
// import PageHeader from '@/components/PageHeader';
// import React from 'react'


// const page = () => {
//     const accordionData = [
//         { title: 'How to apply for Substitution?', content: 'Substitution is the process of mutation of the names of legal heirs on the death of lessee. Application for this purpose shall be made on a plain paper signed by all or one of the legal heirs accompanied by the following documents:- ( i) Attested copy of the death certificate of the lessee issued by the Local Body.' },
//         { title: 'What are the document required for Substitution?', content: 'Substitution is the process of mutation of the names of legal heirs on the death of lessee. Application for this purpose shall be made on a plain paper signed by all or one of the legal heirs accompanied by the following documents:- ( i) Attested copy of the death certificate of the lessee issued by the Local Body.' },
//         { title: 'What is the function of LDO?', content: 'Substitution is the process of mutation of the names of legal heirs on the death of lessee. Application for this purpose shall be made on a plain paper signed by all or one of the legal heirs accompanied by the following documents:- ( i) Attested copy of the death certificate of the lessee issued by the Local Body.' },
//         { title: 'What are the Inspection of Properties?', content: 'Substitution is the process of mutation of the names of legal heirs on the death of lessee. Application for this purpose shall be made on a plain paper signed by all or one of the legal heirs accompanied by the following documents:- ( i) Attested copy of the death certificate of the lessee issued by the Local Body.' },
//         // Add more items as needed
//     ];
//     return (
//         <div className='faq-container'>
//             <PageHeader pageTitle="FAQ" />
//             <div className='introduction-container px-4 md:px-4 py-10 md:pb-28 lg:py-10 lg:pb-32 lg:px-8 xl:px-10 2xl:px-24 xl:pb-24'>
//                 <div className='w-full md:w-2/4 lg:w-3/4 m-auto px-4'>
//                     <div className='title-group2 pb-2 lg:pb-5 mb-5' data-aos="fade-up" data-aos-duration="1000">
//                         <h2 className='themeTitle text-2xl md:text-3xl lg:text-4xl font-bold text-center'>Frequently Asked Questions</h2>
//                     </div>
//                     <p className='text-center'>Find advice and answers from our support team fast or get in touch</p>
//                 </div>
//                 <div className='mt-5'>
//                     <Accordion data={accordionData} />
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default page

'use client';
import React, { useEffect, useState, useContext } from 'react';
import Accordion from '@/components/Accordion';
import PageHeader from '@/components/PageHeader';
import { LangContext } from '@/components/Container';
import { API_HOST } from '@/constants';
import Translate from "@/language.json";

// Created by Swati on 24-03-2025 for fetching dynamic data of faq
const Page = () => {
    const { lang } = useContext(LangContext);
    const [accordionData, setAccordionData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const relatedCategories = ['General Queries', 'Mutation', 'Conversion', 'NOC'];

    useEffect(() => {
        const fetchFaqs = async () => {
            setIsLoading(true);
            const allData = [];

            try {
                for (const category of relatedCategories) {
                    const res = await fetch(`${API_HOST}faqs/${encodeURIComponent(category.toLowerCase())}/${lang}`);
                    const data = await res.json();

                    if (data.status === 'success') {
                        const subItems = data.faqs.map(item => ({
                            title: item.question,
                            answerType: item.answer_type,
                            answerData: item.answer_data,
                            link: item.link || null
                        }));

                        allData.push({
                            // title: data.faqs[0]?.related_to || category,
                            title: data.faqs[0]?.related_to_value || category,
                            description: data.faqs[0]?.related_to_description || '',
                            subItems
                        });
                    }
                }

                setAccordionData(allData);
            } catch (error) {
                console.error('Error loading FAQs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchFaqs();
    }, [lang]);

    return (
        <div className='faq-container'>
            <PageHeader pageTitle={Translate.faq[lang]} language={lang} />
            <div className='introduction-container px-4 py-10 lg:px-8 2xl:px-24'>
                <div className='w-full md:w-2/4 lg:w-3/4 m-auto px-4 text-center'>
                    <h2 className='themeTitle text-2xl md:text-3xl lg:text-4xl font-bold mb-5'>
                        {Translate.faq_full[lang]}
                    </h2>
                    <p>{Translate.faq_full_desc[lang]}</p>
                </div>

                <div className='mt-10'>
                    {isLoading ? (
                        <p className="text-center">Loading FAQs...</p>
                    ) : (
                        <Accordion data={accordionData} lang={lang} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Page;
