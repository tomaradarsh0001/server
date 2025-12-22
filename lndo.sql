
CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` varchar(255) NOT NULL,
  `updated_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `is_active`, `sort_order`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Acts and Rules', 1, 1, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(2, 'Guidelines', 1, 2, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(3, 'Office Orders', 1, 4, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(4, 'Circulars', 1, 3, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(5, 'Tenders', 1, 5, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(6, 'Photo Gallery', 1, 2, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(7, 'Resources', 1, 2, '2024-05-06 06:58:06', '2024-05-06 06:58:06', '2', '2'),
(8, 'FAQ', 1, 8, NULL, NULL, '2', '2');

-- --------------------------------------------------------

--
-- Table structure for table `components`
--

CREATE TABLE `components` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `page_id` int(11) NOT NULL,
  `heading_eng` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `heading_hin` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `components`
--

INSERT INTO `components` (`id`, `name`, `page_id`, `heading_eng`, `heading_hin`, `is_active`) VALUES
(1, 'Introduction', 1, 'About Land and Development Office', 'भूमि तथा विकास कार्यालय के बारे में', 1),
(2, 'What We Do', 1, 'What We Do', 'हम क्या करते हैं', 1),
(5, 'History and Mandate', 3, 'History & Mandate', 'इतिहास और अधिदेश', 1),
(6, 'Image Slider', 1, 'Image Slider', 'छवि स्लाइडर', 1),
(7, 'E-Portal', 1, 'E-Portal', 'ई-पोर्टल', 1),
(8, 'Services', 8, 'Services', 'सेवाएँ', 1),
(9, 'Citizen Charter', 2, 'Citizen Charter', 'नागरिक घोषणा पत्र', 1),
(10, 'Our Prominent Lessees', 1, 'Our Prominent Lessees/Allottees', 'हमारे प्रमुख पट्टेदार/आवंटी', 1),
(11, 'Embassy', 1, 'Our Embassies/ Foreign Missions', 'हमारे दूतावास/विदेशी मिशन', 1);

-- --------------------------------------------------------

--
-- Table structure for table `component_sections`
--

CREATE TABLE `component_sections` (
  `id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `title_eng` varchar(255) DEFAULT NULL,
  `title_hin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `subtitle_eng` varchar(255) DEFAULT NULL,
  `subtitle_hin` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `content_eng` text DEFAULT NULL,
  `content_hin` text CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `image` varchar(1000) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `link_type` tinyint(4) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `component_sections`
--

INSERT INTO `component_sections` (`id`, `component_id`, `parent_id`, `title_eng`, `title_hin`, `subtitle_eng`, `subtitle_hin`, `content_eng`, `content_hin`, `image`, `link`, `link_type`, `created_by`, `created_at`, `updated_at`, `updated_by`) VALUES
(1, 1, NULL, 'L&DO Vision', 'एल एंड डी ओ विजन', NULL, NULL, 'Our goal is to drive sustainable urban development in Delhi, focusing on inclusivity, innovation, and effective land management.', 'हमारा लक्ष्य समावेशिता, नवाचार और प्रभावी भूमि प्रबंधन पर ध्यान केंद्रित करते हुए दिल्ली में समग्र शहरी विकास को प्राप्त करना है।', 'storage/assets/images/20240531084858-0.jpg', NULL, NULL, 2, '2024-04-25 09:30:01', '2024-05-31 11:02:04', 2),
(2, 1, NULL, NULL, NULL, NULL, NULL, 'Welcome to the Land and Development Office. Our office was established in response to Delhi being named as India\'s capital, leading to strategic land acquisitions and the creation of the Imperial Delhi Estate. Originally managed by an Executive Engineer as the Land and Development Officer, we were formalized in 1928 under the direct oversight of the Chief Commissioner of Delhi. This foundational setup enabled us to spearhead effective land management and urban planning initiatives. Over the years, our role has expanded significantly. The integration of Nazul lands in 1958 and our transition under the Ministry of Urban Development, now the Ministry of Housing and Urban Affairs, in 1959 marked key milestones. Elevated to an attached office of the Ministry in 2000, we continue to play a pivotal role in shaping Delhi’s urban landscape, ensuring sustainable development and efficient land use.', 'भूमि तथा विकास कार्यालय में आपका स्वागत है। हमारा कार्यालय दिल्ली को भारत की राजधानी के रूप में नामित किए जाने के परिणामस्वरूप स्थापित किया गया था, जिससे कार्यनीतिक भूमि अधिग्रहण और इंपीरियल दिल्ली एस्टेट का सृजन हुआ। मूल रूप से एक कार्यपालक अभियंता द्वारा भूमि तथा विकास अधिकारी के रूप में प्रबंधित, हमें वर्ष 1928 में दिल्ली के मुख्य आयुक्त की प्रत्यक्ष देखरेख में औपचारिक रूप दिया गया था। इस आधारभूत संरचना ने हमें प्रभावी भूमि प्रबंधन और शहरी नियोजन पहलों की अगुवाई करने में सक्षम बनाया है। कालान्तर में हमारी भूमिका में काफी विस्तार हुआ है। वर्ष 1958 में नज़ूल भूमियों का एकीकरण और वर्ष 1959 में शहरी विकास मंत्रालय, वर्तमान में आवासन और शहरी कार्य मंत्रालय के अंतर्गत हमारा पारगमन, महत्वपूर्ण मील के पत्थर थे। हमारा दर्जा बढ़ाकर वर्ष 2000 में हमें मंत्रालय का एक संबद्ध कार्यालय बनाया गया, और हम चिरस्थायी विकास और कुशल भूमि उपयोग सुनिश्चित करते हुए दिल्ली के शहरी परिदृश्य को आकार देने में एक महत्वपूर्ण भूमिका निभाते रहे हैं।', NULL, NULL, NULL, 2, '2024-04-25 10:09:27', '2024-05-31 11:02:04', 2),
(3, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 2, '2024-04-25 10:11:24', '2024-05-31 08:41:48', 2),
(4, 2, NULL, 'Substitution', 'प्रतिस्थापन', NULL, NULL, 'Substitution of land is the process of transferring property rights to the legal heirs of a deceased lessee. This involves submitting an application with the death certificate, affidavits from the heirs, and any \'Will\' or legal documents. If all documents are in order and undisputed, the property is officially transferred to the heirs. Disputes require additional legal steps, such as obtaining a probate. This process ensures the orderly transfer of property rights upon the lessee\'s death.', 'भूमि का प्रतिस्थापन एक मृतक पट्टेदार के कानूनी उत्तराधिकारियों को संपत्ति के अधिकार हस्तांतरित करने की प्रक्रिया है। इसमें मृत्यु प्रमाण पत्र, उत्तराधिकारियों के शपथ पत्र और किसी \'वसीयत\' या कानूनी दस्तावेजों के साथ एक आवेदन जमा करना शामिल है। यदि सभी दस्तावेज़ सही और निर्विवाद हैं, तो संपत्ति आधिकारिक तौर पर उत्तराधिकारियों को हस्तांतरित कर दी जाती है। विवादों के लिए अतिरिक्त कानूनी कदमों जैसे प्रोबेट प्राप्त करना, की आवश्यकता होती है। यह प्रक्रिया पट्टेदार की मृत्यु होने पर संपत्ति के अधिकारों के सुचारू हस्तांतरण को सुनिश्चित करती है।', 'storage/assets/images/20240702073938-0.JPG', 'storage/pdf/Substitution_Chapter_28.pdf', NULL, 1, '2024-05-07 06:34:47', '2024-07-02 07:39:38', 1),
(5, 5, NULL, 'History & Mandate', 'इतिहास और अधिदेश', NULL, NULL, NULL, NULL, 'storage/assets/images/20240531090138-0.jpg', NULL, NULL, 1, '2024-05-01 09:57:04', '2024-06-03 09:02:11', 1),
(6, 6, NULL, 'Central Vista', 'सेंट्रल विस्टा', NULL, NULL, NULL, NULL, 'storage/assets/images/20240531124018-0.jpg', NULL, NULL, 2, '2024-05-07 08:03:42', '2024-05-31 12:40:18', 2),
(7, 6, NULL, 'Mutation', 'उत्परिवर्तन', NULL, NULL, NULL, NULL, 'storage/assets/images/20240507080342-1.svg', NULL, NULL, 2, '2024-05-07 08:03:42', '2024-05-17 10:20:40', 2),
(8, 2, NULL, 'Mutation', 'दाखिल खारिज', NULL, NULL, 'Mutation is updating property records to reflect new owners after a transfer, such as a sale or gift. The process involves verifying the transfer\'s legality, ensuring permissions are in place, and reviewing the transfer deed. If the deed complies with all requirements and permissions, a mutation letter is issued. Non-compliance or breaches must be rectified, with penalties applied if necessary. Mutation can also occur based on a registered collusive decree.', 'दाखिल खारिज, बिक्री या उपहार जैसे हस्तांतरण के बाद नए मालिकों को प्रतिबिंबित करने के लिए संपत्ति के रिकॉर्ड को अपडेट करना है। इस प्रक्रिया में अंतरण की वैधता की पुष्टि करना, अनुमतियाँ सुनिश्चित करना और हस्तांतरण विलेख की समीक्षा करना शामिल है। यदि विलेख सभी आवश्यकताओं और अनुमतियों का अनुपालन करता है, तो एक दाखिल खारिज पत्र जारी किया जाता है। यदि आवश्यक हो तो दंड लगाकर, गैर-अनुपालन या उल्लंघनों को सुधारा जाना चाहिए। पंजीकृत परस्पर सहमति वाली डिक्री के आधार पर भी दाखिल खारिज हो सकता है।', 'storage/assets/images/20240531085538-1.jpg', 'storage/pdf/Mutation_Chapter_27.pdf', NULL, 1, '2024-05-07 06:43:21', '2024-07-02 07:22:35', 1),
(9, 2, NULL, 'A No Objection Certificate (NOC)', 'अनापत्ति प्रमाणपत्र (एनओसी)', NULL, NULL, 'A No Objection Certificate (NOC) for property is a legal document indicating that there are no objections to the property transaction from relevant authorities. To obtain an NOC, the applicant must submit a request along with required documents, such as property details, ownership proof, and identification. The L&DO official review the application to ensure compliance with regulations and to check for any legal disputes or dues associated with the property. If everything is in order, the NOC is issued, allowing the property transaction to proceed. An NOC is essential for property sales, transfers, or redevelopment, ensuring the transaction\'s legality and transparency.', 'संपत्ति के लिए अनापत्ति प्रमाणपत्र (एनओसी) एक कानूनी दस्तावेज है जो दर्शाता है कि संबंधित प्राधिकारियों की ओर से संपत्ति लेनदेन पर कोई आपत्ति नहीं है। एनओसी प्राप्त करने के लिए, आवेदक को आवश्यक दस्तावेजों, जैसे संपत्ति विवरण, स्वामित्व प्रमाण और पहचान के साथ एक अनुरोध जमा करना होगा। एल एंड डीओ अधिकारी विनियमों का अनुपालन सुनिश्चित करने और संपत्ति से जुड़े किसी भी कानूनी विवाद या बकाया की जांच करने के लिए आवेदन की समीक्षा करते हैं। यदि सब कुछ सही है, तो एनओसी जारी की जाती है, जिससे संपत्ति लेनदेन की अनुमति मिलती है। लेन-देन की वैधता और पारदर्शिता सुनिश्चित करते हुए  संपत्ति की बिक्री, अंतरण या पुनर्विकास के लिए एनओसी आवश्यक है।', 'storage/assets/images/20240531081117-2.jpg', NULL, NULL, 1, '2024-05-07 06:47:13', '2024-07-02 07:22:35', 1),
(10, 6, NULL, 'Testing Image Title 1', 'परीक्षण छवि शीर्षक 1', 'Testing Image Subtitle 1', 'परीक्षण छवि उपशीर्षक 1', NULL, NULL, 'storage/assets/images/20240507085453-0.png', NULL, NULL, 2, '2024-05-07 07:15:07', '2024-05-07 08:54:53', 2),
(11, 6, NULL, 'Testing Image Title 2', 'परीक्षण छवि शीर्षक 2', 'Testing Image Subtitle 2', 'परीक्षण छवि उपशीर्षक 2', NULL, NULL, 'storage/assets/images/20240507085453-1.png', NULL, NULL, 2, '2024-05-07 07:15:07', '2024-05-07 08:54:53', 2),
(12, 6, NULL, 'Testing Image Title 3', 'परीक्षण छवि शीर्षक 3', 'Testing Image Subtitle 3', 'परीक्षण छवि उपशीर्षक 3', NULL, NULL, 'storage/assets/images/20240507085453-2.png', NULL, NULL, 2, '2024-05-07 07:15:07', '2024-05-07 08:54:53', 2),
(13, 6, NULL, 'Testing Image Title 4', 'परीक्षण छवि शीर्षक 4', 'Testing Image Subtitle 4', 'परीक्षण छवि उपशीर्षक 4', NULL, NULL, 'storage/assets/images/20240507085453-3.png', NULL, NULL, 2, '2024-05-07 07:15:07', '2024-05-07 08:54:53', 2),
(14, 6, NULL, 'Testing Image Title 5', 'परीक्षण छवि शीर्षक 5', 'Testing Image Subtitle 5', 'परीक्षण छवि उपशीर्षक 5', NULL, NULL, 'storage/assets/images/20240507085453-4.png', NULL, NULL, 2, '2024-05-07 07:15:07', '2024-05-07 08:54:53', 2),
(15, 6, NULL, 'Testing Image Title 6', 'परीक्षण छवि शीर्षक 6', 'Testing Image Subtitle 6', 'Testing Image Subtitle 6', NULL, NULL, 'storage/assets/images/20240507085453-5.png', NULL, NULL, 2, '2024-05-07 07:15:07', '2024-05-07 08:54:53', 2),
(16, 7, NULL, 'e-dharti', 'ई-धरती', NULL, NULL, NULL, NULL, 'storage/assets/images/20240514094505-0.svg', 'https://ldo.gov.in/edharti/', 2, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(17, 7, NULL, 'e-hearing Appointment', 'ई-हियरिंग अपॉइंटमेंट', NULL, NULL, NULL, NULL, 'storage/assets/images/20240603110104-1.svg', 'https://ldo.gov.in/edharti/', 2, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(18, 7, NULL, 'Office Visit Appointment', 'कार्यालय यात्रा नियुक्ति', NULL, NULL, NULL, NULL, 'storage/assets/images/20240517111614-2.svg', 'https://ldo.gov.in/edharti/', 2, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(19, 7, NULL, 'e-dharti geo portal', 'ई-धरती जियो पोर्टल', NULL, NULL, NULL, NULL, 'storage/assets/images/20240517111614-3.svg', 'http://edhartiv2.eu-north-1.elasticbeanstalk.com/map', 2, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(20, 7, NULL, 'Media Gallery', 'मीडिया गैलरी', NULL, NULL, NULL, NULL, 'storage/assets/images/20240514094505-4.svg', '/media-gallery', 1, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(21, 7, NULL, 'Prominent Lessees/Allottees', 'प्रमुख पट्टेदार/आवंटिती', NULL, NULL, NULL, NULL, 'storage/assets/images/20240517111614-5.svg', '/storage/pdf/List_of_Institution.pdf', 3, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(22, 7, NULL, 'Public Grievances', 'लोक शिकायतें', NULL, NULL, NULL, NULL, 'storage/assets/images/20240514094505-6.svg', '/public-grievances', 1, 1, '2024-05-07 07:42:50', '2024-07-02 13:13:11', 1),
(24, 5, NULL, 'Administration of \"Nazul Land\" in Delhi', 'दिल्ली में \"नजूल भूमि\" का प्रशासन', NULL, NULL, 'Prior to September 17, 1912, the territory of Delhi was known as the “Imperial Delhi Estate’ and was  included within the then Province of Punjab. After the decision to form the capital at Delhi was reached, proceedings for acquisition of land therefore were taken by the Collector of Delhi District pursuant to the Notification No.  775, dated December 21, 1911 issued by the Lt. Governor of Punjab. When the Capital was shifted from Calcutta to Delhi, the Governor-General-in-Council by his proclamation dated September 17, 1912 took under his immediate authority and management the territory of Delhi with the sanction and approbation of the Secretary of State for India. The Delhi Laws Act, 1912 came into force w.e.f. September 18, 1912 and provided for the administration of the territory of Delhi by a Chief Commissioner as a separate Province to be known as the Province of Delhi.', '17 सितंबर, 1912 से पहले, दिल्ली के क्षेत्र को \"इंपीरियल दिल्ली एस्टेट\' के रूप में जाना जाता था और यह तत्कालीन पंजाब प्रांत में शामिल था। दिल्ली में राजधानी बनाने का निर्णय होने के बाद, पंजाब के उपराज्यपाल द्वारा जारी अधिसूचना संख्या 775, दिनांक 21 दिसंबर, 1911 के अनुसार दिल्ली जिले के कलेक्टर द्वारा भूमि अधिग्रहण की कार्यवाही की गई। जब राजधानी को कलकत्ता से दिल्ली स्थानांतरित किया गया, तो गवर्नर-जनरल-इन-काउंसिल ने 17 सितंबर, 1912 की अपनी उद्घोषणा द्वारा भारत के राज्य सचिव की मंजूरी और अनुमोदन के साथ दिल्ली के क्षेत्र को तत्काल अपने अधिकार और प्रबंधन में ले लिया। दिल्ली विधि अधिनियम, 1912, दिनांक 18 सितंबर, 1912 से लागू हुआ जिसमें यह व्यवस्था थी कि दिल्ली क्षेत्र, जिसे दिल्ली नामक एक अलग प्रान्त के रूप में जाना जाएगा, का प्रशासन एक मुख्य आयुक्त द्वारा किया जाएगा।', NULL, NULL, NULL, 1, '2024-05-01 09:57:04', '2024-06-03 09:02:11', 1),
(25, 5, NULL, 'Origin of Land and Development Office under Chief Commissioner of Delhi (1919)', 'दिल्ली के मुख्य आयुक्त के अधीन भूमि तथा विकास कार्यालय की उत्पत्ति (1919)', NULL, NULL, 'Under Section 58 of the Government of India Act, 1919, Delhi remained and was administered as a Chief Commissioner’s Province. In 1919, The office of Land & Development Officer came into being as a separate organisation under the administrative control of the Chief Commissioner of Delhi. Under Section 94 of the Government of India Act, 1935, it was provided that Delhi would continue to be a Chief Commissioner’s Province. A Chief Commissioner’s Province was to be administered by the Governor-General acting to such extent as he thought fit through a Chief Commissioner to be appointed by him in his discretion. Under Section 100(4) of the Government of India Act, 1935, the Federal Legislature was empowered to legislate in relation to Chief Commissioners’ Provinces and without limitation as to subjects.', 'भारत सरकार अधिनियम, 1919 की धारा 58 के तहत, दिल्ली मुख्य आयुक्त के प्रांत के रूप में बनी रही और प्रशासित की गई। वर्ष 1919 में, भूमि तथा विकास अधिकारी का कार्यालय दिल्ली के मुख्य आयुक्त के प्रशासनिक नियंत्रण के तहत एक अलग संगठन के रूप में अस्तित्व में आया। भारत सरकार अधिनियम, 1935 की धारा 94 के तहत यह प्रावधान किया गया कि दिल्ली मुख्य आयुक्त का प्रांत बना रहेगा। एक मुख्य आयुक्त के प्रांत को गवर्नर-जनरल द्वारा उस सीमा तक प्रशासित किया जाना था जैसा वह अपने विवेक से नियुक्त किए जाने वाले मुख्य आयुक्त के माध्यम से उचित समझता था। भारत सरकार अधिनियम, 1935 की धारा 100(4) के तहत, संघीय विधानमंडल को मुख्य आयुक्तों के प्रांतों के संबंध में और विषयों के संबंध में बिना किसी सीमा के कानून बनाने का अधिकार दिया गया था।', NULL, NULL, NULL, 1, '2024-05-01 09:57:04', '2024-06-03 09:02:11', 1),
(26, 5, NULL, 'Administrative Control of office of Land & Development Officer to Ministry of Works, Housing & Supply (1st October, 1959)', 'निर्माण, आवास एवं आपूर्ति मंत्रालय को भूमि तथा विकास अधिकारी के कार्यालय का प्रशासनिक नियंत्रण (1 अक्टूबर, 1959)', NULL, NULL, 'On October 1, 1959, the Government of India decided to shift the administrative control of the Land & Development Officer office in New Delhi from the Delhi Administration to the Ministry of Works, Housing & Supply. This decision was duly communicated to the Chief Commissioner of Delhi and to the Land & Development Officer, New Delhi. In the further affidavit of M.K. Mukherjee, Secretary, Ministry of Works & Housing, it is averred in paragraph 6 that the ‘office of the Land & Development Officer was transferred to the control of the Ministry of Works, Housing & Supply w.e.f. October 1, 1959 and since then it had been functioning as a subordinate office of the Ministry of Works & Housing’. It would, therefore, be manifest that after October 1, 1959 neither the Chief Commissioner nor the Lt. Governor had anything to do with the office of the Land & Development Officer or the administration of nazul lands in the Union Territory of Delhi.', '1 अक्टूबर, 1959 को भारत सरकार द्वारा भूमि तथा विकास अधिकारी, नई दिल्ली के कार्यालय का प्रशासनिक नियंत्रण दिल्ली प्रशासन से निर्माण, आवास एवं पूर्ति मंत्रालय को हस्तांतरित करने का निर्णय लिया गया। इस निर्णय की विधिवत सूचना दिल्ली के मुख्य आयुक्त और भूमि तथा विकास अधिकारी, नई दिल्ली को दी गई। आगे के हलफनामे में एम.के. मुखर्जी, सचिव, निर्माण तथा आवास मंत्रालय के अनुसार, पैरा 6 में कहा गया है कि \'भूमि तथा विकास अधिकारी का कार्यालय दिनांक 01 अक्टूबर, 1959 से निर्माण, आवास एवं आपूर्ति मंत्रालय के नियंत्रण में हस्तांतरित कर दिया गया था और तब से यह निर्माण एवं आवास मंत्रालय के अधीनस्थ कार्यालय के रूप में कार्य कर रहा था। इसलिए, यह स्पष्ट होगा कि 1 अक्टूबर, 1959 के बाद न तो मुख्य आयुक्त और न ही उपराज्यपाल का भूमि तथा विकास अधिकारी के कार्यालय या केंद्र शासित प्रदेश दिल्ली में नजूल भूमि के प्रशासन से कोई लेना-देना था।', NULL, NULL, NULL, 1, '2024-05-01 09:57:04', '2024-06-03 09:02:11', 1),
(27, 8, NULL, 'Substitution', 'प्रतिस्थापन', NULL, NULL, 'Substitution of land is the process of transferring property rights to the legal heirs of a deceased lessee. This involves submitting an application with the death certificate, affidavits from the heirs, and any \'Will\' or legal documents. If all documents are in order and undisputed, the property is officially transferred to the heirs. Disputes require additional legal steps, such as obtaining a probate. This process ensures the orderly transfer of property rights upon the lessee\'s death.', 'भूमि का प्रतिस्थापन एक मृतक पट्टेदार के कानूनी उत्तराधिकारियों को संपत्ति के अधिकार हस्तांतरित करने की प्रक्रिया है। इसमें मृत्यु प्रमाण पत्र, उत्तराधिकारियों के शपथ पत्र और किसी \'वसीयत\' या कानूनी दस्तावेजों के साथ एक आवेदन जमा करना शामिल है। यदि सभी दस्तावेज़ व्यवस्थित और निर्विवाद हैं, तो संपत्ति आधिकारिक तौर पर उत्तराधिकारियों को हस्तांतरित कर दी जाती है। विवादों के लिए अतिरिक्त कानूनी कदमों की आवश्यकता होती है, जैसे प्रोबेट प्राप्त करना। यह प्रक्रिया पट्टेदार की मृत्यु होने पर संपत्ति के अधिकारों के व्यवस्थित हस्तांतरण को सुनिश्चित करती है।', 'storage/assets/images/20240513123959-0.svg', 'storage/pdf/Substitution_Chapter_28.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(28, 8, NULL, 'Mutation', 'दाखिल खारिज', NULL, NULL, 'Mutation is updating property records to reflect new owners after a transfer, such as a sale or gift. The process involves verifying the transfer\'s legality, ensuring permissions are in place, and reviewing the transfer deed. If the deed complies with all requirements and permissions, a mutation letter is issued. Non-compliance or breaches must be rectified, with penalties applied if necessary. Mutation can also occur based on a registered collusive decree.', 'दाखिल खारिज, बिक्री या उपहार जैसे हस्तांतरण के बाद नए मालिकों को प्रतिबिंबित करने के लिए संपत्ति के रिकॉर्ड को अद्यतन करना है। इस प्रक्रिया में हस्तांतरण की वैधता की पुष्टि करना, अनुमतियाँ सुनिश्चित करना और हस्तांतरण विलेख की समीक्षा करना शामिल है। यदि विलेख सभी आवश्यकताओं और अनुमतियों का अनुपालन करता है, तो एक दाखिल खारिज पत्र जारी किया जाता है। गैर-अनुपालन या उल्लंघनों को सुधारा जाना चाहिए, यदि आवश्यक हो तो दंड भी लगाया जाए। पंजीकृत पारस्परिक सहमति वाली डिक्री के आधार पर भी दाखिल खारिज हो सकता है।', 'storage/assets/images/20240513123959-1.svg', 'storage/pdf/Mutation_Chapter_27.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(29, 8, NULL, 'Conversion', 'संपरिवर्तन', NULL, NULL, 'Conversion of property from leasehold to freehold involves changing the ownership status to grant the owner full rights. The process requires the property owner to submit an application along with necessary documents, such as proof of ownership, lease deed, and identification. L&DO officials review the application to ensure all dues are cleared and legal requirements are met. Upon approval, a conversion fee is paid, and the ownership status is updated to freehold. This grants the owner complete control over the property, allowing for easier transfer, sale, or modification without needing further permissions from the lessor.', 'लीजहोल्ड से फ्रीहोल्ड में संपत्ति के संपरिवर्तन में मालिक को पूर्ण अधिकार प्रदान करने के लिए स्वामित्व की स्थिति को बदलना शामिल है। इस प्रक्रिया में संपत्ति के मालिक को आवश्यक दस्तावेजों, जैसे स्वामित्व  पट्टा विलेख और पहचान के प्रमाण के साथ एक आवेदन जमा करना होगा। एलएंडडीओ अधिकारी यह सुनिश्चित करने के लिए आवेदन की समीक्षा करते हैं कि सभी बकाया चुका दिए गए हैं और कानूनी आवश्यकताएं पूरी हो गई हैं। अनुमोदन होने पर, संपरिवर्तन शुल्क का भुगतान किया जाता है, और स्वामित्व स्थिति को फ्रीहोल्ड में अद्यतन किया जाता है। यह मालिक को संपत्ति पर पूर्ण नियंत्रण प्रदान करता है, जिससे पट्टेदार से आगे की अनुमति की आवश्यकता के बिना आसान हस्तांतरण, बिक्री या संशोधन की अनुमति मिलती है।', 'storage/assets/images/20240513123959-2.svg', NULL, NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(30, 8, NULL, 'Land Use Change', 'भूमि उपयोग परिवर्तन', NULL, NULL, 'Land use change involves altering the designated purpose of a land parcel, such as from residential to commercial use. The process starts with the landowner submitting an application to the relevant authority, accompanied by necessary documents, including property details, current land use, and proposed change. L&DO officials review the application to ensure compliance with zoning regulations, environmental considerations, and urban planning guidelines. If the application meets all requirements, a change of land use fee is paid, and the land use designation is officially updated. This change allows the landowner to develop and utilize the property according to the new designated purpose, subject to adherence to any additional conditions or regulations imposed by the authorities.', 'भूमि उपयोग परिवर्तन में भू-खंड के निर्दिष्ट प्रयोजन को बदलना शामिल है, जैसे कि आवासीय से वाणिज्यिक उपयोग तक। प्रक्रिया की शुरुआत भूस्वामी द्वारा संपत्ति के विवरण, वर्तमान भूमि उपयोग और प्रस्तावित परिवर्तन सहित आवश्यक दस्तावेजों के साथ संबंधित प्राधिकारी को एक आवेदन जमा करने से होती है। एल एंड डीओ अधिकारी ज़ोनिंग विनियमों, पर्यावरण संबंधी विचारों और शहरी नियोजन दिशानिर्देशों का अनुपालन सुनिश्चित करने के लिए एप्लिकेशन की समीक्षा करते हैं। यदि आवेदन सभी आवश्यकताओं को पूरा करता है, तो भूमि उपयोग परिवर्तन शुल्क का भुगतान किया जाता है, और भूमि उपयोग पदनाम आधिकारिक तौर पर अद्यतन किया जाता है। यह परिवर्तन भू स्वामी को अधिकारियों द्वारा लगाए गए किसी भी अतिरिक्त शर्तों या विनियमों के पालन के अध्यधीन, नए नामित प्रयोजन के अनुसार संपत्ति को विकसित करने और उपयोग करने की अनुमति देता है।', 'storage/assets/images/20240514044655-3.svg', NULL, NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(31, 8, NULL, 'Temporary Allotment', 'अस्थायी आवंटन', NULL, NULL, 'Temporary allotment of land refers to the short-term assignment of land for specific purposes, such as events, construction, or temporary facilities. The applicant must submit an application to the relevant authority, detailing the intended use, duration, and necessary documents, including identification and proof of eligibility. L&DO officials review the application to ensure compliance with local regulations, zoning laws, and the suitability of the land for the proposed use. If approved, a temporary allotment fee is paid, and the land is assigned for the specified period. Conditions may be imposed to ensure the land is used appropriately and restored after use.', 'भूमि के अस्थायी आवंटन से तात्पर्य विशिष्ट उद्देश्यों, जैसे घटनाओं, निर्माण, या अस्थायी सुविधाओं के लिए भूमि के अल्पकालिक आवंटन से है। आवेदक को संबंधित प्राधिकारी को एक आवेदन प्रस्तुत करना होगा, जिसमें पहचान और पात्रता के प्रमाण सहित इच्छित उपयोग, अवधि और आवश्यक दस्तावेजों का विवरण होगा। एल एंड डीओ अधिकारी स्थानीय विनियमों, ज़ोनिंग विधियों और प्रस्तावित उपयोग के लिए भूमि की उपयुक्तता का अनुपालन सुनिश्चित करने के लिए आवेदन की समीक्षा करते हैं। यदि अनुमोदित हो, तो एक अस्थायी आवंटन शुल्क का भुगतान किया जाता है, और भूमि निर्दिष्ट अवधि के लिए आवंटित की जाती है। यह सुनिश्चित करने के लिए शर्तें लगाई जा सकती हैं कि भूमि का उचित उपयोग किया जाए और उपयोग के बाद उसे बहाल किया जाए।', 'storage/assets/images/20240514044655-4.svg', 'storage/pdf/Temporary_Allotment_Chapter_7.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(32, 8, NULL, 'Govt. Membership of Clubs', 'क्लबों की सरकारी सदस्यता', NULL, NULL, 'Manage and facilitate club memberships for government entities, ensuring entitlements and privileges are maintained.', 'सरकारी संस्थाओं की क्लब सदस्यता का प्रबंधन करता है, हकदारियों को सुनिश्चित करता है और विशेषधिकारों को बनाये रखा जाता है।', 'storage/assets/images/20240514044655-5.svg', NULL, NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(33, 8, NULL, 'Attestation of Building Plans', 'भवन नक्शों का सत्यापन', NULL, NULL, 'Get your building plans officially approved, ensuring they meet all urban guidelines and safety standards before construction.', 'निर्माण से पहले अपने नक्शों को आधिकारिक रूप से मंजूरी प्रदान करते हैं, जिससे सुनिश्चित हो कि वे सभी शहरी दिशानिर्देशों और सुरक्षा मानकों को पूरा करते हैं।', 'storage/assets/images/20240514044655-6.svg', 'storage/pdf/Attestation_of_building_plan_Chapter_16.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(34, 8, NULL, 'Execution of Deed Apartments', 'डीड अपार्टमेंट का निष्पादन', NULL, NULL, 'Formalize apartment ownership with deeds that clarify legal standings and property boundaries.', 'विलेख के साथ अपार्टमेंट के स्वामित्व को औपचारिक रूप प्रदान करते हैं जिससे कानूनी आधार और संपत्ति सीमाएं स्पष्ट हों।', 'storage/assets/images/20240514044655-7.svg', 'storage/pdf/Execution_Of_deed_apartments_chapter_12.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(35, 8, NULL, 'Management of Vacant Land', 'खाली भूमि का प्रबंधन', NULL, NULL, 'Oversee and manage vacant government land, ensuring optimal use and maintenance to prevent misuse and degradation.', 'सरकारी स्वामित्व वाली खाली भूमि की देखरेख और प्रबंधन करते हैं, जिससे इसके दुरुपयोग और डिग्रेडेशन को रोका जा सके।', 'storage/assets/images/20240514044655-8.svg', NULL, NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(36, 8, NULL, 'Multistorey Building Permission', 'बहुमंजिला भवन निर्माण अनुमति', NULL, NULL, 'Secure permissions for constructing multistorey buildings, adhering to safety regulations and urban development plans.', 'सुरक्षा नियमों और शहरी विकास योजनाओं के अनुरूप बहुमंजिला इमारतों के निर्माण की अनुमतियाँ प्राप्त करते हैं।', 'storage/assets/images/20240514044655-9.svg', 'storage/pdf/multistorey_building_permission_chapter_30.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(37, 8, NULL, 'Demarcation of Land', 'भूमि का सीमांकन', NULL, NULL, 'Clearly define and mark land boundaries to prevent disputes and clarify property extents.', 'भूमि विवादों को रोकने और संपत्ति की सीमाओं को स्पष्ट करने के लिए भूमि की सीमाओं को स्पष्ट रूप से परिभाषित और चिन्हित करते हैं।', 'storage/assets/images/20240514044655-10.svg', 'storage/pdf/Demaraction_of_land_chapter_8.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(38, 8, NULL, 'Eviction of Public Premises (Enforcement)', 'सरकारी परिसर की बेदखली (प्रवर्तन)', NULL, NULL, 'Enforce property rights and recover public premises from unauthorized occupation efficiently and lawfully.', 'सरकारी संपत्तियों से अनधिकृत कब्जा हटाने की प्रक्रिया को कुशलता और कानूनी रूप से लागू करके, संपत्ति अधिकारों को लागू करते हैं।', 'storage/assets/images/20240514044655-11.svg', 'storage/pdf/Eviction_and_public_premises_chapter_18.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(39, 8, NULL, 'Mortgage Permission', 'रहन अनुमति', NULL, NULL, 'Obtain necessary permissions to mortgage leased properties, facilitating secure financial transactions.', 'सुरक्षित वित्तीय लेन-देन को सुविधाजनक बनाते हुए सरकारी पट्टे वाली संपत्तियों के रहन के लिए आवश्यक अनुमतियाँ प्राप्त करते हैं।', 'storage/assets/images/20240514044655-12.svg', 'storage/pdf/mortgage_permission_chapter_26.pdf', NULL, 1, '2024-05-10 12:30:08', '2024-06-03 09:01:08', 1),
(40, 8, NULL, 'Issuance of Property Certificate', 'संपत्ति प्रमाण पत्र जारी करना', NULL, NULL, 'Receive official property certificates that affirm your compliance with local regulations and property standards.', 'स्थानीय विनियमों और संपत्ति मानकों के अनुरूप आपकी अनुपालना की पुष्टि करने वाले आधिकारिक संपत्ति प्रमाणपत्र प्राप्त करते हैं।', 'storage/assets/images/20240514044655-13.svg', 'storage/pdf/Issuance_of_property_certificate_chapter_14.pdf', NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(41, 8, NULL, 'Execution of Lease Deed', 'पट्टा विलेख का निष्पादन', NULL, NULL, 'Formalize lease agreements comprehensively, detailing all terms to ensure clear and mutual understanding between parties.', 'पक्षकारों के बीच स्पष्ट और पारस्परिक समझ सुनिश्चित करने के लिए पट्टा करारों को विस्तारपूर्वक तैयार करें, सभी शर्तों को स्पष्ट करते हुए समझौते को औपचारिक रूप करते हैं।', 'storage/assets/images/20240514044655-14.svg', 'storage/pdf/execution_of_lease_deed_chapter_12.pdf', NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(42, 8, NULL, 'Sale Permission', 'बिक्री की अनुमति', NULL, NULL, 'Get the required approvals to proceed with the sale of government-leased lands, ensuring legal transparency.', 'कानूनी पारदर्शिता सुनिश्चित करते हुए सरकारी पट्टे वाली भूमि के विक्रय के लिए आवश्यक मंजूरी प्राप्त करते हैं।', 'storage/assets/images/20240514044655-15.svg', 'storage/pdf/sale_permission_chapter_24.pdf', NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(43, 8, NULL, 'NOC for Registration', 'पंजीकरण के लिए एनओसी', NULL, NULL, 'A No Objection Certificate (NOC) for property is a legal document indicating that there are no objections to the property transaction from relevant authorities. To obtain an NOC, the applicant must submit a request along with required documents, such as property details, ownership proof, and identification. The L&DO official review the application to ensure compliance with regulations and to check for any legal disputes or dues associated with the property. If everything is in order, the NOC is issued, allowing the property transaction to proceed. An NOC is essential for property sales, transfers, or redevelopment, ensuring the transaction\'s legality and transparency.', 'संपत्ति के लिए अनापत्ति प्रमाणपत्र (एनओसी) एक कानूनी दस्तावेज है जो दर्शाता है कि संबंधित प्राधिकारियों की ओर से संपत्ति लेनदेन पर कोई आपत्ति नहीं है। एनओसी प्राप्त करने के लिए, आवेदक को आवश्यक दस्तावेजों, जैसे संपत्ति विवरण, स्वामित्व प्रमाण और पहचान के साथ एक अनुरोध जमा करना होगा। एल एंड डीओ अधिकारी विनियमों का अनुपालन सुनिश्चित करने और संपत्ति से जुड़े किसी भी कानूनी विवाद या बकाया की जांच करने के लिए आवेदन की समीक्षा करते हैं। यदि सब कुछ सही है, तो एनओसी जारी की जाती है, जिससे संपत्ति लेनदेन के आगे बढ़ने की अनुमति मिलती है। लेन-देन की वैधता और पारदर्शिता सुनिश्चित करने के लिए संपत्ति की बिक्री, अंतरण या पुनर्विकास के लिए एनओसी आवश्यक है।', 'storage/assets/images/20240514044655-16.svg', NULL, NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(44, 8, NULL, 'Allotment of Land to Central & State Government', 'केंद्र और राज्य सरकार को भूमि का आवंटन', NULL, NULL, 'Facilitate the distribution and use of land for central and state government projects, supporting public and governmental initiatives.', 'सार्वजनिक और सरकारी कार्यक्रमों में सहायता प्रदान करते हुए केंद्रीय और राज्य सरकारी परियोजनाओं के लिए भूमि के वितरण और उपयोग को सुकर बनाते हैं।', 'storage/assets/images/20240514044655-17.svg', 'storage/pdf/allotment_of_land_to_central_and_state_governement_chapter_7.pdf', NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(45, 8, NULL, 'Notification of Land Rates', 'भूमि दरों की अधिसूचना', NULL, NULL, 'Stay updated with the latest land rates, crucial for financial planning and property management.', 'अद्यतन भूमिदरों की जानकारी बनाए रखते हैं जो वित्त पोषण और संपत्ति प्रबन्धन  के लिए महत्वपूर्ण होगा।', 'storage/assets/images/20240514044655-18.svg', NULL, NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(46, 8, NULL, 'Inspection of Properties', 'संपत्तियों का निरीक्षण', NULL, NULL, 'Conduct regular inspections to ensure property conditions and uses comply with established standards and regulations.', 'निर्धारित मानकों और विनियमों के साथ संपत्ति की शर्तों और उसके उपयोग का अनुपालन सुनिश्चित करने के लिए नियमित निरीक्षण करते हैं।', 'storage/assets/images/20240514044655-19.svg', 'storage/pdf/Inspection_of_properties_chapter_17.pdf', NULL, 1, '2024-05-10 12:51:15', '2024-06-03 09:01:08', 1),
(47, 5, NULL, 'Gazette Notification Dated 1st February 1966 of List of Works allotted to L&DO', 'एल एंड डी ओ को आवंटित कार्यों की सूची की दिनांक 1 फरवरी 1966 की राजपत्र अधिसूचना', NULL, NULL, 'The President of  India on February 1, 1966 issued an order under Article 299(1) of the Constitution which inter alia directed that in the case of Land & Development Office : (1) all contracts and assurances of property relating to matters falling within the jurisdiction of Land & Development Officer, (2) all contracts, deeds and other instruments relating to and for the purpose of enforcement of the terms and conditions of the sale/ lease deed of the Government property in Delhi/New Delhi, etc. made in exercise of the executive power of the Union may be executed on his behalf by the Land & Development Officer. Under Clause XLI it was specifically provided:\r\n‘Notwithstanding anything hereinbefore contained any contract or assurance of property relating to any matter whatsoever may be executed by the Secretary or the Special Secretary or the Additional Secretary or the Joint Secretary or the Director, or when there is no Additional Secretary, Joint Secretary to the Government in the appropriate Ministry or Department.’\r\nIt is pertinent to observe that neither the Chief Commissioner of Delhi nor the Lt. Governor has been conferred any authority by the President under Article 299(1) to enter into any contract made in the exercise of the executive power of the Union or to act ‘on behalf of’ the President in relation to such contract or assurance of property, i.e. to act on behalf of the President for the enforcement of the terms and conditions thereof.\r\n( Source: The Supreme Court in Express Newspapers Pvt. Ltd. vs. Union of India [AIR 1986 SC 872 = (1986) 1 SCC 133], viewed the historical perspective of Union Territory of Delhi. )', 'भारत के राष्ट्रपति ने 1 फरवरी, 1966 को संविधान के अनुच्छेद 299(1) के तहत एक आदेश जारी किया जिसमें अन्य बातों के साथ-साथ निर्देश दिया गया कि भूमि तथा विकास कार्यालय के मामले में: (1) भूमि तथा विकास अधिकारी के अधिकार क्षेत्र के अंतर्गत आने वाले मामलों से संबंधित संपत्ति के सभी संविदा और आश्वासन  (2) दिल्ली/नई दिल्ली आदि में सरकारी संपत्ति की बिक्री/पट्टा विलेख के नियमों और शर्तों को लागू करने के उद्देश्य से किए गए सभी संविदा, विलेख और अन्य दस्तावेज संघ की कार्यकारी शक्ति के प्रयोग से  भूमि तथा विकास अधिकारी द्वारा उसकी ओर से निष्पादित किये जा सकते हैं। खंड XLI के अंतर्गत इसकी विनिर्दिष्ट रूप से व्यवस्था की गयी थी। \r\n\'इससे पहले किसी भी बात के बावजूद किसी भी मामले से संबंधित संपत्ति का कोई संविदा या आश्वासन सचिव या विशेष सचिव या अपर सचिव या संयुक्त सचिव या निदेशक द्वारा निष्पादित किये जा सकते हैं, या जब सरकार में कोई अपर सचिव, संयुक्त सचिव नहीं होता है तो उचित मंत्रालय या विभाग में निष्पादित किए जा सकते हैं।\r\nयह देखना उचित है कि न तो दिल्ली के मुख्य आयुक्त और न ही उपराज्यपाल को राष्ट्रपति द्वारा अनुच्छेद 299(1) के तहत संघ की कार्यकारी शक्ति के प्रयोग में किए गए किसी भी संविदा करने या ऐसी संविदा या संपत्ति के आश्वासन के संबंध में \'राष्ट्रपति की ओर से\', यानि उसके नियमों और शर्तों को लागू करने के लिए राष्ट्रपति की ओर से कार्य करने का कोई अधिकार प्रदान किया गया है।\r\n(स्रोत: सुप्रीम कोर्ट ने एक्सप्रेस न्यूजपेपर्स प्राइवेट लिमिटेड बनाम भारत संघ मामले में [एआईआर 1986 एससी 872 = (1986) 1 एससीसी 133], केंद्र शासित प्रदेश दिल्ली के ऐतिहासिक परिप्रेक्ष्य को देखा।)', NULL, NULL, NULL, 1, '2024-05-14 11:36:53', '2024-06-03 09:02:11', 1),
(48, 9, NULL, 'Citizen Charter', 'नागरिक घोषणा पत्र', NULL, NULL, 'This Charter is a commitment of the Land & Development Office to its lessees in Administering, Nazul Leases, Rehabilitation Leases or Lands in Delhi and in the matter of Sale/Transfer/Mutation/Substitution/Mortgage, and Freehold permissions. (The privity of contract in terms of the lease is between the Lessee (Government Departments, Public Undertakings, Companies, Institutions and Private Persons etc.) and the Lessor L&DO.', 'यह घोषणा पत्र दिल्ली में भूमि के नजूल पट्टों, पुनर्वास पट्टों, पट्टेदारों के प्रशासन, और बिक्री/हस्तांतरण/दाखिल खारिज/प्रतिस्थापन/बंधक और फ्रीहोल्ड अनुमतियों के मामले में अपने पट्टेदारों के प्रति भूमि तथा विकास कार्यालय की प्रतिबद्धता है। (पट्टे के संदर्भ में संविदा की गोपनीयता पट्टेदार (सरकारी विभाग, सार्वजनिक उपक्रम, कंपनियां, संस्थान और निजी व्यक्ति आदि) और पट्टादाता एल एंड डीओ के बीच है)।', NULL, NULL, NULL, 1, '2024-05-16 05:26:36', '2024-06-05 11:26:25', 1),
(49, 9, NULL, 'The L&DO further commits that it will provide information on', 'भूमि तथा विकास कार्यालय इसके लिए भी प्रतिबद्ध है कि निम्नलिखित विषयों पर सूचना उपलब्ध कराएगा', NULL, NULL, '<ul>\r\n<li>The organisational structure of the office, its hierarchy and names of all its officers right down to sectional head level in its office.</li>\r\n<li>The procedure to be followed, the forms to be filled and other requirements in respect of various transactions.</li>\r\n<li>Application form for conversion of properties into freehold through brochures which would be sold in notified branches of the State Bank of India.</li>\r\n<li>Sale permission, mutation, substitution etc. through a printed brochure entitled: information for the Guidance.</li>\r\n<li>Lease Holders through Information and Facilitation Centre to be opened in the office of the L&DO.</li>\r\n<li>How and to whom applications are to be made for various purposes. (The PRO and the respective Branch officers will provide necessary assistance in this regard).</li>\r\n</ul>', '<ul>\r\n<li>कार्यालय की संगठनात्मक संरचना, इसका पदानुक्रम और कार्यालय में अनुभागीय प्रमुख स्तर तक के सभी अधिकारियों के नाम।</li>\r\n<li>विभिन्न लेन देन के संबंध में  पालन की जाने वाली प्रक्रिया, भरे जाने वाले फॉर्म और अन्य आवश्यकताएं।</li>\r\n<li>संपत्तियों को फ्रीहोल्ड में बदलने के लिए ब्रोशर के माध्यम से आवेदन पत्र जो भारतीय स्टेट बैंक की अधिसूचित शाखाओं में बेचे जाएंगे।</li>\r\n<li>मार्गदर्शन हेतु सूचना नामक शीर्षक वाले एक मुद्रित ब्रोशर के माध्यम से बिक्री की अनुमति, दाखिल खारिज, प्रतिस्थापन आदि। </li>\r\n<li>एल एंड डी ओ के कार्यालय में पट्टाधारकों के लिए सूचना एवं सुविधा केंद्र खोले जाएंगे।</li>\r\n<li>विभिन्न प्रयोजनों के लिए आवेदन कैसे और किसे करना है। (पीआरओ और संबंधित शाखा अधिकारी इस संबंध में आवश्यक सहायता प्रदान करेंगे)।</li>\r\n</ul>', NULL, NULL, NULL, 1, '2024-05-16 05:26:36', '2024-06-05 11:26:25', 1),
(50, 10, NULL, 'India Habitat Centre', 'भारत पर्यावास केंद्र', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-0.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(51, 10, NULL, 'All India Institute of Medical Science', 'अखिल भारतीय आयुर्विज्ञान संस्थान', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-1.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(52, 10, NULL, 'India Islamic Cultural Centre', 'इंडिया इस्लामिक कल्चरल सेंटर', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-2.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(53, 10, NULL, 'India International Centre', 'इंडिया इंटरनेशनल सेंटर', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-3.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(54, 10, NULL, 'Kamani Auditorium', 'कमानी ऑडिटोरियम', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-4.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(55, 10, NULL, 'Dr. Ram Manohar Lohia Hospital', 'डॉ. राम मनोहर लोहिया अस्पताल', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-5.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(56, 10, NULL, 'Sir Ganga Ram Hospital', 'सर गंगा राम अस्पताल', NULL, NULL, NULL, NULL, 'storage/assets/images/20240530073215-6.jpg', NULL, NULL, 1, '2024-05-29 09:01:56', '2024-05-30 07:32:15', 1),
(57, 11, NULL, NULL, NULL, NULL, NULL, 'Land and Development Office, Ministry of Housing and Urban Affairs on the request of Ministry of External Affairs (being administrative Ministry in respect of Foreign Mission/ Embassies) allots a number of plots/ land parcels in New Delhi to the Foreign Mission / Embassies on Lease Hold basis for construction of their Embassies such as High Commission of Saudi Arabia, Denmark, Russia, America, Egypt, Sudan, Ghana, Argentina, Hungary, Malaysia, Ethopea, Yugoslavia, Netherland, New Zealand, Portugal, Australia, Italy, Belgium, Canada, Afghanistan, United Kingdom, Turkey, Japan, etc.', 'भूमि और विकास कार्यालय, आवास और शहरी मामलों के मंत्रालय ने विदेश मंत्रालय (विदेशी मिशन/दूतावासों के संबंध में प्रशासनिक मंत्रालय होने के नाते) के अनुरोध पर विदेशी मिशन/दूतावासों को नई दिल्ली में कई भूखंड/भूमि पार्सल पट्टे पर आवंटित किए हैं। सऊदी अरब, डेनमार्क, रूस, अमेरिका, मिस्र, सूडान, घाना, अर्जेंटीना, हंगरी, मलेशिया, इथोपिया, यूगोस्लाविया, नीदरलैंड, न्यूजीलैंड, पुर्तगाल, ऑस्ट्रेलिया, इटली, बेल्जियम के उच्चायोग जैसे अपने दूतावासों के निर्माण के लिए आधार रखें। कनाडा, अफगानिस्तान, यूनाइटेड किंगडम, तुर्की, जापान, आदि।', 'storage/assets/images/20240603090912-0.jpg', NULL, NULL, 2, '2024-06-03 08:50:26', '2024-06-03 09:09:12', 2);

-- --------------------------------------------------------

--
-- Table structure for table `directories`
--

CREATE TABLE `directories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_eng` varchar(255) NOT NULL,
  `name_hin` varchar(255) NOT NULL,
  `designation_eng` varchar(255) NOT NULL,
  `designation_hin` varchar(255) NOT NULL,
  `room_no` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `section_eng` varchar(255) NOT NULL,
  `section_hin` varchar(255) NOT NULL,
  `sort_order` int(11) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `updated_by` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `directories`
--

INSERT INTO `directories` (`id`, `name_eng`, `name_hin`, `designation_eng`, `designation_hin`, `room_no`, `telephone`, `email`, `section_eng`, `section_hin`, `sort_order`, `is_active`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Sh. Suvasish Das', 'श्री सुवाशीष दास', 'Land & Development Officer(L&DO)', 'भूमि एवं विकास अधिकारी (एल एंड डी ओ)', '611-A', '011-23062871,  011-26061384', 'ldo@nic.in', 'L&DO Office', 'एल एंड डी ओ कार्यालय', 1, 1, '2024-05-10 23:34:38', '2024-05-10 23:34:38', 2, 2),
(2, 'Smt. Sunita Uttam', 'श्रीमती सुनीता उत्तम', 'PA to L&DO', 'एल एंड डीओ के पीए', '611-A', '011-23062871', 'sunita.uttam@gov.in', 'L&DO Office', 'एल एंड डी ओ कार्यालय', 2, 1, '2024-05-10 23:41:01', '2024-05-10 23:41:01', 2, 2),
(3, 'Sh. Dinesh Kumar Lakhumna', 'श्री दिनेश कुमार लखुमना', 'Deputy Land & Development officer-lll', 'उप भूमि एवं विकास अधिकारी-III', '633-A', '011-23061296', 'dinesh.lakhumna@gov.in', 'Admin Section', 'प्रशासन खंड', 4, 1, '2024-05-10 23:50:50', '2024-05-21 05:26:52', 2, 2),
(4, 'Sh. Prem Kumar Negi', 'श्री प्रेम कुमार नेगी', 'SO(Admin)', 'एसओ(प्रशासन)', '635', '011-23061391', 'premkumar.negi@nic.in', 'Admin Section', 'प्रशासन खंड', 12, 1, '2024-05-11 09:14:18', '2024-05-21 05:32:48', 2, 2),
(5, 'Sh. Rajeev Kumar Das', 'श्री राजीव कुमार दास', 'Deputy Land & Development officer-V', 'उप भूमि एवं विकास अधिकारी-V', '628-A', '011-23010533', 'rajeevk.das@gov.in', 'Property Section-I', 'संपत्ति खंड-I', 6, 1, '2024-05-11 09:18:40', '2024-05-21 05:28:07', 2, 2),
(6, 'Sh. Ankur Lal', 'श्री अंकुर लाल', 'SO', 'एसओ', '640', NULL, 'ak.lal51@gov.in', 'Property Section-I', 'संपत्ति खंड-II', 13, 1, '2024-05-11 09:22:34', '2024-05-21 05:32:59', 2, 2),
(7, 'Sh. Neeraj Bakshi', 'श्री नीरज बख्शी', 'Deputy Land & Development officer-l', 'उप भूमि एवं विकास अधिकारी-I', '626-A', '011-23063613', 'neeraj.bakshi17@gov.in', 'Property Section-II', 'संपत्ति खंड-II', 3, 0, '2024-05-11 09:25:12', '2024-06-19 06:39:33', 2, 2),
(8, 'Sh. Kunal Bhaskar', 'श्री कुणाल भास्कर', 'SO', 'एसओ', '639', NULL, 'kumal.bhashkar35@gov.in', 'Property Section-II', 'संपत्ति खंड-II', 14, 1, '2024-05-11 09:32:01', '2024-05-21 05:33:13', 2, 2),
(9, 'Sh. Neeraj Bakshi', 'श्री नीरज बख्शी', 'Deputy Land & Development officer-l', 'उप भूमि एवं विकास अधिकारी-l', '626-A', '011-23063613', 'neeraj.bakshi17@gov.in', 'Property Section-III', 'संपत्ति खंड-III', 9, 0, '2024-05-11 09:45:50', '2024-05-21 05:08:32', 2, 2),
(10, 'Sh. Pankaj Kumar Jha', 'श्री पंकज कुमार झा', 'SO', 'एसओ', '639', NULL, 'pankajkumar.jh35@gov.in', 'Property Section-III', 'संपत्ति खंड-III', 15, 1, '2024-05-11 09:47:32', '2024-05-21 06:50:32', 1, 1),
(11, 'Sh. Rajeev Kumar Das', 'श्री राजीव कुमार दास', 'Deputy Land & Development officer-V', 'उप भूमि एवं विकास अधिकारी-V', '628-A', '011-23010533', 'rajeevk.das@gov.in', 'Lease - I Section', 'लीज - I खंड', 11, 0, '2024-05-11 09:52:30', '2024-05-21 05:09:36', 2, 2),
(12, 'Sh. Achintya Chandra', 'श्री अचिन्त्य चन्द्र', 'SO', 'एसओ', '637', NULL, 'achintya.chandra35@gov.in', 'Lease - I Section', 'लीज - I खंड', 16, 1, '2024-05-11 09:55:27', '2024-05-21 05:33:40', 2, 2),
(13, 'Sh. Manoj Kumar Gupta', 'श्री मनोज कुमार गुप्ता', 'Deputy Land & Development officer-IV', 'उप भूमि एवं विकास अधिकारी-IV', '629-A', '011-23061448', 'kumar.m13@nic.in', 'Lease - II (A) Section', 'लीज - II (A) खंड', 5, 1, '2024-05-11 09:57:47', '2024-05-21 05:27:14', 2, 2),
(14, 'Sh. Ankur Lal', 'श्री अंकुर लाल', 'SO', 'एसओ', '637', NULL, 'ak.lal51@gov.in', 'Lease - II (A) Section', 'लीज - II (A) खंड', 14, 0, '2024-05-11 09:59:58', '2024-05-21 05:15:01', 2, 2),
(16, 'Sh. Harsh Kumar Garhwal', 'श्री हर्ष कुमार गढ़वाल', 'SO', 'एसओ', '638-A', NULL, 'Harsh.garhwal@gov.in', 'Lease - II (B) Section', 'लीज - II (B) खंड', 17, 1, '2024-05-11 10:02:50', '2024-05-21 05:34:01', 2, 2),
(17, 'Sh. Bipin Kumar Singh', 'श्री बिपिन कुमार सिंह', 'Deputy Land & Development officer-VII', 'उप भूमि एवं विकास अधिकारी-VII', '623-A', '011-23010532', 'bipinkr.singh17@gov.in', 'Lease - IV Section', 'लीज - IV खंड', 8, 1, '2024-05-11 10:08:49', '2024-05-21 05:28:48', 2, 2),
(18, 'Sh. Dheeraj Kumar', 'श्री धीरज कुमार', 'SO', 'एसओ', NULL, NULL, NULL, 'Lease - IV Section', 'लीज - IV खंड', 18, 1, '2024-05-11 10:10:27', '2024-05-21 05:34:17', 2, 2),
(19, 'Sh. Bipin Kumar Singh', 'श्री बिपिन कुमार सिंह', 'Deputy Land & Development officer-VII', 'उप भूमि एवं विकास अधिकारी-VII', '623-A', '011-23010532', 'bipinkr.singh17@gov.in', 'Lease - V Section', 'लीज - V खंड', 19, 0, '2024-05-11 10:19:59', '2024-05-21 05:06:00', 1, 1),
(20, 'Sh. Dheeraj Kumar', 'श्री धीरज कुमार', 'SO', 'एसओ', NULL, NULL, NULL, 'Lease - V Section', 'लीज - V खंड', 20, 0, '2024-05-11 10:21:22', '2024-05-21 05:19:06', 2, 2),
(21, 'Sh. Dinesh Kumar Lakhumna', 'श्री दिनेश कुमार लखुमना', 'Deputy Land & Development officer-lII', 'उप भूमि एवं विकास अधिकारी-lII', '633-A', '011-23061296', 'dinesh.lakhumna@gov.in', 'Vigilance Section', 'सतर्कता खंड', 21, 0, '2024-05-11 10:23:02', '2024-05-21 05:08:11', 2, 2),
(22, 'Smt. Madhu Bala Saxena', 'श्रीमती मधु बाला सक्सैना', 'Superintendent', 'अधीक्षक', NULL, NULL, NULL, 'Vigilance Section', 'सतर्कता खंड', 19, 0, '2024-05-11 10:24:21', '2024-05-21 05:41:14', 2, 2),
(23, 'Sh. Sanjiv Kumar Kohli', 'श्री संजीव कुमार कोहली', 'Senior Account Officer(AO)', 'वरिष्ठ लेखा अधिकारी (एओ)', NULL, NULL, NULL, 'IAC Section', 'IAC खंड', 11, 1, '2024-05-11 10:26:37', '2024-05-21 05:42:33', 2, 2),
(24, 'Sh. Vimal Chand', 'श्री -विमल चंद', 'Superintendent', 'अधीक्षक', NULL, NULL, NULL, 'IAC Section', 'IAC खंड', 20, 0, '2024-05-11 10:27:35', '2024-05-21 05:40:28', 2, 2),
(25, 'Sh. Rajeev Kumar Das', 'श्री राजीव कुमार दास', 'Deputy Land & Development officer-V', 'उप भूमि एवं विकास अधिकारी-V', '628-A', '011-23010533', 'rajeevk.das@gov.in', 'RP Cell', 'RP सेल', 25, 0, '2024-05-11 10:29:05', '2024-05-21 05:10:00', 2, 2),
(26, 'Sh. Ankur  Lal', 'श्री अंकुर लाल', 'SO', 'एसओ', '640', NULL, 'ak.lal51@gov.in', 'RP Cell', 'RP सेल', 26, 0, '2024-05-11 10:29:57', '2024-05-21 05:15:27', 2, 2),
(27, 'Sh. Ashok Bawal', 'श्री अशोक बवाल', 'Deputy Land & Development officer-VI', 'उप भूमि एवं विकास अधिकारी-VI', '624', '011-23061325', 'a.bawal@nic.in', 'Vigilance Section', 'सतर्कता खंड', 7, 1, '2024-05-21 05:25:35', '2024-05-21 05:28:21', 2, 2),
(28, 'Sh. Suresh Kumar', 'श्री सुरेश कुमार', 'Engineer Officer (EO)', 'इंजीनियर अधिकारी (ईओ)', '617', '23062257', 'suresh.rana197@gov.in', 'IAC Section', 'IAC खंड', 10, 1, '2024-05-21 05:32:30', '2024-05-21 05:32:30', 2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `eso_courts`
--

CREATE TABLE `eso_courts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `file_no` varchar(255) DEFAULT NULL,
  `section_id` bigint(20) UNSIGNED NOT NULL,
  `active_in_court` varchar(255) DEFAULT NULL,
  `case_no` varchar(255) NOT NULL,
  `commencement_date` date DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `status` text DEFAULT NULL,
  `ldoh` date DEFAULT NULL,
  `ndoh` date DEFAULT NULL,
  `closing_date` date DEFAULT NULL,
  `judgement_link` varchar(255) DEFAULT NULL,
  `additional_info` varchar(255) DEFAULT NULL,
  `remarks` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `eso_courts`
--

INSERT INTO `eso_courts` (`id`, `file_no`, `section_id`, `active_in_court`, `case_no`, `commencement_date`, `subject`, `status`, `ldoh`, `ndoh`, `closing_date`, `judgement_link`, `additional_info`, `remarks`, `is_active`, `sort_order`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(8, '55 Hanuman Road', 6, NULL, '11-4(4)/70', '2010-06-08', 'Haji Hammiuddin & ors.', 'Deptt. has informed that the terms towards Govt. dues is under consideration.', NULL, '2024-06-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-29 07:09:58', '2', '2024-05-29 07:09:58', '2'),
(9, 'Plot no. 8 block 91, Gole Market, New Delhi', 6, NULL, '11-3(44)/73', '2019-01-01', 'UOI vs. Rajinder Gupta', 'Written submission has been filed from both the parties.', NULL, NULL, NULL, NULL, 'Fresh proceedings initiated on 01.01.2019', NULL, 1, NULL, '2024-05-29 07:09:58', '2', '2024-05-29 07:09:58', '2'),
(10, '8 Lady Harding Road', 6, NULL, '11-3(48)/73', '1974-02-21', 'UOI vs. Arjun Dev Goel', 'Respondent is not responding to the hearing notices of this court.\nStatus report the Deptt. has been sought.', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-29 07:09:58', '2', '2024-05-29 07:09:58', '2'),
(11, '1 M.M. Road', 6, NULL, '11-3(28)/74', '1975-06-24', 'UOI vs. LR’s of late Krishan Swaroop', 'Respondents have submitted documents which is under examination by the department.', NULL, '2024-05-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-29 07:09:58', '2', '2024-05-29 07:09:58', '2'),
(12, '40 Hanuman Road', 6, NULL, '11-3(84)/74', '2009-11-13', 'UOI vs. Legal heirs of Shri Daljit Singh, Ajit Singh & Ors.', 'Respondent has requested for adjournment as this matter is still pending in the Hon’ble High Court', NULL, NULL, NULL, NULL, '13.11.2009\nRemand case\n', NULL, 1, NULL, '2024-05-29 07:09:58', '2', '2024-05-29 07:09:58', '2'),
(116, 'LI -9/90(20CC)', 6, NULL, '11-4(48)/77', '1980-06-12', 'UOI vs. S.P. Rao (Madras Hotel)', 'Deptt. is directed to file the status report in the matter, especially regarding a stay in the matter or to continue with the proceedings pending before the Estate Officer. ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(117, '8 Jain Mandir Road', 6, NULL, '11-4(1)/79', '2005-04-25', 'UOI vs. V.S. Mittal & Ors.', 'Deptt. is directed to submit status report on SBP to this Court. ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(118, 'LI-9/148(43-B)', 6, NULL, '11-3(6)/2000', '2000-09-07', 'UOI vs. M/s Cycle Equipment (P) Ltd.', 'Party has submitted Sanctioned Building Plan. Department is directed to examine the same in consultation with the Tech. Section', NULL, '2024-05-27', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(119, '12  Lady Harding Road', 6, NULL, '11-3(44)/06', '2006-05-18', 'UOI vs. All India Shwetamber Sthanakwasi Jain Conference ', 'Deptt has informed that the matter is under consideration for preparation of govt. dues.', NULL, '2024-05-29', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(120, '11 Jain Mandir Road', 6, NULL, '11-3(1)/11\n11-4(2)/11', '2010-12-01', 'UOI vs. Prabhat Raman, Puneet Raman ', NULL, NULL, '2024-05-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(121, 'LI-9/G(7)/2001', 6, NULL, '11-3(6)/2019', '2019-12-12', 'UOI vs. M/s Dewan & Sons Investment Pvt. Ltd.', 'Both the parties have confirmed that the matter is pending before the Hon’ble High Court against the demand letter issued by the Department.', NULL, '2024-06-03', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(122, 'LII-1(43)/63', 8, NULL, '11-3(1)/83', '1983-03-03', 'UOI vs. Secy. Jagjiwan Ashram', 'Demand towards govt. dues needs to be finalised. ', NULL, '2024-06-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(123, 'LII-B/10(5)', 8, NULL, '11-3(2)/19', '2019-03-05', 'UOI vs. Chairman and Managing Journals Ltd. 5 Bahadur Zafar Marg', 'The status of the case on the portal of the Supreme Court shows that a stay order has been passed. Deptt. is directed to file the status report in the matter, especially whether there still is a stay in the matter or to continue with the proceedings pending before the undersigned. ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(124, 'LIII- 8/3(2)', 16, NULL, '11-3(2)/00\n11-5(1)/2018', '2018-04-06', 'UOI vs. Masonic Club (Jamna Lodge)', 'Department directed to file its reply to the interrogations dated 02.09.2019 filed by the Respondent', NULL, '2024-06-13', NULL, NULL, '06.04.2018\nRemand case', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(125, 'LIII – 8/3/21', 16, NULL, '11-4(5)/01', '2001-05-30', 'UOI vs. Sharma Montessori school Lodhi Road', 'Notice for appearance received back.', NULL, '2024-04-08', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(126, 'LIII – 8/5(47)', 16, NULL, '11-3(5)/03', '2003-09-02', 'UOI vs. HPCL (Laxmi Super Service Station)', 'Respondent requested for adjournment for filing their representation. ', NULL, '2024-06-07', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(127, 'LIII – 8/2(1)/67', 16, NULL, '11-3(45)/06', '2006-07-05', 'UOI vs. Empire Coal Co.', 'Deptt. informed that there is a stay in eviction order and the case is pending before the Hon’ble High Court on regular basis ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(128, 'LIII- 8/5(25)', 16, NULL, '11-3(1)/09', '2009-07-28', 'UOI vs. HPCL (Kumar Service Station)', 'Respondent requested for adjournment for filing their representation. ', NULL, '2024-06-07', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(129, 'LIII/8/5(134)/2013', 16, NULL, '11-4(2)/13', '2013-12-20', 'UOI vs. BPCL (New United Service Station', 'Matter is at the stage of cross-examination.', NULL, '2024-05-31', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(130, 'LIII/8/2(3)/69', 16, NULL, '11-3(3)/08/R/2013', '2021-10-12', 'UOI vs. New Delhi Coal Depot', 'As per directions of the Hon’ble Court issues framed by the ESO court on 18.04.2022. Reply from deptt. & Respondent are still awaited.                                                                                                       ', NULL, '2024-04-30', NULL, NULL, 'Remand back case\n12.10.2021', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(131, '7 Abdul Fazal Road', 9, NULL, '11-3(25)/75', '2011-12-14', 'UOI vs. D.R. Rakyan', 'The Estate Officer proceedings were initiated vide noting dated 14.12.2011 and Shri Ajit Rakyan filed his statement of facts on the remand case from the ADJ vide his letter dated 20.03.2012. However, on perusal of the record, it is seen that the Deptt has not filed their written submission.\nIt has been informed by the Department that Respondent is not allowing inspection of this site.\nFurther, complaint(s) has beenreceiv                                                                                            ed from the so-called family members of the respondent which needs to be settled.', NULL, '2024-05-27', NULL, NULL, 'Remand back case. ', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(132, '124 Sunder Nagar', 9, NULL, '11-3(33)/75', '1976-09-05', 'Shri Jagmohan Singh\nShri Satwant Singh', 'Demand is under preparation', NULL, '2024-05-17', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(133, '126 Sunder Nagar', 9, NULL, '11-3(34)/75', '1976-03-05', 'UOI vs. Gurmukh Singh & Lachmi Devi', 'Demand is under preparation', NULL, '2024-05-17', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(134, '58-A Jor Bagh', 9, NULL, '11-3(8)/05', '2005-04-19', 'UOI vs. legal heirs of Shri Rameshwari Dasmana', 'Deptt. was directed to prepare demand.', NULL, '2024-05-29', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(135, '5 Sunder Nagar', 9, NULL, '11-4(8)/05', '2005-05-19', 'UOI vs. Lh’s Balbir Singh & Ors', 'In this case, representation has been filed by the Respondent and deptt. has been directed to examine the same. Deptt. has informed that there is a court case pending in Delhi High Court against demand letter, misuse, breach notice issued by this deptt.', NULL, '2024-07-15', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(136, 'LV -3(193)', 10, NULL, '11-3(1)/81\n11-4(7)/81', '1982-11-02', 'UOI vs. Secy. S.D. Sabha \nShiv Mandir', 'S.D. sabha has submitted an application dated 03.06.2019, the same needs to be replied by the deptt. ', NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(137, 'LV -3(193)', 10, NULL, '11-4(5)/81', '1982-11-02', 'UOI vs. Madhu Dayal', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(138, 'LV-3(63)', 10, NULL, '11-4(8)/81', '1982-11-02', 'UOI vs. Shri Om Parkash', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(139, 'LV-3(147)/82', 10, NULL, '11-3(1)/82', '1982-08-31', 'UOI vs. S.D. Sabha Laxmi Narain Temple', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(140, 'LV -3(147)', 10, NULL, '11-4(8)/82', '1982-08-31', 'UOI vs. Sh. Gurdial Singh', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(141, 'LV -3(198)', 10, NULL, '11-4(1)/83', '1985-12-03', 'UOI vs. Faqir Chand', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(142, 'LV-3(63)', 10, NULL, '11-3(2)/83', '1983-04-26', 'UOI vs. Secy. S.D. Sabha Ramlila ground', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(143, 'LV-3(198)', 10, NULL, '11-3(3)/83', '1983-04-06', 'UOI vs. Secy. S.D. Sabha Shiv Temple', NULL, NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(144, 'LV – 5(183)', 10, NULL, '11-3(3)/00', '2000-05-24', 'UOI vs. Sharma Montessori School (Minto Road)', 'ORDER ISSUED', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(145, 'LV-4(11)', 10, NULL, '11-3(1)/01', '2001-03-19', 'UOI vs. Digamber Jain Mahila Ashram', 'The file has been sent to Tech. section for calculation of charges.', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(146, 'LV-4(425)', 10, NULL, '11-3(2)/01', '2001-07-04', 'UOI vs. National league, Defence Colony ', 'Terms letter has been issued to the Respondent on 14.03.2019 and they have filed a representation against the terms letter.\nRespondent requested for adjournment for filing his written submission', NULL, '2024-05-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(147, 'LV-3(19)', 10, NULL, '11-3(1)/2020', '2020-01-08', 'UOI vs. Bharat Sadhu Samaj', 'The counsel on behalf of the department requested for adjournment for filing rejoinder/reply.', NULL, '2024-05-30', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(148, 'RP Cell', 13, NULL, '11-4(13)/01', '2001-10-08', 'UOI vs. M/s Punj and sons', 'It has been informed by the deptt. that this case pending in Hon’ble Delhi High Court on regular basis against the demand raised by the Department. Deptt has been directed for furnish the status report.', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(149, '4/18 Jangpura Extn.', 3, NULL, '11-3(2)/08', '2008-04-14', 'UOI vs. Shri Jawala Dass & Ors.', 'Terms letter issued towards govt. dues. Respondent requested for adjournment for submission of reply.', NULL, '2024-05-31', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(150, 'I/II-42 Lajpat Nagar', 4, NULL, '11-3(46)/73', '2005-10-27', 'UOI vs. Mohinder Singh & sons', 'Deptt. is directed to conduct re-inspection and thereafter matter to be processed for recovery of government dues.', NULL, '2024-06-04', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(151, '39/23 Old Rajinder Nagar', 4, NULL, '11-3(29)/06', '2006-01-19', 'UOI vs. Smt. Chand Mohini & ors', 'Revised demand is under preparation.', NULL, '2024-06-12', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(152, '39/34 Old Rajinder Nagar', 4, NULL, '11-3(23)/06/R/2022', NULL, 'UOI vs. Shri Ajay Kumar Nahata & ors.', 'Fresh show cause notice issued.\nReply from the Respondents awaited.', NULL, '2024-06-14', NULL, NULL, 'Remand back case', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(153, 'CP-34 South Patel Nagar', 5, NULL, '11-3(49)/73', '1974-02-21', 'UOI vs. Mohinder Kaur', 'It has been observed that the respondent is not attending this court despite issuing of the notice and now hearing notice is being pasted at the site.\nFurther, it had been informed by the deptt. that there is a court case pending in the Delhi High court. ', NULL, '2024-07-12', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(154, '5/2 West Patel Nagar', 5, NULL, '11-3(42)/75', '1976-10-11', 'UOI vs.  Savitri Dev', 'Respondent is not attending this court proceedings despite of issuance of this court hearing notices.', NULL, '2024-05-09', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(155, '6/1 West Patel Nagar', 5, NULL, '11-3(2)/06', '2006-01-03', 'UOI vs. Madan Lal Arora & Ors.', 'PAYMENT MADE-Action for withdrawal of re-entry is under consideration', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(156, '6/26 West Patel Nagar', 5, NULL, '11-3(4)/06', '2006-01-03', 'UOI vs. Lh’s Smt. Motia Devi', 'Deptt. has informed that the terms towards govt. dues are still under consideration and requested for adjournment. Breach notice dated 13.11.2018 received back undelivered with the remarks of postal authority remarks a “incomplete address”. The same has been handed to the Respondent. ', NULL, '2024-06-03', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(157, 'CP-18 West Patel Nagar', 5, NULL, '11-3(5)/06', '2006-01-04', 'UOI vs. Gopal Krishan Chopra & Puran Chand', 'Respondent has informed that they have applied for SBP which will take time.', NULL, '2024-07-01', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(158, '5/7 West Patel Nagar', 5, NULL, '11-3(6)/06', '2006-01-04', 'UOI vs. K.G. Ghai & Ors. ', 'Order issued.', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(159, '5/13 West Patel Nagar', 5, NULL, '11-3(8)/06', '2006-01-05', 'UOI vs. Ram Kishan & Mukesh Kumar', 'Towards preparation of the terms letter for govt. due, matter regarding sanctioned building plan needs to be dissolved. Accordingly, both the parties are advised to finalise the matter in consultation with the tech. wing of this office.', NULL, '2024-06-11', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(160, '3/20 West Patel Nagar', 5, NULL, '11-3(9)/06', '2006-01-05', 'UOI vs. Om Parkash & Ors', 'In this case demand letter was issued .', NULL, '2024-08-12', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(161, '4/30 West Patel Nagar', 5, NULL, '11-3(11)/06', '2006-01-06', 'UOI vs. Satpal Babbar & ors.', 'Deptt has issued the demand letter towards govt. dues, payment awaited ', NULL, NULL, NULL, NULL, 'Reserved  for judgment', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(162, '4/29 West Patel Nagar', 5, NULL, '11-3(12)/06', '2006-01-06', 'UOI vs. Smt. Radha Gupta & others', 'Case is under process for preparation of the terms letter for withdrawal of re-entry.', NULL, '2024-06-11', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(163, '4/17 East Patel Nagar', 5, NULL, '11-3(13)/06', '2006-01-09', 'UOI vs. Maya Bhagat & Ors.', 'Deptt. has informed that SLP has been filed in this case since 2012. Deptt. has been directed to reply to the representation filed by the Respondent.', NULL, '2024-06-04', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(164, '1/16 West patel Nagar', 5, NULL, '11-3(15)/06', '2006-01-12', 'UOI vs. Taljeet Singh & Smt. Satnam Kaur', 'The earlier inspection was refused. Department is directed to get inspection within 10 days.', NULL, '2024-07-25', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(165, '3/27 East Patel Nagar', 5, NULL, '11-3(16/06', '2006-01-12', 'Anil Kumar, Rajan Kumar, Sudesh Kumar & Rajesh Kumar', 'Deptt. is directed to examine the representation of the Respondent.', NULL, '2024-07-05', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(166, '13/15 East Patel Nagar', 5, NULL, '11-3(18)/06', '2006-01-13', 'UOI vs. Kamla Bawa & Ors.', 'Demand letter issued on 2019. \nRespondent requested for adjournment for getting SBP from MCD', NULL, '2024-07-16', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(167, '26/32 East Patel Nagar', 5, NULL, '11-3(21)/06', '2006-01-16', 'UOI vs. Banasari Lal & Ors', 'Demand  letter was issued. Last opportunity is given for making payment ', NULL, '2024-07-01', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(168, 'CP-34 West Patel Nagar', 5, NULL, '11-3(22)/06', '2006-01-17', 'UOI vs. Lh’s of Smt. Niranjan Kaur', 'Deptt. has informed that demand is under preparation.', NULL, '2024-06-27', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(169, '26/33 East Patel Nagar', 5, NULL, '11-3(24)/06', '2006-01-17', 'UOI vs. R.N. Khanna & Ors', 'Respondent has filed authorised letter dated 19.11.2019 and as per the they are ready to pay the govt. dues.\nDeptt. has informed that inspection of the site has been conducted and breach notice provided to the respondent. Now terms letter will be prepared.', NULL, '2024-08-19', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(170, '4/24 East Patel Nagar', 5, NULL, '11-3(27)/06', '2006-01-17', 'UOI vs. Shri J.L. Malhotra', 'Respondent has informed that she has filed a representation against the demand letter issued by the Deptt. and the same is under consideration by the Deptt. ', NULL, '2024-06-15', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(171, 'BP-23 West Patel Nagar', 5, NULL, '11-3(30)/06', '2006-01-10', 'UOI vs. M/s Falk Garments (P) Ltd.', 'Deptt. has informed that the file has been sent to tech. section to work out the charges.', NULL, '2024-07-16', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(172, '8/11 East Patel Nagar', 5, NULL, '11-3(31)/06', '2006-01-19', 'UOI vs. Raman Khera', 'Demand letter issued on 24.08.2023', NULL, '2024-07-22', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(173, '6/12 West Patel Nagar', 5, NULL, '11-3(34)/06', '2006-01-20', 'UOI vs. K.S. Suri', 'ORDERS issued on 28.02.2024.', NULL, '2024-02-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(174, '11/5 West Patel Nagar ', 5, NULL, '11-3(36)/06', '2006-01-20', 'UOI vs. Shri Prem Uppal & Ors.', 'Order issued on 19.02.2024', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(175, '4/1 East Patel Nagar', 5, NULL, '11-4(40)/06', '2006-02-13', 'UOI vs/ Meeta Dharmani & Sons', 'In this case, demand letter was issued on 06.12.2018. Party has submitted SBP. The property was again inspected and a breach notice was issued on 29.11.2023. The demand is under consideration.', NULL, '2024-06-11', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(176, '15-7(3012)/71', 17, NULL, '11-(14)/74', '2005-08-31', 'UOI vs. Lh’s of Shri S.N. Dhawan', 'Deptt. has submitted evidence. The counsel for Respondent requested for adjournment for filinkg their reply.', NULL, '2024-06-10', NULL, NULL, '31.08.2005\nRemand case', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(177, '15-7(452)/67', 17, NULL, '11-5(17)/74', '1974-06-14', 'UOI vs. B.L. Bhatia', 'In this case, it has been observed that the unauthorized occupant is on the site since 1955 and the case is originally pending before this court since 1974 and Respondent is not appearing before this court after 14.10.1994, it is, therefore, not feasible to continue the proceedings. Deptt. is directed to give the correct address/where-about of Respondent along with the present status of the case. ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(178, '15-3(253)/72', 17, NULL, '11-5(20)/75\n11-4(14)/85/R\n11-5(21)/83/R', '1976-04-30', 'UOI vs. Jag Ram vs. Dev Raj', 'Respondent has submitted status report. Department is directed to furnish status report. ', NULL, '2024-07-04', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(179, '15-7(275)/67-A', 17, NULL, '11-5(12)/79', '1970-04-17', 'UOI vs. Bengal Sanitary Works', 'Petitioner department i.e. Enf. Section is directed to review the matter in detail and seek legal advice in the matter and with the approval of the competent authority and submit a clear report whether to continue the case or to close the matter before this court. If they suggest to continue with the matter, then they are also directed to furnish the exact whereabouts of the Respondent, so that he can be contacted. It is observed that the matter is pending since 12.03.1979 and the Respondent has attended this court upto 26.10.1998, thereafter, Respondent has never appeared before this court.', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(180, '15-7(39)/82/R/2011', 17, NULL, '11-5(39)/82', '2011-07-29', 'UOI vs. Rawail Singh', 'This is a remand back case. Deptt has filed upto date demand towards govt. dues. Further deptt. status report regarding Respondent’s representation is awaited.', NULL, '2024-07-24', NULL, NULL, '29.07.2011 \nRemand case', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(181, 'Enf.', 17, NULL, '11-5(2)/83', '1983-02-15', 'UOI vs. Sardari Lal', 'Demand letter for Rs. 3,70,98,192/- was issued on 06.03.2020. Respondent inspected the file . Respondents reply is still awaited.', NULL, '2024-06-03', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(182, '15-7(4582)/82', 17, NULL, '11-5(17)/83', '2019-02-25', 'UOI vs. Harish Kapoor (Sumit Kapoor)', 'Department has sent demand of Rs. 9,08,50,696/-towards unauthorised occupation charges on 07.02.2024. Respondent represented against the said notice which is under consideration.', NULL, '2024-05-29', NULL, NULL, '25.02.2019\nRemand case', NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(183, '15-7(4291)/79', 17, NULL, '11-4(6)/84', '2012-03-02', 'UOI vs. Sham Narayan ', 'EO is directed to inspect the entire area and identify the unauthorised occupants and proceed the case against them under the Public Premises (Eviction of Unauthorised Occupants) 1971.', NULL, '2024-06-10', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(184, '15-7(4278)/76', 17, NULL, '11-4(11)/85', '1990-07-10', 'UOI vs. Nand Lal(c/o Sunil Chawla & Ors.)', 'Last opportunity has been given to the department for filing suitable reply if any.\nOrder issued', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(185, '15-7(324)/67', 17, NULL, '11-5(17)/85', '1985-04-02', 'UOI vs DTW Co-op Society', 'Last and final opportunity has been given to the Respondent', NULL, '2024-06-06', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:48', '2', '2024-05-30 06:55:48', '2'),
(186, '15-7(4550)/80', 17, NULL, '11-(28)/85', '1985-12-30', 'UOI vs. Sham Bihari Mishra', 'Main file seems missing. Deptt. has informed that their file has been received from the Vigilance section and now will refer the same to Tech. section for fresh inspection and status report. ', NULL, '2024-06-11', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(187, '15-7(4312)/79', 17, NULL, '11-(39)/85', '2011-01-20', 'UOI vs. M/s Pal Furniture  ', 'Petitioner department i.e. Enf. Section directed to review the matter in detail and seek legal advice in the matter and with the approval of the competent authority submit a clear report whether to continue the case or to close the matter before this court. If they suggest to continue with the matter, then they are directed to furnish the exact whereabouts of the Respondent, so that he can be contacted.', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(188, '15-10(7)/83', 17, NULL, '11-5(4)/86', '2007-06-27', 'UOI vs. Serve Shakti Sanatam Dharam Sabha', 'Demand letter has been issued on 18.04.2018 for amount of Rs. 3,93,54,176/-. On 16.11.2018, last opportunity has been given to respondent for payment. ', NULL, NULL, NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(189, 'Enf – 10-10(54)/R/83', 17, NULL, '11-5(53)/86', '1986-12-17', 'UOI vs. Mansa Devi Mandir', 'Deptt. (Enf. Section) is directed to trace the file from L-V section and  finalise the up-to-date demand dues against the Respondent', NULL, '2024-06-12', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(190, '15-7(4311)/79', 17, NULL, '11-4(23)/86', '1996-07-15', 'UOI vs. Mohd. Ansar', 'Notice has been issued to Waqf Board, Patwari, Revenue Deptt. to produce evidence.', NULL, '2024-07-11', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(191, '15-7(4277)/79', 17, NULL, '11-4(25)/86/R/10', '2010-07-07', 'UOI vs. Shri Krishan Chand', 'It has been observed that the Department Representative are unable to provide evidence/statement on one excuse or the other. cases have been fixed for 06.06.2023 for Department’s evidence by way of affidavit. ', NULL, '2024-06-10', NULL, NULL, '7.7.2010\nRemand case', NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(192, '15-7(4279)/79', 17, NULL, '11-4(42)/86\n11-5(50)/86', '1986-11-26', 'UOI vs. Shri Dal Chand', 'It has been observed that the Department Representative are unable to provide evidence/statement on one excuse or the other. cases has been fixed for 06.06.2023 for Department’s evidence by way of affidavit.', NULL, '2024-06-10', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(193, '15-7(4280)/75', 17, NULL, '11-4(1)/88', '2010-12-22', 'UOI vs. Babu Lal', 'It has been observed that the Department Representative are unable to provide evidence/statement on one excuse or the other. cases have been fixed for 06.06.2023 for Department’s evidence by way of affidavit. ', NULL, '2024-06-10', NULL, NULL, '22.12.2010\nRemand', NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(194, '15-7(4580)/82', 17, NULL, '11-4(4)/88', '2012-03-30', 'UOI vs. Bakshi Singh\n(Dalip motors)\nMalkeet Singh', 'Deptt. and MCD was directed to file affidavits. ', NULL, '2024-05-27', NULL, NULL, '30.03.2012\nRemand Case', NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(195, '15-7(944)/68', 17, NULL, '11-4(1)89\n11-5(4)/89', '1989-02-21', 'UOI vs. Shri Kundan Lal', 'Respondent has submitted reply which is under consideration.', NULL, '2024-05-30', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(196, '15-7(945)/68', 17, NULL, '11-5(1)/89', '1989-02-27', 'UOI vs. Shri Dwarka Nath Amar Nath', 'Respondent has submitted reply which is under consideration.', NULL, '2024-05-30', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(197, '15-7(4993)/89', 17, NULL, '11-4(2)/92', '1992-03-09', 'UOI vs. Virender Singh', 'It has been observed that the Department Representative are unable to provide evidence/statement on one excuse or the other. cases have been fixed for Department’s evidence by way of affidavit. ', NULL, '2024-06-10', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(198, '15-10(50)/Rel.83', 17, NULL, '11-5(5)/92', '1992-04-01', 'UOI vs. Rati Ram', 'Deptt. informed that reply from DDA is still awaited', NULL, '2024-05-27', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(199, '15-7(5461)/90', 17, NULL, '11-4(4)/01', '2012-05-25', 'UOI vs. Rameshwari Devi', 'Respondent has requested to provide translation of urdu documents. ', NULL, '2024-05-22', NULL, NULL, '25.05.2012\nRemand case', NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(200, '15-7(5584)/07', 17, NULL, '11-4(6)/01', '2001-06-01', 'UOI vs. Jagan Nath', 'The case had been reserved for orders, however, the same cannot be done as the Department had submitted their up-to-date demand for recovery of government dues only upto 04.06.2010 vide their demand letter dated 04.06.2010 and giving a loss to the government for more nine years. Fresh demand letter has been issued to the respondent \nRespondent has requested for adjournment for getting the required documents from the Tehsildar', NULL, '2024-05-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(201, '15-7(5585)/07', 17, NULL, '11-4(7)/01', '2001-06-06', 'UOI vs Raj Dulari ', 'The case had been reserved for orders, however, the same cannot be done as the Department had submitted their up-to-date demand for recovery of government dues only upto 04.06.2010 vide their demand letter dated 04.06.2010 and giving a loss to the government for more nine years.  The fresh demand letter has been provided to the Respondent. \nRespondent has requested for adjournment for getting the required documents from the Tehsildar', NULL, '2024-05-28', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(202, '15-7(4584)/82', 17, NULL, '11-5(2)/10', '2010-07-20', 'UOI vs. Shiv Mandir Samiti-I', 'The matter was reserved for orders, however, the same cannot be done, as the department has not filed upto demand for recovery of government dues. Therefore, the matter has been initiated again and now the deptt. has filed the demand letter. Further, the Respondent is given another opportunity to file any authenticable document to prove their title of the property in question ', NULL, '2024-06-14', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(203, '15-7(2394)/09', 17, NULL, '11-4(3)/09', '2009-12-22', 'UOI vs. Naina Dass (pujari)\n(Shiv Mandir/RK Puram)', 'Department is directed to update the demand', NULL, '2024-05-31', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(204, '15-7(4279)79', 17, NULL, '11-5(3)/10', '2010-05-26', 'UOI vs. Smt. Renuka', NULL, NULL, '2024-06-10', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(205, '15-7(4986)/89', 17, NULL, '11-4(1)/19', '2019-07-15', 'UOI vs. Shri Rajesh Bhardwaj\nI Point', 'Deptt. filed rejoinder . Reply to rejoinder by the Respondent is awaited', NULL, '2024-05-27', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(206, '15-10(75)', 17, NULL, 'ESO/11-4(1)/2020', '2020-03-19', 'UOI vs. Hony. General Secretary, Shiv Mandir Samiti -2', 'Order under Sub-section (3) of Section 7 of the Public Premises (Eviction of Unauthorized Occupant) Act, 1971 has already been issued on 31.01.2019. This order was against the religious purpose area measuring 81.10 sq.m. amounting to Rs.58,65,075/-.\nHowever, status report regarding the recovery of the government dues from the Respondent has not been filed till date by the Petitioner Department.\n2.  Regarding the Eviction proceedings: it is seen that the petitioner department has filed the plaint before this court on 24.02.2020, for initiating eviction proceedings under Sub-section (1) of Section 4 of the PPE Act, 1971 against the unauthorised occupants of Hon’ble Secretary, Mandir Samiti-2 for the area measuring 81.10 sq. mts. situated at Block no. 1, Rouse Avenue, Minto Road, New Delhi.\n(i) Accordingly, proceedings were initiated against the Respondent and ongoing through the record, it has been observed that this office (L&DO) has allotted land measuring 3519 sq. meters part of pocket 4 at Deen Dayal Upadhyay Marg, New Delhi to Department of Economic Affairs, Ministry of Finance for construction of 90 dwelling units for officers of Indian Economic Services vide their office letter dated 29.09.2016 and the same has been confirmed by Ministry of Finance vide their letter dated 12.10.2018.\n(ii)         As per the terms and condition of the above-mentioned allotment letter dated 29.09.2016 stated at point 2, the removal of structures/squatters in the allotted area, if any, will be the responsibility of allottee.\n3. In view of above, this court has come to the conclusion that the petitioner department should consider the terms and conditions of this office allotment letter and process their case accordingly, in consultation with LII/A Section w.r.t. the allotted land measuring 3519 sq. meters part of pocket 4 at Deen Dayal Upadhyay Marg, New Delhi to Department of Economic Affairs, Ministry of Finance for construction of 90 dwelling units for officers of Indian Economic Services vide their office letter dated 29.09.2016 which has been confirmed by Ministry of Finance vide their letter dated 12.10.2018. \n4. Further the Respondent has filed their detailed reply and one copy of the same has been provided to Petitioner Department. The Deptt. has been directed to file their detailed report/re-joinder (if any).', NULL, '2024-06-14', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2'),
(207, NULL, 17, NULL, '11-5(1)/01', '2001-07-18', 'UOI vs. Mahant Ashok Atma Dass Brahma rishi Devraha Baba Mandir', 'Repondent has to submit written statement .', NULL, '2024-05-31', NULL, NULL, NULL, NULL, 1, NULL, '2024-05-30 06:55:49', '2', '2024-05-30 06:55:49', '2');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `label`
--

CREATE TABLE `label` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `label_eng` varchar(255) NOT NULL,
  `label_hin` varchar(255) NOT NULL,
  `location` enum('haeder','footer','page') NOT NULL,
  `order` int(11) NOT NULL,
  `page_id` bigint(20) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `menus`
--

CREATE TABLE `menus` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `label_eng` varchar(255) NOT NULL,
  `label_hin` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `link_in_new_tab` tinyint(4) DEFAULT 0,
  `location` enum('header','footer','page','') NOT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `page_id` bigint(20) DEFAULT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `menus`
--

INSERT INTO `menus` (`id`, `label_eng`, `label_hin`, `parent_id`, `link`, `link_in_new_tab`, `location`, `sort_order`, `is_active`, `page_id`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Home', 'होम', NULL, NULL, 0, 'header', 0, 1, NULL, 1, '2024-04-18 01:49:50', '2024-04-18 01:49:50'),
(2, 'About us', 'हमारे बारे में', NULL, 'about-us', 0, 'header', 1, 1, NULL, 2, '2024-04-18 01:54:23', '2024-05-17 04:18:17'),
(3, 'History & Mandate', 'इतिहास और अधिदेश', 2, 'history-and-mandate', 0, 'header', 1, 1, NULL, 2, '2024-04-18 01:57:02', '2024-06-01 05:21:32'),
(4, 'Citizen Charter', 'नागरिक घोषणा पत्र', 2, 'citizen-charter', 0, 'header', 2, 1, NULL, 2, '2024-04-18 01:58:22', '2024-06-01 05:26:58'),
(5, 'Resource Library', 'संसाधन संग्रह', 2, 'resource-library', 0, 'header', 4, 1, NULL, 1, '2024-04-18 02:00:01', '2024-04-18 02:00:01'),
(8, 'Services', 'सेवाएं', NULL, 'services', 0, 'header', 4, 1, NULL, 2, '2024-04-18 04:12:44', '2024-05-16 01:35:35'),
(9, 'Acts & Rules', 'अधिनियम एवं नियम', NULL, 'acts-and-rules', 0, 'header', 3, 1, NULL, 1, '2024-05-01 05:09:29', '2024-05-01 05:09:29'),
(10, 'Acts & Rules', 'अधिनियम एवं नियम', 9, 'acts-and-rules', 0, 'header', 1, 1, NULL, 1, '2024-05-01 05:10:11', '2024-05-01 05:10:11'),
(11, 'Office Orders & Guidelines', 'कार्यालय आदेश एवं दिशानिर्देश', 9, 'office-orders-and-guidelines', 0, 'header', 2, 1, NULL, 1, '2024-05-01 05:12:04', '2024-05-01 05:12:04'),
(12, 'Circulars', 'परिपत्र', 9, 'circulars', 0, 'header', 3, 1, NULL, 1, '2024-05-01 05:20:32', '2024-05-01 05:20:32'),
(14, 'Tenders', 'निविदाएं', NULL, 'tenders', 0, 'header', 4, 1, NULL, 2, '2024-05-01 05:28:03', '2024-05-16 01:38:59'),
(15, 'eServices', 'ई - सेवाएं', NULL, 'eservices', 0, 'header', 5, 1, NULL, 1, '2024-05-01 05:36:53', '2024-05-01 05:36:53'),
(16, 'Payment', 'भुगतान', 15, 'https://ldo.gov.in/edharti/Default_Online_Payment.aspx ', 1, 'header', 1, 1, NULL, 1, '2024-05-01 05:38:24', '2024-05-01 05:38:24'),
(17, 'Application', 'आवेदन', 15, 'https://ldo.gov.in/edharti/SSL/Login.aspx', 1, 'header', 2, 1, NULL, 1, '2024-05-01 05:43:12', '2024-05-01 05:43:12'),
(18, 'Applicant Registration', 'आवेदक पंजीकरण', 15, 'https://ldo.gov.in/edharti/Default_Online_Registration.aspx', 1, 'header', 3, 1, NULL, 1, '2024-05-01 05:44:10', '2024-05-01 05:44:10'),
(19, 'Update NEFT/RTGS Status', 'एनईएफटी - आरटीजीएस अपडेट', 15, 'https://bharatkosh.gov.in/TrackTransaction/VerifyUser', 1, 'header', 4, 1, NULL, 2, '2024-05-01 05:48:45', '2024-05-17 03:45:03'),
(20, 'Payment Help', 'भुगतान सहायता', 15, 'http://192.168.0.62:30/storage/pdf/eServices_PaymentFlow.pdf', 1, 'header', 5, 1, NULL, 2, '2024-05-01 05:49:29', '2024-11-26 01:22:24'),
(21, 'Contact Us', 'हमें संपर्क करें', NULL, 'contact-us', 0, 'header', 9, 1, NULL, 2, '2024-05-01 05:53:53', '2024-06-01 05:29:06'),
(22, 'ESO Court', 'ईएसओ कोर्ट', NULL, 'eso-court', 0, 'header', 6, 1, NULL, 1, '2024-05-09 04:26:15', '2024-05-09 06:03:49'),
(23, 'Re-Entered', 'पुनः प्रवेश', NULL, 'http://192.168.0.62:30/storage/pdf/Re-entered_properties.pdf', 1, 'header', 7, 1, NULL, 1, '2024-05-09 04:27:51', '2024-05-15 07:09:45'),
(24, 'Who\'s Who', 'कौन कौन है', 2, 'whos-who', 0, 'header', 4, 1, NULL, 2, '2024-05-09 04:40:44', '2024-05-21 06:19:52'),
(25, 'footer 1', 'कॉलम 1', NULL, NULL, 0, 'footer', 1, 1, NULL, 1, '2024-05-14 02:53:47', '2024-05-14 05:20:55'),
(27, 'RTI (Right to Information)', 'RTI (सूचना का अधिकार)', 25, 'http://192.168.0.62:30/storage/pdf/RTI_Instructions.pdf', 1, 'footer', 2, 1, NULL, 2, '2024-05-14 02:56:59', '2024-06-03 03:42:41'),
(28, 'Directory', 'निर्देशिका', 25, 'whos-who', 0, 'footer', 1, 1, NULL, 2, '2024-05-14 03:56:03', '2024-05-17 04:10:34'),
(29, 'Club Membership', 'क्लब की सदस्यता', 25, '/club-membership', 0, 'footer', 5, 1, NULL, 2, '2024-05-14 03:57:27', '2024-06-19 01:43:18'),
(30, 'DORIS', 'डी ओ आर आई एस', 25, 'https://doris.delhigovt.nic.in/', 1, 'footer', 6, 1, NULL, 2, '2024-05-14 03:58:28', '2024-05-17 04:29:50'),
(31, 'AIPR for Group-A Officers', 'ग्रुप-क अधिकारियों के लिए ए आई पी आर', 25, 'http://192.168.0.62:30/storage/pdf/AIPR-Group-A.pdf', 1, 'footer', 7, 1, NULL, 2, '2024-05-14 04:02:46', '2024-06-01 05:30:10'),
(33, 'footer 2', 'footer column 2', NULL, NULL, 0, 'footer', 2, 1, NULL, 1, '2024-05-14 04:08:47', '2024-05-14 05:21:25'),
(34, 'About Us', 'हमारे बारे में', 33, 'history-and-mandate', 0, 'footer', 1, 1, NULL, 2, '2024-05-14 04:10:10', '2024-05-17 04:44:20'),
(35, 'eServices', 'ई - सेवाएँ', 33, 'https://ldo.gov.in/edharti/Default_Online_Registration.aspx', 0, 'footer', 2, 1, NULL, 2, '2024-05-14 04:12:21', '2024-05-17 04:45:08'),
(36, 'FAQs', 'सामान्य प्रश्न', 33, 'faq', 0, 'footer', 3, 1, NULL, 1, '2024-05-14 04:13:35', '2024-06-05 06:07:48'),
(37, 'Citizen Charter', 'नागरिक घोषणा पत्र', 33, 'citizen-charter', 0, 'footer', 4, 1, NULL, 1, '2024-05-14 04:14:37', '2024-06-05 05:56:53'),
(38, 'Contact Us', 'हमें संपर्क करें', 33, 'contact-us', 0, 'footer', 5, 1, NULL, 2, '2024-05-14 04:15:50', '2024-06-01 05:28:52'),
(39, 'footer 3', 'कॉलम 3', NULL, NULL, 0, 'footer', 3, 1, NULL, 1, '2024-05-14 04:16:43', '2024-05-14 05:21:58'),
(40, 'ESO Court', 'ईएसओ कोर्ट', 39, 'eso-court', 0, 'footer', 3, 1, NULL, 1, '2024-05-14 04:18:01', '2024-05-14 04:18:01'),
(41, 'Re-entered', 'पुनः प्रवेश', 39, 'http://192.168.0.62:30/storage/pdf/Re-entered_properties.pdf', 1, 'footer', 1, 1, NULL, 2, '2024-05-14 04:19:05', '2024-05-17 04:18:05'),
(42, 'footer 4', 'footer 4', NULL, NULL, 0, 'footer', 4, 1, NULL, 1, '2024-05-14 04:24:05', '2024-05-14 05:08:53'),
(43, 'Privacy Policy', 'गोपनीयता नीति', 42, 'http://192.168.0.62:30/storage/pdf/Privacy_Policy.pdf', 1, 'footer', 1, 1, NULL, 2, '2024-05-14 04:25:18', '2024-05-31 06:36:58'),
(44, 'Terms and Conditions', 'नियम और शर्तें', 42, 'http://192.168.0.62:30/storage/pdf/Terms_and_Conditions.pdf', 1, 'footer', 2, 1, NULL, 2, '2024-05-14 04:26:17', '2024-05-31 06:36:47'),
(45, 'Disclaimer', 'अस्वीकरण', 42, 'http://192.168.0.62:30/storage/pdf/Disclaimer.pdf', 1, 'footer', 3, 1, NULL, 2, '2024-05-14 04:27:03', '2024-05-31 06:51:03'),
(48, 'Copyright Policy', 'कॉपीराइट नीति', 42, 'http://192.168.0.62:30/storage/pdf/Copyright_Policy.pdf', 1, 'footer', 6, 1, NULL, 2, '2024-05-14 04:29:58', '2024-05-31 06:57:06'),
(49, 'Site Map', 'साइट मानचित्र', 42, 'site-map', 0, 'footer', 7, 0, NULL, 1, '2024-05-14 04:31:35', '2024-06-04 06:23:44'),
(50, 'Hyperlinking Policy', 'हाइपरलिंकिंग नीति', 42, 'http://192.168.0.62:30/storage/pdf/Hyperlinking_policy.pdf', 1, 'footer', 8, 1, NULL, 2, '2024-05-14 04:32:35', '2024-05-31 06:59:34'),
(52, 'Admin', 'व्यवस्थापक', 42, 'http://192.168.0.62:30/', 1, 'footer', 6, 1, NULL, 2, '2024-06-05 23:08:34', '2024-06-06 04:46:03');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2014_10_12_000000_create_users_table', 1),
(2, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(3, '2019_08_19_000000_create_failed_jobs_table', 1),
(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(5, '2024_04_15_065559_create_menu_table', 1),
(6, '2024_04_15_065710_create_page_table', 1),
(7, '2024_04_15_065757_create_page_section_table', 1),
(8, '2024_04_15_072915_create_label_table', 1),
(9, '2024_04_16_071212_create_permission_tables', 1),
(11, '2024_04_26_082519_create_news_table', 2),
(12, '2024_05_01_123916_create_office_docs_table', 3),
(13, '2024_05_05_164840_add_status_to_users_table', 4),
(14, '2024_05_21_050123_add_display_till_to_news_table', 5),
(15, '2024_05_21_052741_add_is_active_to_menus_table', 5),
(16, '2024_05_21_055628_add_is_active_to_components_table', 5),
(17, '2025_01_20_123625_create_user_ips_table', 6);

-- --------------------------------------------------------

--
-- Table structure for table `model_has_permissions`
--

CREATE TABLE `model_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `model_has_roles`
--

CREATE TABLE `model_has_roles` (
  `role_id` bigint(20) UNSIGNED NOT NULL,
  `model_type` varchar(255) NOT NULL,
  `model_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `news`
--

CREATE TABLE `news` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title_eng` varchar(255) NOT NULL,
  `title_hin` varchar(255) NOT NULL,
  `description_eng` varchar(255) NOT NULL,
  `description_hin` varchar(255) NOT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `display_till` date DEFAULT NULL,
  `sort_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `news`
--

INSERT INTO `news` (`id`, `title_eng`, `title_hin`, `description_eng`, `description_hin`, `document_path`, `is_active`, `display_till`, `sort_order`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(15, 'Discontinuation of all forms of Direct Payments through AXIS BANK, Nirman Bhawan', 'एक्सिस बैंक, निर्माण भवन के माध्यम से सभी प्रकार के प्रत्यक्ष भुगतान को बंद करना', 'Discontinuation of all forms of Direct Payments through AXIS BANK, Nirman Bhawan', 'एक्सिस बैंक, निर्माण भवन के माध्यम से सभी प्रकार के प्रत्यक्ष भुगतान को बंद करना', 'Discontinuation_of_all_forms_of_Direct_Payments_through_AXIS_BANK,_Nirman_Bhawan.pdf', 1, NULL, 1, '2024-05-17 05:11:33', '2', '2024-05-17 05:11:33', '2'),
(16, 'Order dt 19-3-2024 reg Public meetings in LDO English version', 'एलडीओ अंग्रेजी संस्करण में सार्वजनिक बैठकों के संबंध में आदेश दिनांक 19-3-2024', 'Order dt 19-3-2024 reg Public meetings in LDO English version', 'एलडीओ अंग्रेजी संस्करण में सार्वजनिक बैठकों के संबंध में आदेश दिनांक 19-3-2024', 'Order_dt_19-3-2024_reg_Public_meetings_in_LDO_English_version.pdf', 1, NULL, 2, '2024-05-17 05:13:11', '2', '2024-05-17 05:13:11', '2'),
(17, 'Notice for Engagement of Consultants on Contract Basis in Land and Development Office', 'भूमि एवं विकास कार्यालय में अनुबंध के आधार पर सलाहकारों की नियुक्ति हेतु सूचना', 'Notice for Engagement of Consultants on Contract Basis in Land and Development Office', 'भूमि एवं विकास कार्यालय में अनुबंध के आधार पर सलाहकारों की नियुक्ति हेतु सूचना', 'Notice_for_Engagement_of_Consultants_on_Contract_Basis_in_Land_and_Development_Office.pdf', 1, NULL, 3, '2024-05-17 05:14:54', '2', '2024-05-17 05:14:54', '2'),
(18, 'Public Notice reg. Public Hearing in Land and Development Office', 'सार्वजनिक सूचना के संबंध में। भूमि एवं विकास कार्यालय में जनसुनवाई', 'Public Notice reg. Public Hearing in Land and Development Office', 'सार्वजनिक सूचना के संबंध में। भूमि एवं विकास कार्यालय में जनसुनवाई', 'Public_Notice_reg._Public_Hearing_in_Land_and_Development_Office.pdf', 1, NULL, 4, '2024-05-17 05:16:38', '2', '2024-05-17 05:16:38', '2'),
(19, 'Public Notice in News Paper - instructions', 'समाचार पत्र में सार्वजनिक सूचना - निर्देश', 'Public Notice in News Paper - instructions', 'समाचार पत्र में सार्वजनिक सूचना - निर्देश', 'Addendum_SOPNewPaper.pdf', 1, NULL, 5, '2024-05-17 05:17:45', '2', '2024-05-17 05:17:45', '2'),
(20, 'Contact for Public Grievances', 'लोक शिकायतों के लिए संपर्क करें', 'Contact for Public Grievances', 'लोक शिकायतों के लिए संपर्क करें', 'PGadvertisement.pdf', 1, NULL, 6, '2024-05-17 05:19:34', '2', '2024-05-17 05:19:34', '2'),
(21, 'OM on SOPs for Substitution and Mutation, dated 3rdAug2023', 'प्रतिस्थापन और उत्परिवर्तन के लिए एसओपी पर ओएम, दिनांक 3 अगस्त 2023', 'OM on SOPs for Substitution and Mutation, dated 3rdAug2023', 'प्रतिस्थापन और उत्परिवर्तन के लिए एसओपी पर ओएम, दिनांक 3 अगस्त 2023', 'SOP_sub_mutationAug23.pdf', 1, NULL, 7, '2024-05-17 05:24:41', '2', '2024-05-17 05:24:41', '2'),
(22, 'Re-Entered Properties of LDO dated 18-05-2023', 'दिनांक 18-05-2023 को एलडीओ की संपत्तियों को पुनः दर्ज किया गया', 'Re-Entered Properties of LDO dated 18-05-2023', 'दिनांक 18-05-2023 को एलडीओ की संपत्तियों को पुनः दर्ज किया गया', 'Re-entered_properties(1).pdf', 1, NULL, 8, '2024-05-17 05:26:36', '2', '2024-05-17 05:26:36', '2'),
(23, 'Apply/Process for NOC', 'एनओसी के लिए आवेदन/प्रक्रिया करें', 'Process for Registering and applying for NOC in LDO portal', 'एलडीओ पोर्टल में एनओसी के लिए पंजीकरण और आवेदन करने की प्रक्रिया', 'NOCprocess.pdf', 1, NULL, 9, '2024-05-17 05:27:49', '2', '2024-05-17 05:28:05', '2'),
(24, 'Public Notice regarding Substitution and Mutation Applications Received', 'प्रतिस्थापन एवं नामांतरण आवेदनों के संबंध में सार्वजनिक सूचना प्राप्त हुई', 'Substitution and Mutation Applications', 'प्रतिस्थापन और उत्परिवर्तन अनुप्रयोग', 'PublicNoticeSub-Mut10Aug2023(1).pdf', 1, NULL, 10, '2024-05-17 05:29:39', '2', '2024-05-17 05:29:39', '2');

-- --------------------------------------------------------

--
-- Table structure for table `office_docs`
--

CREATE TABLE `office_docs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` int(11) NOT NULL,
  `title_eng` varchar(255) NOT NULL,
  `title_hin` varchar(255) NOT NULL,
  `description_eng` varchar(255) DEFAULT NULL,
  `description_hin` varchar(255) DEFAULT NULL,
  `attachment_eng` varchar(255) DEFAULT NULL,
  `attachment_hin` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(255) NOT NULL,
  `display_till` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `office_docs`
--

INSERT INTO `office_docs` (`id`, `category_id`, `title_eng`, `title_hin`, `description_eng`, `description_hin`, `attachment_eng`, `attachment_hin`, `is_active`, `sort_order`, `created_at`, `created_by`, `updated_at`, `updated_by`, `display_till`) VALUES
(4, 1, 'The Indian Contract Act, 1872', 'भारतीय संविदा अधिनियम, 1872', NULL, NULL, 'The_Indian_Contract_Act,_1872_.pdf', 'The_Indian_Contract_Act,_1872_.pdf', 1, 1, '2024-05-13 20:30:45', '2', '2024-06-01 05:27:48', '2', NULL),
(5, 1, 'The Punjab Municipal Act 1911', 'पंजाब नगरपालिका अधिनियम 1911', NULL, NULL, 'The_Punjab_Municipal_Act_1911.pdf', 'The_Punjab_Municipal_Act_1911.pdf', 1, 2, '2024-05-13 20:31:33', '2', '2024-05-19 23:42:44', '2', NULL),
(6, 1, 'The Registration Act 1908', 'पंजीकरण अधिनियम 1908', NULL, NULL, 'The_Registration_Act_1908.pdf', 'The_Registration_Act_1908.pdf', 1, 3, '2024-05-13 20:32:06', '2', '2024-05-19 23:43:03', '2', NULL),
(7, 1, 'The Right To Fair Compensation And Transparency In Land Acquisition, Rehabilitation And Resettlement Act, 2013', 'भूमि अधिग्रहण, पुनर्वास और पुनर्स्थापन में उचित मुआवजा और पारदर्शिता का अधिकार अधिनियम, 2013', NULL, NULL, 'THE_RIGHT_TO_FAIR_COMPENSATION_AND_TRANSPARENCY_IN_LAND_ACQUISITION,_REHABILITATION_AND_RESETTLEMENT_ACT,_2013.pdf', 'THE_RIGHT_TO_FAIR_COMPENSATION_AND_TRANSPARENCY_IN_LAND_ACQUISITION,_REHABILITATION_AND_RESETTLEMENT_ACT,_2013.pdf', 1, 4, '2024-05-13 20:32:41', '2', '2024-05-20 04:30:00', '2', NULL),
(8, 1, 'The Transfer Of Property Act 1882', 'संपत्ति अंतरण अधिनियम, 1882', NULL, NULL, 'The_Transfer_Of_Property_Act_1882.pdf', 'The_Transfer_Of_Property_Act_1882.pdf', 1, 5, '2024-05-13 20:33:13', '2', '2024-06-05 06:04:20', '1', NULL),
(9, 7, 'SOP for rationalization of substitution/mutation cases in Land and Development Office - 03 Aug 2023', 'भूमि एवं विकास कार्यालय में प्रतिस्थापन/उत्परिवर्तन मामलों के युक्तिकरण के लिए एसओपी - 03 अगस्त 2023', NULL, NULL, 'SOP_Substituion_Mutation_Aug23.pdf', 'SOP_Substituion_Mutation_Aug23.pdf', 1, 5, '2024-05-13 22:05:40', '2', '2024-05-19 23:44:28', '2', NULL),
(10, 7, 'E-Forms for Land Conversion Applications', 'भूमि रूपांतरण आवेदनों के लिए ई-फॉर्म', NULL, NULL, 'Conversion_Eforms_for_Public.pdf', 'Conversion_Eforms_for_Public.pdf', 1, 2, '2024-05-13 22:59:16', '2', '2024-05-19 23:46:08', '2', NULL),
(11, 7, 'E-Forms for Land Substitution Applications', 'भूमि प्रतिस्थापन आवेदनों के लिए ई-फॉर्म', NULL, NULL, 'Substitution_Eforms_for_Public.pdf', 'Substitution_Eforms_for_Public.pdf', 1, 3, '2024-05-13 23:00:08', '2', '2024-05-19 23:46:43', '2', NULL),
(12, 7, 'E-Forms for Land Mutation Applications', 'भूमि दाखिल खारिज आवेदनों के लिए ई-फॉर्म', NULL, NULL, 'Mutation_Eforms_for_Public.pdf', 'Mutation_Eforms_for_Public.pdf', 1, 4, '2024-05-13 23:02:16', '2', '2024-06-03 03:30:03', '1', NULL),
(13, 3, 'Addendum to SOP regarding rationalisation of Substitution / Mutation Cases - News Paper Instructions -14-Nov-2023', 'प्रतिस्थापन/दाखिल खारिज मामलों के युक्तिकरण के संबंध में एसओपी में परिशिष्ट - समाचार पत्र अनुदेश -14-नवंबर-2023', NULL, NULL, 'Addendum_to_SOP_regarding_rationalisation_of_Substitution_or_Mutation_Cases_-_News_Paper_Instructions_-14-Nov-2023.pdf', 'Addendum_to_SOP_regarding_rationalisation_of_Substitution_or_Mutation_Cases_-_News_Paper_Instructions_-14-Nov-2023.pdf', 1, 1, '2024-05-13 23:14:50', '2', '2024-06-11 01:05:04', '2', NULL),
(14, 3, 'Office Memorandam on Allowing only Lessee/Owner of Leasehold/Freehold Properties as Visitors to L&DO. dated:15-Nov-2023', 'केवल पट्टेदार/लीजहोल्ड/फ्रीहोल्ड संपत्तियों के मालिक को एल एंड डीओ के आगंतुकों के रूप में अनुमति देने पर कार्यालय ज्ञापन। दिनांक:15-नवंबर-2023', NULL, NULL, 'Office_Memorandam_on_Allowing_only_Lessee_or_Owner_of_Leasehold_or_Freehold_Properties_as_Visitors_to_L&DO._dated_15-Nov-2023.pdf', 'Office_Memorandam_on_Allowing_only_Lessee_or_Owner_of_Leasehold_or_Freehold_Properties_as_Visitors_to_L&DO._dated_15-Nov-2023.pdf', 1, 2, '2024-05-13 23:18:03', '2', '2024-06-11 01:05:34', '2', NULL),
(15, 7, 'Office Manual', 'कार्यालय मैनुअल', NULL, NULL, 'Office_Manual.pdf', 'Office_Manual.pdf', 1, 1, '2024-05-13 23:22:33', '2', '2024-05-20 02:11:29', '2', NULL),
(16, 7, 'Application form for India Habitat Centre', 'इंडिया हैबिटेट सेंटर के लिए आवेदन पत्र', '.', '.', 'Tenure_Membership_India_Habitat.pdf', 'Tenure_Membership_India_Habitat.pdf', 1, 6, '2024-05-17 04:38:43', '2', '2024-05-17 04:38:43', '2', NULL),
(18, 4, 'Circular for change of Land Use', 'भूमि उपयोग परिवर्तन हेतु परिपत्र', NULL, NULL, 'Change_of_Land_Use.pdf', 'Change_of_Land_Use.pdf', 1, 2, '2024-05-20 02:46:16', '2', '2024-05-20 04:04:51', '2', NULL),
(19, 4, 'Circular for construction', 'निर्माण हेतु परिपत्र', NULL, NULL, 'Construction.pdf', 'Construction.pdf', 1, 3, '2024-05-20 02:49:25', '2', '2024-05-20 04:05:44', '2', NULL),
(20, 4, 'Circular for breaches', 'उल्लंघनों के लिए परिपत्र', NULL, NULL, 'Breaches.pdf', 'Breaches.pdf', 1, 1, '2024-05-20 03:56:35', '2', '2024-05-20 04:06:27', '2', NULL),
(21, 4, 'Circular for conversion from leasehold to freehold', 'लीजहोल्ड से फ्रीहोल्ड में परिवर्तन हेतु परिपत्र', NULL, NULL, 'Conversion_from_leasehold_to_freehold.pdf', 'Conversion_from_leasehold_to_freehold.pdf', 1, 4, '2024-05-20 03:58:45', '2', '2024-05-20 04:07:01', '2', NULL),
(22, 4, 'Circular for encroachment', 'अतिक्रमण हेतु परिपत्र', NULL, NULL, 'Encroachment.pdf', 'Encroachment.pdf', 1, 5, '2024-05-20 04:10:05', '2', '2024-05-20 04:27:50', '2', NULL),
(23, 4, 'Circular for foreign mission', 'विदेशी मिशन के लिए परिपत्र', NULL, NULL, 'Foreign_Mission.pdf', 'Foreign_Mission.pdf', 1, 6, '2024-05-20 04:11:40', '2', '2024-05-20 04:11:40', '2', NULL),
(24, 4, 'Circular for inspection', 'निरीक्षण हेतु परिपत्र', NULL, NULL, 'Inspection.pdf', 'Inspection.pdf', 1, 7, '2024-05-20 04:13:23', '2', '2024-05-20 05:06:05', '2', NULL),
(25, 4, 'Circular for interest/penalty/belated payment', 'ब्याज/जुर्माना/विलंबित भुगतान के लिए परिपत्र', NULL, NULL, 'Interest,_Penalty,_Belated_Payments.pdf', 'Interest,_Penalty,_Belated_Payments.pdf', 1, 8, '2024-05-20 04:16:39', '2', '2024-05-20 05:06:38', '2', NULL),
(26, 4, 'Circular for misuse/damage', 'दुरुपयोग/क्षति के लिए परिपत्र', NULL, NULL, 'Misuse_or_Damage.pdf', 'Misuse_or_Damage.pdf', 1, 9, '2024-05-20 04:19:37', '2', '2024-05-20 04:19:37', '2', NULL),
(27, 4, 'Circular for Plans/SBP', 'योजनाओं/एसबीपी के लिए परिपत्र', NULL, NULL, 'Plans_or_SBP.pdf', 'Plans_or_SBP.pdf', 1, 10, '2024-05-20 05:08:02', '2', '2024-05-20 05:08:02', '2', NULL),
(28, 4, 'Circular for Re-Entry', 'पुनः प्रवेश के लिए परिपत्र', NULL, NULL, 'Re-Entry.pdf', 'Re-Entry.pdf', 1, 11, '2024-05-20 05:09:01', '2', '2024-05-20 05:09:01', '2', NULL),
(29, 6, 'Layout Plans of Properties', 'संपत्तियों की लेआउट योजनाएं', NULL, NULL, 'layout_plans_of_properties.JPG', 'layout_plans_of_properties.JPG', 1, 1, '2024-05-31 05:09:55', '2', '2024-05-31 05:09:55', '2', NULL),
(30, 6, 'PMU of L&DO', 'एल एंड डीओ पीएमयू', NULL, NULL, 'DSC_0064.JPG', 'DSC_0064.JPG', 1, 2, '2024-05-31 05:11:29', '1', '2024-05-31 05:11:29', '1', NULL),
(31, 6, 'Digitalization of Maps', 'मानचित्रों का डिजिटलीकरण', NULL, NULL, 'DSC_0087.JPG', 'DSC_0087.JPG', 1, 3, '2024-05-31 05:12:42', '1', '2024-05-31 05:12:42', '1', NULL),
(32, 6, 'Digitalization of Property Files', 'संपत्ति फ़ाइलों का डिजिटलीकरण', NULL, NULL, 'DSC_0098.JPG', 'DSC_0098.JPG', 1, 4, '2024-05-31 05:13:43', '1', '2024-06-03 00:01:24', '2', NULL),
(33, 6, 'Record Room', 'रिकॉर्ड रूम', NULL, NULL, 'DSC_0100.JPG', 'DSC_0100.JPG', 1, 5, '2024-05-31 05:16:39', '1', '2024-05-31 05:16:39', '1', NULL),
(34, 6, 'Proof Reading Session in CDV Cell', 'सीडीवी सेल में प्रूफ़ रीडिंग सत्र', NULL, NULL, 'substitution.jpg', 'substitution.jpg', 1, 6, '2024-06-02 23:57:20', '2', '2024-06-02 23:57:20', '2', NULL),
(35, 6, 'Public Dealing by Deputy L&DO', 'उप भूमि एवं विकास अधिकारी द्वारा पब्लिक डीलिंग', NULL, NULL, 'Mutation.jpg', 'Mutation.jpg', 1, 7, '2024-06-03 00:00:30', '2', '2024-06-03 00:00:30', '2', NULL),
(36, 4, 'Circle Rates', 'सर्किल दरें', NULL, NULL, 'Circle_Rates.pdf', 'Circle_Rates.pdf', 1, 12, '2024-06-05 05:23:21', '2', '2024-06-05 05:23:21', '2', NULL),
(37, 4, 'Schedule of Market Rates In Delhi- 1.4.1987 to 31.3.2000', 'दिल्ली में बाजार दरों की अनुसूची- 1.4.1987 से 31.3.2000', NULL, NULL, 'Schedule_of_Market_Rates_In_Delhi-_1.4.1987_to_31.3.2000.pdf', 'Schedule_of_Market_Rates_In_Delhi-_1.4.1987_to_31.3.2000.pdf', 1, 13, '2024-06-05 05:25:16', '2', '2024-06-05 05:25:16', '2', NULL),
(38, 4, 'Schedule of Market Rates of Land In Delhi - 1.4.1979 to 31.3.1987', 'दिल्ली में भूमि की बाजार दरों की अनुसूची - 1.4.1979 से 31.3.1987', NULL, NULL, 'Schedule_of_Market_Rates_of_Land_In_Delhi_-_1.4.1979_to_31.3.1987.pdf', 'Schedule_of_Market_Rates_of_Land_In_Delhi_-_1.4.1979_to_31.3.1987.pdf', 1, 14, '2024-06-05 05:26:02', '2', '2024-06-05 05:26:02', '2', NULL),
(39, 4, 'Schedule of Market Rates of Land in Delhi- 28.3.1966 to 31.3.1979', 'दिल्ली में भूमि की बाजार दरों की अनुसूची- 28.3.1966 से 31.3.1979', NULL, NULL, 'Schedule_of_Market_Rates_of_Land_in_Delhi-_28.3.1966_to_31.3.1979.pdf', 'Schedule_of_Market_Rates_of_Land_in_Delhi-_28.3.1966_to_31.3.1979.pdf', 1, 15, '2024-06-05 05:26:59', '2', '2024-06-05 05:26:59', '2', NULL),
(40, 4, 'Schedule of Zonal Variants Institutional Rates', 'क्षेत्रीय वेरिएंट संस्थागत दरों की अनुसूची', NULL, NULL, 'Schedule_of_Zonal_Variants_Institutional_Rates.pdf', 'Schedule_of_Zonal_Variants_Institutional_Rates.pdf', 1, 16, '2024-06-05 05:27:55', '2', '2024-06-05 05:27:55', '2', NULL),
(41, 4, 'Notification of Schedule of Residential Land Rates dated 02-05-2017', 'आवासीय भूमि दरों की अनुसूची की अधिसूचना दिनांक 02-05-2017', NULL, NULL, 'Notification_of_Schedule_of_Residential_Land_Rates_dated_02-05-2017.pdf', 'Notification_of_Schedule_of_Residential_Land_Rates_dated_02-05-2017.pdf', 1, 17, '2024-06-05 05:29:06', '2', '2024-06-05 05:29:06', '2', NULL),
(42, 4, 'Notification of Schedule of Commercial Land Rates dated 02-05-2017', 'वाणिज्यिक भूमि दरों की अनुसूची की अधिसूचना दिनांक 02-05-2017', NULL, NULL, 'Notification_of_Schedule_of_Commercial_Land_Rates_dated_02-05-2017.pdf', 'Notification_of_Schedule_of_Commercial_Land_Rates_dated_02-05-2017.pdf', 1, 18, '2024-06-05 05:29:54', '2', '2024-06-05 05:29:54', '2', NULL),
(43, 4, 'Institutional Land Rates', 'संस्थागत भूमि दरें', NULL, NULL, 'Institutional_Land_Rates.pdf', 'Institutional_Land_Rates.pdf', 1, 19, '2024-06-05 05:31:08', '2', '2024-06-05 05:31:08', '2', NULL),
(44, 4, '\'A\' Type Conversion fee', '\'ए\' प्रकार का रूपांतरण शुल्क', NULL, NULL, 'A_Type_Conversion_fee_English.pdf', 'A_Type_Conversion_fee_hindi.pdf', 1, 20, '2024-06-05 05:32:20', '2', '2024-06-05 05:32:20', '2', NULL),
(45, 4, 'List of Files forwarded to The National Archives by the Ministry of UD', 'शहरी विकास मंत्रालय द्वारा राष्ट्रीय अभिलेखागार को भेजी गई फाइलों की सूची', NULL, NULL, 'शहरी_विकास_मंत्रालय_द्वारा_राष्ट्रीय_अभिलेखागार_को_भेजी_गई_फाइलों_की_सूची.pdf', 'शहरी_विकास_मंत्रालय_द्वारा_राष्ट्रीय_अभिलेखागार_को_भेजी_गई_फाइलों_की_सूची.pdf', 1, 21, '2024-06-13 05:09:15', '2', '2024-06-13 05:09:15', '2', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `page`
--

CREATE TABLE `page` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `link` varchar(255) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `page`
--

INSERT INTO `page` (`id`, `name`, `link`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'Home', '/', 0, NULL, NULL),
(2, 'Citizen Charter', '/citizen-charter', 0, NULL, NULL),
(3, 'History & Mandate', '/history-and-mandate', 0, NULL, NULL),
(4, 'Who\'s Who', '/whos-who', 0, NULL, NULL),
(5, 'Resource Library', '/resource-library', 0, NULL, NULL),
(6, 'Acts & Rules', '/acts-and-rules', 0, NULL, NULL),
(7, 'Contact us', '/contact-us', 0, NULL, NULL),
(8, 'Services', '/services', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `pages`
--

CREATE TABLE `pages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `page_section`
--

CREATE TABLE `page_section` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `page_id` int(11) NOT NULL,
  `parent_id` int(11) NOT NULL,
  `heading_eng` varchar(255) NOT NULL,
  `heading_hin` varchar(255) NOT NULL,
  `content_eng` varchar(2000) NOT NULL,
  `content_hin` varchar(2000) NOT NULL,
  `key` varchar(255) NOT NULL,
  `order` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `permissions`
--

CREATE TABLE `permissions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `permissions`
--

INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES
(1, 'create user', 'web', '2024-04-18 22:58:37', '2024-04-18 22:58:37');

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `guard_name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `role_has_permissions`
--

CREATE TABLE `role_has_permissions` (
  `permission_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name_eng` varchar(255) NOT NULL,
  `name_hin` varchar(255) NOT NULL,
  `short_name` varchar(255) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `sort_order` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_by` varchar(255) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_by` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`id`, `name_eng`, `name_hin`, `short_name`, `is_active`, `sort_order`, `created_at`, `created_by`, `updated_at`, `updated_by`) VALUES
(1, 'L&DO Office', 'एलएंडडीओ कार्यालय', 'L&DO Office', 1, 1, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(2, 'Admin Section', 'प्रशासन खंड', 'Admin', 1, 2, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(3, 'Property Section-I', 'संपत्ति खंड-I', 'PS-I', 1, 9, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(4, 'Property Section-II', 'संपत्ति खंड-II', 'PS-II', 1, 10, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(5, 'Property Section-III', 'संपत्ति खंड-III', 'PS-III', 1, 11, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(6, 'Lease - I Section', 'लीज - I खंड', 'L-I', 1, 3, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(7, 'Lease - II(A) Section', 'लीज - II(अ) खंड', 'L-II(A)', 1, 4, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(8, 'Lease - II(B) Section', 'लीज - II(ब) खंड', 'L-II(B)', 1, 5, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(9, 'Lease - IV Section', 'लीज - IV खंड', 'L-IV', 1, 7, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(10, 'Lease - V Section', 'लीज - V खंड', 'L-V', 1, 8, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(11, 'Vigilance Section', 'सतर्कता खंड', 'Vigilance', 1, 12, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(12, 'IAC Section', 'आईएसी खंड', 'IAC', 1, 13, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(13, 'RP Cell', 'आरपी सेल', 'RP Cell', 1, 14, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(14, 'Technical Section', 'तकनीकी खंड', 'Technical', 1, 15, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(15, 'Accounts Section', 'लेखा खंड', 'Accounts', 1, 16, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(16, 'Lease - III Section', 'लीज - III खंड', 'L-III', 1, 6, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2'),
(17, 'Enforcement Section', 'प्रवर्तन खंड', 'EO', 1, 17, '2024-05-28 04:37:23', '2', '2024-05-28 04:37:23', '2');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`, `status`) VALUES
(1, 'Nitin', 'nitinrag@gmail.com', NULL, '$2y$10$NSimSYqCbR6CqjZlh0wbaeiF2Ce1hlHoN0ZiLmIT.fXluw/dXv5ba', NULL, '2024-04-18 01:25:50', '2024-05-05 12:24:03', 1),
(2, 'Swati Mishra', 'swati96m@gmail.com', NULL, '$2y$10$2VbyFW57tH1brhu/cHoB3eaYZjmMMNCHTG6mIzsB5sblRU0LXrsYG', NULL, '2024-05-03 06:25:52', '2024-05-05 12:27:08', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_ips`
--

CREATE TABLE `user_ips` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_ips`
--

INSERT INTO `user_ips` (`id`, `ip_address`, `created_at`, `updated_at`) VALUES
(1, '192.168.0.65', '2025-01-21 01:57:12', '2025-01-21 01:57:12'),
(2, '192.168.0.65', '2025-01-21 01:57:55', '2025-01-21 01:57:55'),
(3, '192.168.0.62', '2025-01-21 04:18:51', '2025-01-21 04:18:51'),
(4, '192.168.0.62', '2025-01-21 04:58:30', '2025-01-21 04:58:30');
