'use client';
import PageHeader from '@/components/PageHeader';
import ActTable from '@/components/ActTable';
import { Check } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import StatusAlert from "@/components/StatusAlert";
// import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
// import FileUploadComponent from '@/components/FileUploadComponent';
// import DgcTenureDatePicker from "@/components/DgcTenureDatePicker";
import fetchMemberships from '@/components/FetchMembershipsComponent';//added by swati on 29052025
import MembershipSearchComponent from '@/components/MembershipSearchComponent';
// import pdFIcon from '../../../public/pdf_icon.svg';
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
    department: '',
    isCentralDeputated: '', //added new in common clubmembership on 29052025
    doj: '',
    doct: '',
    supperannuationDate: '',
    officeAddress: '',
    telephoneNo: '',
    payScale: '',
    // indMem: '', // commenting start 29052025 by swati 
    // curHand: '',
    // dgc_tenure_start_date: '',  // Start Date
    // dgc_tenure_end_date: '',    // End Date
    // tenureMemIhc: '', // commenting end 29052025 by swati 
    nameofPrevMembers: '',
    //anyOtherReleInfo: '', // commenting start 29052025 by swati 
    // regMem: '',
    // cenScheme: '',// commenting end 29052025 by swati 
  });

  const [isEditMode, setIsEditMode] = useState(false);
  const [editMembershipData, setEditMembershipData] = useState(null);
  // for edit of central deputed
  const to10 = (v) => {
    if (v === '' || v == null) return '';
    if (v === true || v === 1 || v === '1') return '1';
    if (v === false || v === 0 || v === '0') return '0';
    return ''; // fallback
  };

// Edit state
useEffect(() => {
  if (isEditMode && editMembershipData) {
    const normCentralDep = to10(editMembershipData.is_central_deputated);
    setFormData({
      name: editMembershipData.name || '',
      category: editMembershipData.category || '',
      designation: editMembershipData.designation || '',
      equivalentToDesignation: editMembershipData.designation_equivalent_to || '',
      email: editMembershipData.email || '',
      mobileNumber: editMembershipData.mobile || '',
      service: editMembershipData.name_of_service || '',
      allotyear: editMembershipData.year_of_allotment || '',
      department: editMembershipData.department || '',
      isCentralDeputated: normCentralDep,
      doj: editMembershipData.date_of_joining_central_deputation || '',
      doct: editMembershipData.expected_date_of_tenure_completion || '',
      supperannuationDate: editMembershipData.date_of_superannuation || '',
      officeAddress: editMembershipData.office_address || '',
      telephoneNo: editMembershipData.telephone_no || '',
      payScale: editMembershipData.pay_scale || '',
      nameofPrevMembers: editMembershipData.present_previous_membership_of_other_clubs || '',
    });

    setConsentChecked(editMembershipData.consent === true);
    setSelectedClubType(editMembershipData.club_type || 'IHC');
    setChildVisibleDiv(editMembershipData.club_type || 'IHC');
    setVisibleDiv('div1');
  }
}, [isEditMode, editMembershipData]);

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

//Added useEffect to reset checkbox validation once its checked by Swati Mishra on 29052025
  React.useEffect(() => {
    if (consentChecked && errors.consent) {
      setErrors((prevErrors) => {
        const { consent, ...rest } = prevErrors;
        return rest;
      });
    }
  }, [consentChecked, errors.consent]);
  
  
  //Handle Club Type Change added by swati on 29052025
  const handleClubTypeChange = async (clubType) => {
    setSelectedClubType(clubType);
    setSelectedCategory("");
    setLoadingTable(true);
  
    await fetchMemberships({
      clubType,
      status: currentStatus,
      category: "",
      setLoading: setLoadingTable,
      setData: setTableData,
      setError: setTableError,
    });
  };
  // Handle Category Change added by swati on 29052025
  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
  
    await fetchMemberships({
      clubType: selectedClubType,
      status: currentStatus,
      category,
      setLoading: setLoadingTable,
      setData: setTableData,
      setError: setTableError,
    });
  };

  // //To toggle visibilty of all four div with forms and different listings as per status and club_type by Swati Mishra on 01-02-2025, modified by swati on 29052025
  const toggleVisibility = (div) => {
    setVisibleDiv((prevDiv) => {
      if (prevDiv !== div) {
        const defaultClub = 'IHC';
        setSelectedClubType(defaultClub);
        setSelectedCategory("");
  
        let newStatus = "";
        switch (div) {
          case "div2":
            newStatus = "New";
            break;
          case "div3":
            newStatus = ["Waiting", "Club_Pending"];
            break;
          case "div4":
            newStatus = "Approved";
            break;
          default:
            break;
        }
  
        setLoadingTable(true);
        fetchMemberships({
          clubType: defaultClub,
          status: newStatus,
          category: "",
          setLoading: setLoadingTable,
          setData: setTableData,
          setError: setTableError,
        });
  
        setCurrentStatus(newStatus);
      }
      return div; //changed on 05-05-2025 by anil due to show hide div issue on same button click now one div always show
    });
  };
    

  // Toggle child div visibility
  // const childToggleVisibility = (div) => {
  //   setChildVisibleDiv((prevDiv) => (prevDiv === div ? null : div));
  // };
  //changed on 05-05-2025 by anil due to show hide div issue on same button click now one div always show
  // const childToggleVisibility = (div) => {
  //   setChildVisibleDiv((prevDiv) => {
  //     return prevDiv === div ? prevDiv : div;
  //   });
  // };

  const childToggleVisibility = (div) => {
    setChildVisibleDiv((prevDiv) => {
      if (prevDiv !== div) {
        // Reset only when switching from IHC ↔ DGC
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
          isCentralDeputated: '',
          doj: '',
          doct: '',
          supperannuationDate: '',
          officeAddress: '',
          telephoneNo: '',
          payScale: '',
          nameofPrevMembers: '',
        });
        setErrors({});
        setConsentChecked(false);
      }
  
      return div; // Always return the current div (keeps your original logic)
    });
  };
  
  
  // Handle input changes
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData({
  //     ...formData,
  //     [name]: value,
  //   });
  //   validateInput(name, value);
  // };
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    const error = validateInput(name, value, {
      ...formData,
      [name]: value, // include latest value
    });
  
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };
  

  // Centralized validation function
  const validateInput = (name, value, formData = {}) => {
    const rules = {
      name: { required: 'Name is required.', pattern: { regex: /^[a-zA-Z.\s]+$/, message: 'Name can only contain letters, dots, and spaces.' } },
      category: { required: 'Category is required.' },
      designation: { required: 'Designation is required.', pattern: { regex: /^[a-zA-Z.\s]+$/, message: 'Designation can only contain letters, dots, and spaces.' } },
      equivalentToDesignation: { required: 'Equivalent to designation is required.' },
      email: { required: 'Email is required.', pattern: { regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Email format is not valid.' } },
      mobileNumber: { required: 'Mobile number is required.', pattern: { regex: /^[0-9]{10}$/, message: 'Mobile number must be 10 digits.' } },
      service: { required: 'Name of service is required.', pattern: { regex: /^[a-zA-Z.\s]+$/, message: 'Name of service must only contain letters, dots, and spaces.' } },
      allotyear: { required: 'Allotment year is required.'},
      department: { required: 'Department is required.', pattern: { regex: /^[a-zA-Z.\s]+$/, message: 'Department must only contain letters, dots, and spaces.' } },
      isCentralDeputated: { required: 'Central Staffing detail is required.' },
      doj: { required: formData.isCentralDeputated === '1' ? 'Date of joining is required when central deputation is Yes.' : '',
      pattern: { regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, message: 'Date must be in dd-mm-yyyy format.'} },
      doct: { required: formData.isCentralDeputated === '1' ? 'Tenure completion date is required when central deputation is Yes.' : '', pattern: { regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, message: 'Date must be in dd-mm-yyyy format.' } },
      supperannuationDate: { required: 'Superannuation date is required.', pattern: { regex: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/, message: 'Date must be in dd-mm-yyyy format.' } },
      officeAddress: { required: 'Office address is required.', pattern: { regex: /^[a-zA-Z0-9\s,'#./-]{5,200}$/, message: 'Address must be 5–200 characters and can include letters, numbers, and symbols #/-,.' } },
      telephoneNo: { required: 'Telephone number is required.' },
      payScale: { required: 'Pay level is required.', pattern: { regex: /^[a-zA-Z0-9-\s]+$/, message: 'Pay level can only contain letters, digits, dots, and spaces.' } },
      nameofPrevMembers: { required: 'Name of current/previous club is required.', pattern: { regex: /^[a-zA-Z.\s]+$/, message: 'Name of current/previous club can only contain letters, dots, and spaces.' } },
    };
  
    const field = rules[name];
    if (!field) return '';
  
    if (value == null || !String(value).trim()) {
      return field.required || '';
    }
  
    if (field.pattern && !field.pattern.regex.test(value)) {
      return field.pattern.message;
    }
  
    // Cross-field date validation
    if (['doj', 'doct', 'supperannuationDate'].includes(name)) {
      const parseDate = (str) => new Date(str);
  
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const doj = formData.doj ? parseDate(formData.doj) : null;
      const doct = formData.doct ? parseDate(formData.doct) : null;
      const supDate = formData.supperannuationDate ? parseDate(formData.supperannuationDate) : null;
  
      if (name === 'doj' && doj && doct && doj >= doct) return 'Joining date must be before expected tenure completion.';
      if (name === 'doj' && doj && supDate && doj >= supDate) return 'Joining date must be before superannuation.';
      if (name === 'doct' && doct && doj && doj >= doct) return 'Tenure completion must be after joining.';
      if (name === 'doct' && doct && supDate && doct > supDate) return 'Tenure completion cannot be after superannuation.';
      if (name === 'doct' && doct && doct <= today) return 'Tenure completion must be in the future.';
      if (name === 'supperannuationDate' && supDate && doj && doj >= supDate) return 'Superannuation must be after joining.';
      if (name === 'supperannuationDate' && supDate && doct && doct > supDate) return 'Superannuation cannot be before tenure completion.';
      if (name === 'supperannuationDate' && supDate && supDate <= today) return 'Superannuation date must be in the future.';
    }
  
    return '';
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
      is_central_deputated: formData.isCentralDeputated,
      date_of_joining_central_deputation: formData.doj,
      expected_date_of_tenure_completion: formData.doct,
      date_of_superannuation: formData.supperannuationDate,
      office_address: formData.officeAddress,
      telephone_no:formData.telephoneNo,
      pay_scale: formData.payScale,
      present_previous_membership_of_other_clubs: formData.nameofPrevMembers,
      // other_relevant_information: formData.anyOtherReleInfo,
      consent: consentChecked,
      club_type: type,
    };

    if (type === 'IHC') {
      return {
        ...commonPayload, // commenting start 29052025 by swati 
        // individual_membership_date_and_remark: formData.indMem,
        // dgc_tenure_start_date: formData.dgc_tenure_start_date || null,
        // dgc_tenure_end_date: formData.dgc_tenure_end_date || null,  
      };
    }
    else if (type === 'DGC') {
      return {
        ...commonPayload,
        // is_post_under_central_staffing_scheme: formData.cenScheme, // commenting start 29052025 by swati 
        // regular_membership_date_and_remark: formData.regMem,
        // dgc_tenure_start_date: formData.dgc_tenure_start_date || null,
        // dgc_tenure_end_date: formData.dgc_tenure_end_date || null,
        // handicap_certification: formData.curHand,
        // ihc_nomination_date: formData.tenureMemIhc,
      };
    }

  };

  const handleSubmit = async (e, clubType) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });
  
    const newErrors = {};
    let valid = true;
  
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateInput(key, value, formData); // ✅ Pass full formData
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    });
    
  
    if (!consentChecked) {
      newErrors.consent = 'Please check the consent before submission.';
      valid = false;
    }
  
    // ✅ Set errors once, before early return
    setErrors(newErrors);

    if (!valid) {
      // setErrors(newErrors);
      setAlert({
        type: 'error',
        message: 'Please correct the errors in the form.',
      });

      // Focus the first invalid input
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        if (firstErrorElement) {
          firstErrorElement.focus();
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' }); // optional
        }
      }, 0);

      setLoading(false);
      return;
    }

    const payload = preparePayload(clubType);

    try {
      const response = await fetch(
        // `http://localhost:8000/api/club-memberships/club_type=${clubType}`,
        `http://192.168.0.62:8080/api/club-memberships/club_type=${clubType}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.status === 409) {
        setAlert({
          type: 'error',
          message: 'You have already applied for this club.',
        });
        setLoading(false);
        return;
      }

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
          isCentralDeputated: '', //added new in common table on 29052025 by Swati
          doj: '',
          doct: '',
          supperannuationDate: '',
          officeAddress: '',
          telephoneNo: '',
          payScale: '',
          // indMem: '', // commenting start 29052025 by swati 
          // curHand: '',
          // tenureMemDgc: '',
          // tenureMemIhc: '',
          // dgc_tenure_start_date: '',
          // dgc_tenure_end_date: '',
          nameofPrevMembers: '',
          // anyOtherReleInfo: '',// commenting start 29052025 by swati 
          centralStaffingScheme: '',
          // regMem: '',// commenting start 29052025 by swati 
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


  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ type: '', message: '' });
  
    const newErrors = {};
    let valid = true;
  
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateInput(key, value, formData);
      if (error) {
        newErrors[key] = error;
        valid = false;
      }
    });
  
    if (!consentChecked) {
      newErrors.consent = 'Please check the consent before updating.';
      valid = false;
    }
  
    setErrors(newErrors);
  
    if (!valid) {
      setAlert({
        type: 'error',
        message: 'Please correct the errors before updating.',
      });
  
      setTimeout(() => {
        const firstErrorKey = Object.keys(newErrors)[0];
        const firstErrorElement = document.querySelector(`[name="${firstErrorKey}"]`);
        if (firstErrorElement) {
          firstErrorElement.focus();
          firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 0);
  
      setLoading(false);
      return;
    }
  
    const payload = preparePayload(selectedClubType);
  
    try {
      const response = await fetch(`http://192.168.0.62:8080/api/club-memberships/update/${editMembershipData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (response.ok) {
        const updated = await response.json();
        setAlert({
          type: 'success',
          message: 'Membership updated successfully!',
        });
  
        setIsEditMode(false);
        setEditMembershipData(null);
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
          isCentralDeputated: '',
          doj: '',
          doct: '',
          supperannuationDate: '',
          officeAddress: '',
          telephoneNo: '',
          payScale: '',
          nameofPrevMembers: '',
        });
        setConsentChecked(false);
      } else {
        const error = await response.json();
        setAlert({
          type: 'error',
          message: `Update failed: ${error.message || 'Something went wrong'}`,
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: 'error',
        message: 'An unexpected error occurred while updating.',
      });
    } finally {
      setLoading(false);
    }
  };
  

  const handleHideAlert = () => {
    setAlert({ type: "", message: "" });
  };

  // Columns for div3 (Waiting List Members - "Inprocess and Pending") - Limited details
  const columnsDiv3And4 = [
    { Header: '#', accessor: (row, index) => index + 1 },
    // { Header: 'id', accessor: 'id' },
    { Header: 'Application No.', accessor: 'unique_id' },
    // { Header: 'Membership ID', accessor: 'membership_id' },
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
                    {/* <li><button onClick={() => toggleVisibility('div4')} className={`club_btn block w-full rounded-md px-3.5 py-2.5 text-base font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${visibleDiv === 'div4' ? 'active_border' : ''}`}>Existing Members {visibleDiv === 'div4' ? <Check className='inline text-white' /> : ''}</button></li> */}
                  </ul>
                </div>
              </div>
              {visibleDiv === 'div1' && (
                // change padding classes for create space in responsive by anil on 28-05-2025
                <div className="membership_container w-full md:w-4/5 px-0 md:p-5 bg-white">
                  <div style={{ padding: '10px', }}>
                    <div className="btns-list flex flex-col md:flex-row items-start justify-center w-full">
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
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="name" className="block text-base">Name<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="name"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                                      className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'
                                        } rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="Member of Parliament">
                                        Member of Parliament</option>
                                      <option value="Secretary/Spl. Secretary/Additional Secretary and equivalent">
                                        Secretary/Spl. Secretary/Additional Secretary and equivalent</option>
                                      <option value="Joint Secretaries / Directors and equivalent">
                                        Joint Secretaries / Directors and equivalent</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="designation" className="block text-base">Designation<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="Designation"
                                      name="designation"
                                      value={formData.designation}
                                      onChange={handleChange}
                                      maxLength={100}
                                      className={`w-full px-3 py-2 border ${errors.designation ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
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
                                      className={`w-full px-3 py-2 border ${errors.equivalentToDesignation ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="Member of Parliament">Member of Parliament</option>
                                      <option value="Secretary">Secretary</option>
                                      {/* <option value="SS">Spl.Sec.</option> */}
                                      <option value="Additional Secretary">Additional Secretary</option>
                                      <option value="Joint Secretary">Joint Secretary</option>
                                      <option value="Director">Director</option>
                                    </select>
                                    {errors.equivalentToDesignation && <p className="text-red-500 text-sm">{errors.equivalentToDesignation}</p>}
                                  </div>
                                </div>

                              </div>

                              <div className="block lg:flex items-start w-full">
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
                                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
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
                                      className={`w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={10}
                                      
                                    />
                                    {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="service" className="block text-base">Name Of Service<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="service"
                                      name="service"
                                      value={formData.service}
                                      onChange={handleChange}
                                      maxLength={100}
                                      className={`w-full px-3 py-2 border ${errors.service ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="allotyear" className="block text-base">Allotment Year<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                  <select
                                    id="allotyear"
                                    name="allotyear"
                                    value={formData.allotyear}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.allotyear ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                  >
                                    <option value="" disabled>Select</option>
                                    {Array.from({ length: 60 }, (_, i) => {
                                      const year = new Date().getFullYear() - i;
                                      return <option key={year} value={year}>{year}</option>;
                                    })}
                                  </select>
                                  {errors.allotyear && <p className="text-red-500 text-sm">{errors.allotyear}</p>}
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="department" className="block text-base">Department<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="department"
                                      name="department"
                                      value={formData.department}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="isCentralDeputated" className="block text-base">
                                    Do you hold a central staffing position?<span className="text-red-600">*</span>
                                  </label>
                                  <div className="relative">
                                    <select
                                      id="isCentralDeputated"
                                      name="isCentralDeputated"
                                      value={formData.isCentralDeputated}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.isCentralDeputated ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    >
                                      <option value="" disabled>Select</option>
                                      <option value="1">Yes</option>
                                      <option value="0">No</option>
                                    </select>
                                    {errors.isCentralDeputated && <p className="text-red-500 text-sm">{errors.isCentralDeputated}</p>}
                                  </div>
                                </div>

                                
                              </div>

                              {formData.isCentralDeputated === '1' && (
                              <div className='block lg:flex items-start w-full'>
                              
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
                                      className={`w-full px-3 py-2 border ${errors.doj ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}

                                    />
                                    {errors.doj && <p className="text-red-500 text-sm">{errors.doj}</p>}
                                  </div>
                                </div>
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
                                      className={`w-full px-3 py-2 border ${errors.doct ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}

                                    />
                                    {errors.doct && <p className="text-red-500 text-sm">{errors.doct}</p>}
                                  </div>
                                </div>
                              
                              </div>
                            )}
                              <div className='block lg:flex items-start w-full'>
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
                                      className={`w-full px-3 py-2 border ${errors.supperannuationDate ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.supperannuationDate && <p className="text-red-500 text-sm">{errors.supperannuationDate}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="officeAddress" className="block text-base">Office Address<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="officeAddress"
                                      name="officeAddress"
                                      value={formData.officeAddress}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.officeAddress ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.officeAddress && <p className="text-red-500 text-sm">{errors.officeAddress}</p>}
                                  </div>
                                </div>
                                
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="telephoneNo" className="block text-base">Telephone No. (Format: 01124XXX89)
                                  <span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="telephoneNo"
                                      name="telephoneNo"
                                      value={formData.telephoneNo}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.telephoneNo ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={13}
                                    />
                                    {errors.telephoneNo && <p className="text-red-500 text-sm">{errors.telephoneNo}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="payScale" className="block text-base">Pay Level<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <select
                                      id="payScale"
                                      name="payScale"
                                      value={formData.payScale}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.payScale ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    >
                                      <option value="" disabled>Select</option>
                                      <option value="13">13</option>
                                      <option value="13A">13A</option>
                                      <option value="14">14</option>
                                      <option value="15">15</option>
                                      <option value="16">16</option>
                                      <option value="17">17</option>
                                      <option value="18">18</option>
                                    </select>
                                    {errors.payScale && <p className="text-red-500 text-sm">{errors.payScale}</p>}
                                  </div>
                                </div>
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
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
                                </div> */}
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                {/* <DgcTenureDatePicker
                                  startDate={formData.dgc_tenure_start_date}
                                  endDate={formData.dgc_tenure_end_date}
                                  setFormData={setFormData}
                                  errors={errors}
                                  setErrors={setErrors}
                                /> */}
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="nameofPrevMembers" className="block text-base">Name of Current/Previous Club Memberships<span className="text-red-600">*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="nameofPrevMembers"
                                      name="nameofPrevMembers"
                                      value={formData.nameofPrevMembers}
                                      onChange={handleChange}
                                      maxLength={200}
                                      // className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
                                      className={`w-full px-3 py-2 border ${errors.nameofPrevMembers ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    />
                                    {errors.nameofPrevMembers && <p className="text-red-500 text-sm">{errors.nameofPrevMembers}</p>}
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
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
                                </div> */}
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
                              
                            {/* <button type="submit" className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">Submit</button> */}
                            {/* <button
                              type="submit"
                              disabled={loading}
                              className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">
                              {loading ? 'Submitting...' : 'Submit'}
                            </button> */}
                              
                              <div className='mx-4 mb-4 text-center'>
                                {isEditMode ? (
                                  <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="bg-green-600 text-white text-sm md:text-lg px-5 py-2 w-2/5 mx-auto rounded hover:bg-green-700"
                                  >
                                    {loading ? 'Updating...' : 'Update'}
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    disabled={loading}
                                    className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto"
                                  >
                                    {loading ? 'Submitting...' : 'Submit'}
                                  </button>
                                )}
                              </div>

                              <div className='mx-4 mb-4'>
                                <p className="text-sm text-orange-600 mt-2">
                                  Note: Please upload attested application in order to complete the submission.
                                </p>
                              </div>

                              <div className="mx-4 mb-4 text-left">
                                <a
                                  href="/pdf/club_membership_template.pdf"
                                  download
                                  className="text-sm text-blue-400 underline hover:text-blue-800"
                                >
                                  Download Club Membership Template
                                </a>
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
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="name" className="block text-base">Name<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="name"
                                      name="name"
                                      value={formData.name}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
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
                                      className={`w-full px-3 py-2 border ${errors.category ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'
                                        } rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="Member of Parliament">
                                        Member of Parliament</option>
                                      <option value="Secretary/ Special Secretary and equivalent">
                                        Secretary/ Special Secretary and equivalent</option>
                                      <option value="Additional Secretary and equivalent">
                                        Additional Secretary and equivalent</option>
                                      <option value="Joint Secretary and equivalent">
                                        Joint Secretary and equivalent</option>
                                      <option value="Director and equivalent">
                                        Director and equivalent</option>
                                    </select>
                                    {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="designation" className="block text-base">Designation<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="Designation"
                                      name="designation"
                                      value={formData.designation}
                                      onChange={handleChange}
                                      maxLength={100}
                                      className={`w-full px-3 py-2 border ${errors.designation ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.designation && <p className="text-red-500 text-sm">{errors.designation}</p>}
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
                                      className={`w-full px-3 py-2 border ${errors.equivalentToDesignation ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    >
                                      <option value="" disabled>
                                        Select
                                      </option>
                                      <option value="Member of Parliament">Member of Parliament</option>
                                      <option value="Secretary">Secretary</option>
                                      {/* <option value="SS">Spl.Sec.</option> */}
                                      <option value="Additional Secretary">Additional Secretary</option>
                                      <option value="Joint Secretary">Joint Secretary</option>
                                      <option value="Director">Director</option>
                                    </select>
                                    {errors.equivalentToDesignation && <p className="text-red-500 text-sm">{errors.equivalentToDesignation}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className="block lg:flex items-start w-full">
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
                                      className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
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
                                      className={`w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={10}
                                      
                                    />
                                    {errors.mobileNumber && <p className="text-red-500 text-sm">{errors.mobileNumber}</p>}
                                  </div>
                                </div>
                              </div>

                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="service" className="block text-base">Name Of Service<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="service"
                                      name="service"
                                      value={formData.service}
                                      onChange={handleChange}
                                      maxLength={100}
                                      className={`w-full px-3 py-2 border ${errors.service ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.service && <p className="text-red-500 text-sm">{errors.service}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="allotyear" className="block text-base">Allotment Year<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                  <select
                                    id="allotyear"
                                    name="allotyear"
                                    value={formData.allotyear}
                                    onChange={handleChange}
                                    className={`w-full px-3 py-2 border ${errors.allotyear ? 'border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                  >
                                    <option value="" disabled>Select</option>
                                    {Array.from({ length: 60 }, (_, i) => {
                                      const year = new Date().getFullYear() - i;
                                      return <option key={year} value={year}>{year}</option>;
                                    })}
                                  </select>
                                  {errors.allotyear && <p className="text-red-500 text-sm">{errors.allotyear}</p>}
                                  </div>
                                </div>
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="department" className="block text-base">Department<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="department"
                                      name="department"
                                      value={formData.department}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.department ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.department && <p className="text-red-500 text-sm">{errors.department}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="isCentralDeputated" className="block text-base">
                                    Do you hold a central staffing position?<span className="text-red-600">*</span>
                                  </label>
                                  <div className="relative">
                                    <select
                                      id="isCentralDeputated"
                                      name="isCentralDeputated"
                                      value={formData.isCentralDeputated}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.isCentralDeputated ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    >
                                      <option value="" disabled>Select</option>
                                      <option value="1">Yes</option>
                                      <option value="0">No</option>
                                    </select>
                                    {errors.isCentralDeputated && <p className="text-red-500 text-sm">{errors.isCentralDeputated}</p>}
                                  </div>
                                </div>
                              </div>
                              {formData.isCentralDeputated === '1' && (
                                <div className='block lg:flex items-start w-full'>
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
                                        className={`w-full px-3 py-2 border ${errors.doj ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}

                                      />
                                      {errors.doj && <p className="text-red-500 text-sm">{errors.doj}</p>}
                                    </div>
                                  </div>
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
                                        className={`w-full px-3 py-2 border ${errors.doct ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      />
                                      {errors.doct && <p className="text-red-500 text-sm">{errors.doct}</p>}
                                    </div>
                                  </div>
                                  
                                </div>
                              )}
                              <div className='block lg:flex items-start w-full'>
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
                                      className={`w-full px-3 py-2 border ${errors.supperannuationDate ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.supperannuationDate && <p className="text-red-500 text-sm">{errors.supperannuationDate}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="officeAddress" className="block text-base">Office Address<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="officeAddress"
                                      name="officeAddress"
                                      value={formData.officeAddress}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.officeAddress ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      
                                    />
                                    {errors.officeAddress && <p className="text-red-500 text-sm">{errors.officeAddress}</p>}
                                  </div>
                                </div>
                                
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="telephoneNo" className="block text-base">Telephone No. (Format: 01124XXX89)<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="telephoneNo"
                                      name="telephoneNo"
                                      value={formData.telephoneNo}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.telephoneNo ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                      maxLength={13}
                                    />
                                    {errors.telephoneNo && <p className="text-red-500 text-sm">{errors.telephoneNo}</p>}
                                  </div>
                                </div>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="payScale" className="block text-base">
                                    Pay Level<span className='text-red-600'>*</span>
                                  </label>
                                  <div className='relative'>
                                    <select
                                      id="payScale"
                                      name="payScale"
                                      value={formData.payScale}
                                      onChange={handleChange}
                                      className={`w-full px-3 py-2 border ${errors.payScale ? 'border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    >
                                      <option value="" disabled>Select</option>
                                      <option value="13">13</option>
                                      <option value="13A">13A</option>
                                      <option value="14">14</option>
                                      <option value="15">15</option>
                                      <option value="16">16</option>
                                      <option value="17">17</option>
                                      <option value="18">18</option>
                                    </select>
                                    {errors.payScale && <p className="text-red-500 text-sm">{errors.payScale}</p>}
                                  </div>
                                </div>

                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="cenScheme" className="block text-base">
                                    Do you hold a position under the Central Staffing Scheme?</label>
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
                                </div> */}
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4"> */}
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
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
                                </div> */}
                                {/* <DgcTenureDatePicker
                                  startDate={formData.dgc_tenure_start_date}
                                  endDate={formData.dgc_tenure_end_date}
                                  setFormData={setFormData}
                                  errors={errors}
                                  setErrors={setErrors}
                                /> */}
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
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
                                </div> */}
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
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
                                </div> */}
                              </div>
                              <div className='block lg:flex items-start w-full'>
                                <div className="w-full lg:w-2/4 px-4 mb-4">
                                  <label htmlFor="nameofPrevMembers" className="block text-base">Name Of Present/previous Memberships Of Other Clubs<span className='text-red-600'>*</span></label>
                                  <div className='relative'>
                                    <input
                                      type="text"
                                      id="nameofPrevMembers"
                                      name="nameofPrevMembers"
                                      value={formData.nameofPrevMembers}
                                      onChange={handleChange}
                                      maxLength={200}
                                      className={`w-full px-3 py-2 border ${errors.nameofPrevMembers ? 'border-red-500 focus:invalid:border-red-500 focus:border-red-500' : 'border-gray-300'} rounded focus:outline-none focus:border-indigo-500 bg-transparent`}
                                    />
                                    {errors.nameofPrevMembers && <p className="text-red-500 text-sm">{errors.nameofPrevMembers}</p>}
                                  </div>
                                </div>
                                {/* <div className="w-full lg:w-2/4 px-4 mb-4">
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
                                </div> */}
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


                              {/* <div className='mx-4 mb-4 text-center'> */}
                                {/* <button type="submit" className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">Submit</button> */}
                                {/* <button
                                  type="submit"
                                  disabled={loading}
                                  className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto">
                                  {loading ? 'Submitting...' : 'Submit'}
                                </button>
                                
                              </div> */}
                              <div className='mx-4 mb-4 text-center'>
                                {isEditMode ? (
                                  <button
                                    type="button"
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="bg-green-600 text-white text-sm md:text-lg px-5 py-2 w-2/5 mx-auto rounded hover:bg-green-700"
                                  >
                                    {loading ? 'Updating...' : 'Update'}
                                  </button>
                                ) : (
                                  <button
                                    type="submit"
                                    disabled={loading}
                                    className="apply-btn text-sm md:text-lg px-5 py-2 w-2/5 mx-auto"
                                  >
                                    {loading ? 'Submitting...' : 'Submit'}
                                  </button>
                                )}
                              </div>
                              <div className='mx-4 mb-4'>
                                <p className="text-sm text-orange-600 mt-2">
                                  Note: Please upload attested application in order to complete the submission.
                                </p>
                              </div>
                              <div className="mx-4 mb-4 text-left">
                                <a
                                  href="/pdf/club_membership_template.pdf"
                                  download
                                  className="text-sm text-blue-400 underline hover:text-blue-800"
                                >
                                  Download Club Membership Template
                                </a>
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
                // change padding classes for create space in responsive by anil on 28-05-2025
                <div className="membership_container w-full md:w-4/5 px-0 md:p-5 bg-white">
                <MembershipSearchComponent 
                  onEdit={(data) => { 
                    setEditMembershipData(data); 
                    setIsEditMode(true); 
                    window.scrollTo({ top: 0, behavior: 'smooth' }); 
                  }} 
                />

                </div>
              )}


              {/* Div 3: Waiting Members */}
              {visibleDiv === 'div3' && (
                // change padding classes for create space in responsive by anil on 28-05-2025
                <div className="membership_container w-full md:w-4/5 px-0 md:p-5 bg-white">
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


              {/* Div 4: Existing List Members */}
              {visibleDiv === 'div4' && (
                // change padding classes for create space in responsive by anil on 28-05-2025
                <div className="membership_container w-full md:w-4/5 px-0 md:p-5 bg-white">
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