// components/MembershipSearchComponent.jsx
'use client';
import React, { useState } from 'react';
import ActTable from './ActTable';
import StatusAlert from './StatusAlert';
import FileUploadComponent from './FileUploadComponent';
import Image from 'next/image';
import pdFIcon from '../../public/pdf_icon.svg';
import { Pencil } from 'lucide-react';
import { useMemo } from 'react';

// PDF Download Handler
const handleDownloadPdf = async (membershipId) => {
  try {
    const response = await fetch(`https://ldo.mohua.gov.in/edharti/api/download-pdf/${membershipId}`);
    if (!response.ok) throw new Error('Failed to download PDF');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Membership_${membershipId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Download error:', error);
    setAlert({
      type: 'error',
      message: 'Error downloading the membership PDF. Please try again.'
    });
  }
};

const MembershipSearchComponent = ({ onEdit }) => {
  const [membershipSearchId, setMembershipSearchId] = useState('');
  const [searchedData, setSearchedData] = useState([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const handleEdit = (membershipData) => {
    if (onEdit) {
      onEdit(membershipData);
    }
  };

  const columnsDiv2 = useMemo(() => [
    { Header: '#', accessor: (row, index) => index + 1 },
    { Header: 'Application No.', accessor: 'unique_id' },
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
    },
    {
      Header: 'Edit',
      accessor: 'edit',
      Cell: ({ row }) => {
        const data = row.original;
        const fileUploaded = data.file_uploaded;

        return (
          <button
            onClick={() => !fileUploaded && handleEdit(data)}
            className={`p-2 rounded-full transition 
              ${fileUploaded ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} 
              text-white`}
            title={fileUploaded ? "Edit disabled (document already uploaded)" : "Edit"}
            disabled={!!fileUploaded}
          >
            <Pencil size={16} />
          </button>
        );
      }
    },
    {
      Header: 'Download PDF',
      accessor: 'download_pdf',
      Cell: ({ row }) => (
        <button onClick={() => handleDownloadPdf(row.original.id)}>
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
    }
  ], [searchedData]); // optional: update if search results change



  const handleSearchMembership = async (e) => {
    e.preventDefault();
    setLoadingTable(true);
    setAlert({ type: '', message: '' });
    setSearchedData([]);

    try {
      const response = await fetch(`https://ldo.mohua.gov.in/edharti/api/club-memberships/${membershipSearchId}`);
      const result = await response.json();

      if (!response.ok) {
        setAlert({ type: 'error', message: result.error || 'Membership not found.' });
      } else {
        const membership = result.membership;
        const fileUploaded =
          membership.club_type === 'IHC'
            ? membership.ihc_details?.ihcs_doc
            : membership.dgc_details?.dgcs_doc;

        setSearchedData([{ ...membership, file_uploaded: fileUploaded }]);
      }
    } catch (error) {
      console.error(error);
      setAlert({ type: 'error', message: 'An error occurred while searching. Please try again.' });
    } finally {
      setLoadingTable(false);
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSearchMembership} className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
        <label className="text-base font-semibold">Membership Application Number:</label>
        <input
          type="text"
          value={membershipSearchId}
          onChange={(e) => setMembershipSearchId(e.target.value)}
          placeholder="Enter Membership Application Number"
          className="px-3 py-2 border border-gray-300 rounded w-full md:w-1/2"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loadingTable}
        >
          {loadingTable ? 'Searching...' : 'Search'}
        </button>
      </form>

      <StatusAlert type={alert.type} message={alert.message} onHide={() => setAlert({ type: '', message: '' })} />

      {loadingTable ? (
        <p>Loading...</p>
      ) : searchedData.length > 0 ? (
        <ActTable columns={columnsDiv2}
          data={searchedData}
          customContainerClass="introduction-container"
          showGlobalSearch={false}
          showPagination={false} />
      ) : null}
    </div>
  );
};

export default MembershipSearchComponent;
