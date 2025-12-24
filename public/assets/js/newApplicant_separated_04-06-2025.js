// Field Validation
let spinner;
$(document).ready(function () {
  $(".alpha-only").keypress(function (event) {
    var charCode = event.which;
    if (
      (charCode < 65 || (charCode > 90 && charCode < 97) || charCode > 122) &&
      charCode !== 32 &&
      charCode !== 46 &&
      charCode !== 47
    ) {
      event.preventDefault();
    }
  });

  $(".numericDecimal").on("input", function () {
    var value = $(this).val();
    if (!/^\d*\.?\d*$/.test(value)) {
      $(this).val(value.slice(0, -1));
    }
  });

  $(".numericOnly").on("input", function (e) {
    $(this).val(
      $(this)
        .val()
        .replace(/[^0-9]/g, "")
    );
  });
  $(".numericDecimalHyphen").on("input", function () {
    var value = $(this).val();
    if (!/^[\d-]*\.?\d*$/.test(value)) {
      $(this).val(value.slice(0, -1));
    }
  });
  $(".alphaNum-hiphenForwardSlash").on("input", function () {
    var value = $(this).val();
    // Allow only alphanumeric, hyphen, and forward slash
    var filteredValue = value.replace(/[^a-zA-Z0-9\-\/]/g, "");
    $(this).val(filteredValue);
  });

  //   Date Format
  $(".date_format").on("input", function (e) {
    var input = $(this).val().replace(/\D/g, "");
    if (input.length > 8) {
      input = input.substring(0, 8);
    }

    var formattedDate = "";
    if (input.length > 0) {
      formattedDate = input.substring(0, 2);
    }
    if (input.length >= 3) {
      formattedDate += "-" + input.substring(2, 4);
    }
    if (input.length >= 5) {
      formattedDate += "-" + input.substring(4, 8);
    }

    $(this).val(formattedDate);
  });

  // Plot number
  $(".plotNoAlpaMix").on("input", function () {
    var pattern = /[^a-zA-Z0-9+\-/]/g;
    var sanitizedValue = $(this).val().replace(pattern, "");
    $(this).val(sanitizedValue);
  });
  // PAN Number
  // PAN
  $(".pan_number_format").on("input", function (event) {
    var value = $(this).val().toUpperCase();
    var newValue = "";
    var valid = true;

    // PAN format: AAAAA9999A

    for (var i = 0; i < value.length; i++) {
      var char = value[i];

      if (i < 5) {
        if (/[A-Z]/.test(char)) {
          newValue += char;
        } else {
          valid = false;
          break;
        }
      } else if (i >= 5 && i < 9) {
        if (/[0-9]/.test(char)) {
          newValue += char;
        } else {
          valid = false;
          break;
        }
      } else if (i === 9) {
        if (/[A-Z]/.test(char)) {
          newValue += char;
        } else {
          valid = false;
          break;
        }
      }
    }

    if (value.length > 10) {
      valid = false;
    }

    if (valid) {
      $(this).val(newValue);
    } else {
      $(this).val(newValue);
    }
  });
  // End PAN
  // Share
  $(".alphaNum_slash_modulus").on("input", function () {
    var value = $(this).val();
    var sanitizedValue = value.replace(/[^a-zA-Z0-9\/%]/g, "");
    if (value !== sanitizedValue) {
      $(this).val(sanitizedValue);
    }
  });
  spinner = document.getElementById("spinnerOverlay");
});
// Repeater for Add Co-Applicant Lessee Details
// Repeater for Add Co-Applicant Lessee Details
$("#MUTrepeater").createRepeater({showFirstItemToDefault: true,});
// End
// Repeater for Add Co-Applicant Lessee Details
$("#CONrepeater").createRepeater({showFirstItemToDefault: true,});

$("#conveyanceRepeater").createRepeater({showFirstItemToDefault: true,});

$("#repeater").createRepeater({showFirstItemToDefault: true,});
// End
// Repeater for Add Applicant Lessee Details
// End
// Repeater for Add Applicant Lessee Details
$("#repeaterLessee").createRepeater({showFirstItemToDefault: true,});

$("#affidavits_repeater").createRepeater({showFirstItemToDefault: true,});
$("#indemnityBond_repeater").createRepeater({showFirstItemToDefault: true,});
// End
// AffidavitRepeater
$("#repeaterAffidavit").createRepeater({showFirstItemToDefault: true,});
// End
// IndemnityRepeater
$("#repeaterIndemnity").createRepeater({showFirstItemToDefault: true,});
// End
// IndemnityRepeaterConversion
$("#repeaterIndemnityCon").createRepeater({showFirstItemToDefault: true,});
// End
// repeaterUndertakingCon
$("#repeaterUndertakingCon").createRepeater({
  showFirstItemToDefault: true,
});
// End
// repeaterUndertakingCon
$("#repeaterAffidavitsCon").createRepeater({
  showFirstItemToDefault: true,
});
// End
/**Conversion Repeaters */
// IndemnityBond
$("#convDocIndemnityBond_repeater").createRepeater({
  showFirstItemToDefault: true,
});
// End
// repeaterUndertakingCon
$("#convDocUndertaking_repeater").createRepeater({
  showFirstItemToDefault: true,
});
// End
// property photo
$("#convDocPropertyPhoto_repeater").createRepeater({
  showFirstItemToDefault: true,
});
// End
function getBaseURL() {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? ":" + port : ""}`;
}

$(document).ready(function () {
  // Application Form Show/Hide Based on Selection
  $("#applicationType").change(function () {
    const selectedValue = $(this).val();

    if (selectedValue === "NOC") {
      $(".nocDiv").show();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();
      getUserDetails()
        .then(function (response) {
          if (response.status) {
            $("#nocNameApp").val(response.data.user.name);
            $("#nocGenderApp").val(response.data.details.gender);
            $("#nocDateOfBirthApp").val(response.data.details.dob);
            $("#nocAgeApp").val(response.data.details.age);
            $("#nocprefixApp").html(response.data.details.so_do_spouse);
            $("#nocFathernameApp").val(response.data.details.second_name);
            $("#nocAadharApp").val(response.data.details.aadhar_card);
            $("#nocPanApp").val(response.data.details.pan_card);
            $("#nocMobilenumberApp").val(response.data.user.mobile_no);
          }
        })
        .catch(function (error) {
          console.error("Error during AJAX call:", error);
        }); //code changed by Nitin to reuse fetch-user details function
    } else if (selectedValue === "") {
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();
    } else if (selectedValue === "SUB_MUT") {
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").show();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();

      getUserDetails()
        .then(function (response) {
          if (response.status) {
            $("#mutNameApp").val(response.data.user.name);
            $("#mutGenderApp").val(response.data.details.gender);
            $("#mutDateOfBirth").val(response.data.details.dob);
            $("#mutAge").val(response.data.details.age);
            $("#mutprefixApp").html(response.data.details.so_do_spouse);
            $("#mutFathernameApp").val(response.data.details.second_name);
            $("#mutAadharApp").val(response.data.details.aadhar_card);
            $("#mutPanApp").val(response.data.details.pan_card);
            $("#mutMobilenumberApp").val(response.data.user.mobile_no);
          }
        })
        .catch(function (error) {
          console.error("Error during AJAX call:", error);
        }); //code changed by Nitin to reuse fetch-user details function
    } else if (selectedValue === "PRP_CERT") {
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").show();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();
    } else if (selectedValue === "SEL_PERM") {
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").show();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();
    } else if (selectedValue === "CONVERSION") {
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").show();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();

      getUserDetails()
        .then(function (response) {
          if (response.status) {
            $("#convname").val(response.data.user.name);
            $("#convgender").val(response.data.details.gender);
            $("#conDateOfBirth").val(response.data.details.dob);
            $("#conAge").val(response.data.details.age);
            $("#convprefixApp").html(response.data.details.so_do_spouse);
            $("#convfathername").val(response.data.details.second_name);
            $("#convaadhar").val(response.data.details.aadhar_card);
            $("#convpan").val(response.data.details.pan_card);
            $("#convmobilenumber").val(response.data.user.mobile_no);
          }
        })
        .catch(function (error) {
          console.error("Error during AJAX call:", error);
        }); //code changed by Nitin to reuse fetch-user details function
    } else if (selectedValue === "DOA") {
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").show();
      $(".landusechangeDiv").hide();
    } else if (selectedValue === "LUC") {
      var propertyId = $("#propertyid").val();
      var updateId = $('input[name="updateId"]').val();
      if (propertyid) {
        getLandUseChangeData(propertyId, updateId, function (success, message) {
          if (success) {
            $(".nocDiv").hide();
            $(".FHSubstitutionMutationdiv").hide();
            $(".propertycertificateDiv").hide();
            $(".salepermissionDiv").hide();
            $(".LHConversiondiv").hide();
            $(".deedofappartmentDiv").hide();
            $(".landusechangeDiv").show();
          } else {
            showError(message);
          }
        });
      }
    } else {
      $("#freeleasetitle").text("");
      $(".nocDiv").hide();
      $(".FHSubstitutionMutationdiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".propertycertificateDiv").hide();
      $(".salepermissionDiv").hide();
      $(".LHConversiondiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".deedofappartmentDiv").hide();
      $(".landusechangeDiv").hide();
    }
  });

  // -------------------- if Yes Mortgaged --------------------
  $("#YesMortgaged").change(function () {
    $("#yesRemarksDiv").show();
  });
  $("#NoMortgaged").change(function () {
    $("#yesRemarksDiv").hide();
  });

  // -------------------- if Yes Court Order --------------------
  $("#YesCourtOrder").change(function () {
    $("#yescourtorderDiv").show();
  });
  $("#NoCourtOrder").change(function () {
    $("#yescourtorderDiv").hide();
  });

  // -------------------- if Yes Court Order in Conversion --------------------
  /* $("#YesCourtOrderConversion").change(function () {
    $("#yescourtorderConversionDiv").show();
  });
  $("#NoCourtOrderConversion").change(function () {
    $("#yescourtorderConversionDiv").hide();
  }); */
  $('input[name="courtorderConversion"]').change(function () {
    $("#yescourtorderConversionDiv").css(
      "display",
      $(this).val() == 1 ? "block" : "none"
    );
  });

  // -------------------- if Yes Mortgaged in Conversion --------------------
  /* $("#YesMortgagedConversion").change(function () {
    $("#yesRemarksDivConversion").show();
  });
  $("#NoMortgagedConversion").change(function () {
    $("#yesRemarksDivConversion").hide();
  }); */

  $('input[name="propertymortgagedConversion"]').change(function () {
    $("#yesRemarksDivConversion").css(
      "display",
      $(this).val() == 1 ? "block" : "none"
    );
  });

  // -------------------- if Yes deed Lost in Conversion --------------------
  /* $("#YesDeedLostConversion").change(function () {
    $("#yesDeedLostDivConversion").show();
  });
  $("#NoMortgagedConversion").change(function () {
    $("#NoDeedLostConversion").hide();
  }); */
  /** function  chnaged by nitin to show /hide lease deed loast inputs*/

  $('input[name="isLeaseDeedLost"]').change(function () {
    $("#optionalInputs").css("display", $(this).val() == 1 ? "block" : "none");
  });
});

// Checkbox Group Only One Selection
$("input:checkbox").on("click", function () {
  var $box = $(this);
  if ($box.is(":checked")) {
    var group = "input:checkbox[name='" + $box.attr("name") + "']";
    $(group).prop("checked", false);
    $box.prop("checked", true);
  } else {
    $box.prop("checked", false);
  }
});

document.addEventListener("DOMContentLoaded", function () {
  var form1 = document.getElementById("newstep-vl-1");
  var form2 = document.getElementById("newstep-vl-2");
  var form3 = document.getElementById("newstep-vl-3");

  // Form 1 Fields
  var propertyid = document.getElementById("propertyid");
  var propertyStatus = document.getElementById("propertyStatus");
  var applicationType = document.getElementById("applicationType");
  var statusofapplicant = document.getElementById("statusofapplicant");

  var lucpropertytypeto = document.getElementById("lucpropertytypeto");
  var lucpropertysubtypeto = document.getElementById("lucpropertysubtypeto");

  // Form 1 Errors
  var propertyIdError = document.getElementById("propertyIdError");
  var propertyStatusError = document.getElementById("propertyStatusError");
  var applicationTypeError = document.getElementById("applicationTypeError");
  var statusofapplicantError = document.getElementById("statusofapplicantError");

  var lucpropertytypetoError = document.getElementById(
    "lucpropertytypetoError"
  );
  var lucpropertysubtypetoError = document.getElementById(
    "lucpropertysubtypetoError"
  );

  //Field & Validation Error id for DOA - Lalit tiwari on 11/nov/2024
  var flatid = document.getElementById("flatid");
  var buildingName = document.getElementById("buildingName");
  var originalBuyerName = document.getElementById("originalBuyerName");
  var presentOccupantName = document.getElementById("presentOccupantName");
  var purchasedFrom = document.getElementById("purchasedFrom");
  var purchaseDate = document.getElementById("purchaseDate");
  var apartmentArea = document.getElementById("apartmentArea");
  var plotArea = document.getElementById("plotArea");

  var flatidError = document.getElementById("flatidError");
  var buildingNameError = document.getElementById("buildingNameError");
  var originalBuyerNameError = document.getElementById(
    "originalBuyerNameError"
  );
  var presentOccupantNameError = document.getElementById(
    "presentOccupantNameError"
  );
  var purchasedFromError = document.getElementById("purchasedFromError");
  var purchaseDateError = document.getElementById("purchaseDateError");
  var apartmentArea = document.getElementById("apartmentArea");
  var plotAreaError = document.getElementById("plotAreaError");
  var agreeDOAConsent = document.getElementById("agreeDOAConsent");
  var agreeDOAConsentError = document.getElementById("agreeDOAConsentError");

  function validatePropertyId() {
    var propertyidValue = propertyid.value.trim();
    if (propertyidValue === "") {
      propertyIdError.textContent = "Property ID is required.";
      propertyIdError.style.display = "block";
      return false;
    } else {
      propertyIdError.style.display = "none";
      return true;
    }
  }

  function validatePropertyStatus() {
    var propertyStatusValue = propertyStatus.value.trim();
    if (propertyStatusValue === "") {
      propertyStatusError.textContent = "Property status is required.";
      propertyStatusError.style.display = "block";
      return false;
    } else {
      propertyStatusError.style.display = "none";
      propertyStatusError.style.display = "none";
      return true;
    }
  }

  function validateApplicationType() {
    var applicationTypeValue = applicationType.value.trim();
    if (applicationTypeValue === "") {
      applicationTypeError.textContent = "Application type is required.";
      applicationTypeError.style.display = "block";
      return false;
    } else {
      applicationTypeError.style.display = "none";
      applicationTypeError.style.display = "none";
      return true;
    }
  }

  function validateStatusOfApplicant() {
    var statusofapplicantValue = statusofapplicant.value.trim();
    if (statusofapplicantValue === "") {
      statusofapplicantError.textContent = "Status of applicant is required.";
      statusofapplicantError.style.display = "block";
      return false;
    } else {
      statusofapplicantError.style.display = "none";
      statusofapplicantError.style.display = "none";
      return true;
    }
  }

  function validateFlat() {
    var flatidValue = flatid.value.trim();
    if (flatidValue === "") {
      flatidError.textContent = "Flat is required.";
      flatidError.style.display = "block";
      return false;
    } else {
      flatidError.style.display = "none";
      flatidError.style.display = "none";
      return true;
    }
  }

  function validateBuildingName() {
    var buildingNameValue = buildingName.value.trim();
    var regex = /^[A-Za-z\s]+$/; // Allows only alphabets and spaces

    if (buildingNameValue === "") {
      buildingNameError.textContent = "Building name is required.";
      buildingNameError.style.display = "block";
      return false;
    } else if (!regex.test(buildingNameValue)) {
      buildingNameError.textContent =
        "Only letters and number are allowed.";
      buildingNameError.style.display = "block";
      return false;
    } else {
      buildingNameError.style.display = "none";
      return true;
    }
  }

  function validateoriginalBuyerName() {
    var originalBuyerNameValue = originalBuyerName.value.trim();
    var regex = /^[A-Za-z\s]+$/; // Allows only alphabets and spaces

    if (originalBuyerNameValue === "") {
      originalBuyerNameError.textContent = "Original buyer name is required.";
      originalBuyerNameError.style.display = "block";
      return false;
    } else if (!regex.test(originalBuyerNameValue)) {
      originalBuyerNameError.textContent =
        "Only letters and number are allowed.";
      originalBuyerNameError.style.display = "block";
      return false;
    } else {
      originalBuyerNameError.style.display = "none";
      return true;
    }
  }

  function validatePresentOccupantName() {
    var presentOccupantNameValue = presentOccupantName.value.trim();
    var regex = /^[A-Za-z\s]+$/; // Allows only alphabets and spaces

    if (presentOccupantNameValue === "") {
      presentOccupantNameError.textContent =
        "Present occupant name is required.";
      presentOccupantNameError.style.display = "block";
      return false;
    } else if (!regex.test(presentOccupantNameValue)) {
      presentOccupantNameError.textContent =
        "Only letters are allowed.";
      presentOccupantNameError.style.display = "block";
      return false;
    } else {
      presentOccupantNameError.style.display = "none";
      return true;
    }
  }

  function validatePurchasedFrom() {
    var purchasedFromValue = purchasedFrom.value.trim();
    var regex = /^[A-Za-z\s]+$/; // Allows only alphabets and spaces

    if (purchasedFromValue === "") {
      purchasedFromError.textContent = "Purchased from name is required.";
      purchasedFromError.style.display = "block";
      return false;
    } else if (!regex.test(purchasedFromValue)) {
      purchasedFromError.textContent = "Only letters are allowed.";
      purchasedFromError.style.display = "block";
      return false;
    } else {
      purchasedFromError.style.display = "none";
      return true;
    }
  }

  function validatePurchaseDate() {
    var purchaseDateValue = purchaseDate.value.trim();

    if (purchaseDateValue === "") {
      purchaseDateError.textContent = "Purchase date is required.";
      purchaseDateError.style.display = "block";
      return false;
    }

    // Parse the purchase date and today's date
    var selectedDate = new Date(purchaseDateValue);
    var today = new Date();

    // Check if the selected date is in the future
    if (selectedDate > today) {
      purchaseDateError.textContent = "Purchase date cannot be in the future.";
      purchaseDateError.style.display = "block";
      return false;
    }

    purchaseDateError.style.display = "none";
    return true;
  }

  function validateApartmentArea() {
    var apartmentAreaValue = apartmentArea.value.trim();
    var regex = /^[0-9]+(\.[0-9]+)?$/; // Allows only numbers and decimals

    if (apartmentAreaValue === "") {
      apartmentAreaError.textContent = "Flat area is required.";
      apartmentAreaError.style.display = "block";
      return false;
    } else if (!regex.test(apartmentAreaValue)) {
      apartmentAreaError.textContent = "Flat area must be numeric.";
      apartmentAreaError.style.display = "block";
      return false;
    } else {
      apartmentAreaError.style.display = "none";
      return true;
    }
  }

  function validatePlotArea() {
    var plotAreaValue = plotArea.value.trim();
    var regex = /^[0-9]+(\.[0-9]+)?$/; // Allows only numbers and decimals

    if (plotAreaValue === "") {
      plotAreaError.textContent = "Plot area is required.";
      plotAreaError.style.display = "block";
      return false;
    } else if (!regex.test(plotAreaValue)) {
      plotAreaError.textContent = "Plot area must numeric.";
      plotAreaError.style.display = "block";
      return false;
    } else {
      plotAreaError.style.display = "none";
      return true;
    }
  }

  function validateStatusOfChangeProperty() {
    var lucpropertytypetoValue = lucpropertytypeto.value.trim();
    if (lucpropertytypetoValue === "") {
      lucpropertytypetoError.textContent =
        "Change to property type is required.";
      lucpropertytypetoError.style.display = "block";
      return false;
    } else {
      lucpropertytypetoError.style.display = "none";
      lucpropertytypetoError.style.display = "none";
      return true;
    }
  }

  function validateStatusOfChangeSubProperty() {
    var lucpropertysubtypetoValue = lucpropertysubtypeto.value.trim();
    if (lucpropertysubtypetoValue === "") {
      lucpropertysubtypetoError.textContent =
        "Change to property sub type is required.";
      lucpropertysubtypetoError.style.display = "block";
      return false;
    } else {
      lucpropertysubtypetoError.style.display = "none";
      lucpropertysubtypetoError.style.display = "none";
      return true;
    }
  }

  //Validate Form 1 DOA - Lalit tiwari on 11/Nov/2024
  function validateForm1DOA() {
    var isPropertyIdValid = validatePropertyId();
    var isPropertyStatusValid = validatePropertyStatus();
    var isApplicationTypeValid = validateApplicationType();
    var isStatusOfApplicantValid = validateStatusOfApplicant();
    // DOA
    var isFlatValid = validateFlat();
    var isBuildingNameValid = validateBuildingName();
    var isOriginalBuyerNameValid = validateoriginalBuyerName();
    var isPresentOccupantNameValid = validatePresentOccupantName();
    var isPurchasedFromValid = validatePurchasedFrom();
    var isPurchaseDateValid = validatePurchaseDate();
    var isApartmentAreaValid = validateApartmentArea();
    var isPlotAreaValid = validatePlotArea();

    return (
      isPropertyIdValid &&
      isPropertyStatusValid &&
      isApplicationTypeValid &&
      isStatusOfApplicantValid &&
      isFlatValid &&
      isBuildingNameValid &&
      isOriginalBuyerNameValid &&
      isPresentOccupantNameValid &&
      isPurchasedFromValid &&
      isPurchaseDateValid &&
      isApartmentAreaValid &&
      isPlotAreaValid
    );
  }

  // Validate Form 1
  function validateForm1LUC() {
    var isPropertyIdValid = validatePropertyId();
    var isPropertyStatusValid = validatePropertyStatus();
    var isApplicationTypeValid = validateApplicationType();
    var isStatusOfApplicantValid = validateStatusOfApplicant();
    // LUC
    var isStatusOfChangePropertyValid = validateStatusOfChangeProperty();
    var isStatusOfChangeSubPropertyValid = validateStatusOfChangeSubProperty();

    return (
      isPropertyIdValid &&
      isPropertyStatusValid &&
      isApplicationTypeValid &&
      isStatusOfApplicantValid &&
      isStatusOfChangePropertyValid &&
      isStatusOfChangeSubPropertyValid
    );
  }

  // Form 2 Fields
  var lucpropertyTaxpayreceipt = document.getElementById(
    "lucpropertyTaxpayreceipt"
  );
  var PropertyTaxAssessmentReceipt = document.getElementById(
    "PropertyTaxAssessmentReceipt"
  );
  var lucphoto1 = document.getElementById("lucphoto1");
  var lucmpdzonalpermitting = document.getElementById("lucmpdzonalpermitting");
  var lucagreeconsent = document.getElementById("lucagreeconsent");

  // Form 2 Errors
  var lucpropertyTaxpayreceiptError = document.getElementById(
    "lucpropertyTaxpayreceiptError"
  );
  var PropertyTaxAssessmentReceiptError = document.getElementById(
    "PropertyTaxAssessmentReceiptError"
  );
  var lucphoto1Error = document.getElementById("lucphoto1Error");
  var lucmpdzonalpermittingError = document.getElementById(
    "lucmpdzonalpermittingError"
  );
  var lucagreeconsentError = document.getElementById("lucagreeconsentError");

  function validatelucpropertyTaxpayreceipt() {
    if (lucpropertyTaxpayreceipt.files.length > 0) {
      var file = lucpropertyTaxpayreceipt.files[0];
      if (file.size > 5 * 1024 * 1024) {
        lucpropertyTaxpayreceiptError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        lucpropertyTaxpayreceiptError.textContent =
          "Only PDF files are allowed.";
        return false;
      } else {
        lucpropertyTaxpayreceiptError.textContent = "";
        return true;
      }
    } else {
      // lucpropertyTaxpayreceiptError.textContent =
      //   "Property tax payment receipt is required.";
      // return false;

      if (lucpropertyTaxpayreceipt.getAttribute("data-should-validate") == 1) {
        return true;
      }
      lucpropertyTaxpayreceiptError.textContent =
        "Property tax payment receipt is required.";
      return false;
    }
  }

  function validatePropertyTaxAssessmentReceipt() {
    if (PropertyTaxAssessmentReceipt.files.length > 0) {
      var file = PropertyTaxAssessmentReceipt.files[0];
      if (file.size > 5 * 1024 * 1024) {
        PropertyTaxAssessmentReceiptError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        PropertyTaxAssessmentReceiptError.textContent =
          "Only PDF files are allowed.";
        return false;
      } else {
        PropertyTaxAssessmentReceiptError.textContent = "";
        return true;
      }
    } else {
      // PropertyTaxAssessmentReceiptError.textContent =
      //   "Property tax assessment is required.";
      // return false;
      if (
        PropertyTaxAssessmentReceipt.getAttribute("data-should-validate") == 1
      ) {
        return true;
      }
      PropertyTaxAssessmentReceiptError.textContent =
        "Property tax assessment is required.";
      return false;
    }
  }

  function validateLUCPhoto1() {
    if (lucphoto1.files.length > 0) {
      var file = lucphoto1.files[0];
      if (file.size > 5 * 1024 * 1024) {
        lucphoto1Error.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        lucphoto1Error.textContent = "Only PDF file is allowed.";
        return false;
      } else {
        lucphoto1Error.textContent = "";
        return true;
      }
    } else {
      // lucphoto1Error.textContent = "Property photo is required.";
      // return false;
      if (lucphoto1.getAttribute("data-should-validate") == 1) {
        return true;
      }
      lucphoto1Error.textContent = "Property photo is required.";
      return false;
    }
  }

  function validateLUCMPDPermit() {
    if (lucmpdzonalpermitting.files.length > 0) {
      var file = lucmpdzonalpermitting.files[0];
      if (file.size > 5 * 1024 * 1024) {
        lucmpdzonalpermittingError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        lucmpdzonalpermittingError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        lucmpdzonalpermittingError.textContent = "";
        return true;
      }
    } else {
      // lucmpdzonalpermittingError.textContent =
      //   "MPD/Zonal plan permitting LUC is required.";
      // return false;
      if (lucmpdzonalpermitting.getAttribute("data-should-validate") == 1) {
        return true;
      }
      lucmpdzonalpermittingError.textContent =
        "MPD/Zonal plan permitting LUC is required.";
      return false;
    }
  }

  function validateStatusOfChangeProperty() {
    var lucpropertytypetoValue = lucpropertytypeto.value.trim();
    if (lucpropertytypetoValue === "") {
      lucpropertytypetoError.textContent =
        "Change to property type is required.";
      lucpropertytypetoError.style.display = "block";
      return false;
    } else {
      lucpropertytypetoError.style.display = "none";
      lucpropertytypetoError.style.display = "none";
      return true;
    }
  }

  function validateAgreeConsentLUC() {
    if (!lucagreeconsent.checked) {
      lucagreeconsentError.textContent = "Please accept terms & conditions.";
      lucagreeconsentError.style.display = "block";
      return false;
    } else {
      lucagreeconsentError.style.display = "none";
      return true;
    }
  }

  // Validate Form 2
  function validateForm2LUC() {
    var islucpropertyTaxpayreceiptValid = validatelucpropertyTaxpayreceipt();
    var isPropertyTaxAssessmentReceiptValid =
      validatePropertyTaxAssessmentReceipt();
    var isLUCPhoto1Valid = validateLUCPhoto1();
    var isLUCMPDPermitValid = validateLUCMPDPermit();
    var isAgreeConsentLUCValid = validateAgreeConsentLUC();
    let isPoAValid = validatePOADoc("LUC-2");

    return (
      islucpropertyTaxpayreceiptValid &&
      isPropertyTaxAssessmentReceiptValid &&
      isLUCPhoto1Valid &&
      isLUCMPDPermitValid &&
      isAgreeConsentLUCValid &&
      isPoAValid
    );
  }

  // Validate DOA Form 2
  function validateForm2DOA() {
    var isBuilderBuyerAgreementValid = validateBuilderBuyerAgreement();
    var isSaleDeedValid = validateSaleDeed();
    var isBuildingPlanValid = validateBuildingPlan();
    // var isOtherDocumentValid = validateOtherDocument(); // Comment to make other document optional field - Lalit Tiwari on 06/May/2025
    let isPoAValid = validatePOADoc("DOA-2");
    var isValidateAgreeConsentDoa = validateAgreeConsentDoa();
    return (
      isBuilderBuyerAgreementValid &&
      isSaleDeedValid &&
      isBuildingPlanValid &&
      // isOtherDocumentValid && // Comment to make other document optional field - Lalit Tiwari on 06/May/2025
      isPoAValid &&
      isValidateAgreeConsentDoa
    );
  }

  function validateBuilderBuyerAgreement() {
    if (BuilderBuyerAgreement.files.length > 0) {
      var file = BuilderBuyerAgreement.files[0];
      if (file.size > 5 * 1024 * 1024) {
        BuilderBuyerAgreementError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        BuilderBuyerAgreementError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        BuilderBuyerAgreementError.textContent = "";
        return true;
      }
    } else {
      if (BuilderBuyerAgreement.getAttribute("data-should-validate") == 1) {
        return true;
      }
      BuilderBuyerAgreementError.textContent =
        "Builder buyer agreement is required.";
      return false;
    }
  }
  function validateSaleDeed() {
    if (SaleDeed.files.length > 0) {
      var file = SaleDeed.files[0];
      if (file.size > 5 * 1024 * 1024) {
        SaleDeedError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        SaleDeedError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        SaleDeedError.textContent = "";
        return true;
      }
    } else {
      if (SaleDeed.getAttribute("data-should-validate") == 1) {
        return true;
      }
      SaleDeedError.textContent = "Sale deed is required.";
      return false;
    }
  }
  function validateBuildingPlan() {
    if (BuildingPlan.files.length > 0) {
      var file = BuildingPlan.files[0];
      if (file.size > 5 * 1024 * 1024) {
        BuildingPlanError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        BuildingPlanError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        BuildingPlanError.textContent = "";
        return true;
      }
    } else {
      if (BuildingPlan.getAttribute("data-should-validate") == 1) {
        return true;
      }
      BuildingPlanError.textContent = "Building plan is required.";
      return false;
    }
  }

  function validateAgreeConsentDoa() {
    if (!agreeDOAConsent.checked) {
      agreeDOAConsentError.textContent = "Please accept terms & conditions.";
      agreeDOAConsentError.style.display = "block";
      return false;
    } else {
      agreeDOAConsentError.style.display = "none";
      return true;
    }
  }

  form1.addEventListener("button", function (event) {
    event.preventDefault();
    if (validateForm1LUC() || validateForm1MUT()) {
      alert("Form submitted successfully.");
    }
  });

  form2.addEventListener("button", function (event) {
    event.preventDefault();
    if (validateForm2LUC()) {
      alert("Form submitted successfully.");
    }
  });

  form3.addEventListener("button", function (event) {
    event.preventDefault();
    if (validateForm3()) {
      alert("Form submitted successfully.");
    }
  });

  var editStep1 = document.getElementsByClassName("edit-step1");
  editStep1.forEach((btn) => {
    btn.addEventListener("click", function () {
      var propertyStatus = $("input[name='applicationStatus']").val();
      var applicationType = $("select[name='applicationType']").val();

      if (applicationType === "SUB_MUT" && validateEditMut1()) {
        btn.textContent = "Submitting...";
        btn.disabled = true;

        steppers["stepper3"].next();
        btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
        btn.disabled = false;
      } else if (applicationType === "CONVERSION" && validateEditConv1()) {
        btn.textContent = "Submitting...";
        btn.disabled = true;

        steppers["stepper4"].next();
        btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
        btn.disabled = false;
      } else if (applicationType === "NOC" && validateEditNOC1()) {
        btn.textContent = "Submitting...";
        btn.disabled = true;

        steppers["stepper7"].next();
        btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
        btn.disabled = false;
      }
    });
  });

  var submitButton1 = document.getElementsByClassName("submitbtn1");
  // var $submitButtonOne = $(submitButton1);
  submitButton1.forEach((btn) => {
    btn.addEventListener("click", function () {
      // btn.textContent = "Submitting...";
      // btn.disabled = true;
      var propertyid = $("#propertyid").val();
      var propertyStatus = $("input[name='applicationStatus']").val();
      var applicationType = $("select[name='applicationType']").val();

      if (applicationType === "SUB_MUT" && validateForm1MUT()) {
        // for submitting the first step of application  - Sourav Chauhan (17/sep/2024)
        btn.textContent = "Submitting...";
        btn.disabled = true;
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        var propertyid = $("#propertyid").val();
        var propertyStatus = $("input[name='applicationStatus']").val();
        var applicationType = $("select[name='applicationType']").val();

        //for mutation - Sourav Chauhan (17/sep/2024)
        if (applicationType == "SUB_MUT") {
          mutation(propertyid, propertyStatus, function (success, result) {
            if (result.status) {
              spinner.style.display = "none";
              btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              showSuccess(result.message);
              steppers["stepper3"].next();
            } else {
              spinner.style.display = "none";
              btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              showError(result.message);
            }
          });
        }
      } else if (applicationType === "LUC" && validateForm1LUC()) {
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        if (propertyStatus == "Lease Hold" && applicationType == "LUC") {
          landUseChange(function (success, message) {
            if (success) {
              spinner.style.display = "none";
              btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              steppers["stepper5"].next();
              showSuccess(message);
            } else {
              spinner.style.display = "none";
              btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              showError(message);
            }
          });
        }
      } else if (applicationType === "DOA" && validateForm1DOA()) {
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        if (propertyStatus == "Lease Hold" && applicationType == "DOA") {
          deedOfApartment(
            propertyid,
            propertyStatus,
            function (success, result) {
              if (result.status) {
                spinner.style.display = "none";
                btn.innerHTML =
                  'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
                btn.disabled = false;
                showSuccess(result.message);
                steppers["stepper6"].next();
              } else {
                spinner.style.display = "none";
                btn.innerHTML =
                  'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
                ('Next <i class="bx bx-right-arrow-alt ms-2"></i>');
                btn.disabled = false;
                showError(result.message);
              }
            }
          );
        }
      }

      if (applicationType === "CONVERSION" && validateForm1Conv()) {
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        btn.textContent = "Submitting...";
        btn.disabled = true;
        // If form is valid, proceed with your existing logic
        var propertyid = $("#propertyid").val();
        var propertyStatus = $("input[name='applicationStatus']").val();
        var applicationType = $("select[name='applicationType']").val();

        if (propertyStatus == "Lease Hold" && applicationType == "CONVERSION") {
          // var spinner = document.getElementById('spinnerOverlay');
          spinner.style.display = "flex";
          btn.textContent = "Submitting...";
          btn.disabled = true;
          conversionStep1(
            propertyid,
            propertyStatus,
            function (success, result) {
              if (success) {
                spinner.style.display = "none";
                btn.innerHTML =
                  'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
                btn.disabled = false;
                showSuccess(result.message);
                steppers["stepper4"].next();
              } else {
                spinner.style.display = "none";
                btn.innerHTML =
                  'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
                btn.disabled = false;
                showError(result.message);
              }
            }
          );
        }
      }
      if (applicationType === "NOC" && validateForm1Noc()) {
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        btn.textContent = "Submitting...";
        btn.disabled = true;
        var propertyid = $("#propertyid").val();
        var propertyStatus = $("input[name='applicationStatus']").val();
        var applicationType = $("select[name='applicationType']").val();
        noc(propertyid, propertyStatus, function (success, result) {
          if (success) {
            spinner.style.display = "none";
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            showSuccess(result.message);
            steppers["stepper7"].next();
          } else {
            spinner.style.display = "none";
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            showError(result);
          }
        });
      }
    });
  });

  function deedOfApartment(propertyid, propertyStatus, callback) {
    var flatDropDown = document.getElementsByName("flatid")[0];
    var updateId = $("input[name='updateId']").val();
    var statusofapplicant = $("#statusofapplicant").val();
    var applicantName = $("input[name='applicantName']").val();
    var applicantAddress = $("input[name='applicantAddress']").val();
    var buildingName = $("input[name='buildingName']").val();
    var flatId = flatDropDown.value;
    var builderName = $("input[name='builderName']").val();
    var originalBuyerName = $("input[name='originalBuyerName']").val();
    var presentOccupantName = $("input[name='presentOccupantName']").val();
    var purchasedFrom = $("input[name='purchasedFrom']").val();
    var purchaseDate = $("input[name='purchaseDate']").val();
    var apartmentArea = $("input[name='apartmentArea']").val();
    var plotArea = $("input[name='plotArea']").val();
    var oldPropertyId = $("input[name='old_property_id']").val();
    var propertyMasterId = $("input[name='property_master_id']").val();
    var newPropertyId = $("input[name='new_property_id']").val();
    var splittedPropertyId = $(
      "input[name='splited_property_detail_id']"
    ).val();

    var baseUrl = getBaseURL();
    var csrfToken = $('meta[name="csrf-token"]').attr("content");
    $.ajax({
      url: baseUrl + "/doa-step-first",
      type: "POST",
      dataType: "JSON",
      data: {
        _token: csrfToken,
        updateId: updateId,
        propertyid: propertyid,
        oldPropertyId: oldPropertyId,
        propertyMasterId: propertyMasterId,
        newPropertyId: newPropertyId,
        splittedPropertyId: splittedPropertyId,
        propertyStatus: propertyStatus,
        statusofapplicant: statusofapplicant,
        applicantName: applicantName,
        applicantAddress: applicantAddress,
        buildingName: buildingName,
        flatId: flatId,
        builderName: builderName,
        originalBuyerName: originalBuyerName,
        presentOccupantName: presentOccupantName,
        purchasedFrom: purchasedFrom,
        purchaseDate: purchaseDate,
        apartmentArea: apartmentArea,
        plotArea: plotArea,
      },
      success: function (result) {
        if (result.status) {
          $("#submitbtn1").html(
            'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
          );
          $("#submitbtn1").prop("disabled", false);
          $("input[name='updateId']").val(result.data.id);
          $("input[name='lastPropertyId']").val(result.data.old_property_id);
          if (callback) callback(true, result); // Call the callback with success
        } else {
          // Handle failure scenario
          $("#submitbtn1").html(
            'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
          );
          $("#submitbtn1").prop("disabled", false);
          if (callback) callback(false, result); // Call the callback with failure
        }
      },
      error: function (xhr, status, error) {
        // Handle error scenario
        $("#submitbtn1").html(
          'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#submitbtn1").prop("disabled", false);
        // if (callback) callback(false, { xhr, status, error }); // Call the callback with error
        if (err.responseJSON && err.responseJSON.message) {
          if (callback) callback(false, err.responseJSON.message);
        } else {
          if (callback) callback(false, "Unknown error!!");
        }
      },
    });
  }

  //for step second***********************************
  var submitButton2 = document.getElementsByClassName("submitbtn2");
  submitButton2.forEach((btn) => {
    btn.addEventListener("click", function () {
      var propertyStatus = $("input[name='applicationStatus']").val();
      var applicationType = $("select[name='applicationType']").val();

      if (applicationType === "SUB_MUT" && validateForm2MUT()) {
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        btn.textContent = "Submitting...";
        btn.disabled = true;
        var propertyStatus = $("input[name='applicationStatus']").val();
        var applicationType = $("select[name='applicationType']").val();

        if (applicationType == "SUB_MUT") {
          mutationStepSecond(function (success, result) {
            if (result.status) {
              spinner.style.display = "none";

              var resDocumentType = result.data; // Ensure result.data is an object

              // Check if resDocumentType is not empty
              if (resDocumentType) {
                $.each(resDocumentType, function (key, values) {
                  $.each(values, function (index, value) {
                    console.log("Key: " + key + ", Value: " + value);

                    // Select elements with data-group that matches the current key (e.g., 'affidavits', 'indemnityBond')
                    $(`[data-group="${key}"]`).each(function (i, element) {
                      // console.log(i, element);

                      // Find the hidden input field inside the element with data-name="indexValue"
                      var closestInput = $(element).find(`input[type="file"]`);
                      var hiddenInput = closestInput
                        .parent().find(`input[type="hidden"]`);
                      if (!hiddenInput.val()) {
                        hiddenInput.val(value);
                      }
                    });
                  });
                });
              } else {
                console.log("result.data is not available.");
              }

              btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              showSuccess(result.message);
              steppers["stepper3"].next();
            } else {
              spinner.style.display = "none";
              btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              showError(result.message);
            }
          });
        }
      } else if (propertyStatus == "Lease Hold" && applicationType == "LUC") {
        //not used after lastest design update
        /* landUseChangeStep2(function (success, message) {
          if (success) {
            $("#submitbtn2").html(
              'Submitted <i class="bx bx-right-arrow-alt ms-2"></i>'
            );
            $("#submitbtn2").prop("disabled", false);
            stepper3.next();
          } else {
            $("#submitbtn2").html(
              'Failed <i class="bx bx-right-arrow-alt ms-2"></i>'
            );
            $("#submitbtn2").prop("disabled", false);
            showError(message); 
          }
        });*/
      } else if (applicationType == "CONVERSION" && validateForm2Conv()) {
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        btn.textContent = "Submitting...";
        btn.disabled = true;
        conversionStep2(function (success, message) {
          if (success) {
            spinner.style.display = "none";
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            steppers["stepper4"].next();
          } else {
            spinner.style.display = "none";
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            showError(message);
          }
        });
      }
    });
  });

  var btnfinalsubmit = document.getElementsByClassName("btnfinalsubmit");
  btnfinalsubmit.forEach((btn) => {
    btn.addEventListener("click", function () {
      var propertyStatus = $("input[name='applicationStatus']").val();
      var applicationType = $("select[name='applicationType']").val();

        if (applicationType == "SUB_MUT" && validateForm3MUT()) {
        spinner.style.display = "flex";
        btn.textContent = "Submitting...";
        btn.disabled = true;
          mutationStepThird(function (success, result) {
            if (result.status) {
              btn.innerHTML =
                'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              spinner.style.display = "none";
              showSuccess(
                result.message,
                getBaseURL() + "/applications/history/details"
              );
            } else {
              console.log("condition getting false.");
              btn.innerHTML =
                'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              spinner.style.display = "none";
              showError(result.message);
            }
          });
        }

      if (applicationType === "LUC" && validateForm2LUC()) {

        if (propertyStatus == "Lease Hold" && applicationType == "LUC") {
          // var spinner = document.getElementById('spinnerOverlay');
          spinner.style.display = "flex";
          landUseChangeStep2(function (success, result) {
            if (success) {
              btn.innerHTML =
                'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              spinner.style.display = "none";
              showSuccess(
                result,
                getBaseURL() + "/applications/history/details"
              );
            } else {
              btn.innerHTML =
                'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              spinner.style.display = "none";
              showError(result);
            }
          });
        }
      }

      if (applicationType == "DOA" && validateForm2DOA()) {
        if (propertyStatus == "Lease Hold" && applicationType == "DOA") {
          // var spinner = document.getElementById('spinnerOverlay');
          spinner.style.display = "flex";
          deedOfApartmentStepFinal(function (success, result) {
            if (result.status) {
              btn.innerHTML =
                'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              spinner.style.display = "none";
              showSuccess(
                result.message,
                getBaseURL() + "/applications/history/details"
              );
            } else {
              btn.innerHTML =
                'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>';
              btn.disabled = false;
              spinner.style.display = "none";
              showError(result.message);
            }
          });
        }
      }
      if (applicationType == "CONVERSION" && validateForm3Conv()) {
        // var spinner = document.getElementById('spinnerOverlay');
        btn.textContent = "Submitting...";
        btn.disabled = true;
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        conversionStep3(function (success, result) {
          console.log("conversionStep3 callback triggered", result); // Debugging log
          if (success) {
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            spinner.style.display = "none";
            showSuccess(result, getBaseURL() + "/applications/history/details");
          } else {
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            spinner.style.display = "none";
            showError(result);
          }
        });
      }

      if (applicationType == "NOC" && validateForm2Noc()) {
        // if (applicationType == "NOC") {
        btn.textContent = "Submitting...";
        btn.disabled = true;
        // var spinner = document.getElementById('spinnerOverlay');
        spinner.style.display = "flex";
        nocFinalStep(function (success, result) {
          console.log("nocfinalStep callback triggered", result); // Debugging log
          if (success) {
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            spinner.style.display = "none";
            showSuccess(result, getBaseURL() + "/applications/history/details");
          } else {
            btn.innerHTML = 'Next <i class="bx bx-right-arrow-alt ms-2"></i>';
            btn.disabled = false;
            spinner.style.display = "none";
            showError(result);
          }
        });
      }
    });
  });

  // created commn function by anil for set max date on date input on 27-03-2025
  var today = new Date().toISOString().split("T")[0];
  // console.log(isEditing , "isEditing ");
  $(".coapplicant-block .item-content input[type='date']").attr("max", today);
  regdate.setAttribute("max", today);
  convRegDate.setAttribute("max", today);
  // add condition for check if input is available then set max date today by anil on 16-04-2025
  if (convCourtOrderDate) {
    convCourtOrderDate.setAttribute("max", today);
  }
  if (convDateOfNOC) {
    convDateOfNOC.setAttribute("max", today);
  }
  if (convAttestedLetterDate) {
    convAttestedLetterDate.setAttribute("max", today);
  }
  if (convContructionProofDate) {
    convContructionProofDate.setAttribute("max", today);
  }
  if (convPossessionProofDate) {
    convPossessionProofDate.setAttribute("max", today);
  }
  if (convDocLeaseDeedDoEDate) {
    convDocLeaseDeedDoEDate.setAttribute("max", today);
  }
  if (convMandDocADateAttestation) {
    convMandDocADateAttestation.setAttribute("max", today);
  }
  if (convLesseeAliveAffidevitDate) {
    convLesseeAliveAffidevitDate.setAttribute("max", today);
  }
  if (convLeaseLostAffidevitDate) {
    convLeaseLostAffidevitDate.setAttribute("max", today);
  }
  if (publicNoticeDateEnglish) {
    publicNoticeDateEnglish.setAttribute("max", today);
  }
  if (publicNoticeDateHindi) {
    publicNoticeDateHindi.setAttribute("max", today);
  }
  if (muteDethDate) {
    muteDethDate.setAttribute("max", today);
  }
  if (muteDethCertificateIssueDate) {
    muteDethCertificateIssueDate.setAttribute("max", today);
  }
  if (muteSaleDeedRegDate) {
    muteSaleDeedRegDate.setAttribute("max", today);
  }
  if (muteSaleDeedRegDate) {
    muteWillRegDate.setAttribute("max", today);
  }
  if (muteUnregdWillDate) {
    muteUnregdWillDate.setAttribute("max", today);
  }
  if (muteRelinquishDeedRegdate) {
    muteRelinquishDeedRegdate.setAttribute("max", today);
  }
  if (muteGiftDeedRegdate) {
    muteGiftDeedRegdate.setAttribute("max", today);
  }
  if (muteSmcDateOfIssue) {
    muteSmcDateOfIssue.setAttribute("max", today);
  }
  // if (muteSbpDateOfIssue) {
  //   muteSbpDateOfIssue.setAttribute("max", today);
  // }
});

/**Land use change Added by Nitin */
let propertyTypes; // to capture allowed property types for land use
function getLandUseChangeData(propertyId, updateId, callback) {
  var baseUrl = getBaseURL();

  var csrfToken = $('meta[name="csrf-token"]').attr("content");
  $.ajax({
    url: baseUrl + "/application/fetch-luc-details",
    type: "POST",
    dataType: "JSON",
    data: {
      _token: csrfToken,
      propertyId: propertyId,
      updateId: updateId,
    },
    success: function (response) {
      if (response.status && response.status == "error") {
        if (callback) callback(false, response.details);
      } else {
        if (response.colony_id) {
          $("#luclocality").append(
            `<option value=${response.colony_id}>${response.colony_name}</option>`
          );
        }
        $("#lucblockno").val(response.block_no ?? "");
        $("#lucplotno").val(response.plot_no ?? "");
        $("#lucknownas").val(response.known_as ?? "");
        $("#lucarea").val(response.area ?? "");
        $("#leasetype").val(response.lease_type ?? "");
        let allowdChnage = response.allowdChnage;
        let firstRow = allowdChnage[0];
        $("#lucpropertytype").append(
          `<option value="${firstRow.property_type_from}"> ${firstRow.fromTypeName}</option>`
        );
        $("#lucpropertysubtype").append(
          `<option value="${firstRow.property_sub_type_from}"> ${firstRow.fromSubtypeName}</option>`
        );
        let keys = Object.keys(allowdChnage);
        propertyTypes = [];
        $("#lucpropertytypeto").html('<option value="">Select</option>');
        let propertyTypeMap = new Map();

        $.each(allowdChnage, function (index, row) {
          if (!propertyTypeMap.has(row.property_type_to)) {
            propertyTypeMap.set(row.property_type_to, {
              id: row.property_type_to,
              name: row.toTypeName,
              subtypes: [
                {
                  id: row.property_sub_type_to,
                  name: row.toSubtypeName,
                  rate: row.rate,
                },
              ],
            });
            var appendOption = `<option value="${row.property_type_to}" ${
              isEditing == 1 &&
              application.property_type_change_to == row.property_type_to
                ? "selected"
                : ""
            }>${row.toTypeName}</option>`;
            $("#lucpropertytypeto").append(appendOption);
          } else {
            let propertyType = propertyTypeMap.get(row.property_type_to);
            propertyType.subtypes.push({
              id: row.property_sub_type_to,
              name: row.toSubtypeName,
              rate: row.rate,
            });
          }
        });
        propertyTypes = Array.from(propertyTypeMap.values());

        if (isEditing) {
          $("#lucpropertytypeto").change();
          $("#lucpropertysubtypeto").change();
        }
        if (callback) {
          callback(true, "");
        }
      }
    },
    error: (err) => {
      if (err.responseJSON && err.responseJSON.message) {
        if (callback) callback(false, err.responseJSON.message);
      } else {
        if (callback) callback(false, "Unknown error!!");
      }
    },
  });
}

$("#lucpropertytypeto").change(function () {
  let propertyTypeTo = $(this).val();
  if (propertyTypeTo != "") {
    $("#lucpropertysubtypeto").html('<option value="">Select</option>');
    let selectedPropertyType = propertyTypes.find(
      (type) => type.id == propertyTypeTo
    );
    if (selectedPropertyType) {
      let subtypes = selectedPropertyType.subtypes;
      $.each(subtypes, (i, val) => {
        $("#lucpropertysubtypeto").append(
          `<option value="${val.id}" data-rate="${val.rate}" ${
            isEditing == true &&
            application.property_subtype_change_to == val.id
              ? "selected"
              : ""
          }>${val.name}</option>`
        );
      });
    }
  }
});

function landUseChange(callback) {
  var baseUrl = getBaseURL();
  var csrfToken = $('meta[name="csrf-token"]').attr("content");
  var id = $("input[name='updateId']").val();
  var oldPropertyId = $("#propertyid").val();
  var propertyTypeFrom = $("#lucpropertytype").val();
  var propertySubtypeFrom = $("#lucpropertysubtype").val();
  var propertyTypeTo = $("#lucpropertytypeto").val();
  var propertySubtypeTo = $("#lucpropertysubtypeto").val();
  var statusofapplicant = $("#statusofapplicant").val();
  var mixedUse = $("#mixed_LUC").is(":checked");
  var totalBUiltUpArea = $("#luc_TBUA").val();
  var commercialArea = $("#luc_BUAC").val();
  $.ajax({
    type: "POST",
    url: `${baseUrl}/application/luc-step-1`,
    data: {
      _token: csrfToken,
      id: id,
      oldPropertyId: oldPropertyId,
      propertyTypeFrom: propertyTypeFrom,
      propertySubtypeFrom: propertySubtypeFrom,
      propertyTypeTo: propertyTypeTo,
      propertySubtypeTo: propertySubtypeTo,
      applicantStatus: statusofapplicant,
      mixedUse: mixedUse,
      totalBUiltUpArea: totalBUiltUpArea,
      commercialArea: commercialArea,
    },
    success: function (response) {
      if (response.status == "success") {
        $("input[name='updateId']").val(response.id);
        if (callback) callback(true, response.message); // Call the callback with success
      } else {
        if (callback) callback(false, response.details);
      }
    },
    error: function (response) {
      if (callback) callback(false, response.responseJSON.error);
    },
  });
}

function landUseChangeStep2(callback) {
  var id = $("input[name='updateId']").val();
  var baseUrl = getBaseURL();
  var csrfToken = $('meta[name="csrf-token"]').attr("content");
  var consent = $("#lucagreeconsent").is(":checked");
  $.ajax({
    type: "POST",
    url: baseUrl + "/application/luc-step-2",
    data: { id: id, _token: csrfToken, consent: consent ? 1 : 0 },
    success: function (response) {
      console.log(response);
      // return false;
      if (response.url) {
        window.location.href = response.url;
      } else {
        if (response.status == "success") {
          if (callback) callback(true, response.message);
        } else {
          if (response.missing) {
            let errorArr = [];
            response.missing.forEach((element, index) => {
              $("#" + element.id + "Error").html("This document is required.");
              errorArr.push(`${element.label} is required`);
            });
            if (callback) callback(false, errorArr);
          }
          if (response.message) {
            if (callback) callback(false, response.message);
          }
        }
      }
    },
    error: function (err) {
      if (err.responseJSON && err.responseJSON.message) {
        if (callback) callback(false, err.responseJSON.message);
      } else {
      }
    },
  });
}

function deedOfApartmentStepFinal(callback) {
  var updateId = $("input[name='updateId']").val();
  var baseUrl = getBaseURL();
  var csrfToken = $('meta[name="csrf-token"]').attr("content");
  var agreeConsent = $("#agreeDOAConsent").is(":checked") ? 1 : 0;
  $.ajax({
    type: "POST",
    url: baseUrl + "/doa-step-final",
    dataType: "JSON",
    data: { updateId: updateId, _token: csrfToken, agreeConsent: agreeConsent },
    success: function (result) {
      if (result.status) {
        if (result.url) {
          window.location.href = result.url;
        }
        $("#btnfinalsubmit").html(
          'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#btnfinalsubmit").prop("disabled", false);
        if (callback) callback(true, result); // Call the callback with success
      } else {
        // Handle failure scenario
        $("#btnfinalsubmit").html(
          'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#btnfinalsubmit").prop("disabled", false);
        if (callback) callback(false, result); // Call the callback with failure
      }
    },
    error: function (err) {
      $("#submitbtn1").html(
        'Proceed to Pay <i class="bx bx-right-arrow-alt ms-2"></i>'
      );
      $("#submitbtn1").prop("disabled", false);
      if (err.responseJSON && err.responseJSON.message) {
        if (callback) callback(false, err.responseJSON.message);
      } else {
        if (callback) callback(false, "Unknown error!!");
      }
    },
  });
}

function displayEstimatedCharges() {

  // folowing function is copied from demand input form and modified by Nitin Raghuvanshi on 17 March 2025
  $(".builtUpAreaInputs .error").empty();

  let landValue = 0;
  let landArea = 0;
  let landSizeSpan = $("#land-size-span");

  if (landSizeSpan.length > 0) {
    landArea = parseFloat(landSizeSpan.text().replace("Sq. Mtr.", "")) || 0;
  }

  let chargesApplicabe = true;
  let mixedUse = $("#mixed_LUC").is(":checked");

  if (mixedUse) {
    let tbuac = parseFloat($("#luc_TBUA").val()) || 0;
    let buac = parseFloat($("#luc_BUAC").val()) || 0;

    if (tbuac > landArea) {
      $("#luc_TBUA_error").html(
        `Total built-up area cannot be more than land size ${landArea} Sq.m.`
      );
      return false;
    }

    if (tbuac > 0) {
      if (buac > 0) {
        if (buac > tbuac) {
          $("#luc_BUAC_error").html(
            "Commercial area cannot be more than total built-up area."
          );
          return false;
        }
        let chargableArea = (20 * tbuac) / 100;
        if (buac <= chargableArea) {
          chargesApplicabe = false;
        }
      } else {
        $("#luc_BUAC_error").html("Area to be used as commercial is required.");
        return false;
      }
    } else {
      $("#luc_TBUA_error").html("Total built-up area is required.");
      return false;
    }
  }

  if (chargesApplicabe) {
    let baseUrl = getBaseURL();
    let propertyId = $("#propertyid").val();

    $.ajax({
      type: "GET",
      url: `${baseUrl}/land-use-change/property-type-options/${propertyId}`,
      success: function (response) {
        if (response.status === "success" && response.propertyDetails) {
          landValue = response.propertyDetails.land_value;
        }

        // Move calculation & UI update inside the AJAX success callback
        let lucc = chargesApplicabe ? (landValue * 10) / 100 : 0;
        lucc = (Math.round(lucc * 100) / 100).toFixed(2);

        $("#estimatedCharges").html("₹ " + customNumFormat(lucc));
        $("#chargesCalculationInfo").html("10% of land value");

        $(".estimate").removeClass("d-none");
      },
    });
  } else {
    $("#estimatedCharges").html("₹ " + 0.0);
    $("#chargesCalculationInfo").html(
      "0 as land area to be used as commercial is less than 20% of total area."
    );

    $(".estimate").removeClass("d-none");
  }
}


function getUserDetails() {
  return $.ajax({
    url: fetchUserDetailsUrl,
    type: "GET",
    dataType: "JSON"
  });
}


// Add event listeners to checkboxes
document.querySelectorAll(".documentType").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    const { value, checked, id } = this; // Destructuring for clarity
    handleCheckboxChange(value, checked, id);
  });

  // Check if the checkbox is already checked (on page load)
  const { checked, id } = checkbox;
  handleCheckboxChange(checkbox.value, checked, id);
});

// Function to handle showing/hiding elements based on checkbox state
function handleCheckboxChange(value, checked, id) {
  const element = $(`#stepThreeDiv #${id}`);

  if (checked) {
    element.show();
  } else {
    element.hide();
  }
}


function showErrorMessage(form, message, selector) {
  var inputField = $(form).find(selector);
  var errorMessageSpan = inputField.siblings(".error-message");
  errorMessageSpan.text(message).show();
}

// add common function for all application power of attorney file input by anil on 22-04-2025
function validatePowerAttorney(stepAttr) {
  var container = document.querySelector(`[data-applicant="${stepAttr}"]`);

  if (!container) {
    console.warn(`Container with data-step="${stepAttr}" not found`);
    return false;
  }

  var appPowerAttorney = container.querySelector("#documentpowerofattorney");
  var appPowerAttorneyError = container.querySelector(
    "#documentpowerofattorneyError"
  );

  if (
    appPowerAttorney.files.length === 0 &&
    appPowerAttorney.getAttribute("data-should-validate") != 1
  ) {
    appPowerAttorneyError.textContent = "PDF file is required.";
    return false;
  }

  if (appPowerAttorney.files.length > 0) {
    const PowerAttorneyFile = appPowerAttorney.files[0];
    console.log(appPowerAttorney, PowerAttorneyFile);
    const fileName = PowerAttorneyFile.name.toLowerCase();

    if (!fileName.endsWith(".pdf")) {
      appPowerAttorneyError.textContent = "Only PDF files are allowed.";
      return false;
    }

    if (PowerAttorneyFile.size > 5 * 1024 * 1024) {
      appPowerAttorneyError.textContent = "File size must be less than 5 MB.";
      return false;
    }
  }
  appPowerAttorneyError.textContent = "";
  return true;
}

function validatePOADoc(container) {
  var applicantStatus = $("select[name='mutStatusOfApplicant']").val();
  let isPoAValid = true;
  if (applicantStatus === "1581") {
    isPoAValid = validatePowerAttorney(container); // direct validation
  }
  return isPoAValid;
}

// End common function for all application power of attorney file input by anil on 22-04-2025

// add common function for all application other document file input by anil on 22-04-2025
function validateAppOtherDoc(stepAttr) {
  var otherDocContainer = document.querySelector(
    `[data-applicant="${stepAttr}"]`
  );

  if (!otherDocContainer) {
    console.warn(`Container with data-step="${stepAttr}" not found`);
    return false;
  }

  var otherDocApp = otherDocContainer.querySelector(
    "#otherDocumentbyApplicant"
  );
  var otherDocAppError = otherDocContainer.querySelector(
    "#otherDocumentbyApplicantError"
  );

  if (!otherDocApp || !otherDocAppError) {
    console.warn("File input or error message element not found.");
    return false;
  }

  // If no file is selected, just return true (no error)
  if (otherDocApp.files.length === 0) {
    otherDocAppError.textContent = "";
    return true;
  }

  // If file is selected, perform file format and size validation
  var file = otherDocApp.files[0];

  // Check file size (less than 5MB)
  if (file.size > 5 * 1024 * 1024) {
    otherDocAppError.textContent = "File size must be less than 5 MB.";
    return false;
  }

  // Check if the file is a PDF
  if (!file.name.endsWith(".pdf")) {
    otherDocAppError.textContent = "Only PDF files are allowed.";
    return false;
  }

  // If everything is valid, clear the error message
  otherDocAppError.textContent = "";
  return true;
}
//End common function for all application other document file input by anil on 22-04-2025

// add common function for draft for remove "View saved document" link when a new file is uploaded, by anil on 22-04-2025
document.addEventListener("change", function (e) {
  if (e.target && e.target.matches('input[type="file"]')) {
    const fileInput = e.target;

    if (fileInput.files.length > 0) {
      const formGroup = fileInput.closest(".form-group");

      if (formGroup) {
        const links = formGroup.querySelectorAll("a");

        links.forEach((link) => {
          const linkText = link.textContent.trim().toLowerCase();
          if (
            linkText.startsWith("view uploaded") ||
            linkText.startsWith("view saved")
          ) {
            link.remove();
          }
        });

        // Remove the data-should-validate attribute after removing the link
        fileInput.removeAttribute("data-should-validate");
      }
    }
  }
});
// End common function for draft for remove "View saved document" link when a new file is uploaded, by anil on 22-04-2025

// add new function for edit additional documents and remark form validation by anil on 24-04-2025
function validateEditDoc() {
  let isEditDocFormValid = true;

  // Loop through each .items (document form group)
  $("#file-inputs-container .items").each(function () {
    const $editDocForm = $(this);

    const $docTitleInput = $editDocForm.find(
      "input[name='additional_document_titles[]']"
    );
    const $docFileInput = $editDocForm.find(
      "input[name='additional_documents[]']"
    );

    if ($docTitleInput.length === 0 && $docFileInput.length === 0) return;

    const editDocTitleVal = $docTitleInput.val()?.trim() || "";
    const editDocFileVal = $docFileInput[0]?.files[0];

    // ✅ Skip validation if both title and file are empty
    if (!editDocTitleVal && !editDocFileVal) {
      $docTitleInput.siblings(".text-danger").text("");
      $docFileInput.siblings(".text-danger").text("");
      return;
    }

    let editDocHasError = false;

    // Check if one is filled but the other is not
    if (
      (editDocTitleVal && !editDocFileVal) ||
      (!editDocTitleVal && editDocFileVal)
    ) {
      editDocHasError = true;

      if (!editDocTitleVal) {
        $docTitleInput
          .siblings(".text-danger")
          .text("Title is required when document is uploaded.");
      } else {
        $docTitleInput.siblings(".text-danger").text("");
      }

      if (!editDocFileVal) {
        $docFileInput
          .siblings(".text-danger")
          .text("Document is required when title is provided.");
      } else {
        $docFileInput.siblings(".text-danger").text("");
      }
    }

    // Validate title format
    if (editDocTitleVal) {
      if (!/^[A-Za-z\s]+$/.test(editDocTitleVal)) {
        editDocHasError = true;
        $docTitleInput
          .siblings(".text-danger")
          .text("Title must contain letters only.");
      } else {
        $docTitleInput.siblings(".text-danger").text("");
      }
    }

    // Validate file format and size
    if (editDocFileVal) {
      const fileName = editDocFileVal.name.toLowerCase();
      const fileSize = editDocFileVal.size;

      if (!fileName.endsWith(".pdf")) {
        editDocHasError = true;
        $docFileInput
          .siblings(".text-danger")
          .text("Only PDF files are allowed.");
      } else if (fileSize > 5 * 1024 * 1024) {
        editDocHasError = true;
        $docFileInput
          .siblings(".text-danger")
          .text("File size must be less than 5MB.");
      } else {
        $docFileInput.siblings(".text-danger").text("");
      }
    }

    if (editDocHasError) {
      isEditDocFormValid = false;
    }
  });

  // ✅ Validate mandatory textarea outside of file container
  const $additionalRemarkTextarea = $("textarea[name='additionalRemark']");
  const $additionalRemarkError = $("#additionalRemark");
  const additionalRemarkVal = $additionalRemarkTextarea.val()?.trim() || "";

  if (!additionalRemarkVal) {
    isEditDocFormValid = false;
    $additionalRemarkError.text("Remark is required.");
  } else if (additionalRemarkVal.length > 500) {
    isEditDocFormValid = false;
    $additionalRemarkError.text("Remark must be under 500 characters.");
  } else {
    $additionalRemarkError.text("");
  }

  return isEditDocFormValid;
}

function validateEditAdditionalDocuments() {
  var isEditDoc = validateEditDoc();
  return isEditDoc;
}

// Get all buttons with class 'edit-step3'
var editFinalSubmit = document.getElementsByClassName("edit-step3");

Array.from(editFinalSubmit).forEach((btn) => {
  btn.addEventListener("click", function (event) {
    // Get application type and status from the form
    var applicationType = $("select[name='applicationType']").val();

    // Check if application type is valid and if additional documents are valid
    const validTypesName = ["CONVERSION", "SUB_MUT", "NOC"];

    // If validation passes, set text and disable the button
    if (
      validTypesName.includes(applicationType) &&
      validateEditAdditionalDocuments()
    ) {
      btn.textContent = "Submitting..."; // Change button text
      btn.disabled = true; // Disable button to prevent double submission
      // Submit the parent form manually
      btn.closest("form").submit();
    } else {
      // Prevent form submission if validation fails
      event.preventDefault();
      btn.disabled = false; // Re-enable the button in case of validation failure
    }
  });
});

// End new function for edit additional documents and remark form validation by anil on 24-04-2025