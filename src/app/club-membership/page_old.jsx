'use client';
import PageHeader from '@/components/PageHeader';
import ActTable from '@/components/ActTable';
import { Check } from 'lucide-react';
import React, { useState } from 'react';
import StatusAlert from "@/components/StatusAlert";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import FileUploadComponent from '@/components/FileUploadComponent';
import DgcTenureDatePicker from "@/components/DgcTenureDatePicker";
import pdFIcon from '../../../public/pdf_icon.svg';
import Image from 'next/image'

const Page = () => {
  const [visibleDiv, setVisibleDiv] = useState('div1');
  const [childVisibleDiv, setChildVisibleDiv] = useState('IHC');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    designation: '',
    equivalentToDesignation: '',
    email: '',
    mobileNumber: '',
    service: '',
    allotyear: '',
    doj: '',
    doct: '',
    supperannuationDate: '',
    officeAddress: '',
    telephoneNo: '',
    payScale: '',
    indMem: '',
    curHand: '',
    dgc_tenure_start_date: '',  // Start Date
    dgc_tenure_end_date: '',    // End Date
    tenureMemIhc: '',
    nameofPrevMembers: '',
    anyOtherReleInfo: '',
    regMem: '',
    cenScheme: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [tableData, setTableData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [tableError, setTableError] = useState('');
  const [selectedClubType, setSelectedClubType] = useState('IHC'); // Default to IHC
  const [currentStatus, setCurrentStatus] = useState("New"); // Default to "New" for div2
  const [consentChecked, setConsentChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');


  //To fetch listing data for div 2, div 3, and div 4 by Swati Mishra on 01-02-2025
  const fetchMemberships = async (clubType, status, category = '') => {
    setLoadingTable(true);
    setTableError('');

    try {
      let data;
      const statusParam = Array.isArray(status) ? status.join(',') : status; // Convert array to CSV string

      if (category) {
        // POST API when category is selected
        // const response = await fetch('http://localhost:8000/api/membership/filter', {
        const response = await fetch('http://edharti.eu-north-1.elasticbeanstalk.com/api/membership/filter', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            club_type: clubType,
            status_name: statusParam,  // Now supports multiple statuses
            category: category,
          }),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error fetching filtered memberships");
        }
      } else {
        // GET API when no category is selected
        // const response = await fetch(`http://localhost:8000/api/membership/${clubType}/${status}`);
        const response = await fetch(`http://edharti.eu-north-1.elasticbeanstalk.com/api/membership/${clubType}/${status}`)
        data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Error fetching memberships");
        }
      }

      setTableData(data.memberships || []);
    } catch (error) {
      console.error("Error fetching membership data:", error);
      setTableData([]); // Ensure table is empty on error
      setTableError("No records available.");
    } finally {
      setLoadingTable(false);
    }
  };


  // Handle Club Type Change
  const handleClubTypeChange = (clubType) => {
    setSelectedClubType(clubType);
    setSelectedCategory("");
    setLoadingTable(true);
    fetchMemberships(clubType, currentStatus, "");
  };

  // Handle Category Change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchMemberships(selectedClubType, currentStatus, category);
  };

  //To toggle visibilty of all four div with forms and different listings as per status and club_type by Swati Mishra on 01-02-2025
  const toggleVisibility = (div) => {
    setVisibleDiv((prevDiv) => {
      if (prevDiv !== div) {
        setSelectedClubType('IHC');
        setSelectedCategory("");

        let newStatus = "";
        switch (div) {
          case "div2": newStatus = "New"; break;
          case "div3": newStatus = ["Inprocess", "Pending"]; break;
          case "div4": newStatus = "Approved"; break;
          default: break;
        }

        setLoadingTable(true);
        fetchMemberships('IHC', newStatus, "");
        setCurrentStatus(newStatus);
      }

      return prevDiv === div ? null : div;
    });
  };

  // Toggle child div visibility
  const childToggleVisibility = (div) => {
    setChildVisibleDiv((prevDiv) => (prevDiv === div ? null : div));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validateInput(name, value);
  };

  // Centralized validation function
  const validateInput = (name, value) => {
    let error = '';
    const rules = {
      name: /^[a-zA-Z\s]+$/,
      email: /^[a-zA-Z0-9._%+-]+@gov\.in$/,
      mobileNumber: /^[0-9]{10}$/,
    };

    if (rules[name] && !rules[name].test(value)) {
      if (name === 'name') error = 'Name can only contain letters and spaces';
      if (name === 'email') error = 'Email must be a valid @gov.in email address';
      if (name === 'mobileNumber') error = 'Mobile number must be 10 digits';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  // Prepare payload based on club type by Swati Mishra on 29-01-2025
  const preparePayload = (type) => {
    const commonPayload = {
      name: formData.name,
      category: formData.category,
      designation: formData.designation,
      designation_equivalent_to: formData.equivalentToDesignation,
      department: formData.department,
      email: formData.email,
      mobile: formData.mobileNumber,
      name_of_service: formData.service,
      year_of_allotment: formData.allotyear,
      date_of_joining_central_deputation: formData.doj,
      expected_date_of_tenure_completion: formData.doct,
      date_of_superannuation: formData.supperannuationDate,
      office_address: formData.officeAddress,
      pay_scale: formData.payScale,
      present_previous_membership_of_other_clubs: formData.nameofPrevMembers,
      other_relevant_information: formData.anyOtherReleInfo,
      consent: consentChecked,
      club_type: type,
    };

    if (type === 'IHC') {
      return {
        ...commonPayload,
        individual_membership_date_and_remark: formData.indMem,
        dgc_tenure_start_date: formData.dgc_tenure_start_date || null,
        dgc_tenure_end_date: formData.dgc_tenure_end_date || null,
      };
    }
    else if (type === 'DGC') {
      return {
        ...commonPayload,
        is_post_under_central_staffing_scheme: formData.cenScheme,
        regular_membership_date_and_remark: formData.regMem,
        dgc_tenure_start_date: formData.dgc_tenure_start_date || null,
        dgc_tenure_end_date: formData.dgc_tenure_end_date || null,
        handicap_certification: formData.curHand,
        ihc_nomination_date: formData.tenureMemIhc,
      };
    }

  };

  const handleSubmit = async (e, clubType) => {
    e.preventDefault();
    setLoading(true);

    // Reset alert messages
    setAlert({ type: '', message: '' });

    let valid = true;
    let newErrors = { ...errors };

    // Validate all fields
    Object.entries(formData).forEach(([key, value]) => {
      validateInput(key, value);
      if (errors[key]) valid = false;
    });

    // Check if consent is checked, otherwise set error
    if (!consentChecked) {
      newErrors.consent = "Please check the consent before submission.";
      valid = false;
    }

    if (!valid) {
      setErrors(newErrors);
      setAlert({
        type: 'error',
        message: 'Please correct the errors in the form.',
      });
      setLoading(false);
      return;
    }

    const payload = preparePayload(clubType);

    try {
      const response = await fetch(
        // `http://localhost:8000/api/club-memberships/club_type=${clubType}`,
        `http://edharti.eu-north-1.elasticbeanstalk.com/api/club-memberships/club_type=${clubType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error(`Error submitting ${clubType} form:`, errorData);
        setAlert({
          type: 'error',
          message: `Error submitting the ${clubType} form. ${errorData.message || 'Please try again.'}`,
        });
      } else {
        const responseData = await response.json();
        console.log(`${clubType} form submitted successfully:`, responseData);
        setAlert({
          type: 'success',
          message: `${clubType} Membership application submitted successfully!`,
        });

        // Reset form data after successful submission
        setFormData({
          name: '',
          category: '',
          designation: '',
          equivalentToDesignation: '',
          email: '',
          mobileNumber: '',
          service: '',
          allotyear: '',
          department: '',
          doj: '',
          doct: '',
          supperannuationDate: '',
          officeAddress: '',
          telephoneNo: '',
          payScale: '',
          indMem: '',
          curHand: '',
          tenureMemDgc: '',
          tenureMemIhc: '',
          dgc_tenure_start_date: '',
          dgc_tenure_end_date: '',
          nameofPrevMembers: '',
          anyOtherReleInfo: '',
          centralStaffingScheme: '',
          regMem: '',
          consent: '', // Reset consent field
        });

        setConsentChecked(false); // Reset checkbox after submission
      }
    } catch (error) {
      console.error(`Error submitting ${clubType} form:`, error.message);
      setAlert({
        type: 'error',
        message: `An unexpected error occurred: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };



  const handleHideAlert = () => {
    setAlert({ type: "", message: "" });
  };

  //Download PDF for Already Applied Listing by Swati Mishra on 04-02-2024
  const handleDownloadPdf = async (membershipId) => {
    try {
      // const response = await fetch(`http://localhost:8000/api/download-pdf/${membershipId}`, {
      //   method: 'GET',
      // });
      const response = await fetch(`http://edharti.eu-north-1.elasticbeanstalk.com/api/download-pdf/${membershipId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error("Failed to download PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link & trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `Membership_${membershipId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      setAlert({
        type: 'error',
        message: 'Error downloading the membership PDF. Please try again.'
      });
    }
  };


  // Columns for div2 (Already Applied - "New") - Full details
  const columnsDiv2 = [
    { Header: '#', accessor: (row, index) => index + 1 },
    // { Header: 'ID', accessor: 'id' },
    { Header: 'Officer Name', accessor: 'name' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Designation', accessor: 'designation' },
    { Header: 'Designation equivalent to', accessor: 'designation_equivalent_to' },
    { Header: 'Department', accessor: 'department' },
    {
      Header: 'Application Date', accessor: 'date_of_application',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-GB') : ''
    },
    {
      Header: 'Tenure Completion Date',
      accessor: 'expected_date_of_tenure_completion',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-GB') : ''
    },
    {
      Header: 'Superannuation Date',
      accessor: 'date_of_superannuation',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-GB') : ''
    },
    {
      Header: 'Download PDF',
      accessor: 'download_pdf',
      Cell: ({ row }) => (
        <button
          onClick={() => handleDownloadPdf(row.original.id)}
        >
          <Image src={pdFIcon} alt='PDF' />
        </button>
      )
    },
    {
      Header: 'Upload Docs',
      accessor: 'upload_docs',
      Cell: ({ row }) => (
        <FileUploadComponent
          membershipAppId={row.original.id}
          clubType={row.original.club_type}
          existingFile={row.original.file_uploaded}
          setAlert={setAlert}
        />
      )
    },
  ];


  // Columns for div3 (Waiting List Members - "Inprocess and Pending") - Limited details
  const columnsDiv3And4 = [
    { Header: '#', accessor: (row, index) => index + 1 },
    // { Header: 'id', accessor: 'id' },
    { Header: 'Membership ID', accessor: 'membership_id' },
    { Header: 'Officer Name', accessor: 'name' },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Designation', accessor: 'designation' },
    { Header: 'Designation equivalent to', accessor: 'designation_equivalent_to' },
    { Header: 'Department', accessor: 'department' },
    {
      Header: 'Application Date',
      accessor: 'date_of_application',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-GB') : ''
    },
    {
      Header: 'Tenure Completion Date',
      accessor: 'expected_date_of_tenure_completion',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-GB') : ''
    },
    {
      Header: 'Superannuation Date',
      accessor: 'date_of_superannuation',
      Cell: ({ value }) => value ? new Date(value).toLocaleDateString('en-GB') : ''
    }
  ];

  // // Columns for Div 3 (excluding Membership ID)
  // const columnsDiv3 = columnsDiv3And4.filter(col => col.accessor !== 'membership_id');

  // // Columns for Div 4 (same as columnsDiv3And4)
  // const columnsDiv4 = [...columnsDiv3And4];


  return (
    <div className="contact-us">
      <PageHeader pageTitle={'Club Membership'} />
      <div className='section-bg-1'>
        <div className='whatwedo px-4 md:px-6 pt-10 lg:px-8 xl:pt-20 xl:px-10 2xl:px-24 2xl:pt-10'>
          <div className='w-full px-4'>
            <div className='title-group2 pb-2 lg:pb-5 mb-5' data-aos="fade-up" data-aos-duration="1000">
              <h2 className='themeTitle text-2xl lg:text-4xl font-bold text-center'>Club Membership</h2>
            </div>
            <div className="block md:flex items-start gap-2 pb-40">
              <div className="w-full md:w-1/5">
                <div className="membership-btns">
                  <ul className="btns-list">
                    <li><button onClick={() => toggleVisibility('div1')} className={`club_btn block w-full rounded-md px-3.5 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mb-2 ${visibleDiv === 'div1' ? 'active_border' : ''}`}>Apply Online {visibleDiv === 'div1' ? <Check className='inline text-white' /> : ''}</button></li>
                    <li><button onClick={() => toggleVisibility('div2')} className={`club_btn block w-full rounded-md px-3.5 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mb-2 ${visibleDiv === 'div2' ? 'active_border' : ''}`}>Already Applied{visibleDiv === 'div2' ? <Check className='inline text-white' /> : ''}</button></li>
                    <li><button onClick={() => toggleVisibility('div3')} className={`club_btn block w-full rounded-md px-3.5 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mb-2 ${visibleDiv === 'div3' ? 'active_border' : ''}`}>Waiting List Members {visibleDiv === 'div3' ? <Check className='inline text-white' /> : ''}</button></li>
                    <li><button onClick={() => toggleVisibility('div4')} className={`club_btn block w-full rounded-md px-3.5 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${visibleDiv === 'div4' ? 'active_border' : ''}`}>Existing Members {visibleDiv === 'div4' ? <Check className='inline text-white' /> : ''}</button></li>
                  </ul>
                </div>
              </div>
              {visibleDiv === 'div1' && (
                <div className="membership_container w-full md:w-4/5 p-5 bg-white">
                  <div style={{ padding: '10px', }}>
                    <div className="btns-list flex items-start justify-center w-full">
                      <button onClick={() => childToggleVisibility('IHC')} className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  ${childVisibleDiv === 'IHC' ? 'child_active_border' : ''}`}>Apply For India Habitat Centre (IHC)</button>
                      <button onClick={() => childToggleVisibility('DGC')} className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2  ${childVisibleDiv === 'DGC' ? 'child_active_border' : ''}`}>Apply For Delhi Golf Club (DGC)</button>
                    </div>
                    {childVisibleDiv === 'IHC' && (
                      <div style={{ padding: '10px', }}>
                        <div className="form_box_container membership_forms mt-5">
                          <h2 class="themeTitle text-xl lg:text-2xl font-bold text-center mb-9">Apply For India Habitat Centre (IHC)</h2>
                          <div className="form_container">
                            <StatusAlert
                              type={alert.type}
                              message={alert.message}
                              onHide={handleHideAlert}
                            />
                            <form onSubmit={(e) => handleSubmit(e, 'IHC')}>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="name" className="block text-base">Name<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="name"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="category" className="block text-base">Category<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <select
                                      id="category"
                                      name="category"
                                      value={formData.category} // Bind to formData
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        } rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="Secretary/Spl. Secretary/Additional Secretary and equivalent">
                                        Secretary/Spl. Secretary/Additional Secretary and equivalent</option>
                                      <option value="Joint Secretaries / Directors and equivalent">
                                        Joint Secretaries / Directors and equivalent</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="designation" className="block text-base">Designation<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="Designation"
                                      name="designation"
                                      value={formData.designation}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="equivalentToDesignation" className="block text-base">
                                    Equivalent to Designation<span className="text-red-600">*</span></label>
                                  <div className="relative">
                                    <select
                                      id="equivalentToDesignation"
                                      name="equivalentToDesignation"
                                      value={formData.equivalentToDesignation} // Bind the value to formData
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="SEC">Secretary</option>
                                      {/* <option value="SS">Spl.Sec.</option> */}
                                      <option value="AS">AS</option>
                                      <option value="JS">JS</option>
                                      <option value="DIR">Dir.</option>
                                    </select>
                                  </div>
                                </div>

                              </div>

                              <div className="block lg:flex items-center w-full">
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="email" className="block text-base">
                                    Email<span className="text-red-600">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="email"
                                      id="email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="mobileNumber" className="block text-base">
                                    Mobile Number<span className="text-red-600">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="mobileNumber"
                                      name="mobileNumber"
                                      value={formData.mobileNumber}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={10}
                                      required
                                    />
                                    {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="service" className="block text-base">Name Of Service<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="service"
                                      name="service"
                                      value={formData.service}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="allotyear" className="block text-base">Allotment Year<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="allotyear"
                                      name="allotyear"
                                      value={formData.allotyear}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={4}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="department" className="block text-base">Department<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="department"
                                      name="department"
                                      value={formData.department}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>

                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="doj" className="block text-base">Date Of Joining On Central Deputation In Delhi</label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="doj"
                                      name="doj"
                                      value={formData.doj}
                                      onChange={handleChange}
                                      maxLength={10}
                                      className={`w-full px-3 py-2 border ${errors.doj ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}

                                    />
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="doct" className="block text-base">Expected Date Of Completion Of Tenure</label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="doct"
                                      name="doct"
                                      value={formData.doct}
                                      onChange={handleChange}
                                      maxLength={10}
                                      className={`w-full px-3 py-2 border ${errors.doct ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}

                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="supperannuationDate" className="block text-base">Date Of Superannuation<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="supperannuationDate"
                                      name="supperannuationDate"
                                      value={formData.supperannuationDate}
                                      onChange={handleChange}
                                      maxLength={10}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="officeAddress" className="block text-base">Office Address<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="officeAddress"
                                      name="officeAddress"
                                      value={formData.officeAddress}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.officeAddress ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="telephoneNo" className="block text-base">Telephone No.</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="telephoneNo"
                                      name="telephoneNo"
                                      value={formData.telephoneNo}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.telephoneNo ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={10}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="telephoneNo" className="block text-base">Pay Scale (Pay Band & Grade Pay)<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="payScale"
                                      name="payScale"
                                      value={formData.payScale}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.payScale ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="indMem" className="block text-base">Whether Applied For Individual Membership In Ihc? If So, Date/ Relevant Details Thereof</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="indMem"
                                      name="indMem"
                                      value={formData.indMem}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <DgcTenureDatePicker
                                  startDate={formData.dgc_tenure_start_date}
                                  endDate={formData.dgc_tenure_end_date}
                                  setFormData={setFormData}
                                  errors={errors}
                                  setErrors={setErrors}
                                />
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="nameofPrevMembers" className="block text-base">Name Of Present/previous Memberships Of Other Clubs</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="nameofPrevMembers"
                                      name="nameofPrevMembers"
                                      value={formData.nameofPrevMembers}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="anyOtherReleInfo" className="block text-base">Any Other Relevant Information You May Like To Furnish</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="anyOtherReleInfo"
                                      name="anyOtherReleInfo"
                                      value={formData.anyOtherReleInfo}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full px-4 mb-4 flex items-start">
                                <input
                                  type="checkbox"
                                  id="consent"
                                  checked={consentChecked}
                                  onChange={(e) => setConsentChecked(e.target.checked)}
                                  className="mr-2 mt-1"
                                />
                                <label htmlFor="consent" className="text-base">
                                  I have thoroughly reviewed the
                                  <a href="pdf/IHC_Guidelines.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mx-1">
                                    guidelines
                                  </a>
                                  and would like to apply for membership.
                                </label>
                              </div>
                              {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}




                              <div className='mx-4 mb-4 text-center'>
                                {/* <button type="submit" className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">Submit</button> */}
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">
                                  {loading ? 'Submitting...' : 'Submit'}
                                </button>
                                {/* <button
                              type="submit"
                              disabled={!consentChecked || loading}
                              className={`apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto ${!consentChecked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {loading ? 'Submitting...' : 'Submit'}
                            </button> */}

                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    )}
                    {childVisibleDiv === 'DGC' && (
                      <div style={{ padding: '10px', }}>
                        <div className="form_box_container membership_forms mt-5">
                          <h2 class="themeTitle text-xl lg:text-2xl font-bold text-center mb-9">Apply For Delhi Golf Club (DGC)</h2>
                          <div className="form_container">
                            <StatusAlert
                              type={alert.type}
                              message={alert.message}
                              onHide={handleHideAlert}
                            />
                            <form onSubmit={(e) => handleSubmit(e, 'DGC')}>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="name" className="block text-base">Name<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="name"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="category" className="block text-base">Category<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <select
                                      id="category"
                                      name="category"
                                      value={formData.category} // Bind to formData
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'
                                        } rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="Secretary/ Special Secretary and equivalent">
                                        Secretary/ Special Secretary and equivalent</option>
                                      <option value="Additional Secretary and equivalent">
                                        Additional Secretary and equivalent</option>
                                      <option value="Joint Secretary and equivalent">
                                        Joint Secretary and equivalent</option>
                                      <option value="Director and equivalent">
                                        Director and equivalent</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="designation" className="block text-base">Designation<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="Designation"
                                      name="designation"
                                      value={formData.designation}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="equivalentToDesignation" className="block text-base">
                                    Equivalent to Designation<span className="text-red-600">*</span></label>
                                  <div className="relative">
                                    <select
                                      id="equivalentToDesignation"
                                      name="equivalentToDesignation"
                                      value={formData.equivalentToDesignation} // Bind the value to formData
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="SEC">Secretary</option>
                                      {/* <option value="SS">Spl.Sec.</option> */}
                                      <option value="AS">AS</option>
                                      <option value="JS">JS</option>
                                      <option value="DIR">Dir.</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              <div className="block lg:flex items-center w-full">
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="email" className="block text-base">
                                    Email<span className="text-red-600">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="email"
                                      id="email"
                                      name="email"
                                      value={formData.email}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="mobileNumber" className="block text-base">
                                    Mobile Number<span className="text-red-600">*</span>
                                  </label>
                                  <div className="relative">
                                    <input
                                      type="text"
                                      id="mobileNumber"
                                      name="mobileNumber"
                                      value={formData.mobileNumber}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={10}
                                      required
                                    />
                                    {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="service" className="block text-base">Name Of Service<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="service"
                                      name="service"
                                      value={formData.service}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="allotyear" className="block text-base">Allotment Year<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="allotyear"
                                      name="allotyear"
                                      value={formData.allotyear}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={4}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="department" className="block text-base">Department<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="department"
                                      name="department"
                                      value={formData.department}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="doj" className="block text-base">Date Of Joining On Central Deputation In Delhi</label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="doj"
                                      name="doj"
                                      value={formData.doj}
                                      onChange={handleChange}
                                      maxLength={10}
                                      className={`w-full px-3 py-2 border ${errors.doj ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}

                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="doct" className="block text-base">Expected Date Of Completion Of Tenure</label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="doct"
                                      name="doct"
                                      value={formData.doct}
                                      onChange={handleChange}
                                      maxLength={10}
                                      className={`w-full px-3 py-2 border ${errors.doct ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="supperannuationDate" className="block text-base">Date Of Superannuation<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="supperannuationDate"
                                      name="supperannuationDate"
                                      value={formData.supperannuationDate}
                                      onChange={handleChange}
                                      maxLength={10}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="officeAddress" className="block text-base">Office Address<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="officeAddress"
                                      name="officeAddress"
                                      value={formData.officeAddress}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.officeAddress ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="telephoneNo" className="block text-base">Telephone No.</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="telephoneNo"
                                      name="telephoneNo"
                                      value={formData.telephoneNo}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.telephoneNo ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="payScale" className="block text-base">Pay Scale (Pay Band & Grade Pay)<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="payScale"
                                      name="payScale"
                                      value={formData.payScale}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.payScale ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="cenScheme" className="block text-base">
                                    Do you hold a position under the Central Staffing Scheme? If yes, provide details.</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="cenScheme"
                                      name="cenScheme"
                                      value={formData.cenScheme}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4"> */}
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="regMem" className="block text-base">Whether applied to DGC for regular membership? If so, date/relevant details thereof.</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="regMem"
                                      name="regMem"
                                      value={formData.regMem}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                                <DgcTenureDatePicker
                                  startDate={formData.dgc_tenure_start_date}
                                  endDate={formData.dgc_tenure_end_date}
                                  setFormData={setFormData}
                                  errors={errors}
                                  setErrors={setErrors}
                                />
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="curHand" className="block text-base">Current Handicap in Golf (Along with certification, if any).</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="curHand"
                                      name="curHand"
                                      value={formData.curHand}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="tenureMemIhc" className="block text-base">Whether you are tenure member of India Habitat Centre? If so, indicate the date of nomination.</label>
                                  <div className='relative'>
                                    <input
                                      type="date"
                                      id="tenureMemIhc"
                                      name="tenureMemIhc"
                                      value={formData.tenureMemIhc}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-center w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="nameofPrevMembers" className="block text-base">Name Of Present/previous Memberships Of Other Clubs</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="nameofPrevMembers"
                                      name="nameofPrevMembers"
                                      value={formData.nameofPrevMembers}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="anyOtherReleInfo" className="block text-base">Any Other Relevant Information You May Like To Furnish</label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="anyOtherReleInfo"
                                      name="anyOtherReleInfo"
                                      value={formData.anyOtherReleInfo}
                                      onChange={handleChange}
                                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="w-full px-4 mb-4 flex items-start">
                                <input
                                  type="checkbox"
                                  id="consent"
                                  checked={consentChecked}
                                  onChange={(e) => setConsentChecked(e.target.checked)}
                                  className="mr-2 mt-1"
                                />
                                <label htmlFor="consent" className="text-base">
                                  I have thoroughly reviewed the
                                  <a href="pdf/DGC_Guidelines.pdf" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline mx-1">
                                    guidelines
                                  </a>
                                  and would like to apply for membership.
                                </label>
                              </div>
                              {errors.consent && <p className="text-red-500 text-sm">{errors.consent}</p>}


                              <div className='mx-4 mb-4 text-center'>
                                {/* <button type="submit" className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">Submit</button> */}
                                <button
                                  type="submit"
                                  disabled={loading}
                                  className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">
                                  {loading ? 'Submitting...' : 'Submit'}
                                </button>
                              </div>
                            </form>
                          </div>

                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {/* {visibleDiv === 'div2' && (
                <div className="membership_container w-full md:w-4/5 p-5 bg-white">
                  <div style={{ marginTop: '10px', padding: '10px', }}>
                  <CommonTable columns={columns} data={tableData} />
                  </div>
                </div>
              )} */}
              {/* Div 2: Already Applied */}
              {visibleDiv === 'div2' && (
                <div className="membership_container w-full md:w-4/5 p-5 bg-white">
                  <div style={{ marginTop: '10px', padding: '10px' }}>

                    {/* Add Club Toggle Buttons Here */}
                    <div className="btns-list flex items-start justify-center w-full mb-4">
                      <button
                        onClick={() => handleClubTypeChange('IHC')}
                        className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                    ${selectedClubType === 'IHC' ? 'child_active_border' : ''}`}>
                        Already Applied - IHC
                      </button>
                      <button
                        onClick={() => handleClubTypeChange('DGC')}
                        className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                    ${selectedClubType === 'DGC' ? 'child_active_border' : ''}`}>
                        Already Applied - DGC
                      </button>
                    </div>


                    {/* Membership Table */}
                    {/* {loadingTable ? <p>Loading...</p> : <ActTable columns={columnsDiv2} data={tableData} customContainerClass="introduction-container"/>} */}
                    {loadingTable ? (
                      <p>Loading...</p>
                    ) : tableData.length > 0 ? (
                      <ActTable
                        columns={columnsDiv2}
                        data={tableData}
                        clubType={selectedClubType}
                        selectedCategory={selectedCategory}  // ✅ Ensure category is passed
                        onCategoryChange={handleCategoryChange}
                        customContainerClass="introduction-container"
                        showCategoryFilter={true}
                      />

                    ) : (
                      <p>No records available.</p>
                    )}

                  </div>
                </div>
              )}


              {/* Div 3: Existing Members */}
              {visibleDiv === 'div3' && (
                <div className="membership_container w-full md:w-4/5 p-5 bg-white">
                  <div style={{ marginTop: '10px', padding: '10px' }}>

                    {/* Add Club Toggle Buttons Here */}
                    <div className="btns-list flex items-start justify-center w-full mb-4">
                      <button
                        onClick={() => handleClubTypeChange('IHC')}
                        className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                    ${selectedClubType === 'IHC' ? 'child_active_border' : ''}`}>
                        Waiting List - IHC
                      </button>
                      <button
                        onClick={() => handleClubTypeChange('DGC')}
                        className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                    ${selectedClubType === 'DGC' ? 'child_active_border' : ''}`}>
                        Waiting List - DGC
                      </button>
                    </div>


                    {/* Membership Table */}
                    {/* {loadingTable ? <p>Loading...</p> : <ActTable columns={columnsDiv3And4} data={tableData} customContainerClass="introduction-container"/>} */}
                    {loadingTable ? (
                      <p>Loading...</p>
                    ) : tableData.length > 0 ? (
                      <ActTable
                        columns={columnsDiv3And4}
                        data={tableData}
                        clubType={selectedClubType}
                        selectedCategory={selectedCategory}  // ✅ Ensure category is passed
                        onCategoryChange={handleCategoryChange}
                        customContainerClass="introduction-container"
                        showCategoryFilter={true}
                      />
                    ) : (
                      <p>No records available.</p>
                    )}
                  </div>
                </div>
              )}


              {/* Div 4: Waiting List Members */}
              {visibleDiv === 'div4' && (
                <div className="membership_container w-full md:w-4/5 p-5 bg-white">
                  <div style={{ marginTop: '10px', padding: '10px' }}>

                    {/* Add Club Toggle Buttons Here */}
                    <div className="btns-list flex items-start justify-center w-full mb-4">
                      <button
                        onClick={() => handleClubTypeChange('IHC')}
                        className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                    ${selectedClubType === 'IHC' ? 'child_active_border' : ''}`}>
                        Existing Members - IHC
                      </button>
                      <button
                        onClick={() => handleClubTypeChange('DGC')}
                        className={`childClub_btn block w-full rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm 
                                    focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 
                                    ${selectedClubType === 'DGC' ? 'child_active_border' : ''}`}>
                        Existing Members - DGC
                      </button>
                    </div>


                    {/* Membership Table */}
                    {/* {loadingTable ? <p>Loading...</p> : <ActTable columns={columnsDiv3And4} data={tableData} customContainerClass="introduction-container"/>} */}
                    {loadingTable ? (
                      <p>Loading...</p>
                    ) : tableData.length > 0 ? (
                      <ActTable
                        columns={columnsDiv3And4}
                        data={tableData}
                        clubType={selectedClubType}
                        selectedCategory={selectedCategory}  // ✅ Ensure category is passed
                        onCategoryChange={handleCategoryChange}
                        customContainerClass="introduction-container"
                        showCategoryFilter={true}
                      />
                    ) : (
                      <p>No records available.</p>
                    )}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Page