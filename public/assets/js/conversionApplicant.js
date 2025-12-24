function conversionStep1(propertyid, propertyStatus, callback) {
  var updateId = $("input[name='updateId']").val();
  var statusofapplicant = $("#statusofapplicant").val();
  var convname = $("input[name='convname']").val();
  var convgender = $("input[name='convgender']").val();
  var convage = $("input[name='convage']").val();
  var convRelationPrefix = $("#convprefixApp").html();
  var convRelationName = $("#convfathername").html();
  var convExecutedOnAsOnLease = $(
    "input[name='convExecutedOnAsOnLease']"
  ).val();
  var convaadhar = $("input[name='convaadhar']").val();
  var convpan = $("input[name='convpan']").val();
  var convmobilenumber = $("input[name='convmobilenumber']").val();
  var convNameAsOnLease = $("input[name='convNameAsOnLease']").val();
  var convRegnoAsOnLease = $("input[name='convRegnoAsOnLease']").val();
  var convBooknoAsOnLease = $("input[name='convBooknoAsOnLease']").val();
  var convVolumenoAsOnLease = $("input[name='convVolumenoAsOnLease']").val();
  var convPagenoFrom = $("input[name='convPagenoFrom']").val();
  var convPagenoTo = $("input[name='convPagenoTo']").val();
  var convRegdateAsOnLease = $("input[name='convRegdateAsOnLease']").val();
  var convCaseNo = $("input[name='convCaseNo']").val();
  var convCaseDetail = $("textarea[name='convCaseDetail']").val();
  var courtorderConversion = $(
    "input[name='courtorderConversion']:checked"
  ).val();
  var propertymortgagedConversion = $(
    "input[name='propertymortgagedConversion']:checked"
  ).val();
  var courtorderConversion = $(
    "input[name='courtorderConversion']:checked"
  ).val();

  var coapplicants = {};
  var formData = new FormData(); // Initialize FormData to handle both text and file data

  // Collect other fields (property details)
  formData.append("_token", $('meta[name="csrf-token"]').attr("content"));
  formData.append("updateId", updateId);
  formData.append("propertyid", propertyid);
  formData.append("propertyStatus", propertyStatus);
  formData.append("statusofapplicant", statusofapplicant);
  formData.append("convname", convname);
  formData.append("convgender", convgender);
  formData.append("convage", convage);
  formData.append("convRelationPrefix", convRelationPrefix);
  formData.append("convRelationName", convRelationName);
  formData.append("convExecutedOnAsOnLease", convExecutedOnAsOnLease);
  formData.append("convaadhar", convaadhar);
  formData.append("convpan", convpan);
  formData.append("convmobilenumber", convmobilenumber);
  formData.append("convNameAsOnLease", convNameAsOnLease);
  formData.append("convRegnoAsOnLease", convRegnoAsOnLease);
  formData.append("convBooknoAsOnLease", convBooknoAsOnLease);
  formData.append("convVolumenoAsOnLease", convVolumenoAsOnLease);
  formData.append("convPagenoFrom", convPagenoFrom);
  formData.append("convPagenoTo", convPagenoTo);
  formData.append("convRegdateAsOnLease", convRegdateAsOnLease);
  formData.append("courtorderConversion", courtorderConversion);
  if (courtorderConversion == "1") {
    formData.append("convCaseNo", convCaseNo);
    formData.append("convCaseDetail", convCaseDetail);

    var convCourtOrderFileInput = $('input[name="convCourtOrderFile"]');
    var convCourtOrderFile = convCourtOrderFileInput[0].files[0];
    formData.append("convCourtOrderFile", convCourtOrderFile);
    var convCourtOrderDate = $('input[name="convCourtOrderDate"]').val();
    formData.append("convCourtOrderDate", convCourtOrderDate);
    var courtorderattestedbyConversion = $(
      'input[name="courtorderattestedbyConversion"]'
    ).val();
    formData.append(
      "courtorderattestedbyConversion",
      courtorderattestedbyConversion
    );
  }

  formData.append("propertymortgagedConversion", propertymortgagedConversion);
  if (propertymortgagedConversion == "1") {
    var mortgageNoCFileInput = $('input[name="convMortgageeBankNOC"]');
    var mortgageNoCFile = mortgageNoCFileInput[0].files[0];
    formData.append("mortgageNoCFile", mortgageNoCFile);
    var NOCAttestationDateConversion = $(
      'input[name="NOCAttestationDateConversion"]'
    ).val();
    formData.append(
      "NOCAttestationDateConversion",
      NOCAttestationDateConversion
    );
    var NOCIssuedByConversion = $('input[name="NOCIssuedByConversion"]').val();
    formData.append("NOCIssuedByConversion", NOCIssuedByConversion);
  }

  // Iterate over co-applicant inputs and add text fields to formData
  $("input[name^='convcoapplicant'], select[name^='convcoapplicant']").each(
    function () {
      var nameAttr = $(this).attr("name");
      var value = $(this).val();
      var matches = nameAttr.match(/coapplicant\[(\d+)]\[(\w+)\]/);
      if (matches) {
        var index = matches[1];
        var field = matches[2];
        if (!coapplicants[index]) coapplicants[index] = {};
        coapplicants[index][field] = value;

        // Append the text field to FormData
        formData.append(`coapplicants[${index}][${field}]`, value);
        if ($(this).attr("type") == "file") {
          var fileInput = $(this)[0].files[0]; // Get the first file (since each input has one file)
          if (fileInput) {
            formData.append(`coapplicants[${index}][${field}]`, fileInput); // Append the file to FormData
          }
        }
      }
    }
  );

  var baseUrl = getBaseURL();

  $.ajax({
    url: baseUrl + "/conversion/step-1",
    type: "POST",
    data: formData, // Use FormData for sending files
    contentType: false, // Prevent jQuery from overriding content type
    processData: false, // Tell jQuery not to process data

    success: function (result) {
      if (result.status == "success") {
        $("#submitbtn1").html(
          'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#submitbtn1").prop("disabled", false);
        $("input[name='updateId']").val(result.data.id);
        $("input[name='lastPropertyId']").val(result.data.old_property_id);
        if (callback) callback(true, result); // Success
      } else {
        // Handle failure scenario
        $("#submitbtn1").html(
          'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#submitbtn1").prop("disabled", false);
        // $("input[name='updateId']").val(result.data.id);
        // $("input[name='lastPropertyId']").val(result.data.old_property_id);
        if (callback) callback(false, result); // Call the callback with failure
      }
    },
    error: function (err) {
      $("#submitbtn1").html('Next <i class="bx bx-right-arrow-alt ms-2"></i>');
      $("#submitbtn1").prop("disabled", false);
      if (err.responseJSON && err.responseJSON.message) {
        if (callback) callback(false, err.responseJSON.message);
      } else {
        if (callback) callback(false, "Unknown error!!");
      }
    },
  });
}

// not apply 'blur change' on date inputs for final validation (after manual entry) by anil 26-03-2025
$(document).on(
  "blur change",
  "#CONrepeater .coapplicant-block input:not([type='date']), #CONrepeater .coapplicant-block select, #CONrepeater .repeater-add-btn",
  function () {
    coapplicantConRepeaterForm();
  }
);
// Only apply 'blur' to date inputs for final validation (after manual entry) by anil 26-03-2025
$(document).on(
  "blur",
  "#CONrepeater .coapplicant-block input[type='date']",
  function () {
    coapplicantConRepeaterForm();
  }
);

// Add a listener to the date of birth field to handle changes when it's cleared
$(document).on(
  "change",
  "#CONrepeater .coapplicant-block input[type='date']",
  function () {
    var conCoDobInput = $(this);
    var ageConField = conCoDobInput
      .closest(".coapplicant-block")
      .find("input[id$='_age']");

    // If the date of birth is cleared, clear the age field as well
    if (!conCoDobInput.val()) {
      ageConField.val(""); // Clear the age field
    }
  }
);

// Calculate age for all date inputs on page load and set value in ageConField added by anil on 28-03-2025
$("#CONrepeater .coapplicant-block").each(function () {
  var conCoDobInput = $(this).find("input[id$='_dateofbirth']");
  var ageConField = $(this).find("input[id$='_age']");

  var dobValue = conCoDobInput.val();
  if (dobValue) {
    var dob = new Date(dobValue);
    var age = conCalculateAge(dob);
    ageConField.val(age);
  }
});

function coapplicantConRepeaterForm() {
  var isCoapplicantConValid = true;

  $("#CONrepeater .coapplicant-block").each(function (index, element) {
    let currentIndex = $(this).data("index");
    var conCoName = $(element)
      .find("#convcoapplicant_" + currentIndex + "_name")
      .val();
    var conCoGender = $(element)
      .find("#convcoapplicant_" + currentIndex + "_gender")
      .val();
    // var conCoDob = $(element).find("#convcoapplicant_" + currentIndex + "_dateofbirth").val();
    var conCoDobInput = $(element).find(
      "#convcoapplicant_" + currentIndex + "_dateofbirth"
    );
    // var ageConField = $(element).find("#convcoapplicant_" + currentIndex + "_age");
    var conCoRelation = $(element)
      .find("#convcoapplicant_" + currentIndex + "_fathername")
      .val();
    var conCoAdhaarNumber = $(element)
      .find("#convcoapplicant_" + currentIndex + "_aadharnumber")
      .val();
    var conCoPanNumber = $(element)
      .find("#convcoapplicant_" + currentIndex + "_pannumber")
      .val();
    var conCoMobileNumber = $(element)
      .find("#convcoapplicant_" + currentIndex + "_mobilenumber")
      .val();
    //var conCoPhotoFile = $(element).find("#convcoapplicant_" + currentIndex + "_photo")[0].files[0]; // Get the actual file

    var conCoAdhaarFileInput = $(element).find(
      "#convcoapplicant_" + currentIndex + "_aadhaarfile"
    );
    var conCoAdhaarFile =
      conCoAdhaarFileInput.length > 0 &&
      conCoAdhaarFileInput[0].files.length > 0
        ? conCoAdhaarFileInput[0].files[0]
        : null;
    var conCoPanFileInput = $(element).find(
      "#convcoapplicant_" + currentIndex + "_panfile"
    );
    var conCoPanFile =
      conCoPanFileInput.length > 0 && conCoPanFileInput[0].files.length > 0
        ? conCoPanFileInput[0].files[0]
        : null;
    var conCoPhotoFileInput = $(element).find(
      "#convcoapplicant_" + currentIndex + "_photo"
    );
    var conCoPhotoFile =
      conCoPhotoFileInput.length > 0 && conCoPhotoFileInput[0].files.length > 0
        ? conCoPhotoFileInput[0].files[0]
        : null;

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    var shouldValidateAadhaar = conCoAdhaarFileInput.attr(
      "data-should-validate"
    );
    var shouldValidatePan = conCoPanFileInput.attr("data-should-validate");
    var shouldValidatePhoto = conCoPhotoFileInput.attr("data-should-validate"); // get value of data-should-validate

    // ✅ Ensure max date is set dynamically
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    conCoDobInput.attr("max", today); // Set max date to today

    var conCoDob = conCoDobInput.val();
    var ageConField = $(element).find(
      "#convcoapplicant_" + currentIndex + "_age"
    );

    // Remove previous error messages
    $(this).find(".error-message").text("");

    // Future Date Validation for DOB
    if (conCoDob) {
      var dob = new Date(conCoDob);
      var todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (dob > todayDate) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Date of birth cannot be in the future.",
          "#convcoapplicant_" + currentIndex + "_dateofbirth"
        );
        conCoDobInput.val(""); // Clear invalid input
      } else {
        var age = conCalculateAge(dob);
        ageConField.val(age);
      }
    }

    // Check if any field is filled
    var isAnyConFieldFilled =
      conCoName ||
      conCoGender ||
      conCoDob ||
      conCoRelation ||
      conCoAdhaarNumber ||
      conCoAdhaarFile ||
      conCoPanNumber ||
      conCoPanFile ||
      conCoMobileNumber ||
      conCoPhotoFile;

    if (isAnyConFieldFilled) {
      // If at least one field is filled, make all fields mandatory
      if (!conCoName) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Name is required.",
          "#convcoapplicant_" + currentIndex + "_name"
        );
      }
      if (!conCoGender) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Gender is required.",
          "#convcoapplicant_" + currentIndex + "_gender"
        );
      }
      if (!conCoDob) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Date of birth is required.",
          "#convcoapplicant_" + currentIndex + "_dateofbirth"
        );
      }
      if (!conCoRelation) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Relation is required.",
          "#convcoapplicant_" + currentIndex + "_fathername"
        );
      }
      // Validate aadhaar number (example: 12-digit number)
      if (!conCoAdhaarNumber) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Aadhaar number is required.",
          "#convcoapplicant_" + currentIndex + "_aadharnumber"
        );
      } else if (!/^\d{12}$/.test(conCoAdhaarNumber)) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Aadhaar number must be 12 digits.",
          "#convcoapplicant_" + currentIndex + "_aadharnumber"
        );
      }

      // added by anil for draft and edit case on 09-04-2025
      // Check if file exists and its size for aadhaar file
      if (shouldValidateAadhaar !== "1") {
        // Perform aadhaar file validation only when shouldValidate is 0
        if (!conCoAdhaarFile) {
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "Aadhaar PDF is required.",
            "#convcoapplicant_" + currentIndex + "_aadhaarfile"
          );
        } else if (conCoAdhaarFile.size > 5 * 1024 * 1024) {
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "Aadhaar file size must be less than 5MB.",
            "#convcoapplicant_" + currentIndex + "_aadhaarfile"
          );
        } else if (!conCoAdhaarFile.name.endsWith(".pdf")) {
          // Check if the file is not a PDF
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "Only PDF files are allowed.",
            "#convcoapplicant_" + currentIndex + "_aadhaarfile"
          );
        }
      }

      // Validate PAN number (example: format ABCDE1234F)
      if (!conCoPanNumber) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "PAN number is required.",
          "#convcoapplicant_" + currentIndex + "_pannumber"
        );
      } else if (!panRegex.test(conCoPanNumber.toUpperCase())) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Invalid PAN number format.",
          "#convcoapplicant_" + currentIndex + "_pannumber"
        );
      }
      // Check if file exists and its size for PAN file
      if (shouldValidatePan !== "1") {
        //  Perform PAN file validation only when shouldValidate is 0
        if (!conCoPanFile) {
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "PAN PDF is required.",
            "#convcoapplicant_" + currentIndex + "_panfile"
          );
        } else if (conCoPanFile && conCoPanFile.size > 5 * 1024 * 1024) {
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "PAN file size must be less than 5MB.",
            "#convcoapplicant_" + currentIndex + "_panfile"
          );
        } else if (!conCoPanFile.name.endsWith(".pdf")) {
          // Check if the file is not a PDF
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "Only PDF files are allowed.",
            "#convcoapplicant_" + currentIndex + "_panfile"
          );
        }
      }
      
      // Validate mobile number (example: 10-digit number)
      if (!conCoMobileNumber) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Mobile number is required.",
          "#convcoapplicant_" + currentIndex + "_mobilenumber"
        );
      } else if (!/^\d{10}$/.test(conCoMobileNumber)) {
        isCoapplicantConValid = false;
        showErrorMessage(
          element,
          "Mobile number must be 10 digits.",
          "#convcoapplicant_" + currentIndex + "_mobilenumber"
        );
      }
      // commented by anil and add new same function which is work for also draft on 02-04-2025
      if (shouldValidatePhoto !== "1") {
        if (!conCoPhotoFile) {
          isCoapplicantConValid = false;
          showErrorMessage(
            element,
            "Co-applicant passport size photo is required.",
            "#convcoapplicant_" + currentIndex + "_photo"
          );
        } else {
          var conCoPhotoFileName = conCoPhotoFile.name;
          var conCoPhotoFileExtension = conCoPhotoFileName
            .split(".")
            .pop()
            .toLowerCase();
          var conCoPhotoValidExtensions = ["jpg", "jpeg", "png"];

          if (!conCoPhotoValidExtensions.includes(conCoPhotoFileExtension)) {
            isCoapplicantConValid = false;
            showErrorMessage(
              element,
              "Only .jpg, .jpeg, and .png formats are allowed.",
              "#convcoapplicant_" + currentIndex + "_photo"
            );
            // Clear the invalid file input
            // $(element).find("#convcoapplicant_" + currentIndex + "_photo").val(""); // Reset file input
          } else if (conCoPhotoFile.size > 102400) {
            isCoapplicantConValid = false;
            showErrorMessage(
              element,
              "Passport photo size must be less than 100KB.",
              "#convcoapplicant_" + currentIndex + "_photo"
            );
          }
        }
      }
    }
  });

  return isCoapplicantConValid;
}
//end for conversion repeater form validtaion



// function to calculate age
function conCalculateAge(dob) {
  var today = new Date();
  var age = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}


function conversionStep2(callback) {
  var updateId = $("input[name='updateId']").val();
  var formData = new FormData();
  var baseUrl = getBaseURL();
  formData.append("_token", $('meta[name="csrf-token"]').attr("content")); // CSRF token
  formData.append("updateId", updateId);

  $("input[name^='convDoc'], select[name^='convDoc']").each(function () {
    var nameAttr = $(this).attr("name");
    var value = $(this).val();
    // Append the text field to FormData
    formData.append(nameAttr, value);
    if ($(this).attr("type") == "file") {
      var fileInput = $(this)[0].files[0]; // Get the first file (since each input has one file)
      if (fileInput) {
        formData.append(nameAttr, fileInput); // Append the file to FormData
      }
    }
    // }
  });

  $.ajax({
    type: "POST",
    url: `${baseUrl}/conversion/step-2`,
    contentType: false,
    processData: false,
    data: formData,
    success: (response) => {
      if (response.status == "error") {
        console.log("success response");
        console.log(response);
        if (callback) callback(false, response.id + "-" + response.message);
      }
      if (callback) callback(true, response.message);
    },
    error: (response) => {
      if (response.status == 422) {
        let er = response.responseJSON;
        if (callback) callback(false, er.id + "-" + er.message); // Call the callback with failure
      } else {
        if (callback) callback(response.responseText);
      }
    },
  });
}
function conversionStep3(callback) {
  var updateId = $("input[name='updateId']").val();
  var formData = new FormData();
  var baseUrl = getBaseURL();
  formData.append("_token", $('meta[name="csrf-token"]').attr("content")); // CSRF token
  formData.append("updateId", updateId);

  $("input[name^='convOpt']").each(function () {
    var nameAttr = $(this).attr("name");
    var value = $(this).val();
    // Append the text field to FormData
    formData.append(nameAttr, value);
  });

  formData.append("isLeaseDeedLost", $('input[name="isLeaseDeedLost"]').val());
  formData.append(
    "applicantConsent",
    $("#agreeConsentConversion").is(":checked")
  );

  $.ajax({
    type: "POST",
    url: `${baseUrl}/conversion/step-3`,
    contentType: false,
    processData: false,
    data: formData,
    success: (response) => {
      if (response.url) {
        window.location.href = response.url;
      } else {
        if (response.status == "error") {
          if (callback) callback(false, response.message);
        }
        if (callback) callback(true, response.message);
      }
    },
    error: (response) => {
      if (response.status == 422) {
        // validation error
        let er = response.responseJSON;
        if (callback) callback(false, er.id + "-" + er.message); // Call the callback with failure
      } else {
        if (callback) callback(response.responseText);
      }
    },
  });
}


// Conversion Form 1 Fields
  var convExecutedFavour = document.getElementById("convNameAsOnLease");
  var convExecutedOnAsOnLease = document.getElementById(
    "convExecutedOnAsOnLease"
  );
  var convRegNo = $("#convLeaseDeed").find("#regno");
  var convBookno = document.getElementById("convbookno");
  var convVolumeno = document.getElementById("convvolumeno");
  var convPagenoFrom = document.getElementById("convPagenoFrom");
  var convPagenoTo = document.getElementById("convPagenoTo");
  var convRegDate = document.getElementById("convregdate");
  var convYesCourtOrder = document.getElementById("YesCourtOrderConversion");
  var convCaseNo = document.getElementById("convCaseNo");
  var convCaseDetail = document.getElementById("convCaseDetail");
  var convCourtOrderFile = document.getElementById("convCourtOrderFile");
  var convCourtOrderDate = document.getElementById("convCourtOrderDate");
  var convCourtIssuingAuthority = document.getElementById(
    "courtorderattestedbyConversion"
  );
  var convYesMortgaged = document.getElementById("YesMortgagedConversion");
  var convMortgageeNOC = document.getElementById("convMortgageeBankNOC");
  var convDateOfNOC = document.getElementById("NOCAttestationDateConversion");
  var convMortgageeIssuingAuthority = document.getElementById(
    "NOCIssuedByConversion"
  );

  // Form 1 Errors
  var convExecutedFavourError = document.getElementById(
    "convNameAsOnLeaseError"
  );
  var convExecutedOnAsOnLeaseError = document.getElementById(
    "convExecutedOnAsOnLeaseError"
  );
  var convRegNoError = $("#convLeaseDeed").find("#regnoError");
  var convBooknoError = document.getElementById("convbooknoError");
  var convVolumenoError = document.getElementById("convvolumenoError");
  var convPagenoFromError = document.getElementById("convPagenoFromError");
  var convPagenoToError = document.getElementById("convPagenoToError");
  var convRegDateError = document.getElementById("convregdateError");
  var convYesCourtOrderError = document.getElementById(
    "YesCourtOrderConversionError"
  );
  var convCaseNoError = document.getElementById("convCaseNoError");
  var convCaseDetailError = document.getElementById("convCaseDetailError");
  var convCourtOrderFileError = document.getElementById(
    "convCourtOrderFileError"
  );
  var convCourtOrderDateError = document.getElementById(
    "convCourtOrderDateError"
  );
  var convCourtIssuingAuthorityError = document.getElementById(
    "courtorderattestedbyConversionError"
  );
  var convYesMortgagedError = document.getElementById(
    "YesMortgagedConversionError"
  );
  var convMortgageeNOCError = document.getElementById(
    "convMortgageeBankNOCError"
  );
  var convDateOfNOCError = document.getElementById(
    "NOCAttestationDateConversionError"
  );
  var convMortgageeIssuingAuthorityError = document.getElementById(
    "NOCIssuedByConversionError"
  );

  function validateConvExecutedfavour() {
    var convExecutedFavourValue = convExecutedFavour.value.trim();
    if (convExecutedFavourValue === "") {
      convExecutedFavourError.textContent = "Executed in favour of is required.";
      convExecutedFavourError.style.display = "block";
      return false;
    } else {
      convExecutedFavourError.style.display = "none";
      return true;
    }
  }

  function validateConvExecutedOnAsOnLeaseDate() {
    var convExecutedOnAsOnLeaseValue = convExecutedOnAsOnLease.value.trim();
    var today = new Date().toISOString().split("T")[0];
    if (convExecutedOnAsOnLeaseValue === "") {
      convExecutedOnAsOnLeaseError.textContent = "Executed date is required.";
      convExecutedOnAsOnLeaseError.style.display = "block";
      return false;
    } else if (convExecutedOnAsOnLeaseValue > today) {
      convExecutedOnAsOnLeaseError.textContent =
        "Executed date cannot be in the future.";
      convExecutedOnAsOnLeaseError.style.display = "block";
      convExecutedOnAsOnLease.value = ""; // Clear invalid input
      return false;
    } else {
      convExecutedOnAsOnLeaseError.style.display = "none";
      return true;
    }
  }

  function validateConvRegOn() {
    var convRegNoValue = convRegNo.val().trim();
    if (convRegNoValue === "") {
      convRegNoError.text("Registration number is required.");
      convRegNoError.css("display", "block");
      return false;
    } else {
      convRegNoError.css("display", "none");
      return true;
    }
  }

  function validateConvBookno() {
    var convBooknoValue = convBookno.value.trim();

    // Check if the field is empty
    if (convBooknoValue === "") {
      convBooknoError.textContent = "Book number is required.";
      convBooknoError.style.display = "block";
      return false;
    }
    
    // Check if the Book number is numeric
    if (!/^\d+$/.test(convBooknoValue)) {
      convBooknoError.textContent = "Book number must be a numeric value.";
      convBooknoError.style.display = "block";
      return false;
    }

    // Check if the Book number is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(convBooknoValue) <= 0) {
      convBooknoError.textContent = "Book number must be a positive number.";
      convBooknoError.style.display = "block";
      return false;
    }

    convBooknoError.style.display = "none";
    return true;
  }

  function validateConvVolumeno() {
    var convVolumenoValue = convVolumeno.value.trim();

    // Check if the field is empty
    if (convVolumenoValue === "") {
      convVolumenoError.textContent = "Volume number is required.";
      convVolumenoError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(convVolumenoValue)) {
      convVolumenoError.textContent = "Volume must be a numeric value.";
      convVolumenoError.style.display = "block";
      return false;
    }

    // Check if the value is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(convVolumenoValue) <= 0) {
      convVolumenoError.textContent = "Volume must be a positive number.";
      convVolumenoError.style.display = "block";
      return false;
    }

    convVolumenoError.style.display = "none";
    return true;
  }

  $(document).on("input blur change", "#convPagenoFrom", function () {
    validateConvPagenoFrom();
  });

  function validateConvPagenoFrom() {
    var convPagenoFromValue = convPagenoFrom.value.trim();
    var convPagenoValueTo = convPagenoTo.value.trim();

    // Check if the field is empty
    if (convPagenoFromValue === "") {
      convPagenoFromError.textContent = "Page number from is required.";
      convPagenoFromError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(convPagenoFromValue)) {
      convPagenoFromError.textContent = "Page number from must be a numeric value.";
      convPagenoFromError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(convPagenoFromValue) <= 0) {
      convPagenoFromError.textContent =
        "Page number from must be a positive number.";
      convPagenoFromError.style.display = "block";
      return false;
    }
    // Check if 'Page number From' is greater than 'Page number To'
    if (parseInt(convPagenoFromValue) > parseInt(convPagenoValueTo)) {
      convPagenoFromError.textContent =
        "Page number from cannot be greater than page number to.";
      convPagenoFromError.style.display = "block";
      return false;
    } else {
      convPagenoFromError.style.display = "none";
      return true;
    }
  }

  $(document).on("input blur change", "#convPagenoTo", function () {
    validateConvPagenoTo();
  });

  function validateConvPagenoTo() {
    var convPagenoToValue = convPagenoTo.value.trim();
    var convPagenoValueFrom = convPagenoFrom.value.trim();
    // Check if the field is empty
    if (convPagenoToValue === "") {
      convPagenoToError.textContent = "Page number to is required.";
      convPagenoToError.style.display = "block";
      // Check the value
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(convPagenoToValue)) {
      convPagenoToError.textContent = "Page number to must be a numeric value.";
      convPagenoToError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(convPagenoToValue) <= 0) {
      convPagenoToError.textContent = "Page number to must be a positive number.";
      convPagenoToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is less than 'Page number From'
    if (parseInt(convPagenoToValue) < parseInt(convPagenoValueFrom)) {
      convPagenoToError.textContent =
        "Page number to cannot be less than page number from.";
      convPagenoToError.style.display = "block";
      return false;
    } else {
      convPagenoToError.style.display = "none";
      return true;
    }
  }

  function validateConvRegDate() {
    var convRegDateValue = convRegDate.value.trim();
    var convExecutedOnAsOnValueLease = convExecutedOnAsOnLease.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    var convRegDateObj = new Date(convRegDateValue);
    var convExecutedOnAsOnLeaseObj = new Date(convExecutedOnAsOnValueLease);

    if (convRegDateValue === "") {
      convRegDateError.textContent = "Registration date is required.";
      convRegDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (convRegDateValue > today) {
      convRegDateError.textContent =
        "Registration date cannot be in the future.";
      convRegDateError.style.display = "block";
      convRegDate.value = ""; // Clear the invalid date
      return false;
    }

    // Ensure convRegDate is not earlier than mutExecutedOnAsConLease
    if (convRegDateObj < convExecutedOnAsOnLeaseObj) {
      convRegDateError.textContent =
        "Registration cannot occur prior to the execution date.";
      convRegDateError.style.display = "block";
      convRegDate.value = ""; // Clear the invalid date
      return false;
    }

    convRegDateError.style.display = "none";
    return true;
  }

  function validateConvCourtOrderFields() {
    const alphaRegex = /^[A-Za-z\s.-]+$/; // Allows only letters, spaces, commas, etc.
    const CourtMaxFileSize = 5 * 1024 * 1024; // 5MB
    const today = new Date().toISOString().split("T")[0];

    if (convYesCourtOrder && convYesCourtOrder.checked) {
      let isconvYesCourtOrderValid = true;

      // 1. Case number
      if (convCaseNo.value.trim() === "") {
        convCaseNoError.textContent = "Case number is required.";
        convCaseNoError.style.display = "block";
        isconvYesCourtOrderValid = false;
      } else {
        convCaseNoError.style.display = "none";
      }

      // 2. Case Detail
      if (convCaseDetail.value.trim() === "") {
        convCaseDetailError.textContent = "Case detail is required.";
        convCaseDetailError.style.display = "block";
        isconvYesCourtOrderValid = false;
      } else {
        convCaseDetailError.style.display = "none";
      }

      // 3. Court Order File (skip validation if data-should-validate == 1)
      if (convCourtOrderFile.getAttribute("data-should-validate") != "1") {
        if (
          convCourtOrderFile.files.length === 0 ||
          convCourtOrderFile.value.trim() === ""
        ) {
          convCourtOrderFileError.textContent =
            "Court order PDF file is required.";
          convCourtOrderFileError.style.display = "block";
          isconvYesCourtOrderValid = false;
        } else {
          const file = convCourtOrderFile.files[0];

          // Check if the file is a PDF
          if (file.type !== "application/pdf") {
            convCourtOrderFileError.textContent = "Only PDF files are allowed.";
            convCourtOrderFileError.style.display = "block";
            isconvYesCourtOrderValid = false;
          }
          // Check if the file size is within the allowed limit
          else if (file.size > CourtMaxFileSize) {
            convCourtOrderFileError.textContent =
              "PDF file size must be less than 5MB.";
            convCourtOrderFileError.style.display = "block";
            isconvYesCourtOrderValid = false;
          } else {
            convCourtOrderFileError.style.display = "none";
          }
        }
      } else {
        convCourtOrderFileError.style.display = "none";
      }

      // 4. Court Order Date
      if (convCourtOrderDate.value.trim() === "") {
        convCourtOrderDateError.textContent = "Court order date is required.";
        convCourtOrderDateError.style.display = "block";
        isconvYesCourtOrderValid = false;
      } else if (convCourtOrderDate.value.trim() > today) {
        convCourtOrderDateError.textContent = "Date of document cannot be in the future.";
        convCourtOrderDateError.style.display = "block";
        convCourtOrderDate.value = "";
        isconvYesCourtOrderValid = false;
      } else {
        convCourtOrderDateError.style.display = "none";
      }

      // 5. Issuing Authority
      if (convCourtIssuingAuthority.value.trim() === "") {
        convCourtIssuingAuthorityError.textContent =
          "Issuing authority is required.";
        convCourtIssuingAuthorityError.style.display = "block";
        isconvYesCourtOrderValid = false;
      } else if (!alphaRegex.test(convCourtIssuingAuthority.value.trim())) {
        convCourtIssuingAuthorityError.textContent =
          "Issuing authority must contain letters only.";
        convCourtIssuingAuthorityError.style.display = "block";
        isconvYesCourtOrderValid = false;
      } else {
        convCourtIssuingAuthorityError.style.display = "none";
      }

      return isconvYesCourtOrderValid;
    }

    return true; // Skip validation if "No" is selected
  }

  function validateConvYesMortgaged() {
    const alphaRegex = /^[A-Za-z\s.-]+$/;
    const CourtMaxFileSize = 5 * 1024 * 1024;
    const today = new Date().toISOString().split("T")[0];

    if (convYesMortgaged && convYesMortgaged.checked) {
      let isconvYesMortgagedValid = true;

      // 1. Mortgagee NOC File (skip if data-should-validate == 1)
      if (convMortgageeNOC.getAttribute("data-should-validate") != "1") {
        if (
          convMortgageeNOC.files.length === 0 ||
          convMortgageeNOC.value.trim() === ""
        ) {
          convMortgageeNOCError.textContent = "Mortgagee NOC PDF is required.";
          convMortgageeNOCError.style.display = "block";
          isconvYesMortgagedValid = false;
        } else {
          const file = convMortgageeNOC.files[0];

          // Check if the file is a PDF
          if (file.type !== "application/pdf") {
            convMortgageeNOCError.textContent = "Only PDF files are allowed.";
            convMortgageeNOCError.style.display = "block";
            isconvYesMortgagedValid = false;
          }
          // Check if the file size is within the allowed limit
          else if (file.size > CourtMaxFileSize) {
            convMortgageeNOCError.textContent =
              "PDF size must be less than 5MB.";
            convMortgageeNOCError.style.display = "block";
            isconvYesMortgagedValid = false;
          } else {
            convMortgageeNOCError.style.display = "none";
          }
        }
      } else {
        convMortgageeNOCError.style.display = "none";
      }

      // 2. Date of NOC
      if (convDateOfNOC.value.trim() === "") {
        convDateOfNOCError.textContent = "Date of NOC is required.";
        convDateOfNOCError.style.display = "block";
        isconvYesMortgagedValid = false;
      } else if (convDateOfNOC.value.trim() > today) {
        convDateOfNOCError.textContent = "Date of NOC cannot be in the future.";
        convDateOfNOCError.style.display = "block";
        convDateOfNOC.value = "";
        isconvYesMortgagedValid = false;
      } else {
        convDateOfNOCError.style.display = "none";
      }

      // 3. Issuing Authority
      if (convMortgageeIssuingAuthority.value.trim() === "") {
        convMortgageeIssuingAuthorityError.textContent =
          "Issuing authority is required.";
        convMortgageeIssuingAuthorityError.style.display = "block";
        isconvYesMortgagedValid = false;
      } else if (!alphaRegex.test(convMortgageeIssuingAuthority.value.trim())) {
        convMortgageeIssuingAuthorityError.textContent =
          "Issuing authority must contain letters only.";
        convMortgageeIssuingAuthorityError.style.display = "block";
        isconvYesMortgagedValid = false;
      } else {
        convMortgageeIssuingAuthorityError.style.display = "none";
      }

      return isconvYesMortgagedValid;
    }

    return true; // Skip validation if "No" is selected
  }

  function validateForm1Conv() {
    var isCoapplicantConversionValid = coapplicantConRepeaterForm();
    var isConvExecutedNameValid = validateConvExecutedfavour();
    var isConvExecutedOnAsOnLeaseDate = validateConvExecutedOnAsOnLeaseDate();
    var isConvRegno = validateConvRegOn();
    var isConvBookno = validateConvBookno();
    var isConvVolumeno = validateConvVolumeno();
    var isConvRegDate = validateConvRegDate();
    var isConvPagenoFrom = validateConvPagenoFrom();
    var isConvPagenoTo = validateConvPagenoTo();
    var isConvCourtOrderFields = validateConvCourtOrderFields();
    var isConvYesMortgaged = validateConvYesMortgaged();
    var isStatusOfApplicantValid = validateStatusOfApplicant();

    return (
      isCoapplicantConversionValid &&
      isConvExecutedNameValid &&
      isConvExecutedOnAsOnLeaseDate &&
      isConvRegno &&
      isConvBookno &&
      isConvVolumeno &&
      isConvRegDate &&
      isConvPagenoFrom &&
      isConvPagenoTo &&
      isConvCourtOrderFields &&
      isConvYesMortgaged &&
      isStatusOfApplicantValid
    );
  }

  function validateEditConv1() {
    var isCoapplicantConversionValid = coapplicantConRepeaterForm();
    var isConvRegno = validateConvRegOn();
    var isConvBookno = validateConvBookno();
    var isConvVolumeno = validateConvVolumeno();
    var isConvRegDate = validateConvRegDate();
    var isConvPagenoFrom = validateConvPagenoFrom();
    var isConvPagenoTo = validateConvPagenoTo();
    console.log(
      coapplicantConRepeaterForm(),
      validateConvRegOn(),
      validateConvBookno(),
      validateConvVolumeno(),
      validateConvRegDate(),
      validateConvPagenoFrom(),
      validateConvPagenoTo()
    );
    return (
      isCoapplicantConversionValid &&
      isConvRegno &&
      isConvBookno &&
      isConvVolumeno &&
      isConvRegDate &&
      isConvPagenoFrom &&
      isConvPagenoTo
    );
  }

  // function mandatoryMutDocumentsForm() {
  function validateMandatoryConvDocumentsForm() {
    var isMandatoryConvDocumentsFormValid = true;

    // Clear previous error messages before starting new validation
    // $(".text-danger").text(""); // Clear the text inside all error message spans

    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Loop through all .items inside #affidavits_repeater
    $("#convDocIndemnityBond_repeater .items").each(function (index, element) {
      let currentIndex = $(this).data("index");
      var convIndemnityBondFile = $(element).find(
        "#convdocindemnitybond_conversion_" +
          currentIndex +
          "_convdocindemnitybond"
      )[0]?.files[0]; // File input
      var convAttestationDate = $(element)
        .find(
          "#convdocindemnitybond_conversion_" +
            currentIndex +
            "_convdocindemnitybonddateofattestation"
        )
        .val();
      var convAttestedBy = $(element)
        .find(
          "#convdocindemnitybond_conversion_" +
            currentIndex +
            "_convdocindemnitybondattestedby"
        )
        .val();

      var isConvIndemnityValid = true;

      // Skip validation based on custom condition
      if (
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybond"
          )
          .attr("data-should-validate") !== "1"
      ) {
        // return true; // Skip validation and continue to the next item // commented by anil for not in use and keeping the file validation here
        // Validate file input (Always check file size and presence)
        if (!convIndemnityBondFile) {
          isConvIndemnityValid = false;
          $(element)
            .find(
              "#convdocindemnitybond_conversion_" +
                currentIndex +
                "_convdocindemnitybond"
            )
            .siblings(".text-danger")
            .text("Indemnity bond file is required.");
        } else {
          if (!convIndemnityBondFile.name.endsWith(".pdf")) {
            isConvIndemnityValid = false;
            $(element)
              .find(
                "#convdocindemnitybond_conversion_" +
                  currentIndex +
                  "_convdocindemnitybond"
              )
              .siblings(".text-danger")
              .text("Only PDF files are allowed.");
          }
          // Validate file size (5MB limit)
          else if (convIndemnityBondFile.size > 5 * 1024 * 1024) {
            isConvIndemnityValid = false;
            $(element)
              .find(
                "#convdocindemnitybond_conversion_" +
                  currentIndex +
                  "_convdocindemnitybond"
              )
              .siblings(".text-danger")
              .text("File size must be less than 5MB.");
          } else {
            // If the date is valid, clear the error message
            $(element)
              .find(
                "#convdocindemnitybond_conversion_" +
                  currentIndex +
                  "_convdocindemnitybond"
              )
              .siblings(".text-danger")
              .text(""); // Clear the error message
          }
        }
      }

      // Validate attestation date (No future dates)
      if (!convAttestationDate) {
        isConvIndemnityValid = false;
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybonddateofattestation"
          )
          .siblings(".text-danger")
          .text("Date of attestation is required.");
      } else if (convAttestationDate > today) {
        isConvIndemnityValid = false;
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybonddateofattestation"
          )
          .siblings(".text-danger")
          .text("Future date is not allowed.");
      } else {
        // If the date is valid, clear the error message
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybonddateofattestation"
          )
          .siblings(".text-danger")
          .text(""); // Clear the error message
      }

      // Validate "attested by" field (Check if it contains valid text)
      if (!convAttestedBy) {
        isConvIndemnityValid = false;
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybondattestedby"
          )
          .siblings(".text-danger")
          .text("Attested by is required.");
      } else if (!/^[A-Za-z\s.]+$/.test(convAttestedBy)) {
        // Check if it contains only alphabets and spaces
        isConvIndemnityValid = false;
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybondattestedby"
          )
          .siblings(".text-danger")
          .text("Attested by must contain letters only.");
      } else {
        // If Attested by is valid, clear the error message
        $(element)
          .find(
            "#convdocindemnitybond_conversion_" +
              currentIndex +
              "_convdocindemnitybondattestedby"
          )
          .siblings(".text-danger")
          .text("");
      }

      // Ensure the form validation status is updated correctly
      if (!isConvIndemnityValid) {
        isMandatoryConvDocumentsFormValid = false;
      }
    });

    // Loop through all .items inside #indemnityBond_repeater
    $("#convDocUndertaking_repeater .items").each(function (index, element) {
      let currentIndex = $(this).data("index");
      var convIndeBondFile = $(element).find(
        "#convdocundertaking_conversion_" + currentIndex + "_convdocundertaking"
      )[0]?.files[0]; // File input
      var conveIndeAttestationDate = $(element)
        .find(
          "#convdocundertaking_conversion_" +
            currentIndex +
            "_convdocdateofundertaking"
        )
        .val();

      var isConvUndertakingValid = true;

      // Skip validation based on custom condition
      if (
        $(element)
          .find(
            "#convdocundertaking_conversion_" +
              currentIndex +
              "_convdocundertaking"
          )
          .attr("data-should-validate") !== "1"
      ) {
        // return true; // Skip validation and continue to the next item // commented by anil for not in use and keeping the file validation here
        // Validate "Indemnity Bond" input field
        if (!convIndeBondFile) {
          isConvUndertakingValid = false;
          $(element)
            .find(
              "#convdocundertaking_conversion_" +
                currentIndex +
                "_convdocundertaking"
            )
            .siblings(".text-danger")
            .text("Undertaking file required."); // changed error text as per your note
        } else {
          if (!convIndeBondFile.name.endsWith(".pdf")) {
            isConvUndertakingValid = false;
            $(element)
              .find(
                "#convdocundertaking_conversion_" +
                  currentIndex +
                  "_convdocundertaking"
              )
              .siblings(".text-danger")
              .text("Only PDF files are allowed.");
          }
          // Validate file size (5MB limit)
          else if (convIndeBondFile.size > 5 * 1024 * 1024) {
            isConvUndertakingValid = false;
            $(element)
              .find(
                "#convdocundertaking_conversion_" +
                  currentIndex +
                  "_convdocundertaking"
              )
              .siblings(".text-danger")
              .text("File size must be less than 5MB.");
          } else {
            // If the file size is valid, clear the error message
            $(element)
              .find(
                "#convdocundertaking_conversion_" +
                  currentIndex +
                  "_convdocundertaking"
              )
              .siblings(".text-danger")
              .text("");
          }
        }
      }

      // Validate attestation date (No future dates)
      if (!conveIndeAttestationDate) {
        isConvUndertakingValid = false;
        $(element)
          .find(
            "#convdocundertaking_conversion_" +
              currentIndex +
              "_convdocdateofundertaking"
          )
          .siblings(".text-danger")
          .text("Date of attestation is required.");
      } else if (conveIndeAttestationDate > today) {
        isConvUndertakingValid = false;
        $(element)
          .find(
            "#convdocundertaking_conversion_" +
              currentIndex +
              "_convdocdateofundertaking"
          )
          .siblings(".text-danger")
          .text("Future date is not allowed.");
      } else {
        // If the attestation date is valid, clear the error message
        $(element)
          .find(
            "#convdocundertaking_conversion_" +
              currentIndex +
              "_convdocdateofundertaking"
          )
          .siblings(".text-danger")
          .text("");
      }

      // If validation fails, update the form validity status
      if (!isConvUndertakingValid) {
        isMandatoryConvDocumentsFormValid = false;
      }
    });

    // Loop through all .items inside #indemnityBond_repeater
    $("#convDocPropertyPhoto_repeater .items").each(function (index, element) {
      let currentIndex = $(this).data("index");
      var convPropertyBonaFide = $(element).find(
        "#convdocpropertyphoto_conversion_" +
          currentIndex +
          "_convdocpropertyphoto"
      )[0]?.files[0]; // File input

      var isConvPropertyBonaFideValid = true;

      // Skip validation based on custom condition
      if (
        $(element)
          .find(
            "#convdocpropertyphoto_conversion_" +
              currentIndex +
              "_convdocpropertyphoto"
          )
          .attr("data-should-validate") !== "1"
      ) {
        // If the file input should not be validated, skip further validation for this field
        // return true; // Skip validation and continue to the next item // commented by anil for not in use and keeping the file validation here
        // Validate "Indemnity Bond" input field
        if (!convPropertyBonaFide) {
          isConvPropertyBonaFideValid = false;
          $(element)
            .find(
              "#convdocpropertyphoto_conversion_" +
                currentIndex +
                "_convdocpropertyphoto"
            )
            .siblings(".text-danger")
            .text("Property photographs file required.");
        } else {
          if (!convPropertyBonaFide.name.endsWith(".pdf")) {
            isConvPropertyBonaFideValid = false;
            $(element)
              .find(
                "#convdocpropertyphoto_conversion_" +
                  currentIndex +
                  "_convdocpropertyphoto"
              )
              .siblings(".text-danger")
              .text("Only PDF files are allowed.");
          }
          // Validate file size (5MB limit)
          else if (convPropertyBonaFide.size > 5 * 1024 * 1024) {
            isConvPropertyBonaFideValid = false;
            $(element)
              .find(
                "#convdocpropertyphoto_conversion_" +
                  currentIndex +
                  "_convdocpropertyphoto"
              )
              .siblings(".text-danger")
              .text("File size must be less than 5MB.");
          } else {
            // If the file is valid, clear the error message
            $(element)
              .find(
                "#convdocpropertyphoto_conversion_" +
                  currentIndex +
                  "_convdocpropertyphoto"
              )
              .siblings(".text-danger")
              .text("");
          }
        }
      }

      // If validation fails, update the form validity status
      if (!isConvPropertyBonaFideValid) {
        isMandatoryConvDocumentsFormValid = false;
      }
    });

    return isMandatoryConvDocumentsFormValid;
  }

  $(document).ready(function () {
    var today = new Date().toISOString().split("T")[0];

    // Iterate through all elements if they have a data-index
    $("[data-index]").each(function () {
      var currentIndex = $(this).data("index");

      // Set max date for affidavit attestation date inputs
      $("#convDocIndemnityBond_repeater").on(
        "input change",
        "#convdocindemnitybond_conversion_" +
          currentIndex +
          "_convdocindemnitybonddateofattestation",
        function () {
          if ($(this).val() > today) {
            // $(this).val(""); // Clear future date
            $(this)
              .siblings(".text-danger")
              .text("Date cannot be in the future.");
          } else {
            $(this).siblings(".text-danger").text("");
          }
        }
      );

      // Set max date for indemnity bond attestation date inputs
      $("#indemnityBond_repeater").on(
        "input change",
        "#convdocundertaking_conversion_" +
          currentIndex +
          "_convdocdateofundertaking",
        function () {
          if ($(this).val() > today) {
            // $(this).val(""); // Clear future date
            $(this)
              .siblings(".text-danger")
              .text("Date cannot be in the future.");
          } else {
            $(this).siblings(".text-danger").text("");
          }
        }
      );

      // Apply max date on document load for existing fields
      $(
        "#convdocindemnitybond_conversion_" +
          currentIndex +
          "_convdocindemnitybonddateofattestation, #convdocundertaking_conversion_" +
          currentIndex +
          "_convdocdateofundertaking"
      ).attr("max", today);
    });
  });

  // Conversion Form 2 Field
  var convAttestedLetterFile = document.getElementById(
    "convDOcLastSubstitutionLetter"
  );
  var convAttestedLetterDate = document.getElementById("convDocSubLetterDate");

  var convContructionProofType = document.getElementById(
    "convDocContructionProofType"
  );
  var convConstructionProofFile = document.getElementById(
    "convDocProofOfConstruction"
  );
  var convContructionProofDate = document.getElementById(
    "convDocContructionProofDate"
  );
  var convContructionProofIssuing = document.getElementById(
    "convDocContructionProofIssuingAuthority"
  );

  var convPossessionProofType = document.getElementById(
    "convDocPossessionProofType"
  );
  var convPossessionProofFile = document.getElementById(
    "convDocProofOfPossession"
  );
  var convPossessionProofDate = document.getElementById(
    "convDocPossessionProofDate"
  );
  var convPossessionProofIssuing = document.getElementById(
    "convDocPossessionProofIssuingAuthority"
  );

  var convDocLeaseDeedFile = document.getElementById("convDocLeaseDeed");
  var convDocLeaseDeedDoEDate = document.getElementById("convDocLeaseDeedDoE");

  var convMandDocAdhaar = document.getElementById("convDocApplicantAadhaar");
  var convMandDocPan = document.getElementById("convDocApplicantPan");

  var convMandDocAffidavits = document.getElementById("convDocAffidavit");
  var convMandDocADateAttestation = document.getElementById(
    "convDocAffidavitsDateOfAttestation"
  );
  var convMandDocAttestedby = document.getElementById(
    "convDocAffidavitAttestedBy"
  );

  // Conversion Form 2 Error
  var convAttestedLetterFileError = document.getElementById(
    "convDOcLastSubstitutionLetterError"
  );
  var convAttestedLetterDateError = document.getElementById(
    "convDocSubLetterDateError"
  );

  var convContructionProofTypeError = document.getElementById(
    "convDocContructionProofTypeError"
  );
  var convConstructionProofFileError = document.getElementById(
    "convDocProofOfConstructionError"
  );
  var convContructionProofDateError = document.getElementById(
    "convDocContructionProofDateError"
  );
  var convContructionProofIssuingError = document.getElementById(
    "convDocContructionProofIssuingAuthorityError"
  );

  var convPossessionProofTypeError = document.getElementById(
    "convDocPossessionProofTypeError"
  );
  var convPossessionProofFileError = document.getElementById(
    "convDocProofOfPossessionError"
  );
  var convPossessionProofDateError = document.getElementById(
    "convDocPossessionProofDateError"
  );
  var convPossessionProofIssuingError = document.getElementById(
    "convDocPossessionProofIssuingAuthorityError"
  );

  var convDocLeaseDeedFileError = document.getElementById(
    "convDocLeaseDeedError"
  );
  var convDocLeaseDeedDoEDateError = document.getElementById(
    "convDocLeaseDeedDoEError"
  );

  var convMandDocAdhaarError = document.getElementById(
    "convDocApplicantAadhaarError"
  );
  var convMandDocPanError = document.getElementById("convDocApplicantPanError");

  var convMandDocAffidavitsError = document.getElementById(
    "convDocAffidavitError"
  );
  var convMandDocADateAttestationError = document.getElementById(
    "convDocAffidavitsDateOfAttestationError"
  );
  var convMandDocAttestedbyError = document.getElementById(
    "convDocAffidavitAttestedByError"
  );

  function validateConvAttestedLetterFile() {
    if (convAttestedLetterFile.files.length > 0) {
      var file = convAttestedLetterFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convAttestedLetterFileError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convAttestedLetterFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        convAttestedLetterFileError.textContent = "";
        return true;
      }
    } else {
      if (convAttestedLetterFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convAttestedLetterFileError.textContent =
        "Substitution/Mutation letter is required.";
      return false;
    }
  }

  function validateConvAttestedLetterDate() {
    var convAttestedLetterDateValue = convAttestedLetterDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (convAttestedLetterDateValue === "") {
      convAttestedLetterDateError.textContent =
        "Date of attested letter is required.";
      convAttestedLetterDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (convAttestedLetterDateValue > today) {
      convAttestedLetterDateError.textContent =
        "Date of attested letter cannot be in the future.";
      convAttestedLetterDateError.style.display = "block";
      convAttestedLetterDate.value = ""; // Clear invalid input
      return false;
    }

    convAttestedLetterDateError.style.display = "none";
    return true;
  }

  function validateConvContructionProofType() {
    var convContructionProofTypeValue = convContructionProofType.value.trim();

    if (convContructionProofTypeValue === "") {
      convContructionProofTypeError.textContent =
        "Proof of construction is required.";
      convContructionProofTypeError.style.display = "block";
      return false;
    } else {
      convContructionProofTypeError.style.display = "none";
      return true;
    }
  }

  function validateConvConstructionProofFile() {
    if (convConstructionProofFile.files.length > 0) {
      var file = convConstructionProofFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convConstructionProofFileError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convConstructionProofFileError.textContent =
          "Only PDF files are allowed.";
        return false;
      } else {
        convConstructionProofFileError.textContent = "";
        return true;
      }
    } else {
      if (convConstructionProofFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convConstructionProofFileError.textContent =
        "Proof of construction PDF is required.";
      return false;
    }
  }

  function validateConvContructionProofDate() {
    var convContructionProofDateValue = convContructionProofDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (convContructionProofDateValue === "") {
      convContructionProofDateError.textContent =
        "Proof of construction date is required.";
      convContructionProofDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (convContructionProofDateValue > today) {
      convContructionProofDateError.textContent =
        "Proof of construction date cannot be in the future.";
      convContructionProofDateError.style.display = "block";
      convContructionProofDate.value = ""; // Clear invalid input
      return false;
    }

    convContructionProofDateError.style.display = "none";
    return true;
  }

  function validateConvContructionProofIssuing() {
    var convContructionProofIssuingValue =
      convContructionProofIssuing.value.trim();
    if (convContructionProofIssuingValue === "") {
      convContructionProofIssuingError.textContent =
        "Issuing authority is required.";
      convContructionProofIssuingError.style.display = "block";
      return false;
    }
    var convContructionAlpha = /^[A-Za-z\s.-]+$/;
    if (!convContructionAlpha.test(convContructionProofIssuingValue)) {
      convContructionProofIssuingError.textContent =
        "Issuing authority must contain letters only.";
      convContructionProofIssuingError.style.display = "block";
      return false;
    } else {
      convContructionProofIssuingError.style.display = "none";
      return true;
    }
  }

  function validateConvPossessionProofType() {
    var validateConvPossessionProofTypeValue =
      convPossessionProofType.value.trim();

    if (validateConvPossessionProofTypeValue === "") {
      convPossessionProofTypeError.textContent =
        "Proof of possession is required.";
      convPossessionProofTypeError.style.display = "block";
      return false;
    } else {
      convPossessionProofTypeError.style.display = "none";
      return true;
    }
  }

  function validateConvPossessionProofFile() {
    if (convPossessionProofFile.files.length > 0) {
      var file = convPossessionProofFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convPossessionProofFileError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convPossessionProofFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        convPossessionProofFileError.textContent = "";
        return true;
      }
    } else {
      if (convPossessionProofFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convPossessionProofFileError.textContent =
        "Proof of possession PDF is required.";
      return false;
    }
  }

  function validateConvPossessionProofDate() {
    var convPossessionProofDateValue = convPossessionProofDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (convPossessionProofDateValue === "") {
      convPossessionProofDateError.textContent =
        "Proof of possession date is required.";
      convPossessionProofDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (convPossessionProofDateValue > today) {
      convPossessionProofDateError.textContent =
        "Proof of possession date cannot be in the future.";
      convPossessionProofDateError.style.display = "block";
      convPossessionProofDate.value = ""; // Clear invalid input
      return false;
    }

    convPossessionProofDateError.style.display = "none";
    return true;
  }

  function validateConvPossessionProofIssuing() {
    var convPossessionProofIssuingValue =
      convPossessionProofIssuing.value.trim();
    if (convPossessionProofIssuingValue === "") {
      convPossessionProofIssuingError.textContent =
        "Issuing authority is required.";
      convPossessionProofIssuingError.style.display = "block";
      return false;
    }
    var convContructionAlpha = /^[A-Za-z\s.-]+$/;
    if (!convContructionAlpha.test(convPossessionProofIssuingValue)) {
      convPossessionProofIssuingError.textContent =
        "Issuing authority must contain letters only.";
      convPossessionProofIssuingError.style.display = "block";
      return false;
    } else {
      convPossessionProofIssuingError.style.display = "none";
      return true;
    }
  }

  function validateConvDocLeaseDeedFile() {
    if (convDocLeaseDeedFile.files.length > 0) {
      var file = convDocLeaseDeedFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convDocLeaseDeedFileError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convDocLeaseDeedFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        convDocLeaseDeedFileError.textContent = "";
        return true;
      }
    } else {
      if (convDocLeaseDeedFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convDocLeaseDeedFileError.textContent =
        "Registered lease deed is required.";
      return false;
    }
  }

  function validateConvDocLeaseDeedDoEDate() {
    var convDocLeaseDeedDoEDateValue = convDocLeaseDeedDoEDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (convDocLeaseDeedDoEDateValue === "") {
      convDocLeaseDeedDoEDateError.textContent =
        "Date of execution is required.";
      convDocLeaseDeedDoEDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (convDocLeaseDeedDoEDateValue > today) {
      convDocLeaseDeedDoEDateError.textContent =
        "Date of execution cannot be in the future.";
      convDocLeaseDeedDoEDateError.style.display = "block";
      convDocLeaseDeedDoEDate.value = ""; // Clear invalid input
      return false;
    }

    convDocLeaseDeedDoEDateError.style.display = "none";
    return true;
  }

  function validateConvMandDocAdhaar() {
    if (convMandDocAdhaar.files.length > 0) {
      var file = convMandDocAdhaar.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convMandDocAdhaarError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convMandDocAdhaarError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        convMandDocAdhaarError.textContent = "";
        return true;
      }
    } else {
      if (convMandDocAdhaar.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convMandDocAdhaarError.textContent = "Aadhaar PDF is required.";
      return false;
    }
  }

  function validateConvMandDocPan() {
    if (convMandDocPan.files.length > 0) {
      var file = convMandDocPan.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convMandDocPanError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convMandDocPanError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        convMandDocPanError.textContent = "";
        return true;
      }
    } else {
      if (convMandDocPan.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convMandDocPanError.textContent = "PAN PDF is required.";
      return false;
    }
  }

  function validateConvMandDocAffidavits() {
    if (convMandDocAffidavits.files.length > 0) {
      var file = convMandDocAffidavits.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convMandDocAffidavitsError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        convMandDocAffidavitsError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        convMandDocAffidavitsError.textContent = "";
        return true;
      }
    } else {
      if (convMandDocAffidavits.getAttribute("data-should-validate") == 1) {
        return true;
      }
      convMandDocAffidavitsError.textContent =
        "Court affidavit PDF is required.";
      return false;
    }
  }

  function validateConvMandDocADateAttestation() {
    var convMandDocADateAttestationValue =
      convMandDocADateAttestation.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (convMandDocADateAttestationValue === "") {
      convMandDocADateAttestationError.textContent =
        "Date of attestation is required.";
      convMandDocADateAttestationError.style.display = "block";
      return false;
    }

    // Future date validation
    if (convMandDocADateAttestationValue > today) {
      convMandDocADateAttestationError.textContent =
        "Date of attestation cannot be in the future.";
      convMandDocADateAttestationError.style.display = "block";
      convMandDocADateAttestation.value = ""; // Clear invalid input
      return false;
    }

    convMandDocADateAttestationError.style.display = "none";
    return true;
  }

  function validateConvMandDocAttestedby() {
    var convMandDocAttestedbyValue = convMandDocAttestedby.value.trim();
    if (convMandDocAttestedbyValue === "") {
      convMandDocAttestedbyError.textContent = "Attested by is required.";
      convMandDocAttestedbyError.style.display = "block";
      return false;
    }
    var convAttestedbyAlpha = /^[A-Za-z\s.]+$/;
    if (!convAttestedbyAlpha.test(convMandDocAttestedbyValue)) {
      convMandDocAttestedbyError.textContent =
        "Attested by must contain letters only.";
      convMandDocAttestedbyError.style.display = "block";
      return false;
    } else {
      convMandDocAttestedbyError.style.display = "none";
      return true;
    }
  }

  function validateForm2Conv() {
    var isMandatoryConvDocumentsFormValid =
      validateMandatoryConvDocumentsForm();
    var isConvAttestedLetterFileValid = validateConvAttestedLetterFile();
    var isConvAttestedLetterDateValid = validateConvAttestedLetterDate();
    var isConvContructionProofType = validateConvContructionProofType();
    var isConvConstructionProofFile = validateConvConstructionProofFile();
    var isConvContructionProofDate = validateConvContructionProofDate();
    var isConvContructionProofIssuing = validateConvContructionProofIssuing();
    var isConvPossessionProofType = validateConvPossessionProofType();
    var isConvPossessionProofFile = validateConvPossessionProofFile();
    var isConvPossessionProofDate = validateConvPossessionProofDate();
    var isConvPossessionProofIssuing = validateConvPossessionProofIssuing();
    var isConvDocLeaseDeedFile = validateConvDocLeaseDeedFile();
    var isConvDocLeaseDeedDoEDate = validateConvDocLeaseDeedDoEDate();
    var isConvMandDocAdhaar = validateConvMandDocAdhaar();
    var isConvMandDocPan = validateConvMandDocPan();
    var isConvMandDocAffidavits = validateConvMandDocAffidavits();
    var isConvMandDocADateAttestation = validateConvMandDocADateAttestation();
    var isConvMandDocAttestedby = validateConvMandDocAttestedby();

    return (
      isMandatoryConvDocumentsFormValid &&
      isConvAttestedLetterFileValid &&
      isConvAttestedLetterDateValid &&
      isConvContructionProofType &&
      isConvConstructionProofFile &&
      isConvContructionProofDate &&
      isConvContructionProofIssuing &&
      isConvPossessionProofType &&
      isConvPossessionProofFile &&
      isConvPossessionProofDate &&
      isConvPossessionProofIssuing &&
      isConvDocLeaseDeedFile &&
      isConvDocLeaseDeedDoEDate &&
      isConvMandDocAdhaar &&
      isConvMandDocPan &&
      isConvMandDocAffidavits &&
      isConvMandDocADateAttestation &&
      isConvMandDocAttestedby
    );
  }

  // conversion step 3 form validation

  var convLesseeAliveAffidevitFile = document.getElementById(
    "convOptLesseeAliveAffidevit"
  );
  var convLesseeAliveAffidevitDate = document.getElementById(
    "convOptLesseeAliveAffidevitDocumentDate"
  );
  var convLesseeAliveAttestedby = document.getElementById(
    "convOptLesseeAliveAffidevitAttestedby"
  );

  var convYesLeaseDeedLost = document.getElementById("isLeaseDeedLostYes");
  var convNoLeaseDeedLost = document.getElementById("isLeaseDeedLostNo");
  var convLeaseLostAffidevitFile = document.getElementById(
    "convOptLeaseLostAffidevit"
  );
  var convLeaseLostAffidevitDate = document.getElementById(
    "convLeaseLostAffidevitDocumentDate"
  );
  var convLeaseLostAttestedBy = document.getElementById(
    "convLeaseLostAffidevitAttestedBy"
  );
  var convLeaseLostNoticeFile = document.getElementById(
    "convOptLeaseLostPublicNotice"
  );
  var convLeaseLostNameOfNewspaper = document.getElementById(
    "convOptLeaseLostPublicNoticeNameOfNewspaper"
  );

  var convAgreeConsentCheck = document.getElementById("agreeConsentConversion");

  // Conv step 3 Erros
  var convLesseeAliveAffidevitFileError = document.getElementById(
    "convOptLesseeAliveAffidevitError"
  );
  var convLesseeAliveAffidevitDateError = document.getElementById(
    "convOptLesseeAliveAffidevitDocumentDateError"
  );
  var convLesseeAliveAttestedbyError = document.getElementById(
    "convOptLesseeAliveAffidevitAttestedbyError"
  );

  var convLeaseLostAffidevitFileError = document.getElementById(
    "convOptLeaseLostAffidevitError"
  );
  var convLeaseLostAffidevitDateError = document.getElementById(
    "convLeaseLostAffidevitDocumentDateError"
  );
  var convLeaseLostAttestedByError = document.getElementById(
    "convLeaseLostAffidevitAttestedByError"
  );
  var convLeaseLostNoticeFileError = document.getElementById(
    "convOptLeaseLostPublicNoticeError"
  );
  var convLeaseLostNameOfNewspaperError = document.getElementById(
    "convOptLeaseLostPublicNoticeNameOfNewspaperError"
  );

  var convAgreeConsentCheckError = document.getElementById(
    "agreeConsentConversionError"
  );

  function validateConvLesseeAliveAffidevitGroup() {
    const fileInput = convLesseeAliveAffidevitFile;
    const dateInput = convLesseeAliveAffidevitDate;
    const attestedInput = convLesseeAliveAttestedby;

    const fileSelected = fileInput.files.length > 0;
    const shouldValidateFile =
      fileInput.getAttribute("data-should-validate") == "1";

    // Determine if we should trigger full validation
    const shouldTriggerFullValidation =
      fileSelected ||
      shouldValidateFile ||
      dateInput.value.trim() !== "" ||
      attestedInput.value.trim() !== "";

    let isAliveLesseeValid = true;

    // --- FILE VALIDATION ---
    if (fileSelected) {
      const file = fileInput.files[0];
      if (file.size > 5 * 1024 * 1024) {
        convLesseeAliveAffidevitFileError.textContent =
          "File size must be less than 5 MB.";
        isAliveLesseeValid = false;
      } else if (!file.name.endsWith(".pdf")) {
        convLesseeAliveAffidevitFileError.textContent =
          "Only PDF files are allowed.";
        isAliveLesseeValid = false;
      } else {
        convLesseeAliveAffidevitFileError.textContent = "";
      }
    } else if (!shouldValidateFile && shouldTriggerFullValidation) {
      convLesseeAliveAffidevitFileError.textContent =
        "Affidavit PDF is required.";
      isAliveLesseeValid = false;
    } else {
      convLesseeAliveAffidevitFileError.textContent = "";
    }

    // --- DATE VALIDATION ---
    const dateVal = dateInput.value.trim();
    const today = new Date().toISOString().split("T")[0];
    if (shouldTriggerFullValidation) {
      if (dateVal === "") {
        convLesseeAliveAffidevitDateError.textContent =
          "Date of document is required.";
        convLesseeAliveAffidevitDateError.style.display = "block";
        isAliveLesseeValid = false;
      } else if (dateVal > today) {
        convLesseeAliveAffidevitDateError.textContent =
          "Date of document cannot be in the future.";
        convLesseeAliveAffidevitDateError.style.display = "block";
        dateInput.value = "";
        isAliveLesseeValid = false;
      } else {
        convLesseeAliveAffidevitDateError.style.display = "none";
      }
    } else {
      convLesseeAliveAffidevitDateError.textContent = "";
      convLesseeAliveAffidevitDateError.style.display = "none";
    }

    // --- ATTESTED BY VALIDATION ---
    const attestedVal = attestedInput.value.trim();
    if (shouldTriggerFullValidation) {
      if (attestedVal === "") {
        convLesseeAliveAttestedbyError.textContent = "Attested by is required.";
        convLesseeAliveAttestedbyError.style.display = "block";
        isAliveLesseeValid = false;
      } else if (!/^[A-Za-z\s.]+$/.test(attestedVal)) {
        convLesseeAliveAttestedbyError.textContent =
          "Attested by must contain letters only.";
        convLesseeAliveAttestedbyError.style.display = "block";
        isAliveLesseeValid = false;
      } else {
        convLesseeAliveAttestedbyError.style.display = "none";
      }
    } else {
      convLesseeAliveAttestedbyError.textContent = "";
      convLesseeAliveAttestedbyError.style.display = "none";
    }

    return isAliveLesseeValid;
  }

  function validateConvYesLeaseDeedLostFields() {
    const alphaRegex = /^[A-Za-z\s.]+$/;
    const CourtMaxFileSize = 5 * 1024 * 1024; // 5MB
    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

    if (convYesLeaseDeedLost.checked) {
      let isconvYesLeaseDeedLostValid = true;

      // 1. Validate Lease deed Affidevit File
      if (
        convLeaseLostAffidevitFile.getAttribute("data-should-validate") != "1"
      ) {
        if (
          convLeaseLostAffidevitFile.files.length === 0 ||
          convLeaseLostAffidevitFile.value.trim() === ""
        ) {
          convLeaseLostAffidevitFileError.textContent =
            "Lease deed affidavit PDF file is required.";
          convLeaseLostAffidevitFileError.style.display = "block";
          isconvYesLeaseDeedLostValid = false;
        } else {
          const file = convLeaseLostAffidevitFile.files[0];

          // Check if the file is a PDF
          if (file.type !== "application/pdf") {
            convLeaseLostAffidevitFileError.textContent =
              "Only PDF files are allowed.";
            convLeaseLostAffidevitFileError.style.display = "block";
            isconvYesLeaseDeedLostValid = false;
          }
          // Check if the file size is within the allowed limit
          else if (file.size > CourtMaxFileSize) {
            convLeaseLostAffidevitFileError.textContent =
              "PDF size must be less than 5MB.";
            convLeaseLostAffidevitFileError.style.display = "block";
            isconvYesLeaseDeedLostValid = false;
          } else {
            convLeaseLostAffidevitFileError.style.display = "none";
          }
        }
      } else {
        convLeaseLostAffidevitFileError.style.display = "none";
      }

      // 2. Validate Lease deed Affidevit Date
      if (convLeaseLostAffidevitDate.value.trim() === "") {
        convLeaseLostAffidevitDateError.textContent =
          "Lease deed affidavit date is required.";
        convLeaseLostAffidevitDateError.style.display = "block";
        isconvYesLeaseDeedLostValid = false;
      } else if (convLeaseLostAffidevitDate.value.trim() > today) {
        convLeaseLostAffidevitDateError.textContent =
          "Lease deed affidavit cannot be in the future.";
        convLeaseLostAffidevitDateError.style.display = "block";
        convLeaseLostAffidevitDate.value = ""; // Clear invalid input
        isconvYesLeaseDeedLostValid = false;
      } else {
        convLeaseLostAffidevitDateError.style.display = "none";
      }

      // 3. Validate Attested By
      if (convLeaseLostAttestedBy.value.trim() === "") {
        convLeaseLostAttestedByError.textContent = "Attested by is required.";
        convLeaseLostAttestedByError.style.display = "block";
        isconvYesLeaseDeedLostValid = false;
      } else if (!alphaRegex.test(convLeaseLostAttestedBy.value.trim())) {
        convLeaseLostAttestedByError.textContent =
          "Attested by must contain letters only.";
        convLeaseLostAttestedByError.style.display = "block";
        isconvYesLeaseDeedLostValid = false;
      } else {
        convLeaseLostAttestedByError.style.display = "none";
      }

      // 4. Validate Public Notice File
      if (convLeaseLostNoticeFile.getAttribute("data-should-validate") != "1") {
        if (
          convLeaseLostNoticeFile.files.length === 0 ||
          convLeaseLostNoticeFile.value.trim() === ""
        ) {
          convLeaseLostNoticeFileError.textContent =
            "Public notice PDF is required.";
          convLeaseLostNoticeFileError.style.display = "block";
          isconvYesLeaseDeedLostValid = false;
        } else {
          const file = convLeaseLostNoticeFile.files[0];

          // Check if the file is a PDF
          if (file.type !== "application/pdf") {
            convLeaseLostNoticeFileError.textContent =
              "Only PDF files are allowed.";
            convLeaseLostNoticeFileError.style.display = "block";
            isconvYesLeaseDeedLostValid = false;
          }
          // Check if the file size is within the allowed limit
          else if (file.size > CourtMaxFileSize) {
            convLeaseLostNoticeFileError.textContent =
              "PDF size must be less than 5MB.";
            convLeaseLostNoticeFileError.style.display = "block";
            isconvYesLeaseDeedLostValid = false;
          } else {
            convLeaseLostNoticeFileError.style.display = "none";
          }
        }
      } else {
        convLeaseLostNoticeFileError.style.display = "none";
      }

      // 5. Validate Name of Newspaper
      if (convLeaseLostNameOfNewspaper.value.trim() === "") {
        convLeaseLostNameOfNewspaperError.textContent =
          "Name of newspaper is required.";
        convLeaseLostNameOfNewspaperError.style.display = "block";
        isconvYesLeaseDeedLostValid = false;
      } else if (!alphaRegex.test(convLeaseLostNameOfNewspaper.value.trim())) {
        convLeaseLostNameOfNewspaperError.textContent =
          "Newspaper name must contain letters only.";
        convLeaseLostNameOfNewspaperError.style.display = "block";
        isconvYesLeaseDeedLostValid = false;
      } else {
        convLeaseLostNameOfNewspaperError.style.display = "none";
      }

      return isconvYesLeaseDeedLostValid;
    }

    return true; // If "No" is selected, skip validation
  }

  function validateConvAgreeConsent() {
    if (!convAgreeConsentCheck.checked) {
      convAgreeConsentCheckError.textContent =
        "Please accept terms & conditions.";
      convAgreeConsentCheckError.style.display = "block";
      return false;
    } else {
      convAgreeConsentCheckError.style.display = "none";
      return true;
    }
  }

  function validateForm3Conv() {
    var isConvLesseeAliveAffidevitGroup =
      validateConvLesseeAliveAffidevitGroup();
    var isConvYesLeaseDeedLostFields = validateConvYesLeaseDeedLostFields();
    var isConvAgreeConsent = validateConvAgreeConsent();
    var isAppOtherDoc = validateAppOtherDoc("CONVERSION-3");
    let isPoAValid = validatePOADoc("CONVERSION-3");

    return (
      isConvLesseeAliveAffidevitGroup &&
      isConvYesLeaseDeedLostFields &&
      isConvAgreeConsent &&
      isAppOtherDoc &&
      isPoAValid
    );
  }