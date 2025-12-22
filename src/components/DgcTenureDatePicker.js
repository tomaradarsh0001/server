import React from "react";

const DgcTenureDatePicker = ({ startDate, endDate, setFormData, errors, setErrors }) => {
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { [name]: value };

    setFormData(prevState => {
      const newFormData = { ...prevState, ...updatedData };

      if (!newFormData.dgc_tenure_start_date || !newFormData.dgc_tenure_end_date) {
        setErrors(prevErrors => ({
          ...prevErrors,
          dgc_tenure_dates: "Both start and end dates must be filled.",
        }));
      } else {
        const start = new Date(newFormData.dgc_tenure_start_date);
        const end = new Date(newFormData.dgc_tenure_end_date);

        if (start > end) {
          setErrors(prevErrors => ({
            ...prevErrors,
            dgc_tenure_dates: "Start date cannot be later than end date.",
          }));
        } else {
          setErrors(prevErrors => ({
            ...prevErrors,
            dgc_tenure_dates: "",
          }));
        }
      }

      return newFormData;
    });
  };

  return (
    <div className="w-full lg:w-2/4 px-4 mb-4">
      <label htmlFor="dgc_tenure_dates" className="block text-base">
        Have you been a tenure member of Delhi Golf Club earlier? If so, indicate the period.
      </label>
      <div className="relative flex md:space-x-4 md:flex-row flex-col gap-2">
        {/* Start Date Input */}
        <input
          type="date"
          id="dgc_tenure_start_date"
          name="dgc_tenure_start_date"
          value={startDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
          title="Start Date"
        />

        {/* End Date Input */}
        <input
          type="date"
          id="dgc_tenure_end_date"
          name="dgc_tenure_end_date"
          value={endDate}
          onChange={handleDateChange}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-indigo-500 bg-transparent"
          title="End Date"
        />
      </div>

      {/* Error Message */}
      {errors.dgc_tenure_dates && (
        <p className="text-red-500 text-sm mt-1">{errors.dgc_tenure_dates}</p>
      )}
    </div>
  );
};

export default DgcTenureDatePicker;
