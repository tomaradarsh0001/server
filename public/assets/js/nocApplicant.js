// for storing first step of noc details - Lalit Tiwari (17/march/2025)
function noc(propertyid, propertyStatus, callback) {
  var updateId = $("input[name='updateId']").val();
  var statusofapplicant = $("#statusofapplicant").val();
  var nocNameApp = $("input[name='nocNameApp']").val();
  var nocGenderApp = $("input[name='nocGenderApp']").val();
  var nocDateOfBirth = $("input[name='nocDateOfBirth']").val();
  var nocAgeApp = $("input[name='nocAgeApp']").val();
  var nocFathernameApp = $("input[name='nocFathernameApp']").val();

  var nocAadharApp = $("input[name='nocAadharApp']").val();
  var nocPanApp = $("input[name='nocPanApp']").val();
  var nocMobilenumberApp = $("input[name='nocMobilenumberApp']").val();

  var conveyanceDeedName = $("input[name='conveyanceDeedName']").val();
  var conveyanceExecutedOn = $("input[name='conveyanceExecutedOn']").val();

  var conveyanceRegnoDeed = $("input[name='conveyanceRegnoDeed']").val();
  var conveyanceBookNoDeed = $("input[name='conveyanceBookNoDeed']").val();
  var conveyanceVolumeNo = $("input[name='conveyanceVolumeNo']").val();
  var conveyancePagenoFrom = $("input[name='conveyancePagenoFrom']").val();
  var conveyancePagenoTo = $("input[name='conveyancePagenoTo']").val();
  var conveyanceRegDate = $("input[name='conveyanceRegDate']").val();
  var conveyanceConAppDate = $("input[name='conveyanceConAppDate']").val();
  var coapplicants = {};
  var formData = new FormData();
  formData.append("_token", $('meta[name="csrf-token"]').attr("content")); // CSRF token
  formData.append("updateId", updateId);
  formData.append("propertyid", propertyid);
  formData.append("propertyStatus", propertyStatus);
  formData.append("statusofapplicant", statusofapplicant);
  formData.append("nocNameApp", nocNameApp);
  formData.append("nocGenderApp", nocGenderApp);
  formData.append("nocDateOfBirth", nocDateOfBirth);
  formData.append("nocAgeApp", nocAgeApp);
  formData.append("nocFathernameApp", nocFathernameApp);
  formData.append("nocAadharApp", nocAadharApp);
  formData.append("nocPanApp", nocPanApp);
  formData.append("nocMobilenumberApp", nocMobilenumberApp);
  formData.append("conveyanceDeedName", conveyanceDeedName);
  formData.append("conveyanceExecutedOn", conveyanceExecutedOn);
  formData.append("conveyanceRegnoDeed", conveyanceRegnoDeed);
  formData.append("conveyanceBookNoDeed", conveyanceBookNoDeed);
  formData.append("conveyanceVolumeNo", conveyanceVolumeNo);
  formData.append("conveyancePagenoFrom", conveyancePagenoFrom);
  formData.append("conveyancePagenoTo", conveyancePagenoTo);
  formData.append("conveyanceRegDate", conveyanceRegDate);
  formData.append("conveyanceConAppDate", conveyanceConAppDate);

  // Iterate over co-applicant inputs and add text fields to formData
  $("input[name^='noccoapplicant'], select[name^='noccoapplicant']").each(
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
    url: baseUrl + "/noc-step-first",
    type: "POST",
    dataType: "JSON",
    data: formData,
    processData: false,
    contentType: false,
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


// NOC form step 1
// NOC Co-applicant
// ✅ not apply 'blur change' on date inputs for final validation (after manual entry) by anil 27-03-2025
$(document).on(
  "blur change",
  "#conveyanceRepeater .coapplicant-block input:not([type='date']), #conveyanceRepeater .coapplicant-block select, #conveyanceRepeater .repeater-add-btn",
  function () {
    coapplicantNocRepeaterForm();
  }
);

// ✅ Only apply 'blur' to date inputs for final validation (after manual entry) by anil 27-03-2025
$(document).on(
  "blur",
  "#conveyanceRepeater .coapplicant-block input[type='date']",
  function () {
    coapplicantNocRepeaterForm();
  }
);

// Add a listener to the date of birth field to handle changes when it's cleared
$(document).on(
  "change",
  "#conveyanceRepeater .coapplicant-block input[type='date']",
  function () {
    var nocCoDobInput = $(this);
    var agenocField = nocCoDobInput
      .closest(".coapplicant-block")
      .find("input[id$='_age']");

    // If the date of birth is cleared, clear the age field as well
    if (!nocCoDobInput.val()) {
      agenocField.val(""); // Clear the age field
    }
  }
);

// ✅ Calculate age for all date inputs on page load and set value in ageConField added by anil on 28-03-2025
$("#conveyanceRepeater .coapplicant-block").each(function () {
  var nocCoDobInput = $(this).find("input[id$='_dateofbirth']");
  var agenocField = $(this).find("input[id$='_age']");

  var nocDobValue = nocCoDobInput.val();
  if (nocDobValue) {
    var dob = new Date(nocDobValue);
    var age = nocCalculateAge(dob);
    agenocField.val(age);
  }
});

function coapplicantNocRepeaterForm() {
  var isCoapplicantNocValid = true;

  $("#conveyanceRepeater .coapplicant-block").each(function (index, element) {
    let currentIndex = $(this).data("index");
    var nocCoName = $(element)
      .find("#noccoapplicant_" + currentIndex + "_name")
      .val();
    var nocCoGender = $(element)
      .find("#noccoapplicant_" + currentIndex + "_gender")
      .val();
    var nocCoDobInput = $(element).find(
      "#noccoapplicant_" + currentIndex + "_dateofbirth"
    );
    var nocCoRelation = $(element)
      .find("#noccoapplicant_" + currentIndex + "_fathername")
      .val();
    var nocCoAdhaarNumber = $(element)
      .find("#noccoapplicant_" + currentIndex + "_aadharnumber")
      .val();
    var nocCoPanNumber = $(element)
      .find("#noccoapplicant_" + currentIndex + "_pannumber")
      .val();
    var nocCoMobileNumber = $(element)
      .find("#noccoapplicant_" + currentIndex + "_mobilenumber")
      .val();
    var nocCoAdhaarFileInput = $(element).find(
      "#noccoapplicant_" + currentIndex + "_aadhaarfile"
    );
    var nocCoAdhaarFile =
      nocCoAdhaarFileInput.length > 0 &&
      nocCoAdhaarFileInput[0].files.length > 0
        ? nocCoAdhaarFileInput[0].files[0]
        : null;
    var nocCoPanFileInput = $(element).find(
      "#noccoapplicant_" + currentIndex + "_panfile"
    );
    var nocCoPanFile =
      nocCoPanFileInput.length > 0 && nocCoPanFileInput[0].files.length > 0
        ? nocCoPanFileInput[0].files[0]
        : null;
    var nocCoPhotoFileInput = $(element).find(
      "#noccoapplicant_" + currentIndex + "_photo"
    );
    var nocCoPhotoFile =
      nocCoPhotoFileInput.length > 0 && nocCoPhotoFileInput[0].files.length > 0
        ? nocCoPhotoFileInput[0].files[0]
        : null;

    var shouldValidateNocAadhaar = nocCoAdhaarFileInput.attr(
      "data-should-validate"
    );
    var shouldValidateNocPan = nocCoPanFileInput.attr("data-should-validate");
    var shouldValidatePhoto = nocCoPhotoFileInput.attr("data-should-validate"); // get value of data-should-validate

    // ✅ Ensure max date is set dynamically
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    nocCoDobInput.attr("max", today); // Set max date to today

    var nocCoDob = nocCoDobInput.val();
    var agenocField = $(element).find(
      "#noccoapplicant_" + currentIndex + "_age"
    );

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

    // Remove previous error messages
    $(this).find(".error-message").text("");

    // Future Date Validation for DOB
    if (nocCoDob) {
      var dob = new Date(nocCoDob);
      var todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);

      if (dob > todayDate) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Date of birth cannot be in the future.",
          "#noccoapplicant_" + currentIndex + "_dateofbirth"
        );
        nocCoDobInput.val(""); // Clear invalid input
      } else {
        var age = nocCalculateAge(dob);
        agenocField.val(age);
      }
    }

    // Check if any field is filled
    var isAnynocFieldFilled =
      nocCoName ||
      nocCoGender ||
      nocCoDob ||
      nocCoRelation ||
      nocCoAdhaarNumber ||
      nocCoAdhaarFile ||
      nocCoPanNumber ||
      nocCoPanFile ||
      nocCoMobileNumber ||
      nocCoPhotoFile;

    if (isAnynocFieldFilled) {
      // If at least one field is filled, make all fields mandatory
      if (!nocCoName) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Name is required.",
          "#noccoapplicant_" + currentIndex + "_name"
        );
      }
      if (!nocCoGender) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Gender is required.",
          "#noccoapplicant_" + currentIndex + "_gender"
        );
      }
      if (!nocCoDob) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Date of birth is required.",
          "#noccoapplicant_" + currentIndex + "_dateofbirth"
        );
      }
      if (!nocCoRelation) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Relation is required.",
          "#noccoapplicant_" + currentIndex + "_fathername"
        );
      }
      // Validate aadhaar number (example: 12-digit number)
      if (!nocCoAdhaarNumber) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Aadhaar number is required.",
          "#noccoapplicant_" + currentIndex + "_aadharnumber"
        );
      } else if (!/^\d{12}$/.test(nocCoAdhaarNumber)) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Aadhaar number must be 12 digits.",
          "#noccoapplicant_" + currentIndex + "_aadharnumber"
        );
      }
      // Check if file exists and its size for aadhaar file
      // aadhaar file validation if shouldValidateAadhaar !== "1" cahnged by anil on 22-04-2025 for draft and edit
      if (shouldValidateNocAadhaar !== "1") {
        if (!nocCoAdhaarFile) {
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "Aadhaar PDF is required.",
            "#noccoapplicant_" + currentIndex + "_aadhaarfile"
          );
        } else if (nocCoAdhaarFile.size > 5 * 1024 * 1024) {
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "Aadhaar file size must be less than 5MB.",
            "#noccoapplicant_" + currentIndex + "_aadhaarfile"
          );
        } else if (!nocCoAdhaarFile.name.endsWith(".pdf")) {
          // Check if the file is not a PDF
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "Only PDF files are allowed.",
            "#noccoapplicant_" + currentIndex + "_aadhaarfile"
          );
        }
      }
      // Validate PAN number (example: format ABCDE1234F)
      if (!nocCoPanNumber) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "PAN number is required.",
          "#noccoapplicant_" + currentIndex + "_pannumber"
        );
      } else if (!panRegex.test(nocCoPanNumber.toUpperCase())) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Invalid PAN number format.",
          "#noccoapplicant_" + currentIndex + "_pannumber"
        );
      }
      // Check if file exists and its size for PAN file
      // PAN file validation if shouldValidatePan !== "1" cahnged by anil on 22-04-2025 for draft and edit
      if (shouldValidateNocPan !== "1") {
        if (!nocCoPanFile) {
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "PAN PDF is required.",
            "#noccoapplicant_" + currentIndex + "_panfile"
          );
        } else if (nocCoPanFile.size > 5 * 1024 * 1024) {
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "PAN file size must be less than 5MB.",
            "#noccoapplicant_" + currentIndex + "_panfile"
          );
        } else if (!nocCoPanFile.name.endsWith(".pdf")) {
          // Check if the file is not a PDF
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "Only PDF files are allowed.",
            "#noccoapplicant_" + currentIndex + "_panfile"
          );
        }
      }
      // if (!nocCoPanFile) {
      //   isCoapplicantNocValid = false;
      //   showErrorMessage(element, "PAN PDF is required.", "#noccoapplicant_" + currentIndex + "_panfile");
      // } else if (nocCoPanFile && nocCoPanFile.size > 5 * 1024 * 1024) {
      //   // 5MB limit for PAN file
      //   isCoapplicantNocValid = false;
      //   showErrorMessage(element, "PAN file size must be less than 5MB.", "#noccoapplicant_" + currentIndex + "_panfile");
      // }
      // Validate mobile number (example: 10-digit number)
      if (!nocCoMobileNumber) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Mobile number is required.",
          "#noccoapplicant_" + currentIndex + "_mobilenumber"
        );
      } else if (!/^\d{10}$/.test(nocCoMobileNumber)) {
        isCoapplicantNocValid = false;
        showErrorMessage(
          element,
          "Mobile number must be 10 digits.",
          "#noccoapplicant_" + currentIndex + "_mobilenumber"
        );
      }
      // Photo validation
      if (shouldValidatePhoto !== "1") {
        if (!nocCoPhotoFile) {
          isCoapplicantNocValid = false;
          showErrorMessage(
            element,
            "Co-applicant passport size photo is required.",
            "#noccoapplicant_" + currentIndex + "_photo"
          );
        } else {
          var nocCoPhotoFileName = nocCoPhotoFile.name;
          var nocCoPhotoFileExtension = nocCoPhotoFileName
            .split(".")
            .pop()
            .toLowerCase();
          var nocCoPhotoValidExtensions = ["jpg", "jpeg", "png"];

          if (!nocCoPhotoValidExtensions.includes(nocCoPhotoFileExtension)) {
            isCoapplicantNocValid = false;
            showErrorMessage(
              element,
              "Only .jpg, .jpeg, and .png formats are allowed.",
              "#noccoapplicant_" + currentIndex + "_photo"
            );
            $(element)
              .find("#noccoapplicant_" + currentIndex + "_photo")
              .val(""); // Reset file input
          } else if (nocCoPhotoFile.size > 102400) {
            isCoapplicantNocValid = false;
            showErrorMessage(
              element,
              "Passport photo size must be less than 100KB.",
              "#noccoapplicant_" + currentIndex + "_photo"
            );
          }
        }
      }
    }
  });

  return isCoapplicantNocValid;
}

// function to calculate age
function nocCalculateAge(dob) {
  var today = new Date();
  var age = today.getFullYear() - dob.getFullYear();
  var m = today.getMonth() - dob.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return age;
}

function showErrorMessage(form, message, selector) {
  var inputField = $(form).find(selector);
  var errorMessageSpan = inputField.siblings(".error-message");
  errorMessageSpan.text(message).show();
}

var nocApplicantStatus = document.getElementById("statusofapplicant");
var nocExecutedName = document.getElementById("conveyanceDeedName");
var nocDateExecutedOn = document.getElementById("conveyanceExecutedOn");
var nocRegNo = document.getElementById("conveyanceRegnoDeed");
var nocBookno = document.getElementById("conveyanceBookNoDeed");
var nocVolumeno = document.getElementById("conveyanceVolumeNo");
var nocPagenoFrom = document.getElementById("conveyancePagenoFrom");
var nocPagenoTo = document.getElementById("conveyancePagenoTo");
var nocRegDate = document.getElementById("conveyanceRegDate");
var nocConvAppDate = document.getElementById("conveyanceConAppDate");

// Form 1 Errors
var nocApplicantStatusError = document.getElementById("statusofapplicantError");
var nocExecutedNameError = document.getElementById("conveyanceDeedNameError");
var nocDateExecutedOnError = document.getElementById(
  "conveyanceExecutedOnError"
);
var nocRegNoError = document.getElementById("conveyanceRegnoDeedError");
var nocBooknoError = document.getElementById("conveyanceBookNoDeedError");
var nocVolumenoError = document.getElementById("conveyanceVolumeNoError");
var nocPagenoFromError = document.getElementById("conveyancePagenoFromError");
var nocPagenoToError = document.getElementById("conveyancePagenoToError");
var nocRegDateError = document.getElementById("conveyanceRegDateError");
var nocConvAppDateError = document.getElementById("conveyanceConAppDateError");

function validateNocApplicationType() {
  var nocApplicantStatusValue = nocApplicantStatus.value.trim();
  if (nocApplicantStatusValue === "") {
    nocApplicantStatusError.textContent = "Status of applicant is required.";
    nocApplicantStatusError.style.display = "block";
    return false;
  } else {
    nocApplicantStatusError.style.display = "none";
    nocApplicantStatusError.style.display = "none";
    return true;
  }
}

function validateNocExecutedName() {
  var nocExecutedNameValue = nocExecutedName.value.trim();
  if (nocExecutedNameValue === "") {
    nocExecutedNameError.textContent = "Executed in favour of is required.";
    nocExecutedNameError.style.display = "block";
    return false;
  } else {
    nocExecutedNameError.style.display = "none";
    return true;
  }
}

function validateNocExecutedOnDate() {
  var nocnocDateExecutedOnValue = nocDateExecutedOn.value.trim();
  var today = new Date().toISOString().split("T")[0];
  if (nocnocDateExecutedOnValue === "") {
    nocDateExecutedOnError.textContent = "Executed date is required.";
    nocDateExecutedOnError.style.display = "block";
    return false;
  } else if (nocnocDateExecutedOnValue > today) {
    nocDateExecutedOnError.textContent =
      "Executed date cannot be in the future.";
    nocDateExecutedOnError.style.display = "block";
    nocDateExecutedOn.value = ""; // Clear invalid input
    return false;
  } else {
    nocDateExecutedOnError.style.display = "none";
    return true;
  }
}

function validateNocRegNo() {
  var nocRegNoValue = nocRegNo.value.trim();
  if (nocRegNoValue === "") {
    nocRegNoError.textContent = "Registration number is required.";
    nocRegNoError.style.display = "block";
    return false;
  } else {
    nocRegNoError.style.display = "none";
    return true;
  }
}

function validateNocBookno() {
  var nocBooknoValue = nocBookno.value.trim();

  // Check if the field is empty
  if (nocBooknoValue === "") {
    nocBooknoError.textContent = "Book number is required.";
    nocBooknoError.style.display = "block";
    return false;
  }
  
  // Check if the Book number is numeric
  if (!/^\d+$/.test(nocBooknoValue)) {
    nocBooknoError.textContent = "Book number must be a numeric value.";
    nocBooknoError.style.display = "block";
    return false;
  }

  // Check if the Book number is a positive number (optional, if you want to restrict to positive values)
  if (parseFloat(nocBooknoValue) <= 0) {
    nocBooknoError.textContent = "Book number must be a positive number.";
    nocBooknoError.style.display = "block";
    return false;
  }

  nocBooknoError.style.display = "none";
  return true;
}

function validateNocVolumeno() {
  var nocVolumenoValue = nocVolumeno.value.trim();

  // Check if the field is empty
  if (nocVolumenoValue === "") {
    nocVolumenoError.textContent = "Volume number is required.";
    nocVolumenoError.style.display = "block";
    return false;
  }
  
  // Check if the value is numeric
  if (!/^\d+$/.test(nocVolumenoValue)) {
    nocVolumenoError.textContent = "Volume number must be a numeric value.";
    nocVolumenoError.style.display = "block";
    return false;
  }

  // Check if the value is a positive number (optional, if you want to restrict to positive values)
  if (parseFloat(nocVolumenoValue) <= 0) {
    nocVolumenoError.textContent = "Volume must be a positive number.";
    nocVolumenoError.style.display = "block";
    return false;
  }

  nocVolumenoError.style.display = "none";
  return true;
}

$(document).on("input blur change", "#conveyancePagenoFrom", function () {
  validateNocPagenoFrom();
});

function validateNocPagenoFrom() {
  var nocPagenoFromValue = nocPagenoFrom.value.trim();
  var nocPagenoValueTo = nocPagenoTo.value.trim();

  // Check if the field is empty
  if (nocPagenoFromValue === "") {
    nocPagenoFromError.textContent = "Page number from is required.";
    nocPagenoFromError.style.display = "block";
    return false;
  }
  
  // Check if the value is numeric
  if (!/^\d+$/.test(nocPagenoFromValue)) {
    nocPagenoFromError.textContent = "Page number from must be a numeric value.";
    nocPagenoFromError.style.display = "block";
    return false;
  }

  // Check if the value is positive
  if (parseFloat(nocPagenoFromValue) <= 0) {
    nocPagenoFromError.textContent = "Page number from must be a positive number.";
    nocPagenoFromError.style.display = "block";
    return false;
  }
  // Check if 'Page number From' is greater than 'Page number To'
  if (parseInt(nocPagenoFromValue) > parseInt(nocPagenoValueTo)) {
    nocPagenoFromError.textContent = "Page number from cannot be greater than page number to.";
    nocPagenoFromError.style.display = "block";
    return false;
  } else {
    nocPagenoFromError.style.display = "none";
    return true;
  }
}

$(document).on("input blur change", "#conveyancePagenoTo", function () {
  validateNocPagenoTo();
});

function validateNocPagenoTo() {
  var nocPagenoToValue = nocPagenoTo.value.trim();
  var nocPagenoValueFrom = nocPagenoFrom.value.trim();
  // Check if the field is empty
  if (nocPagenoToValue === "") {
    nocPagenoToError.textContent = "Page number to is required.";
    nocPagenoToError.style.display = "block";
    // Check the value
    return false;
  }
  
  // Check if the value is numeric
  if (!/^\d+$/.test(nocPagenoToValue)) {
    nocPagenoToError.textContent = "Page number to must be a numeric value.";
    nocPagenoToError.style.display = "block";
    return false;
  }

  // Check if the value is positive
  if (parseFloat(nocPagenoToValue) <= 0) {
    nocPagenoToError.textContent = "Page number to must be a positive number.";
    nocPagenoToError.style.display = "block";
    return false;
  }

  // Check if 'Page number To' is less than 'Page number From'
  if (parseInt(nocPagenoToValue) < parseInt(nocPagenoValueFrom)) {
    nocPagenoToError.textContent =
      "Page number to cannot be less than page number from.";
    nocPagenoToError.style.display = "block";
    return false;
  } else {
    nocPagenoToError.style.display = "none";
    return true;
  }
}

function validateNocRegDate() {
  var nocRegDateValue = nocRegDate.value.trim();
  var nocDateExecutedValueOn = nocDateExecutedOn.value.trim();
  var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

  var nocRegDateObj = new Date(nocRegDateValue);
  var nocDateExecutedValueOnObj = new Date(nocDateExecutedValueOn);

  if (nocRegDateValue === "") {
    nocRegDateError.textContent = "Registration date is required.";
    nocRegDateError.style.display = "block";
    return false;
  }

  // Future date validation
  if (nocRegDateValue > today) {
    nocRegDateError.textContent = "Registration date cannot be in the future.";
    nocRegDateError.style.display = "block";
    nocRegDate.value = ""; // Clear the invalid date
    return false;
  }

  // Ensure nocRegDate is not earlier than mutExecutedOnAsConLease
  if (nocRegDateObj < nocDateExecutedValueOnObj) {
    nocRegDateError.textContent =
      "Registration cannot occur prior to the execution date.";
    nocRegDateError.style.display = "block";
    nocRegDate.value = ""; // Clear the invalid date
    return false;
  }

  nocRegDateError.style.display = "none";
  return true;
}
function validateNocConvAppDate() {
  var nocConvAppDateValue = nocConvAppDate.value.trim();
  var nocExecutedDateValueOn = nocDateExecutedOn.value.trim();

  // if (nocConvAppDateValue === "") {
  //   nocConvAppDateError.textContent = "Conversion application date is required.";
  //   nocConvAppDateError.style.display = "block";
  //   return false;
  // }

  // Check if executed on date is entered
  if (nocExecutedDateValueOn === "") {
    nocConvAppDateError.textContent = "Executed on need to be added first.";
    nocConvAppDateError.style.display = "block";
    return false;
  }

  // If conversion app date is not entered, skip further validation added on 01-05-2025 by anil
  if (nocConvAppDateValue === "") {
    nocConvAppDateError.style.display = "none";
    return true;
  }

  var convAppDateObj = new Date(nocConvAppDateValue);
  var executedOnDateObj = new Date(nocExecutedDateValueOn);

  // Check if Conversion App Date is greater than or equal to executed on Date
  if (convAppDateObj > executedOnDateObj) {
    nocConvAppDateError.textContent =
      "Registration cannot occur prior to the execution date.";
    nocConvAppDateError.style.display = "block";
    nocConvAppDate.value = ""; // Clear invalid input
    return false;
  }

  nocConvAppDateError.style.display = "none";
  return true;
}
document.addEventListener("DOMContentLoaded", function () {
  const executedOnInput = document.getElementById("conveyanceExecutedOn");
  const conAppDateInput = document.getElementById("conveyanceConAppDate");
  const checkApplicationType = document.getElementById("applicationType");

  // Function to apply max date based on executed on date
  function setMaxDate() {
    if (executedOnInput && conAppDateInput) {
      const executedDate = executedOnInput.value.trim();

      if (executedDate !== "") {
        conAppDateInput.setAttribute("max", executedDate);
        console.log("✅ Max date set to:", executedDate);

        // If current value exists and exceeds max, clear it
        if (
          conAppDateInput.value &&
          new Date(conAppDateInput.value) > new Date(executedDate)
        ) {
          console.warn("Existing value exceeds max, clearing.");
          conAppDateInput.value = "";
        }
      }
    } else {
      console.error("Required inputs not found.");
    }
  }

  // Apply max date on page load
  setMaxDate();

  // Apply max date when applicationType changes (if NOC)
  checkApplicationType.addEventListener("change", function () {
    if (this.value === "NOC") {
      setMaxDate();
    } else {
      conAppDateInput.removeAttribute("max");
    }
  });

  // Validate date on user change
  conAppDateInput.addEventListener("change", function () {
  nocConvAppDateError.textContent = "";
  nocConvAppDateError.style.display = "none";

  if (!this.value) return; // Skip if field is empty

  const selectedDate = new Date(this.value);
  const maxDate = new Date(this.max);

  if (selectedDate > maxDate) {
    // Format maxDate as MM/DD/YYYY
    const formattedMaxDate =
      ("0" + (maxDate.getMonth() + 1)).slice(-2) + "/" +
      ("0" + maxDate.getDate()).slice(-2) + "/" +
      maxDate.getFullYear();

    nocConvAppDateError.textContent =
      "Selected date cannot be after the executed on date (" +
      formattedMaxDate + ").";
    nocConvAppDateError.style.display = "block";
    this.value = "";
  }
});


  // Optional: Update max date when executed on is changed by the user
  executedOnInput.addEventListener("change", setMaxDate);
});

// this function and created new common function for all input date for set max date today by anil on 27-03-2525
document.addEventListener("DOMContentLoaded", function () {
  var today = new Date().toISOString().split("T")[0];

  $(".coapplicant-block .item-content input[type='date']").attr("max", today);

  // add condition for check if input is available then set max date today by anil on 24-04-2025
  if (nocRegDate) {
    nocRegDate.setAttribute("max", today);
  }
  // if (nocConvAppDate){nocConvAppDate.setAttribute("max", today);}
});

function validateForm1Noc() {
  var isCoapplicantNocValid = coapplicantNocRepeaterForm();
  var isNocExecutedNameValid = validateNocExecutedName();
  var isNocExecutedOnAsOnLeaseDate = validateNocExecutedOnDate();
  var isNocRegno = validateNocRegNo();
  var isNocBookno = validateNocBookno();
  var isNocVolumeno = validateNocVolumeno();
  var isNocPagenoFrom = validateNocPagenoFrom();
  var isNocPagenoTo = validateNocPagenoTo();
  var isNocRegDate = validateNocRegDate();
  var isNocConvAppDate = validateNocConvAppDate();
  var isNocApplicationType = validateNocApplicationType();

  return (
    isCoapplicantNocValid &&
    isNocExecutedNameValid &&
    isNocExecutedOnAsOnLeaseDate &&
    isNocRegno &&
    isNocBookno &&
    isNocVolumeno &&
    isNocPagenoFrom &&
    isNocPagenoTo &&
    isNocRegDate &&
    isNocConvAppDate &&
    isNocApplicationType
  );
}

// NOC Edit step 1 valdation
function validateEditNOC1() {
  var isCoapplicantNocValid = coapplicantNocRepeaterForm();
  var isNocRegno = validateNocRegNo();
  var isNocBookno = validateNocBookno();
  var isNocVolumeno = validateNocVolumeno();
  var isNocPagenoFrom = validateNocPagenoFrom();
  var isNocPagenoTo = validateNocPagenoTo();
  var isNocRegDate = validateNocRegDate();
  var isNocConvAppDate = validateNocConvAppDate();

  return (
    isCoapplicantNocValid &&
    isNocRegno &&
    isNocBookno &&
    isNocVolumeno &&
    isNocPagenoFrom &&
    isNocPagenoTo &&
    isNocRegDate &&
    isNocConvAppDate
  );
}
// End NOC Edit step 1 valdation

//  End NOC step 1 form validtaion

// NOC step 2 form validation anil 21-03-2025
var conveyancedeed = document.getElementById("conveyancedeed");
var conveyancedeedError = document.getElementById("conveyancedeedError");

var conveyanceOwnershipDoc = document.getElementById("conveyanceownershipdoc");
var conveyanceOwnershipDocError = document.getElementById(
  "conveyanceownershipdocError"
);

var conveyanceAadharDoc = document.getElementById("conveyanceaadhardoc");
var conveyanceAadharDocError = document.getElementById(
  "conveyanceaadhardocError"
);

var conveyancePanDoc = document.getElementById("conveyancepandoc");
var conveyancePanDocError = document.getElementById("conveyancepandocError");

var conveyanceConAppDoc = document.getElementById("conveyanceconappdoc");
var conveyanceConAppDocError = document.getElementById(
  "conveyanceconappdocError"
);

var agreeConsentNoc = document.getElementById("agreeConsentNoc");
var agreeConsentNocError = document.getElementById("agreeConsentNocError");

function validateForm2Noc() {
  var isValidateConveyanceDeedFile = validateConveyanceDeedFile();
  var isConveyanceOwnershipDoc = validateConveyanceOwnershipDoc();
  var isConveyanceAadharDoc = validateConveyanceAadharDoc();
  var isConveyancePanDoc = validateConveyancePanDoc();
  var isValidateAgreeConsentNoc = validateAgreeConsentNoc();
  var isValidateConAppDoc = validateConveyanceConAppDoc();
  var isAppOtherDoc = validateAppOtherDoc("NOC-2");
  let isPoAValid = validatePOADoc("NOC-2");

  return (
    isValidateConveyanceDeedFile &&
    isConveyanceOwnershipDoc &&
    isConveyanceAadharDoc &&
    isConveyancePanDoc &&
    isValidateConAppDoc &&
    isValidateAgreeConsentNoc &&
    isAppOtherDoc &&
    isPoAValid
  );
}

// function validateForm2NocPOA() {
//   var isValidateConveyancePowerAttorney = validateConveyancePowerAttorney();

//   return (
//     isValidateConveyancePowerAttorney
//   );
// }

// NOC Form Step 2

function validateConveyanceDeedFile() {
  if (conveyancedeed.files.length > 0) {
    var file = conveyancedeed.files[0];
    if (file.size > 5 * 1024 * 1024) {
      conveyancedeedError.textContent = "File size must be less than 5 MB.";
      return false;
    } else if (!file.name.endsWith(".pdf")) {
      conveyancedeedError.textContent = "Only PDF files are allowed.";
      return false;
    } else {
      conveyancedeedError.textContent = "";
      return true;
    }
  } else {
    if (conveyancedeed.getAttribute("data-should-validate") == 1) {
      return true;
    }
    conveyancedeedError.textContent = "Conveyance deed PDF is required.";
    return false;
  }
}

function validateConveyanceOwnershipDoc() {
  if (conveyanceOwnershipDoc.files.length > 0) {
    var file = conveyanceOwnershipDoc.files[0];
    if (file.size > 5 * 1024 * 1024) {
      conveyanceOwnershipDocError.textContent =
        "File size must be less than 5 MB.";
      return false;
    } else if (!file.name.endsWith(".pdf")) {
      conveyanceOwnershipDocError.textContent = "Only PDF files are allowed.";
      return false;
    } else {
      conveyanceOwnershipDocError.textContent = "";
      return true;
    }
  } else {
    if (conveyanceOwnershipDoc.getAttribute("data-should-validate") == 1) {
      return true;
    }
    conveyanceOwnershipDocError.textContent =
      "Ownership document PDF is required.";
    return false;
  }
}

function validateConveyanceAadharDoc() {
  if (conveyanceAadharDoc.files.length > 0) {
    var file = conveyanceAadharDoc.files[0];
    if (file.size > 5 * 1024 * 1024) {
      conveyanceAadharDocError.textContent = "File size must be less than 5 MB.";
      return false;
    } else if (!file.name.endsWith(".pdf")) {
      conveyanceAadharDocError.textContent = "Only PDF files are allowed.";
      return false;
    } else {
      conveyanceAadharDocError.textContent = "";
      return true;
    }
  } else {
    if (conveyanceAadharDoc.getAttribute("data-should-validate") == 1) {
      return true;
    }
    conveyanceAadharDocError.textContent = "Aadhaar PDF is required.";
    return false;
  }
}

function validateConveyancePanDoc() {
  if (conveyancePanDoc.files.length > 0) {
    var file = conveyancePanDoc.files[0];
    if (file.size > 5 * 1024 * 1024) {
      conveyancePanDocError.textContent = "File size must be less than 5 MB.";
      return false;
    } else if (!file.name.endsWith(".pdf")) {
      conveyancePanDocError.textContent = "Only PDF files are allowed.";
      return false;
    } else {
      conveyancePanDocError.textContent = "";
      return true;
    }
  } else {
    if (conveyancePanDoc.getAttribute("data-should-validate") == 1) {
      return true;
    }
    conveyancePanDocError.textContent = "PAN PDF is required.";
    return false;
  }
}

function validateConveyanceConAppDoc() {
  if (conveyanceConAppDoc.files.length > 0) {
    var file = conveyanceConAppDoc.files[0];
    // Check if file size is greater than 5 MB
    if (file.size > 5 * 1024 * 1024) {
      conveyanceConAppDocError.textContent = "File size must be less than 5 MB.";
      return false;
    }
    // Check if file type is PDF
    else if (!file.name.endsWith(".pdf")) {
      conveyanceConAppDocError.textContent = "Only PDF files are allowed.";
      return false;
    }
    // File is valid
    else {
      conveyanceConAppDocError.textContent = "";
      return true;
    }
  } else {
    // Skip validation if no file is selected and "data-should-validate" is not 1
    if (conveyanceConAppDoc.getAttribute("data-should-validate") == 1) {
      conveyanceConAppDocError.textContent = "";
      return true; // Skip the validation and return true as no file is required
    }
    // No file selected, and validation is not required
    conveyanceConAppDocError.textContent = "";
    return true;
  }
}

function validateAgreeConsentNoc() {
  if (!agreeConsentNoc.checked) {
    agreeConsentNocError.textContent = "Please accept terms & conditions.";
    agreeConsentNocError.style.display = "block";
    return false;
  } else {
    agreeConsentNocError.style.display = "none";
    return true;
  }
}

// Store noc 2 step form details - Lalit Tiwari (17/march/2025)
function nocFinalStep(callback) {
  var updateId = $("input[name='updateId']").val();

  var conveyancedeedDateOfAttestation = $(
    "input[name='conveyancedeedDateOfAttestation']"
  ).val();
  var conveyancedeedAttestedBy = $(
    "input[name='conveyancedeedAttestedBy']"
  ).val();
  var agreeConsent = $("#agreeConsentNoc").is(":checked") ? 1 : 0;

  var baseUrl = getBaseURL();
  var csrfToken = $('meta[name="csrf-token"]').attr("content");
  $.ajax({
    url: baseUrl + "/noc-final-step",
    type: "POST",
    dataType: "JSON",
    data: {
      _token: csrfToken,
      updateId: updateId,
      conveyancedeedDateOfAttestation: conveyancedeedDateOfAttestation,
      conveyancedeedAttestedBy: conveyancedeedAttestedBy,
      agreeConsent: agreeConsent,
    },
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
// End NOC step 2 form validation anil 21-03-2025