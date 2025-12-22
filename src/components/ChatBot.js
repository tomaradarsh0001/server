"use client";
import React, { useEffect, useState, useRef } from "react";
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

let lastSelectedCategory = null;

//Chatbot Developed by Adarsh Tomar
const ChatBotComponent = () => {
    const [showTooltip, setShowTooltip] = useState(true);
    const [fadeTooltip, setFadeTooltip] = useState(false);
    const chatContentRef = useRef(null);

    // Developed By Adarsh Tomar -> 10-10-2024
    const scrollToLastMessage = () => {
        const content = chatContentRef.current;
        if (content) {
            const lastMessage = content.querySelector(
                ".rsc-ts-bot:last-child, .rsc-ts-user:last-child, .rsc-os:last-child"
            );
            if (lastMessage) {
                lastMessage.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    // Developed By Adarsh Tomar -> 10-10-2024
    useEffect(() => {
        const chatContent = document.querySelector(".rsc-content");
        if (chatContent) {
            chatContentRef.current = chatContent;

            const observer = new MutationObserver(() => {
                scrollToLastMessage();
            });

            observer.observe(chatContent, { childList: true, subtree: true });

            return () => observer.disconnect();
        }
    }, []);
    // End

    useEffect(() => {
        setFadeTooltip(true);

        const hideTooltipTimer = setTimeout(() => {
            setFadeTooltip(false);
            setTimeout(() => setShowTooltip(false), 1200);
        }, 5000);

        return () => clearTimeout(hideTooltipTimer);
    }, []);

    useEffect(() => {
        const link = document.createElement("link");
        link.href =
            "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap";
        link.rel = "stylesheet";
        document.head.appendChild(link);
    }, []);

    const theme = {
        background: "#ffffff",
        fontFamily: "Montserrat, sans-serif",
        headerBgColor: "#0f3557",
        headerFontColor: "#fff",
        headerFontSize: "15px",
        botBubbleColor: "#0f3557",
        botFontColor: "#fff",
        userBubbleColor: "#fff",
        userFontColor: "#4a4a4a",
        textAlign: "left",
    };

    const steps = [
        {
            id: "1",
            message:
                'Hello! My name is Bhoomi, your digital assistant. Welcome to eDharti 2.0 Portal. Type "Hi, Hello or Hey" to start the conversation!',
            trigger: "greet-response"
        },
        {
            id: "greet-response",
            user: true,
            trigger: value => {
                const userInput = String(value.value)
                    .toLowerCase()
                    .trim();

                if (["hi", "hey", "hello"].includes(userInput)) {
                    return "ask-name"; // Trigger to ask the user's name
                } else if (
                    [
                        "adarsh",
                        "tomar",
                        "design",
                        "developer",
                        "develop"
                    ].includes(userInput)
                ) {
                    return "hello-adarsh"; // Trigger to greet the user specifically
                } else {
                    return "type-hi"; // Fallback for non-matching inputs
                }
            }
        },
        {
            id: "ask-name",
            message: "Hi! May I know your name, please?",
            trigger: "user-name",
            delay: 1000
        },
        {
            id: "hello-adarsh",
            message: "Hello, This Chatbot is designed by Adarsh Tomar!",
            end: true
        },
        {
            id: "user-name",
            user: true,
            trigger: "help"
        },
        {
            id: "help",
            message:
                "Thanks! {previousValue}, Type 'Help' for getting help related options.",
            trigger: "check-help",
            delay: 1000
        },
        {
            id: "check-help",
            user: true,
            trigger: value => {
                const userInput = String(value.value)
                    .toLowerCase()
                    .trim();
                return userInput === "help" ? "provide-options" : "type-hi";
            }
        },
        {
            id: "provide-options",
            message: "Here are some options that may help you:",
            trigger: "display-options"
        },
        {
            id: "display-options",
            options: [

                { value: "2", label: "Visit eDharti", trigger: "redirect-property" },
                { value: "3", label: "Book an Appointment", trigger: "redirect-support" },
                { value: "4", label: "General Queries", trigger: () => { lastSelectedCategory = "general-queries"; return "general-queries"; } },
                { value: "5", label: "Mutation", trigger: () => { lastSelectedCategory = "substitution-queries"; return "substitution-queries"; } },
                // { value: "6", label: "", trigger: () => { lastSelectedCategory = "mutation-queries"; return "mutation-queries"; }},
                { value: "7", label: "NOC", trigger: () => { lastSelectedCategory = "noc-queries"; return "noc-queries"; } },
                { value: "8", label: "Conversion", trigger: () => { lastSelectedCategory = "conversion-queries"; return "conversion-queries"; } },
                { value: "9", label: "Contact Us", trigger: () => { lastSelectedCategory = "contact-us"; return "contact-us"; } }
            ]
        },


        // General Queries
        {
            id: "general-queries",
            message: "Please select a question:",
            trigger: "general-list"
        },
        {
            id: "general-list",
            options: [
                { value: "q1", label: "What are the functions of Land and Development Office?", trigger: "ans1" },
                { value: "q2", label: "Where is the office located?", trigger: "ans2" },
                { value: "q3", label: "How many types of services provided by Land & Development Office?", trigger: "ans3" },
                { value: "q4", label: "Where can I submit any document/paper at L&DO office?", trigger: "ans4" },
                { value: "q5", label: "Where can I find directory of officials of L&DO?", trigger: "ans5" },
                { value: "q6", label: "Can I submit offline application?", trigger: "ans6" },
                { value: "q7", label: "What is the process for visiting L&DO office?", trigger: "ans7" },
                { value: "q8", label: "	In case of any query/grievance, whom can I contact?", trigger: "ans8" },
            ]
        },
        { id: "ans1", message: "Land & Development Office administers around 3% area of Delhi and maintains records of all Nazul lands acquired in 1911 for the formation of Capital at Delhi and land comprising Rehabilitation Colonies.", trigger: "common-restart" },
        { id: "ans2", message: "Gate No. 4, 'A' Wing, 6th floor, Moulana Azad Road, NirmanBhawan, New Delhi, 110011", trigger: "common-restart" },
        {
            id: "ans3",
            component: (() => {
                const commonStyle = {
                    color: "#fff",
                    fontSize: "15px",
                    fontFamily: "Montserrat, sans-serif"
                };

                return (
                    <div>
                        <p style={{ ...commonStyle }}>The following are the services provided by this office:</p>
                        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                            {[
                                "Conversion",
                                // "Substitution",
                                "Mutation",
                                "Mortgage",
                                "Sale Permission",
                                "Gift Permission",
                                "Property Certificate",
                                "NOC for Freehold Properties"
                            ].map((service, index) => (
                                <li key={index} style={commonStyle}>{service}</li>
                            ))}
                        </ul>
                    </div>
                );
            })(),
            asMessage: true,
            trigger: "common-restart"
        },
        { id: "ans4", message: "One can submit his/her document/paper at Information Facilitation Centre(IFC) section of this office and an acknowledgment receipt will be provided which will be useful for tracking.", trigger: "common-restart" },
        { id: "ans5", message: "Click here to see the directory", trigger: "show-directory-button" },
        {
            id: "show-directory-button",
            component: (
                <div>
                    <button
                        id="btndirectory"
                        onClick={() =>
                            window.open("https://ldo.mohua.gov.in/whos-who", "_blank")
                        }
                        style={{
                            backgroundColor: "#3879b3",
                            color: "#ffffff",
                            border: "none",
                            padding: "7px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Open Directory
                    </button>
                </div>
            ),
            asMessage: true,
            trigger: "common-restart"
        },
        { id: "ans6", message: "No. only online applications are accepted.", trigger: "common-restart" },
        { id: "ans7", message: "One has to take office visit appointment on our website. Apart from this, one can also take e-hearing appointment for virtual meeting with the officials of L&DO Office. If you want to book an appointment click on the button", trigger: "show-appointment-button" },
        { id: "ans8", message: "Click the button to check our support details", trigger: "show-contact-button" },

        // Substitution Queries
        {
            id: "substitution-queries",
            message: "Select a mutation-related question:",
            trigger: "substitution-list"
        },
        {
            id: "substitution-list",
            options: [
                // { value: "q1", label: "What is Substitution?", trigger: "sub-ans1" },
                { value: "q1", label: "What is Mutation?", trigger: "sub-ans1" },
                { value: "q2", label: "Who can apply for mutation?", trigger: "sub-ans2" },
                // { value: "q3", label: "What are the types of document required for substitution?", trigger: "sub-ans3" },
                { value: "q3", label: "What are the types of document required for mutation?", trigger: "sub-ans3" },
                { value: "q4", label: "What is the application fee, and are there any other charges?", trigger: "sub-ans4" },
                // { value: "q6", label: "Whether unearned increase is recoverable in substitution application?", trigger: "sub-ans6" },
                { value: "q5", label: "Whether unearned increase is recoverable in mutation application?", trigger: "sub-ans5" },
                // { value: "q8", label: "Is inspection mandatory for Substitution?", trigger: "sub-ans8" },
                { value: "q6", label: "Is inspection mandatory for Mutation?", trigger: "sub-ans6" },
            ]
        },
        // { id: "sub-ans1", message: "Substitution is the process of mutation(transfer of legal rights) of the names of legal heirs on the death of lessee.", trigger: "common-restart" },
        { id: "sub-ans1", message: "Mutation is a process of substitution in the place of the previous lessee, the name(s) of new owners. Upon transfer of the leased premises by way of sale or gift etc., the name of transferee is mutated in the records of the lessor.", trigger: "common-restart" },
        { id: "sub-ans2", message: "Mutation can be carried out in the name of the transferee in whose 	favour the leased property has been transferred through sale or gift or a collusive decree (regd.) etc.", trigger: "common-restart" },
        // {
        //     id: "sub-ans4",
        //     component: (() => {
        //         const commonStyle = {
        //             color: "#fff",
        //             fontSize: "15px",
        //             fontFamily: "Montserrat, sans-serif"
        //         };

        //         return (
        //             <div>
        //                 <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
        //                     {[
        //                         "Self attested copy of registered lease deed",
        //                         "Self attested copy of registered Conveyance Deed(in case of freehold)",
        //                         "Surviving Member Certificate",
        //                         "Copy of AADHAR and PAN card",
        //                         "Copy of Newspaper Advertisement(Hindi and English newspaper)",
        //                         "Affidavit by the applicants on Rs. 100 non judicial stamp paper to be attested by SDM/Sub-judge/ 1st Class magistrate",
        //                         "Indemnity bond by the applicants on Rs. 100 non judicial stamp paper to be attested by SDM/Sub-judge/ 1st Class magistrate",
        //                         "Affidavit to the effect that lost of the lease deed on Rs. 100 non judicial stamp paper.",
        //                         "Copy of Newspaper advertisement regarding lost of lease deed.",
        //                         "In case of No objection, affidavit by all the legal heirs of the property on Rs. 100/- non judicial stamp paper. In absence of which the beneficiary should obtain probate of the WILL from the competent court of law and will submit a certified copy of the same to this office.",
        //                         "Copy of registered or unregistered will deed/registered relinquishment deed/NOC/Affidavit, if required.",
        //                         "Any other required documents."
        //                     ].map((subDocument, index) => (
        //                         <li key={index} style={commonStyle}>{subDocument}</li>
        //                     ))}
        //                 </ul>
        //             </div>
        //         );
        //     })(),
        //     asMessage: true,
        //     trigger: "common-restart"
        // },
        {
            id: "sub-ans3",
            component: (() => {
                const commonStyle = {
                    color: "#fff",
                    fontSize: "15px",
                    fontFamily: "Montserrat, sans-serif"
                };

                return (
                    <div>
                        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                            {[
                                "Self attested copy of registered lease deed",
                                "Self attested copy of registered Conveyance Deed(in case of freehold)",
                                "Self attested copy of registered Sale deed",
                                "Copy of Sanctioned Building Plan and/or existing plan duly signed by the registered architect and countersigned by all the co-owners of the property along with payment of Rs. 1000/- as application fee.",
                                "Surviving Member Certificate",
                                "Copy of AADHAR and PAN card",
                                "Copy of Newspaper Advertisement(Hindi and English newspaper)",
                                "Affidavit by the applicants on Rs. 100 non judicial stamp paper to be attested by SDM/Sub-judge/ 1st Class magistrate",
                                "Indemnity bond by the applicants on Rs. 100 non judicial stamp paper to be attested by SDM/Sub-judge/ 1st Class magistrate",
                                "Affidavit to the effect that lost of the lease deed on Rs. 100 non judicial stamp paper.",
                                "Copy of Newspaper advertisement regarding lost of lease deed.",
                                "Copy of registered relinquishment deed/Gift Deed etc., if any.",
                                "Any other required documents."
                            ].map((subDocument, index) => (
                                <li key={index} style={commonStyle}>{subDocument}</li>
                            ))}
                        </ul>
                    </div>
                );
            })(),
            asMessage: true,
            trigger: "common-restart"
        },
        { id: "sub-ans4", message: "As of now, this office charges Rs. 1000 for a substitution/mutation application (after freehold) and no charges for leasehold. There are no additional charges unless there is a pending demand.", trigger: "common-restart" },
        // { id: "sub-ans7", message: "Unearned increase shall not be levied in case of transfer of property among members of the same family at the time of succession.", trigger: "common-restart" },
        { id: "sub-ans5", message: "As per the terms of the lease deed under Appendix XI, unearned increase is recoverable in the case of second sale.", trigger: "common-restart" },
        // { id: "sub-ans9", message: "No.", trigger: "common-restart" },
        { id: "sub-ans6", message: "Yes.", trigger: "common-restart" },

        //NOC Queries
        {
            id: "noc-queries",
            message: "Select a NOC-related question:",
            trigger: "noc-list"
        },
        {
            id: "noc-list",
            options: [
                { value: "q1", label: "What is NOC?", trigger: "noc-ans1" },
                { value: "q2", label: "What are the types of document required for NOC?", trigger: "noc-ans2" },
                { value: "q3", label: "What is application fee of NOC?", trigger: "noc-ans3" },
                { value: "q4", label: "What is demand and without demand NOC ?", trigger: "noc-ans4" },
                { value: "q5", label: "What is the crucial date for the properties not requiring NOC from L&DO office ?", trigger: "noc-ans5" },
            ]
        },
        { id: "noc-ans1", message: "No objection certificate is required for further transaction of the property with sub registrar office after freehold.", trigger: "common-restart" },
        {
            id: "noc-ans2",
            component: (() => {
                const commonStyle = {
                    color: "#fff",
                    fontSize: "15px",
                    fontFamily: "Montserrat, sans-serif"
                };

                return (
                    <div>
                        <ul style={{ paddingLeft: "20px", listStyleType: "disc" }}>
                            {[
                                "Registered Lease deed, if any",
                                "Registered Conveyance deed",
                                "Registered Sale deed(if any)",
                                "Chain of title documents-court orders, decree, Relinquishment deed, Will etc. (if any)",
                                "Substitution/Mutation done, if any (after freehold).",
                                "Photo of the property (to establish the purpose for which it is being used).",
                                "Latest electricity bill(not older than last 6 months).",
                                "Undertaking regarding land use of the property on Rs. 10 non judicial stamp paper."
                            ].map((subDocument, index) => (
                                <li key={index} style={commonStyle}>{subDocument}</li>
                            ))}
                        </ul>
                    </div>
                );
            })(),
            asMessage: true,
            trigger: "common-restart"
        },
        { id: "noc-ans3", message: "NAs of now, Nil charges are levied.", trigger: "common-restart" },
        {
            id: "noc-ans4",
            message: "No objection certificate (NOC) is required for further transaction of the property with the sub-registrar office after freehold. NOC required for properties converted into freehold on or before 14.02.2006 are called 'without demand NOC,' and those converted after 14.02.2006 are called 'with demand NOC' (for residential properties). For commercial/misuse properties, those converted into freehold before 01.04.2004 are 'without demand NOC,' while those converted on or after 01.04.2004 are 'with demand NOC.'",
            trigger: "common-restart"
        },
        { id: "noc-ans5", message: "NOC is not required for registration of sale/purchase of properties which have been converted from leasehold to freehold on or before 31.03.2000.", trigger: "common-restart" },

        //Conversion Queries
        {
            id: "conversion-queries",
            message: "Please select a question:",
            trigger: "conversion-list"
        },
        {
            id: "conversion-list",
            options: [
                { value: "q1", label: "What are the properties under the control of land and development office eligible for conversion from leasehold to freehold?", trigger: "conv-ans1" },
                { value: "q2", label: "Whether conversion is compulsory or optional?", trigger: "conv-ans2" },
                { value: "q3", label: "Whether conversion will be granted even if there is encroachment in the property?", trigger: "conv-ans3" },
                { value: "q4", label: "How long does it take to grant conversion and issue conveyance deed?", trigger: "conv-ans4" },

            ]
        },
        { id: "conv-ans1", message: "All residential plots, irrespective of area, for which the allotment / perpetual lease is issued by the department of Rehabilitation or L&DO for residential purpose and building thereon is constructed and where completion certificate or at least D-Form in respect of such construction is obtained from the Local Body.'C' type tenements allotted on leasehold basis by the Department of Rehabilitation or Land and Development Office. 'A' type tenements allotted on leasehold basis by the Department of Rehabilitation or Land and Development Office.All Industrial plots allotted by the Department of Rehabilitation or Land and Development Office and upon which building is constructed and completion certificate or at least D-Form in respect of such construction isobtained from the Local Body.All built up commercial and mixed land use properties allotted by the department of Rehabilitation, L&DO or the Directorate Of Estate, for which ownership rights have been conferred and lease deed executed and registered.Note: The properties which are not specifically mentioned above are not covered under the conversion policy (e.g. institutional allotment including allotment to press, hotels, cinemas, properties covered under the disinvestment policy of the Govt., Petrol pumps, Fuel Depots, CNG Station etc.)", trigger: "common-restart" },
        { id: "conv-ans2", message: "Conversion from leasehold to freehold is optional", trigger: "common-restart" },
        { id: "conv-ans3", message: "No.", trigger: "common-restart" },
        { id: "conv-ans4", message: "Three months from the date the application (complete in all respects) is submitted along with complete payments.", trigger: "common-restart" },


        //Common Restart for all menu
        {
            id: "common-restart",
            message: "Would you like to ask another query or restart the chat?",
            trigger: "restart-options"
        },

        {
            id: "restart-options",
            options: [
                {
                    value: "1",
                    label: "Previous Menu",
                    trigger: () => lastSelectedCategory || "provide-options"
                },
                {
                    value: "2",
                    label: "Main Menu",
                    trigger: () => {
                        lastSelectedCategory = null;
                        return "provide-options";
                    }
                },
                { value: "3", label: "End Chat", trigger: "end-conversation" }
            ]
        },

        {
            id: "trigger-services",
            options: [
                // {
                //     value: "1",
                //     label: "Substitution",
                //     trigger: "redirect-property"
                // },
                { value: "1", label: "Mutation", trigger: "redirect-property" },
                {
                    value: "2",
                    label: "Conversion",
                    trigger: "redirect-property"
                },
                {
                    value: "3",
                    label: "Land Use Change",
                    trigger: "redirect-property"
                },
                {
                    value: "4",
                    label: "Lease of Deed",
                    trigger: "redirect-property"
                }
            ]
        },
        {
            id: "redirect-property",
            message:
                "You Selected eDharti Portal option here is the direct link to open eDharti Portal.",
            trigger: "show-edharti-button"
        },
        {
            id: "show-edharti-button",
            component: (
                <div>
                    <button
                        id="btnedharti"
                        onClick={() =>
                            window.open("https://ldo.mohua.gov.in/", "_blank")
                        }
                        style={{
                            backgroundColor: "#3879b3",
                            color: "#ffffff",
                            border: "none",
                            padding: "7px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Open eDharti
                    </button>
                </div>
            ),
            asMessage: true,
            trigger: "display-restart"
        },
        {
            id: "redirect-payment",
            message:
                "You Selected Services option here is the direct link to open Services.",
            trigger: "show-services-button"
        },
        {
            id: "show-services-button",
            component: (
                <div>
                    <button
                        onClick={() =>
                            window.open(
                                "https://ldo.mohua.gov.in/services",
                                "_blank"
                            )
                        }
                        style={{
                            backgroundColor: "#3879b3",
                            color: "#ffffff",
                            border: "none",
                            padding: "7px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Open Services
                    </button>
                </div>
            ),
            asMessage: true,
            trigger: "display-restart"
        },
        {
            id: "redirect-support",
            message:
                "You Selected Book an Appoitment option here is the direct link to open Appoitments.",
            trigger: "show-appointment-button"
        },
        {
            id: "show-appointment-button",
            component: (
                <div>
                    <button
                        onClick={() =>
                            window.open(
                                "https://ldo.mohua.gov.in/appointment-detail",
                                "_blank"
                            )
                        }
                        style={{
                            backgroundColor: "#3879b3",
                            color: "#ffffff",
                            border: "none",
                            padding: "7px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Book an Appointment
                    </button>
                </div>
            ),
            asMessage: true,
            trigger: "common-restart"
        },
        {
            id: "show-contact-button",
            component: (
                <div>
                    <button
                        onClick={() =>
                            window.open(
                                "https://ldo.mohua.gov.in/contact-us",
                                "_blank"
                            )
                        }
                        style={{
                            backgroundColor: "#3879b3",
                            color: "#ffffff",
                            border: "none",
                            padding: "7px 12px",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "10px"
                        }}
                    >
                        Open Contact Us
                    </button>
                </div>
            ),
            asMessage: true,
            trigger: "common-restart"
        },
        {
            id: "about-lndo",
            message:
                "With the decision to form the Capital at Delhi, the Lieutenant Governor of Punjab in his notification, ordered the Collector of Delhi District to acquire land for the New Capital of India. After the land was acquired Imperial Delhi Estate was created vide Chief Commissioner, Delhi notification. The Land and Development work was then done by an Executive Engineer of PWD, known as Land and Development Officer, in the Chief Engineer office, under the control of the Secretary to the Chief Commissioner in the Public Works Department. The Land and Development Officer formally charged with the land record work and administration on behalf of Government of Raisina Estate. The work was transferred under the direct control of the Chief Commissioner, Delhi with effect from 1 March 1928. Thus in 1928, the office of the Land and Development Officer came into being as a separate Organization under the Administrative control of Commissioner., Delhi. Since independence, the activities of this office have gradually expanded. In 1958, the Chief Commissioner resumed Nazul lands under the management of the Notified Area Committee, Civil Section, Delhi and put them under the administrative control of the Land and Development Officer. Land and Development Officer was brought under the control of the then Ministry of Urban Development (presently Ministry of Housing and Urban Affairs) with effect from the 1 October 1959 and since then, it had been functioning as a subordinate office of this Ministry till it was upgraded from that of a subordinate office to an attached office of Ministry of Urban Development (presently Ministry of Housing and Urban Affairs) vide Gazette Notification dated 4 April 2000.",
            trigger: "for-more"
        },
        {
            id: "contact-us",
            message:
                "Please contact us with Nirman Bhawan Phone : 23022174, Email Address:ldo@nic.in.",
            trigger: "for-more"
        },
        {
            id: "type-hi",
            message: "Please type 'Hi' to Start the Conversation.",
            trigger: "greet-response"
        },
        {
            id: "for-more",
            message: "Please type 'More' to Chat again.",
            trigger: "p-options"
        },
        {
            id: "p-options",
            user: true,
            trigger: value => {
                const userInput = String(value.value)
                    .toLowerCase()
                    .trim();
                return userInput === "more"
                    ? "provide-options"
                    : "end-convo-wrong-input";
            }
        },
        {
            id: "end-conversation",
            message: "Thank you! Have a great day.",
            end: true
        },
        {
            id: "end-convo-wrong-input",
            message: "You Input Inappropriate Kindly Restart the Chat.",
            trigger: "display-restart"
        },
        {
            id: "display-restart",
            options: [
                { value: "1", label: "Restart", trigger: "provide-options" },
                { value: "2", label: "End Chat", trigger: "end-conversation" }
            ]
        }
    ];

    return (
        <ThemeProvider theme={theme}>
            <div style={{ position: "relative" }}>
                {showTooltip && (
                    <div
                        style={{
                            position: "fixed",
                            bottom: window.innerWidth < 999 ? "100px" : "150px",
                            right: window.innerWidth < 999 ? "40px" : "45px",
                            backgroundColor: "#0f3557",
                            color: "white",
                            padding: "10px 15px",
                            borderRadius: "15px",
                            fontSize: "14px",
                            zIndex: 1000,
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                            opacity: fadeTooltip ? 1 : 0,
                            transition: "opacity 1s ease-in"
                        }}
                    >
                        Hi, I&apos;m Bhoomi, How may I assist you?
                        <div
                            style={{
                                position: "absolute",
                                top: "100%",
                                right: "20px",
                                width: 0,
                                height: 0,
                                borderLeft: "8px solid transparent",
                                borderRight: "8px solid transparent",
                                borderTop: "8px solid #0f3557"
                            }}
                        />
                    </div>
                )}

                {/* <div onClick={handleBotClick}>  */}
                <div onClick={() => setFadeTooltip(false)}>
                    <ChatBot
                        steps={steps}
                        floating={true}
                        botDelay={1000}
                        headerTitle="Bhoomi"
                        //  speechSynthesis={{ enable: true, lang: "en" }}
                        botAvatar="/usericon.png"
                        userAvatar="/usericon.png"
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default ChatBotComponent;
