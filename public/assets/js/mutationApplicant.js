  // ✅ not apply 'blur change' on date inputs for final validation (after manual entry) by anil 26-03-2025
  $(document).on(
    "blur change",
    "#repeater .coapplicant-block input:not([type='date']), #repeater .coapplicant-block select, #repeater .repeater-add-btn",
    function () {
      coapplicantMutRepeaterForm();
    }
  );

  // ✅ Only apply 'blur' to date inputs for final validation (after manual entry) by anil 26-03-2025
  $(document).on(
    "blur",
    "#repeater .coapplicant-block input[type='date']",
    function () {
      coapplicantMutRepeaterForm();
    }
  );

  // Add a listener to the date of birth field to handle changes when it's cleared
  $(document).on(
    "change",
    "#repeater .coapplicant-block input[type='date']",
    function () {
      var coDobInput = $(this);
      var ageField = coDobInput
        .closest(".coapplicant-block")
        .find("input[id$='_age']");

      // If the date of birth is cleared, clear the age field as well
      if (!coDobInput.val()) {
        ageField.val(""); // Clear the age field
      }
    }
  );

  $("#repeater .coapplicant-block").each(function () {
    var coDobInput = $(this).find("input[id$='_dateofbirth']");
    var ageField = $(this).find("input[id$='_age']");
    var dobValue = coDobInput.val();

    if (dobValue) {
      var dob = new Date(dobValue);
      var age = coCalculateAge(dob);
      ageField.val(age);
    }
  });

  function coapplicantMutRepeaterForm() {
    var isCoapplicantMutValid = true;

    $("#repeater .coapplicant-block").each(function (index, element) {
      let currentIndex = $(this).data("index");
      var coName = $(element).find("#coapplicant_" + currentIndex + "_name").val();
      var coGender = $(element).find("#coapplicant_" + currentIndex + "_gender").val();
      // var coDob = $(element).find('#coapplicant_' + currentIndex + '_dateofbirth').val();
      var coDobInput = $(element).find("#coapplicant_" + currentIndex + "_dateofbirth");
      var ageField = $(element).find("#coapplicant_" + currentIndex + "_age");
      var coRelation = $(element).find("#coapplicant_" + currentIndex + "_secondnameinv").val();
      var coAdhaarNumber = $(element).find("#coapplicant_" + currentIndex + "_aadharnumber").val();
      var coPanNumber = $(element).find("#coapplicant_" + currentIndex + "_pannumber").val();
      var coMobileNumber = $(element).find("#coapplicant_" + currentIndex + "_mobilenumber").val();
      var coPhotoFile = $(element).find("#coapplicant_" + currentIndex + "_photo")[0].files[0]; // Get the actual file

      // var previewImgSrc = $(element).find(".preview").attr("src");
      // var isPreviewImageValid = previewImgSrc && previewImgSrc.trim() !== "" && !previewImgSrc.includes("placeholder") && !previewImgSrc.includes("default");

      var coAdhaarFileInput = $(element).find("#coapplicant_" + currentIndex + "_aadhaarfile");
      var coAdhaarFile = coAdhaarFileInput.length > 0 && coAdhaarFileInput[0].files.length > 0 ? coAdhaarFileInput[0].files[0] : null;

      var coPanFileInput = $(element).find("#coapplicant_" + currentIndex + "_panfile");
      var coPanFile = coPanFileInput.length > 0 && coPanFileInput[0].files.length > 0 ? coPanFileInput[0].files[0] : null;

      var coPhotoFileInput = $(element).find("#coapplicant_" + currentIndex + "_photo");
      var coPhotoFile = coPhotoFileInput.length > 0 && coPhotoFileInput[0].files.length > 0 ? coPhotoFileInput[0].files[0] : null;

      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

      var aadhaarShouldValidate = coAdhaarFileInput.attr("data-should-validate");
      var panShouldValidate = coPanFileInput.attr("data-should-validate");
      var photoShouldValidate = coPhotoFileInput.attr("data-should-validate");

      // var coPhotoFileInput = $(element).find('#coapplicant_' + currentIndex + '_photo');
      // var coPhotoFile = coPhotoFileInput.length > 0 && coPhotoFileInput[0].files.length > 0 ? coPhotoFileInput[0].files[0] : null;
      var today = new Date().toISOString().split("T")[0]; // Get today's date (YYYY-MM-DD format)
      coDobInput.attr("max", today); // Set max date to today

      var coDob = coDobInput.val();

      // Remove previous error messages
      $(element).find(".error-message").text("");

      // Future Date Validation for DOB
      if (coDob) {
        var dob = new Date(coDob);
        var todayDate = new Date();
        todayDate.setHours(0, 0, 0, 0);

        if (dob > todayDate) {
          isCoapplicantMutValid = false;
          showErrorMessage(element, "Date of birth cannot be in the future.","#coapplicant_" + currentIndex + "_dateofbirth");
          coDobInput.val(""); // Clear invalid date
        } else {
          var age = coCalculateAge(dob);
          ageField.val(age);
        }
      }

      // Check if any field is filled
      var isAnyFieldFilled =
        coName ||
        coGender ||
        coDob ||
        coRelation ||
        coAdhaarNumber ||
        coAdhaarFile ||
        coPanNumber ||
        coPanFile ||
        coMobileNumber ||
        coPhotoFile;

      if (isAnyFieldFilled) {
        // Make all fields mandatory if at least one field is filled
        if (!coName) {
          isCoapplicantMutValid = false;
          showErrorMessage(element,"Name is required.","#coapplicant_" + currentIndex + "_name");
        }
        if (!coGender) {
          isCoapplicantMutValid = false;
          showErrorMessage(element,"Gender is required.","#coapplicant_" + currentIndex + "_gender");
        }
        if (!coDob) {
          isCoapplicantMutValid = false;
          showErrorMessage(element,"Date of birth is required.","#coapplicant_" + currentIndex + "_dateofbirth");
        }
        if (!coRelation) {
          isCoapplicantMutValid = false;
          showErrorMessage(element,"Relation is required.","#coapplicant_" + currentIndex + "_secondnameinv");
        }
        if (!coAdhaarNumber) {
          isCoapplicantMutValid = false;
          showErrorMessage(element,"Aadhaar number is required.","#coapplicant_" + currentIndex + "_aadharnumber");
        } else if (!/^\d{12}$/.test(coAdhaarNumber)) {
          isCoapplicantMutValid = false;
          showErrorMessage(element,"Aadhaar number must be 12 digits.","#coapplicant_" + currentIndex + "_aadharnumber");
        }
        if (aadhaarShouldValidate !== "1") {
          if (!coAdhaarFile) {
            isCoapplicantMutValid = false;
            showErrorMessage(element, "Aadhaar PDF is required.", "#coapplicant_" + currentIndex + "_aadhaarfile");
          } else if (coAdhaarFile.size > 5 * 1024 * 1024) {
            isCoapplicantMutValid = false;
            showErrorMessage(element, "Aadhaar file size must be less than 5MB.", "#coapplicant_" + currentIndex + "_aadhaarfile");
          } else if (!coAdhaarFile.name.endsWith(".pdf")) {
            // Check if the file is not a PDF
            isCoapplicantMutValid = false;
            showErrorMessage(element, "Only PDF files are allowed.", "#coapplicant_" + currentIndex + "_aadhaarfile");
          }
        }
        if (!coPanNumber) {
          isCoapplicantMutValid = false;
          showErrorMessage(element, "PAN number is required.", "#coapplicant_" + currentIndex + "_pannumber");
        } else if (!panRegex.test(coPanNumber.toUpperCase())) {
          isCoapplicantMutValid = false;
          showErrorMessage(element, "Invalid PAN number format.", "#coapplicant_" + currentIndex + "_pannumber");
        }
        if (panShouldValidate !== "1") {
          if (!coPanFile) {
            isCoapplicantMutValid = false;
            showErrorMessage(element, "PAN PDF is required.", "#coapplicant_" + currentIndex + "_panfile");
          } else if (coPanFile.size > 5 * 1024 * 1024) {
            isCoapplicantMutValid = false;
            showErrorMessage(element, "PAN file size must be less than 5MB.", "#coapplicant_" + currentIndex + "_panfile");
          } else if (!coPanFile.name.endsWith(".pdf")) {
            // Check if the file is not a PDF
            isCoapplicantMutValid = false;
            showErrorMessage(element, "Only PDF files are allowed.", "#coapplicant_" + currentIndex + "_panfile");
          }
        }
        if (!coMobileNumber) {
          isCoapplicantMutValid = false;
          showErrorMessage(element, "Mobile number is required.", "#coapplicant_" + currentIndex + "_mobilenumber");
        } else if (!/^\d{10}$/.test(coMobileNumber)) {
          isCoapplicantMutValid = false;
          showErrorMessage(element, "Mobile number must be 10 digits.", "#coapplicant_" + currentIndex + "_mobilenumber");
        }

        if (photoShouldValidate !== "1") {
          if (!coPhotoFile) {
            isCoapplicantMutValid = false;
            showErrorMessage(element, "Co-applicant passport size photo is required.", "#coapplicant_" + currentIndex + "_photo");
          } else {
            var coPhotoFileName = coPhotoFile.name;
            var coPhotoFileExtension = coPhotoFileName.split(".").pop().toLowerCase();
            var coPhotoValidExtensions = ["jpg", "jpeg", "png"];

            if (!coPhotoValidExtensions.includes(coPhotoFileExtension)) {
              isCoapplicantMutValid = false;
              showErrorMessage(element, "Only .jpg, .jpeg, and .png formats are allowed.", "#coapplicant_" + currentIndex + "_photo");
              coPhotoFileInput.val(""); // Reset file input
            } else if (coPhotoFile.size > 102400) {
              isCoapplicantMutValid = false;
              showErrorMessage(element, "Passport photo size must be less than 100KB.", "#coapplicant_" + currentIndex + "_photo");
            }
          }
        }
      }
    });

    return isCoapplicantMutValid;
  }

  // Function to calculate age
  function coCalculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const month = today.getMonth();
    const day = today.getDate();

    if (
      month < dob.getMonth() ||
      (month === dob.getMonth() && day < dob.getDate())
    ) {
      age--;
    }
    return age;
  }

  // Function to validate mandatory mutation documents
  // function mandatoryMutDocumentsForm() {
  function validateMandatoryMutDocumentsForm() {
    var isMandatoryMutDocumentsForm = true;
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Loop through all .items inside #affidavits_repeater
    $("#affidavits_repeater .items").each(function (index, element) {
      let currentIndex = $(this).data("index");
      var mutAttestedBy = $(element)
        .find("#affidavits_" + currentIndex + "_affidavitattestedby")
        .val();
      var muteAffidavitsFile = $(element).find(
        "#affidavits_" + currentIndex + "_affidavits"
      )[0]?.files[0]; // File input
      var muteAttestationDate = $(element)
        .find("#affidavits_" + currentIndex + "_affidavitsdateofattestation")
        .val();

      var isMutAttesteValid = true; // Track validity for this specific form

      // Check if the field should be validated
      if (
        $(element).find("#affidavits_" + currentIndex + "_affidavits").attr("data-should-validate") !== "1") {
        // If the file input should not be validated, skip further validation for this field
        // return true; // Skip validation and continue to the next item // commented by anil for not in use and keeping the file validation here
        // Validate file input
        if (!muteAffidavitsFile) {
          isMutAttesteValid = false;
          $(element).find("#affidavits_" + currentIndex + "_affidavits").siblings(".text-danger").text("Affidavit file is required.");
        } else {
          // Validate file size (5MB limit)
          if (muteAffidavitsFile.size > 5 * 1024 * 1024) {
            isMutAttesteValid = false;
            $(element).find("#affidavits_" + currentIndex + "_affidavits").siblings(".text-danger").text("File size must be less than 5MB.");
          } else if (!muteAffidavitsFile.name.toLowerCase().endsWith(".pdf")) {
            isMutAttesteValid = false;
            $(element).find("#affidavits_" + currentIndex + "_affidavits").siblings(".text-danger").text("Only PDF files are allowed.");
          } else {
            $(element).find("#affidavits_" + currentIndex + "_affidavits").siblings(".text-danger").text("");
          }
        }
      }

      // Validate "attested by" field
      if (!mutAttestedBy) {
        isMutAttesteValid = false;
        $(element).find("#affidavits_" + currentIndex + "_affidavitattestedby").siblings(".text-danger").text("Attested by is required.");
      } else if (!/^[A-Za-z\s.]+$/.test(mutAttestedBy)) {
        // Check if it contains only alphabets and spaces
        isMutAttesteValid = false;
        $(element).find("#affidavits_" + currentIndex + "_affidavitattestedby").siblings(".text-danger").text("Attested by must contain letters only.");
      } else {
        $(element)
          .find("#affidavits_" + currentIndex + "_affidavitattestedby")
          .siblings(".text-danger")
          .text("");
      }

      // Validate attestation date (No future dates)
      if (!muteAttestationDate) {
        isMutAttesteValid = false;
        $(element).find("#affidavits_" + currentIndex + "_affidavitsdateofattestation").siblings(".text-danger").text("Date of attestation is required.");
      } else if (muteAttestationDate > today) {
        isMutAttesteValid = false;
        $(element).find("#affidavits_" + currentIndex + "_affidavitsdateofattestation").siblings(".text-danger").text("Future date is not allowed.");
      } else {
        $(element).find("#affidavits_" + currentIndex + "_affidavitsdateofattestation").siblings(".text-danger").text(""); // Clear invalid input
      }

      if (!isMutAttesteValid) {
        isMandatoryMutDocumentsForm = false;
      }
    });

    // Loop through all .items inside #indemnityBond_repeater
    $("#indemnityBond_repeater .items").each(function (index, element) {
      let currentIndex = $(this).data("index");
      var mutIndeBond = $(element).find("#indemnitybond_" + currentIndex + "_indemnitybond")[0]?.files[0]; // File input
      var mutIndeAttestationDate = $(element).find("#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation").val();
      var muteIndeAttestedBy = $(element).find("#indemnitybond_" + currentIndex + "_indemnitybondattestedby").val();

      var isMutIndeValid = true;

      // Check if the field should be validated
      if (
        $(element).find("#indemnitybond_" + currentIndex + "_indemnitybond").attr("data-should-validate") !== "1") {
        // If the file input should not be validated, skip further validation for this field
        // return true; // Skip validation and continue to the next item // commented by anil for not in use and keeping the file validation here
        // Validate "Indemnity Bond" input field
        if (!mutIndeBond) {
          isMutIndeValid = false;
          $(element).find("#indemnitybond_" + currentIndex + "_indemnitybond").siblings(".text-danger").text("Indemnity bond file required.");
        } else {
          // Validate file size (5MB limit)
          if (mutIndeBond.size > 5 * 1024 * 1024) {
            isMutIndeValid = false;
            $(element)
              .find("#indemnitybond_" + currentIndex + "_indemnitybond")
              .siblings(".text-danger")
              .text("File size must be less than 5MB.");
          } else if (!mutIndeBond.name.toLowerCase().endsWith(".pdf")) {
            isMutIndeValid = false;
            $(element)
              .find("#indemnitybond_" + currentIndex + "_indemnitybond")
              .siblings(".text-danger")
              .text("Only PDF files are allowed.");
          } else {
            $(element)
              .find("#indemnitybond_" + currentIndex + "_indemnitybond")
              .siblings(".text-danger")
              .text("");
          }
        }
      }

      // Validate attestation date (No future dates)
      if (!mutIndeAttestationDate) {
        isMutIndeValid = false;
        $(element)
          .find(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          )
          .siblings(".text-danger")
          .text("Date of attestation is required.");
      } else if (mutIndeAttestationDate > today) {
        isMutIndeValid = false;
        $(element)
          .find(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          )
          .siblings(".text-danger")
          .text("Future date is not allowed.");
      } else {
        $(element)
          .find(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          )
          .siblings(".text-danger")
          .text(""); // Clear invalid input
      }

      // Validate "Attested By" field
      if (!muteIndeAttestedBy) {
        isMutIndeValid = false;
        $(element)
          .find("#indemnitybond_" + currentIndex + "_indemnitybondattestedby")
          .siblings(".text-danger")
          .text("Attested by is required.");
      } else if (!/^[A-Za-z\s.]+$/.test(muteIndeAttestedBy)) {
        // Check if it contains only alphabets and spaces
        isMutIndeValid = false;
        $(element)
          .find("#indemnitybond_" + currentIndex + "_indemnitybondattestedby")
          .siblings(".text-danger")
          .text("Attested by must contain letters only.");
      } else {
        $(element)
          .find("#indemnitybond_" + currentIndex + "_indemnitybondattestedby")
          .siblings(".text-danger")
          .text("");
      }

      if (!isMutIndeValid) {
        isMandatoryMutDocumentsForm = false;
      }
    });

    return isMandatoryMutDocumentsForm;
  }

  // Apply max date restriction to prevent future dates in attestation date fields
  $(document).ready(function () {
    var today = new Date().toISOString().split("T")[0];
    let currentIndex = $(this).data("index");
    // Set max date for affidavit attestation date inputs
    $("#affidavits_repeater").on(
      "blur change",
      "#affidavits_repeater .items, #affidavits_repeater .repeater-add-btn",
      function () {
        var today = new Date().toISOString().split("T")[0];
        if (
          $(
            "#affidavits_" + currentIndex + "_affidavitsdateofattestation"
          ).val() > today
        ) {
          $("#affidavits_" + currentIndex + "_affidavitsdateofattestation").val(
            ""
          ); // Clear future date
          $("#affidavits_" + currentIndex + "_affidavitsdateofattestation")
            .siblings(".text-danger")
            .text("Future date is not allowed.");
        } else {
          $("#affidavits_" + currentIndex + "_affidavitsdateofattestation")
            .siblings(".text-danger")
            .text("");
        }
      }
    );

    // Set max date for indemnity bond attestation date inputs
    $("#indemnityBond_repeater").on(
      "blur change",
      "#indemnityBond_repeater .items, #indemnityBond_repeater .repeater-add-btn",
      function () {
        var today = new Date().toISOString().split("T")[0];
        let currentIndex = $(this).data("index");
        if (
          $(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          ).val() > today
        ) {
          $(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          ).val(""); // Clear future date
          $(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          )
            .siblings(".text-danger")
            .text("Future date is not allowed.");
        } else {
          $(
            "#indemnitybond_" + currentIndex + "_indemnitybonddateofattestation"
          )
            .siblings(".text-danger")
            .text("");
        }
      }
    );
    // Apply max date on document load for existing fields
    $(
      "#affidavits_" +
        currentIndex +
        "_affidavitsdateofattestation, #indemnitybond_" +
        currentIndex +
        "_indemnitybonddateofattestation"
    ).attr("max", today);
  });



// Form 1 Fields
  var namergapp = document.getElementById("namergapp");
  var mutExecutedOnAsConLease = document.getElementById(
    "mutExecutedOnAsConLease"
  );
  var regno = document.getElementById("regno");
  var bookno = document.getElementById("bookno");
  var volumeno = document.getElementById("volumeno");
  var pagenoFrom = document.getElementById("pagenoFrom");
  var pagenoTo = document.getElementById("pagenoTo");
  var regdate = document.getElementById("regdate");
  var soughtByApplicant = document.getElementById("soughtByApplicant");
  var YesMortgaged = document.getElementById("YesMortgaged");
  var remarks = document.getElementById("remarks");
  var mutcase = document.getElementById("mutCaseNo");

  // Form 1 Errors
  var namergappError = document.getElementById("namergappError");
  var mutExecutedOnAsConLeaseError = document.getElementById(
    "mutExecutedOnAsConLeaseError"
  );
  var regnoError = document.getElementById("regnoError");
  var booknoError = document.getElementById("booknoError");
  var volumenoError = document.getElementById("volumenoError");
  var pagenoFromError = document.getElementById("pagenoFromError");
  var pagenoToError = document.getElementById("pagenoToError");
  var regdateError = document.getElementById("regdateError");
  var soughtByApplicantError = document.getElementById(
    "soughtByApplicantError"
  );
  var YesMortgagedError = document.getElementById("YesMortgagedError");

  function validateNamerGapp() {
    var namergappValue = namergapp.value.trim();
    if (namergappValue === "") {
      namergappError.textContent = "Executed in favour of is required.";
      namergappError.style.display = "block";
      return false;
    } else {
      namergappError.style.display = "none";
      return true;
    }
  }

  function validateExecutedOn() {
    var mutExecutedOnAsConLeaseValue = mutExecutedOnAsConLease.value.trim();
    if (mutExecutedOnAsConLeaseValue === "") {
      mutExecutedOnAsConLeaseError.textContent =
        "Executed on is required.";
      mutExecutedOnAsConLeaseError.style.display = "block";
      return false;
    } else {
      mutExecutedOnAsConLeaseError.style.display = "none";
      return true;
    }
  }

  function validateRegOn() {
    var regnoValue = regno.value.trim();
    if (regnoValue === "") {
      regnoError.textContent = "Registration number is required.";
      regnoError.style.display = "block";
      return false;
    } else {
      regnoError.style.display = "none";
      return true;
    }
  }

  function validateBookNo() {
    var booknoValue = bookno.value.trim();
    if (booknoValue === "") {
      booknoError.textContent = "Book number is required.";
      booknoError.style.display = "block";
      return false;
    } else {
      booknoError.style.display = "none";
      return true;
    }
  }

  function validateVolumeNo() {
    var volumenoValue = volumeno.value.trim();
    if (volumenoValue === "") {
      volumenoError.textContent = "Volume number is required.";
      volumenoError.style.display = "block";
      return false;
    } else {
      volumenoError.style.display = "none";
      return true;
    }
  }

  $(document).on("input blur change", "#pagenoTo", function () {
    validatePageNoTo();
  });

  function validatePageNoTo() {
    var pagenoValue = pagenoTo.value.trim();
    var pagenoValueFrom = pagenoFrom.value.trim();

    // Check if 'Page number To' is empty
    if (pagenoValue === "") {
      pagenoToError.textContent = "Page number to is required.";
      pagenoToError.style.display = "block";
      return false;
    }

    // Check if the value is numeric
    if (!/^\d+$/.test(pagenoValue)) {
      pagenoToError.textContent = "Page number to must be a numeric value.";
      pagenoToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is a positive integer
    if (parseInt(pagenoValue) <= 0) {
      pagenoToError.textContent = "Page number to must be a positive number.";
      pagenoToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is less than 'Page number From'
    if (parseInt(pagenoValue) < parseInt(pagenoValueFrom)) {
      pagenoToError.textContent =
        "Page number to cannot be less than page number from.";
      pagenoToError.style.display = "block";
      return false;
    }

    // If no issues, hide the error message
    pagenoToError.style.display = "none";
    return true;
  }

  $(document).on("input blur change", "#pagenoFrom", function () {
    validatePageNoFrom();
  });

  function validatePageNoFrom() {
    var pagenoValueFrom = pagenoFrom.value.trim();
    var pagenoValueTo = pagenoTo.value.trim();

    // Check if 'Page number From' is empty
    if (pagenoValueFrom === "") {
      pagenoFromError.textContent = "Page number from is required.";
      pagenoFromError.style.display = "block";
      return false;
    }

    // Check if the value is numeric
    if (!/^\d+$/.test(pagenoValueFrom)) {
      pagenoFromError.textContent = "Page number from must be a numeric value.";
      pagenoFromError.style.display = "block";
      return false;
    }

    // Check if 'Page number From' is a positive integer
    if (parseInt(pagenoValueFrom) <= 0) {
      pagenoFromError.textContent = "Page number from must be a positive number.";
      pagenoFromError.style.display = "block";
      return false;
    }

    // Check if 'Page number From' is greater than 'Page number To'
    if (parseInt(pagenoValueFrom) > parseInt(pagenoValueTo)) {
      pagenoFromError.textContent =
        "Page number from cannot be greater than page number to.";
      pagenoFromError.style.display = "block";
      return false;
    }

    // If no issues, hide the error message
    pagenoFromError.style.display = "none";
    return true;
  }

  function validateRegDate() {
    var regdateValue = regdate.value.trim();
    var mutExecutedOnAsConValueLease = mutExecutedOnAsConLease.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    var regdateObj = new Date(regdateValue);
    var mutExecutedOnAsConLeaseObj = new Date(mutExecutedOnAsConValueLease);

    if (regdateValue === "") {
      regdateError.textContent = "Registration date is required.";
      regdateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (regdateValue > today) {
      regdateError.textContent = "Registration date cannot be in the future.";
      regdateError.style.display = "block";
      regdate.value = ""; // Clear the invalid date
      return false;
    }

    // Ensure regdate is not earlier than mutExecutedOnAsConLease
    if (regdateObj < mutExecutedOnAsConLeaseObj) {
      regdateError.textContent = "Registration cannot occur prior to the execution date.";
      regdateError.style.display = "block";
      regdate.value = ""; // Clear the invalid date
      return false;
    }

    regdateError.style.display = "none";
    return true;
  }

  function validateSoughtApplicant() {
    var soughtByApplicantValue = document.querySelectorAll(
      ".documentType:checked"
    );
    if (soughtByApplicantValue.length === 0) {
      soughtByApplicantError.style.display = "block";
      soughtByApplicantError.textContent =
        "Select at least one document.";
      return false;
    } else {
      soughtByApplicantError.style.display = "none";
      return true;
    }
  }

  function validateYesMortgages() {
    if (YesMortgaged.checked) {
      var remarksValue = remarks.value.trim();
      if (remarksValue === "") {
        YesMortgagedError.textContent = "Remark is required.";
        YesMortgagedError.style.display = "block";
        return false;
      } else {
        YesMortgagedError.style.display = "none";
      }
    }
    return true;
  }

  // Validate Form 1 MUT
  function validateForm1MUT() {
    var isCoapplicantValid = coapplicantMutRepeaterForm();
    var isFarm1MUTValid = validateNamerGapp();
    var isExecutedOnValid = validateExecutedOn();
    var isRegOnValid = validateRegOn();
    var isBookNoValid = validateBookNo();
    var isVolumeNoValid = validateVolumeNo();
    var isPageNoFromValid = validatePageNoFrom();
    var isPageNoToValid = validatePageNoTo();
    var isRegDateValid = validateRegDate();
    var isSoughtApplicantValid = validateSoughtApplicant();
    var isYesMortgagesValid = validateYesMortgages();
    var isStatusOfApplicantValid = validateStatusOfApplicant();
    // var isYesCourtOrderValid = validYesCourtOrder();

    return (
      isCoapplicantValid &&
      isFarm1MUTValid &&
      isExecutedOnValid &&
      isRegOnValid &&
      isBookNoValid &&
      isVolumeNoValid &&
      isPageNoFromValid &&
      isPageNoToValid &&
      isRegDateValid &&
      isSoughtApplicantValid &&
      isYesMortgagesValid &&
      isStatusOfApplicantValid
      // isYesCourtOrderValid
    );
  }

  function validateEditMut1() {
    var isCoapplicantValid = coapplicantMutRepeaterForm();
    var isRegOnValid = validateRegOn();
    var isBookNoValid = validateBookNo();
    var isVolumeNoValid = validateVolumeNo();
    var isPageNoFromValid = validatePageNoFrom();
    var isPageNoToValid = validatePageNoTo();
    var isRegDateValid = validateRegDate();
    var isSoughtApplicantValid = validateSoughtApplicant();
    var isYesMortgagesValid = validateYesMortgages();

    return (
      isCoapplicantValid &&
      isRegOnValid &&
      isBookNoValid &&
      isVolumeNoValid &&
      isPageNoFromValid &&
      isPageNoToValid &&
      isRegDateValid &&
      isSoughtApplicantValid &&
      isYesMortgagesValid
    );
  }

    // for storing first step of mutation- Sourav Chauhan (17/sep/2024)
  function mutation(propertyid, propertyStatus, callback) {
    var updateId = $("input[name='updateId']").val();
    var statusofapplicant = $("#statusofapplicant").val();
    var mutNameApp = $("input[name='mutNameApp']").val();
    var mutGenderApp = $("input[name='mutGenderApp']").val();
    var mutAgeApp = $("input[name='mutAgeApp']").val();
    // var mutFathernameApp = $("input[name='mutFathernameApp']").val();
    var mutExecutedOnAsConLease = $(
      "input[name='mutExecutedOnAsConLease']"
    ).val();
    var mutAadharApp = $("input[name='mutAadharApp']").val();
    var mutPanApp = $("input[name='mutPanApp']").val();
    var mutMobilenumberApp = $("input[name='mutMobilenumberApp']").val();

    var mutNameAsConLease = $("input[name='mutNameAsConLease']").val();
    var mutFathernameAsConLease = $(
      "input[name='mutFathernameAsConLease']"
    ).val();
    var mutRegnoAsConLease = $("input[name='mutRegnoAsConLease']").val();
    var mutBooknoAsConLease = $("input[name='mutBooknoAsConLease']").val();
    var mutVolumenoAsConLease = $("input[name='mutVolumenoAsConLease']").val();
    var mutPagenoFrom = $("input[name='mutPagenoFrom']").val();
    var mutPagenoTo = $("input[name='mutPagenoTo']").val();
    var mutRegdateAsConLease = $("input[name='mutRegdateAsConLease']").val();
    // var soughtByApplicant = $("#soughtByApplicant").val();
    const soughtByApplicantDocuments = [];
    const checkboxes = document.querySelectorAll(".documentType:checked");
    checkboxes.forEach(function (checkbox) {
      soughtByApplicantDocuments.push(checkbox.value);
    });
    var mutPropertyMortgaged = $(
      "input[name='mutPropertyMortgaged']:checked"
    ).val();
    var mutMortgagedRemarks = $("textarea[name='mutMortgagedRemarks']").val();
    var mutCourtorder = $("input[name='courtorderMutation']:checked").val();
    var mutCaseNo = $("input[name='mutCaseNo']").val();
    var mutCaseDetail = $("textarea[name='mutCaseDetail']").val();

    var coapplicants = {};

    var formData = new FormData();
    formData.append("_token", $('meta[name="csrf-token"]').attr("content")); // CSRF token
    formData.append("updateId", updateId);
    formData.append("propertyid", propertyid);
    formData.append("propertyStatus", propertyStatus);
    formData.append("statusofapplicant", statusofapplicant);
    formData.append("mutNameApp", mutNameApp);
    formData.append("mutGenderApp", mutGenderApp);
    formData.append("mutAgeApp", mutAgeApp);
    formData.append("mutExecutedOnAsConLease", mutExecutedOnAsConLease);
    formData.append("mutAadharApp", mutAadharApp);
    formData.append("mutPanApp", mutPanApp);
    formData.append("mutMobilenumberApp", mutMobilenumberApp);
    formData.append("mutNameAsConLease", mutNameAsConLease);
    formData.append("mutFathernameAsConLease", mutFathernameAsConLease);
    formData.append("mutRegnoAsConLease", mutRegnoAsConLease);
    formData.append("mutBooknoAsConLease", mutBooknoAsConLease);
    formData.append("mutVolumenoAsConLease", mutVolumenoAsConLease);
    formData.append("mutPagenoFrom", mutPagenoFrom);
    formData.append("mutPagenoTo", mutPagenoTo);
    formData.append("mutRegdateAsConLease", mutRegdateAsConLease);
    // formData.append('soughtByApplicant', soughtByApplicant);
    formData.append("soughtByApplicantDocuments", soughtByApplicantDocuments);
    formData.append("mutPropertyMortgaged", mutPropertyMortgaged);
    formData.append("mutMortgagedRemarks", mutMortgagedRemarks);
    formData.append("mutCourtorder", mutCourtorder);
    formData.append("mutCaseNo", mutCaseNo);
    formData.append("mutCaseDetail", mutCaseDetail);

    $("input[name^='coapplicant'], select[name^='coapplicant']").each(
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
    // var csrfToken = $('meta[name="csrf-token"]').attr("content");
    $.ajax({
      url: baseUrl + "/mutation-step-first",
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
        $("#submitbtn1").html(
          'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
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
 

    // Form 2 Fields
  var affidavits = document.getElementById("affidavits");
  var affidavitsDateAttestation = document.getElementById("dateattestation");
  var affidavitsAttestedby = document.getElementById("attestedby");
  var indemnityBond = document.getElementById("indemnityBond");
  var indemnityBonddateattestation = document.getElementById("indemnityBondDateOfAttestation");
  var indemnityBondattestedby = document.getElementById("indemnityBondAttestedBy");
  var leaseconyedeed = document.getElementById("leaseconyedeed");
  var dateofexecution = document.getElementById("leaseConvDeedDateOfExecution");
  var lesseename = document.getElementById("leaseConvDeedLesseename");
  var pannumber = document.getElementById("panNumber");
  // var pancertificateno = document.getElementById("panCertificateNo");
  // var pandateissue = document.getElementById("pandateissue");

  var aadharnumber = document.getElementById("aadharnumber");
  var publicNoticeEnglish = document.getElementById("publicNoticeEnglish");
  var newspaperNameEnglish = document.getElementById("newspaperNameEnglish");
  var publicNoticeDateEnglish = document.getElementById("publicNoticeDateEnglish");
  var publicNoticeHindi = document.getElementById("publicNoticeHindi");
  var newspaperNameHindi = document.getElementById("newspaperNameHindi");
  var publicNoticeDateHindi = document.getElementById("publicNoticeDateHindi");
  var propertyPhoto = document.getElementById("propertyPhoto");

  // Form 2 Errors
  var affidavitsError = document.getElementById("affidavitsError");
  var dateattestationError = document.getElementById("affidavitsDateOfAttestationError");
  var attestedbyError = document.getElementById("affidavitAttestedByError");
  var indemnityBondError = document.getElementById("indemnityBondError");
  var indemnityBonddateattestationError = document.getElementById("indemnityBondDateOfAttestationError");
  var indemnityBondattestedbyError = document.getElementById("indemnityBondAttestedByError");
  var leaseconyedeedError = document.getElementById("leaseconyedeedError");
  var dateofexecutionError = document.getElementById("leaseConvDeedDateOfExecutionError");
  var lesseenameError = document.getElementById("leaseConvDeedLesseenameError");
  var pannumberError = document.getElementById("panNumberError");
  var aadharnumberError = document.getElementById("aadharnumberError");
  var publicNoticeEnglishError = document.getElementById("publicNoticeEnglishError");
  var newspaperNameEnglishError = document.getElementById("newspaperNameEnglishError");
  var publicNoticeDateEnglishError = document.getElementById("publicNoticeDateEnglishError");
  var publicNoticeHindiError = document.getElementById("publicNoticeHindiError");
  var newspaperNameHindiError = document.getElementById("newspaperNameHindiError");
  var publicNoticeDateHindiError = document.getElementById("publicNoticeDateHindiError");
  var propertyPhotoError = document.getElementById("propertyPhotoError");

  function validateAffidavits() {
    if (affidavits.files.length > 0) {
      var file = affidavits.files[0];
      if (file.size > 5 * 1024 * 1024) {
        affidavitsError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        affidavitsError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        affidavitsError.textContent = "";
        return true;
      }
    } else {
      if (affidavits.getAttribute("data-should-validate") == 1) {
        return true;
      }
      affidavitsError.textContent = "Affidavit is required.";
      return false;
    }
  }
  function validateDateofAffidavits() {
    var affidavitsDateAttestationValue = affidavitsDateAttestation.value.trim();
    if (affidavitsDateAttestationValue === "") {
      dateattestationError.textContent = "Date of attestation is required.";
      dateattestationError.style.display = "block";
      return false;
    } else {
      dateattestationError.style.display = "none";
      return true;
    }
  }
  function validateAttestedByAffidavits() {
    var affidavitsAttestedbyValue = affidavitsAttestedby.value.trim();
    if (affidavitsAttestedbyValue === "") {
      attestedbyError.textContent = "Attested by is required.";
      attestedbyError.style.display = "block";
      return false;
    } else {
      attestedbyError.style.display = "none";
      return true;
    }
  }

  function validateIndemnityBond() {
    if (indemnityBond.files.length > 0) {
      var file = indemnityBond.files[0];
      if (file.size > 5 * 1024 * 1024) {
        indemnityBondError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        indemnityBondError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        indemnityBondError.textContent = "";
        return true;
      }
    } else {
      if (indemnityBond.getAttribute("data-should-validate") == 1) {
        return true;
      }
      indemnityBondError.textContent = "Indemnity bond is required.";
      return false;
    }
  }
  function validateIndemnityDateofAttestation() {
    var indemnityBonddateattestationValue =
      indemnityBonddateattestation.value.trim();
    if (indemnityBonddateattestationValue === "") {
      indemnityBonddateattestationError.textContent =
        "Date of attestation is required.";
      indemnityBonddateattestationError.style.display = "block";
      return false;
    } else {
      indemnityBonddateattestationError.style.display = "none";
      return true;
    }
  }
  function validateIndemnityAttestedBy() {
    var indemnityBondattestedbyValue = indemnityBondattestedby.value.trim();
    if (indemnityBondattestedbyValue === "") {
      indemnityBondattestedbyError.textContent = "Attested by is required.";
      indemnityBondattestedbyError.style.display = "block";
      return false;
    } else {
      indemnityBondattestedbyError.style.display = "none";
      return true;
    }
  }

  function validateLeaseConyence() {
    if (leaseconyedeed.files.length > 0) {
      var file = leaseconyedeed.files[0];
      if (file.size > 5 * 1024 * 1024) {
        leaseconyedeedError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        leaseconyedeedError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        leaseconyedeedError.textContent = "";
        return true;
      }
    } else {
      if (leaseconyedeed.getAttribute("data-should-validate") == 1) {
        return true;
      }
      leaseconyedeedError.textContent =
        "Lease deed/Conveyance deed is required.";
      return false;
    }
  }
  function validateDateofExecution() {
    var dateofexecutionValue = dateofexecution.value.trim();
    if (dateofexecutionValue === "") {
      dateofexecutionError.textContent = "Date of execution is required.";
      dateofexecutionError.style.display = "block";
      return false;
    } else {
      dateofexecutionError.style.display = "none";
      return true;
    }
  }
  function validateLesseeName() {
    var lesseenameValue = lesseename.value.trim();
    if (lesseenameValue === "") {
      lesseenameError.textContent = "Lessee name is required.";
      lesseenameError.style.display = "block";
      return false;
    } else {
      lesseenameError.style.display = "none";
      return true;
    }
  }

  function validatePAN() {
    if (pannumber.files.length > 0) {
      var file = pannumber.files[0];
      if (file.size > 5 * 1024 * 1024) {
        pannumberError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        pannumberError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        pannumberError.textContent = "";
        return true;
      }
    } else {
      if (pannumber.getAttribute("data-should-validate") == 1) {
        return true;
      }
      pannumberError.textContent = "PAN is required.";
      return false;
    }
  }
  function validatePANCertification() {
    var pancertificatenoValue = pancertificateno.value.trim();
    if (pancertificatenoValue === "") {
      pancertificatenoError.textContent = "Certificate number is required.";
      pancertificatenoError.style.display = "block";
      return false;
    } else {
      pancertificatenoError.style.display = "none";
      return true;
    }
  }
  function validatePANDate() {
    var pandateissueValue = pandateissue.value.trim();
    if (pandateissueValue === "") {
      pandateissueError.textContent = "Date of issue is required.";
      pandateissueError.style.display = "block";
      return false;
    } else {
      pandateissueError.style.display = "none";
      return true;
    }
  }

  function validateAadhar() {
    if (aadharnumber.files.length > 0) {
      var file = aadharnumber.files[0];
      if (file.size > 5 * 1024 * 1024) {
        aadharnumberError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        aadharnumberError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        aadharnumberError.textContent = "";
        return true;
      }
    } else {
      if (aadharnumber.getAttribute("data-should-validate") == 1) {
        return true;
      }
      aadharnumberError.textContent = "Aadhaar is required.";
      return false;
    }
  }
  function validateAadharCertification() {
    var aadharcertificatenoValue = aadharcertificateno.value.trim();
    if (aadharcertificatenoValue === "") {
      aadharcertificatenoError.textContent = "Certificate number is required.";
      aadharcertificatenoError.style.display = "block";
      return false;
    } else {
      aadharcertificatenoError.style.display = "none";
      return true;
    }
  }
  function validateAadharDate() {
    var aadhardateissueValue = aadhardateissue.value.trim();
    if (aadhardateissueValue === "") {
      aadhardateissueError.textContent = "Date of issue is required.";
      aadhardateissueError.style.display = "block";
      return false;
    } else {
      aadhardateissueError.style.display = "none";
      return true;
    }
  }

  function validatePublicNoticeEnglish() {
    if (publicNoticeEnglish.files.length > 0) {
      var file = publicNoticeEnglish.files[0];
      if (file.size > 5 * 1024 * 1024) {
        publicNoticeEnglishError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        publicNoticeEnglishError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        publicNoticeEnglishError.textContent = "";
        return true;
      }
    } else {
      if (publicNoticeEnglish.getAttribute("data-should-validate") == 1) {
        return true;
      }
      publicNoticeEnglishError.textContent =
        "Public notice in national daily (English) is required.";
      return false;
    }
  }

  function validateNewsPaperNameEnglish() {
    var newspapernameenglighValue = newspaperNameEnglish.value.trim();
    if (newspapernameenglighValue === "") {
      newspaperNameEnglishError.textContent =
        "Name of newspaper(English) is required.";
      newspaperNameEnglishError.style.display = "block";
      return false;
    }
    var newsEnglishAlpha = /^[A-Za-z\s]+$/;
    if (!newsEnglishAlpha.test(newspapernameenglighValue)) {
      newspaperNameEnglishError.textContent =
        "Newspaper name must contain letters only.";
      newspaperNameEnglishError.style.display = "block";
      return false;
    } else {
      newspaperNameEnglishError.style.display = "none";
      return true;
    }
  }

  // changed by anil on 17-02-2025 for future date input type show future date error validtion
  function validatePublicNoteDateEnglish() {
    var publicnoticedateValue = publicNoticeDateEnglish.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (publicnoticedateValue === "") {
      publicNoticeDateEnglishError.textContent =
        "Date of public notice is required.";
      publicNoticeDateEnglishError.style.display = "block";
      return false;
    }

    // Future date validation
    if (publicnoticedateValue > today) {
      publicNoticeDateEnglishError.textContent =
        "Date cannot be in the future.";
      publicNoticeDateEnglishError.style.display = "block";
      publicNoticeDateEnglish.value = ""; // Clear invalid input
      return false;
    }

    publicNoticeDateEnglishError.style.display = "none";
    return true;
  }

  function validatePublicNoticeHindi() {
    if (publicNoticeHindi.files.length > 0) {
      var file = publicNoticeHindi.files[0];
      if (file.size > 5 * 1024 * 1024) {
        publicNoticeHindiError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        publicNoticeHindiError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        publicNoticeHindiError.textContent = "";
        return true;
      }
    } else {
      if (publicNoticeHindi.getAttribute("data-should-validate") == 1) {
        return true;
      }
      publicNoticeHindiError.textContent =
        "Public notice in national daily (Hindi) is required.";
      return false;
    }
  }

  function validateNewsPaperNameHindi() {
    var newspaperNameHindiValue = newspaperNameHindi.value.trim();
    if (newspaperNameHindiValue === "") {
      newspaperNameHindiError.textContent =
        "Name of newspaper(Hindi) is required.";
      newspaperNameHindiError.style.display = "block";
      return false;
    }
    var newsEnglishAlpha = /^[A-Za-z\s]+$/;
    if (!newsEnglishAlpha.test(newspaperNameHindiValue)) {
      newspaperNameHindiError.textContent =
        "Newspaper name must contain letters only.";
      newspaperNameHindiError.style.display = "block";
      return false;
    } else {
      newspaperNameHindiError.style.display = "none";
      return true;
    }
  }
  // changed by anil on 17-02-2025 for future date input type show future date error validtion
  function validatePublicNoteDateHindi() {
    var publicnoticedateValue = publicNoticeDateHindi.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (publicnoticedateValue === "") {
      publicNoticeDateHindiError.textContent =
        "Date of public notice is required.";
      publicNoticeDateHindiError.style.display = "block";
      return false;
    }

    // Future date validation
    if (publicnoticedateValue > today) {
      publicNoticeDateHindiError.textContent =
        "Date cannot be in the future.";
      publicNoticeDateHindiError.style.display = "block";
      publicNoticeDateHindi.value = ""; // Clear invalid input
      return false;
    }

    publicNoticeDateHindiError.style.display = "none";
    return true;
  }

  function validatePropertyPhoto() {
    if (propertyPhoto.files.length > 0) {
      var file = propertyPhoto.files[0];
      if (file.size > 5 * 1024 * 1024) {
        propertyPhotoError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        propertyPhotoError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        propertyPhotoError.textContent = "";
        return true;
      }
    } else {
      if (propertyPhoto.getAttribute("data-should-validate") == 1) {
        return true;
      }
      propertyPhotoError.textContent = "Property photo is required.";
      return false;
    }
  }

  // Validate Form 2 MUT
  function validateForm2MUT() {
    var isMandatoryMutDocumentsForm = validateMandatoryMutDocumentsForm();
    var isLeaseConyenceValid = validateLeaseConyence();
    var isPANValid = validatePAN();
    var isAadharValid = validateAadhar();
    var isPublicNoticeEnglishValid = validatePublicNoticeEnglish();
    var isNewsPaperNameEnglishValid = validateNewsPaperNameEnglish();
    var isPublicNoteDateEnglishValid = validatePublicNoteDateEnglish();
    var isPublicNoticeHindiValid = validatePublicNoticeHindi();
    var isNewsPaperNameHindiValid = validateNewsPaperNameHindi();
    var isPublicNoteDateHindiValid = validatePublicNoteDateHindi();
    var isPropertyPhotoValid = validatePropertyPhoto();

    return (
      isMandatoryMutDocumentsForm &&
      isLeaseConyenceValid &&
      isPANValid &&
      isAadharValid &&
      isPublicNoticeEnglishValid &&
      isNewsPaperNameEnglishValid &&
      isPublicNoteDateEnglishValid &&
      isPublicNoticeHindiValid &&
      isNewsPaperNameHindiValid &&
      isPublicNoteDateHindiValid &&
      isPropertyPhotoValid
    );
  }

// for storing second step of mutation- Sourav Chauhan (19/sep/2024)
function mutationStepSecond(callback) {
  var updateId = $("input[name='updateId']").val();
  var newspaperNameEnglish = $("input[name='newspaperNameEnglish']").val();
  var publicNoticeDateEnglish = $(
    "input[name='publicNoticeDateEnglish']"
  ).val();
  var newspaperNameHindi = $("input[name='newspaperNameHindi']").val();
  var publicNoticeDateHindi = $("input[name='publicNoticeDateHindi']").val();

  var formData = new FormData();
  formData.append("_token", $('meta[name="csrf-token"]').attr("content")); // CSRF token
  formData.append("updateId", updateId);
  formData.append("newspaperNameEnglish", newspaperNameEnglish);
  formData.append("publicNoticeDateEnglish", publicNoticeDateEnglish);
  formData.append("newspaperNameHindi", newspaperNameHindi);
  formData.append("publicNoticeDateHindi", publicNoticeDateHindi);

  $("input[name^='affidavits']").each(function (item, value) {
    // console.log(item,value);

    var nameAttr = $(this).attr("name");
    var value;
    if ($(this).attr("type") === "file") {
      if ($(this)[0].files.length > 0) {
        value = $(this)[0].files[0]; // Get the file object
        formData.append(nameAttr, value); // Append the file to FormData
      }
    } else {
      value = $(this).val(); // Get the string value for other inputs
      formData.append(nameAttr, value); // Append to FormData
    }
  });

  $("input[name^='indemnityBond']").each(function () {
    var nameAttr = $(this).attr("name");
    var value;
    if ($(this).attr("type") === "file") {
      if ($(this)[0].files.length > 0) {
        value = $(this)[0].files[0]; // Get the file object
        formData.append(nameAttr, value); // Append the file to FormData
      }
    } else {
      value = $(this).val(); // Get the string value for other inputs
      formData.append(nameAttr, value); // Append to FormData
    }
  });

  var baseUrl = getBaseURL();
  // var csrfToken = $('meta[name="csrf-token"]').attr("content");
  $.ajax({
    url: baseUrl + "/mutation-step-second",
    type: "POST",
    dataType: "JSON",
    data: formData,
    processData: false,
    contentType: false,
    success: function (result) {
      if (result.status) {
        $("#submitbtn2").html(
          'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#submitbtn2").prop("disabled", false);
        if (callback) callback(true, result); // Call the callback with success
      } else {
        // Handle failure scenario
        $("#submitbtn2").html(
          'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
        );
        $("#submitbtn2").prop("disabled", false);
        if (callback) callback(false, result); // Call the callback with failure
      }
    },
    error: function (err) {
      $("#submitbtn1").html(
        'Next <i class="bx bx-right-arrow-alt ms-2"></i>'
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


  // Form 3 Fields
  // validation var and fucntion added by anil for mutation third step select documents on 17-02-2025
  // Death Certificate Mutaition form step 3  add by anil on 17-02-2025 for validation
  var muteDethCertificate = document.getElementById("deathCertificate");
  var muteDethDeceaseName = document.getElementById(
    "deathCertificateDeceasedName"
  );
  var muteDethDate = document.getElementById("deathCertificateDeathdate");
  var muteDethCertificateIssueDate = document.getElementById(
    "deathCertificateIssuedate"
  );
  var muteDethCertificateNumber = document.getElementById(
    "deathCertificateDocumentCertificate"
  );
  var MutAgreeConsent = document.getElementById("agreeconsent");
  // Death Certificate Mutaition form step 3  add by anil on 17-02-2025 for validation

  // Sale deed Mutaition form step 3 add by anil on 17-02-2025 for validation
  var muteSaleDeed = document.getElementById("saleDeed");
  var muteSaleDeedRegno = document.getElementById("saleDeedRegno");
  var muteSaleDeedVolume = document.getElementById("saleDeedVolume");
  var muteSaleDeedBookNo = document.getElementById("saleDeedBookNo");
  var muteSaleDeedFrom = document.getElementById("saleDeedFrom");
  var muteSaleDeedTo = document.getElementById("saleDeedTo");
  var muteSaleDeedRegDate = document.getElementById("saleDeedRegDate");
  var muteSaleDeedRegOfficeName = document.getElementById(
    "saleDeedRegOfficeName"
  );
  // Sale deed Mutaition form step 3 add by anil on 17-02-2025 for validation

  // Regd. Will deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteWillRegdFile = document.getElementById("regdWillDeed");
  var muteWillTestatorName = document.getElementById("regWillDeedTestatorName");
  var muteWillRegno = document.getElementById("regWillDeedRegNo");
  var muteWillVolume = document.getElementById("regWillDeedVolume");
  var muteWillBookNo = document.getElementById("regWillDeedBookNo");
  var muteWillFrom = document.getElementById("regWillDeedFrom");
  var muteWillTo = document.getElementById("regWillDeedTo");
  var muteWillRegDate = document.getElementById("regWillDeedRegDate");
  var muteWillRegOfficeName = document.getElementById(
    "regWillDeedRegOfficeName"
  );
  // Regd. Will deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Unregd. Will deed Mutaition form step 3 add by anil on 20-02-2025 for validation
  var muteUnregdWillFile = document.getElementById("unregdWillCodocil");
  var muteUnregdWillTestatorName = document.getElementById(
    "unregWillCodicilTestatorName"
  );
  var muteUnregdWillDate = document.getElementById(
    "unregWillCodicilDateOfWillCodicil"
  );
  // Unregd. Will deed Mutaition form step 3 add by anil on 20-02-2025 for validation

  // Registered Relinquishment deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteRelinquishDeedFile = document.getElementById("relinquishmentDeed");
  var muteRelinquishDeedReleaserName = document.getElementById(
    "relinquishDeedReleaserName"
  );
  var muteRelinquishDeedRegNo = document.getElementById("relinquishDeedRegNo");
  var muteRelinquishDeedVolume = document.getElementById(
    "relinquishDeedVolume"
  );
  var muteRelinquishDeedBookno = document.getElementById(
    "relinquishDeedBookno"
  );
  var muteRelinquishDeedFrom = document.getElementById("relinquishDeedFrom");
  var muteRelinquishDeedTo = document.getElementById("relinquishDeedTo");
  var muteRelinquishDeedRegdate = document.getElementById(
    "relinquishDeedRegdate"
  );
  var muteRelinquishDeedRegname = document.getElementById(
    "relinquishDeedRegname"
  );
  // Registered Relinquishment deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Gift deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteGiftDeedFile = document.getElementById("giftDeed");
  var muteGiftDeedRegno = document.getElementById("giftdeedRegno");
  var muteGiftDeedVolume = document.getElementById("giftdeedVolume");
  var muteGiftDeedBookno = document.getElementById("giftdeedBookno");
  var muteGiftDeedFrom = document.getElementById("giftdeedFrom");
  var muteGiftDeedTo = document.getElementById("giftdeedTo");
  var muteGiftDeedRegdate = document.getElementById("giftdeedRegdate");
  var muteGiftDeedRegOfficeName = document.getElementById(
    "giftdeedRegOfficeName"
  );
  // Gift deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Surviving Member Certificate Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteSmcFile = document.getElementById("survivingMemberCertificate");
  var muteSmcCertificateNo = document.getElementById("smcCertificateNo");
  var muteSmcDateOfIssue = document.getElementById("smcDateOfIssue");
  // Surviving Member Certificate Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Propate/LOA/Court Decree/Order Mutaition form step 3 add by anil on 15-05-2025 for validation
  var mutePropateFile = document.getElementById("propateLoaCourtDecreeOrder");
  // Propate/LOA/Court Decree/Order Mutaition form step 3 add by anil on 15-05-2025 for validation

  // Any Other Document Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteAodFile = document.getElementById("anyOtherDocument");
  var muteAodRemark = document.getElementById("otherDocumentRemark");
  // Any Other Document Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Form 3 Errors
  // Death Certificate Mutaition form step 3  add by anil on 17-02-2025 for validation
  var muteDethCertificateError = document.getElementById(
    "deathCertificateError"
  );
  var muteDethDeceaseNameError = document.getElementById(
    "deathCertificateDeceasedNameError"
  );
  var muteDethDateError = document.getElementById(
    "deathCertificateDeathdateError"
  );
  var muteDethCertificateIssueDateError = document.getElementById(
    "deathCertificateIssuedateError"
  );
  var muteDethCertificateNumberError = document.getElementById(
    "deathCertificateDocumentCertificateError"
  );
  var MutAgreeconsentError = document.getElementById("MutAgreeconsentError");
  // Death Certificate Mutaition form step 3  add by anil on 17-02-2025 for validation

  // Sale deed Mutaition form step 3 add by anil on 17-02-2025 for validation
  var muteSaleDeedError = document.getElementById("saleDeedError");
  var muteSaleDeedRegnoError = document.getElementById("saleDeedRegnoError");
  var muteSaleDeedVolumeError = document.getElementById("saleDeedVolumeError");
  var muteSaleDeedBookNoError = document.getElementById("saleDeedBookNoError");
  var muteSaleDeedFromError = document.getElementById("saleDeedFromError");
  var muteSaleDeedToError = document.getElementById("saleDeedToError");
  var muteSaleDeedRegDateError = document.getElementById(
    "saleDeedRegDateError"
  );
  var muteSaleDeedRegOfficeNameError = document.getElementById(
    "saleDeedRegOfficeNameError"
  );
  // Sale deed Mutaition form step 3 add by anil on 17-02-2025 for validation

  // Regd. Will deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteWillRegdFileError = document.getElementById("regdWillDeedError");
  var muteWillTestatorNameError = document.getElementById(
    "regWillDeedTestatorNameError"
  );
  var muteWillRegnoError = document.getElementById("regWillDeedRegNoError");
  var muteWillVolumeError = document.getElementById("regWillDeedVolumeError");
  var muteWillBookNoError = document.getElementById("regWillDeedBookNoError");
  var muteWillFromError = document.getElementById("regWillDeedFromError");
  var muteWillToError = document.getElementById("regWillDeedToError");
  var muteWillRegDateError = document.getElementById("regWillDeedRegDateError");
  var muteWillRegOfficeNameError = document.getElementById(
    "regWillDeedRegOfficeNameError"
  );
  // Regd. Will deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Unregd. Will deed Mutaition form step 3 add by anil on 20-02-2025 for validation
  var muteUnregdWillFileError = document.getElementById(
    "unregdWillCodocilError"
  );
  var muteUnregdWillTestatorNameError = document.getElementById(
    "unregWillCodicilTestatorNameError"
  );
  var muteUnregdWillDateError = document.getElementById(
    "unregWillCodicilDateOfWillCodicilError"
  );
  // Unregd. Will deed Mutaition form step 3 add by anil on 20-02-2025 for validation

  // Registered Relinquishment deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteRelinquishDeedFileError = document.getElementById(
    "relinquishmentDeedError"
  );
  var muteRelinquishDeedReleaserNameError = document.getElementById(
    "relinquishDeedReleaserNameError"
  );
  var muteRelinquishDeedRegNoError = document.getElementById(
    "relinquishDeedRegNoError"
  );
  var muteRelinquishDeedVolumeError = document.getElementById(
    "relinquishDeedVolumeError"
  );
  var muteRelinquishDeedBooknoError = document.getElementById(
    "relinquishDeedBooknoError"
  );
  var muteRelinquishDeedFromError = document.getElementById(
    "relinquishDeedFromError"
  );
  var muteRelinquishDeedToError = document.getElementById(
    "relinquishDeedToError"
  );
  var muteRelinquishDeedRegdateError = document.getElementById(
    "relinquishDeedRegdateError"
  );
  var muteRelinquishDeedRegnameError = document.getElementById(
    "relinquishDeedRegnameError"
  );
  // Registered Relinquishment deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Gift deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteGiftDeedFileError = document.getElementById("giftDeedError");
  var muteGiftDeedRegnoError = document.getElementById("giftdeedRegnoError");
  var muteGiftDeedVolumeError = document.getElementById("giftdeedVolumeError");
  var muteGiftDeedBooknoError = document.getElementById("giftdeedBooknoError");
  var muteGiftDeedFromError = document.getElementById("giftdeedFromError");
  var muteGiftDeedToError = document.getElementById("giftdeedToError");
  var muteGiftDeedRegdateError = document.getElementById(
    "giftdeedRegdateError"
  );
  var muteGiftDeedRegOfficeNameError = document.getElementById(
    "giftdeedRegOfficeNameError"
  );
  // Gift deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Surviving Member Certificate Mutaition form step 3 add by anil on 18-02-2025 for validation
  var muteSmcFileError = document.getElementById(
    "survivingMemberCertificateError"
  );
  var muteSmcCertificateNoError = document.getElementById(
    "smcCertificateNoError"
  );
  var muteSmcDateOfIssueError = document.getElementById("smcDateOfIssueError");
  // Surviving Member Certificate Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Propate/LOA/Court Decree/Order Mutaition form step 3 add by anil on 15-05-2025 for validation
  var mutePropateFileError = document.getElementById("propateLoaCourtDecreeOrderError");
  // Propate/LOA/Court Decree/Order Mutaition form step 3 add by anil on 15-05-2025 for validation

  // Death Certificate Mutaition form step 3  add by anil on 17-02-2025 for validation
  function isElementVisible(element) {
    console.log(element);
    if (!element) return false; // Ensure element exists

    // Get computed styles of the element
    var style = window.getComputedStyle(element);

    // Check if element is visible based on display, visibility, opacity, and dimensions
    var isVisible = style.display !== "none";

    return isVisible;
  }
  function validateMuteDethCertificate() {
    if (muteDethCertificate.files.length > 0) {
      var file = muteDethCertificate.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteDethCertificateError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteDethCertificateError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteDethCertificateError.textContent = "";
        return true;
      }
    } else {
      if (muteDethCertificate.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteDethCertificateError.textContent =
        "Death certificate PDF file is required.";
      return false;
    }
  }

  function validateMuteDethDeceaseName() {
    var muteDethDeceaseNameValue = muteDethDeceaseName.value.trim();

    // Check if the input is empty
    if (muteDethDeceaseNameValue === "") {
      muteDethDeceaseNameError.textContent = "Name of deceased is required.";
      muteDethDeceaseNameError.style.display = "block";
      return false;
    }

    // Check if the input contains only alphabets
    var alphaPattern = /^[A-Za-z\s]+$/;
    if (!alphaPattern.test(muteDethDeceaseNameValue)) {
      muteDethDeceaseNameError.textContent = "Name must contain letters only.";
      muteDethDeceaseNameError.style.display = "block";
      return false;
    }

    // If all validations pass
    muteDethDeceaseNameError.style.display = "none";
    return true;
  }

  function validateMuteDethDate() {
    var muteDethDateValue = muteDethDate.value.trim();
    var muteDethCertificateIssueDateValue =
      muteDethCertificateIssueDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteDethDateValue === "") {
      muteDethDateError.textContent = "Date of death is required.";
      muteDethDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteDethDateValue > today) {
      muteDethDateError.textContent = "Date of death cannot be in the future.";
      muteDethDateError.style.display = "block";
      muteDethDate.value = ""; // Clear invalid input
      return false;
    }

    // Check if muteDethDate is greater than muteDethCertificateIssueDate
    if (
      muteDethCertificateIssueDateValue &&
      muteDethDateValue > muteDethCertificateIssueDateValue
    ) {
      muteDethDateError.textContent =
        "Date of death cannot be after the certificate issue date.";
      muteDethDateError.style.display = "block";
      muteDethDate.value = ""; // Clear invalid input
      return false;
    }

    muteDethDateError.style.display = "none";
    return true;
  }

  function validateMuteDethCertificateIssueDate() {
    var muteDethCertificateIssueDateValue =
      muteDethCertificateIssueDate.value.trim();
    var muteDethDateValue = muteDethDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteDethCertificateIssueDateValue === "") {
      muteDethCertificateIssueDateError.textContent =
        "Certificate issue date is required.";
      muteDethCertificateIssueDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteDethCertificateIssueDateValue > today) {
      muteDethCertificateIssueDateError.textContent =
        "Certificate issue date cannot be in the future.";
      muteDethCertificateIssueDateError.style.display = "block";
      muteDethCertificateIssueDate.value = ""; // Clear invalid input
      return false;
    }

    // Check if muteDethCertificateIssueDate is less than muteDethDate
    if (
      muteDethDateValue &&
      muteDethCertificateIssueDateValue < muteDethDateValue
    ) {
      muteDethCertificateIssueDateError.textContent =
        "Certificate date cannot be before the date of death.";
      muteDethCertificateIssueDateError.style.display = "block";
      muteDethCertificateIssueDate.value = ""; // Clear invalid input
      return false;
    }

    muteDethCertificateIssueDateError.style.display = "none";
    return true;
  }

  function validateMuteDethCertificateNumber() {
    var muteDethCertificateNumberValue = muteDethCertificateNumber.value.trim();
    var allowedPattern = /^[A-Za-z0-9:\/\-\s]+$/;
    if (muteDethCertificateNumberValue === "") {
      muteDethCertificateNumberError.textContent =
        "Death certificate number is required.";
      muteDethCertificateNumberError.style.display = "block";
      return false;
    } else if (!allowedPattern.test(muteDethCertificateNumberValue)) {
      muteDethCertificateNumberError.textContent =
        "Only letters, numbers, and : - / are allowed.";
      muteDethCertificateNumberError.style.display = "block";
      return false;
    } else {
      muteDethCertificateNumberError.style.display = "none";
    }
    return true;
  }
  // Death Certificate Mutaition form step 3  add by anil on 17-02-2025 for validation

  // Sale deed Mutaition form step 3 add by anil on 17-02-2025 for validation
  function validateMuteSaleDeed() {
    if (muteSaleDeed.files.length > 0) {
      var file = muteSaleDeed.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteSaleDeedError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteSaleDeedError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteSaleDeedError.textContent = "";
        return true;
      }
    } else {
      if (muteSaleDeed.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteSaleDeedError.textContent = "Sale deed PDF file is required.";
      return false;
    }
  }

  function validateMuteSaleDeedRegno() {
    var muteSaleDeedRegnoValue = muteSaleDeedRegno.value.trim();

    // Check if input is empty
    if (muteSaleDeedRegnoValue === "") {
      muteSaleDeedRegnoError.textContent = "Deed registration number is required.";
      muteSaleDeedRegnoError.style.display = "block";
      return false;
    }

    // Check if input exceeds 30 digits
    if (muteSaleDeedRegnoValue.length > 30) {
      muteSaleDeedRegnoError.textContent = "Registration number cannot exceed 30 digits.";
      muteSaleDeedRegnoError.style.display = "block";
      return false;
    }

    // Check if input is numeric only
    if (!/^\d+$/.test(muteSaleDeedRegnoValue)) {
      muteSaleDeedRegnoError.textContent = "Registration number must be a numeric value.";
      muteSaleDeedRegnoError.style.display = "block";
      return false;
    }

    // All validations passed
    muteSaleDeedRegnoError.style.display = "none";
    return true;
  }
  function validateMuteSaleDeedVolume() {
    var muteSaleDeedVolumeValue = muteSaleDeedVolume.value.trim();

    // Check if the field is empty
    if (muteSaleDeedVolumeValue === "") {
      muteSaleDeedVolumeError.textContent = "Volume number is required.";
      muteSaleDeedVolumeError.style.display = "block";
      return false;
    }

    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteSaleDeedVolumeValue)) {
      muteSaleDeedVolumeError.textContent =
        "Volume number must be a numeric value.";
      muteSaleDeedVolumeError.style.display = "block";
      return false;
    }

    // Check if the value is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteSaleDeedVolumeValue) <= 0) {
      muteSaleDeedVolumeError.textContent = "Volume must be a positive number.";
      muteSaleDeedVolumeError.style.display = "block";
      return false;
    }

    // Check if the number exceeds 10 digits
    if (muteSaleDeedVolumeValue.length > 10) {
      muteSaleDeedVolumeError.textContent = "Volume number cannot exceed 10 digits.";
      muteSaleDeedVolumeError.style.display = "block";
      return false;
    }

    muteSaleDeedVolumeError.style.display = "none";
    return true;
  }
  function validateMuteSaleDeedBookNo() {
    var muteSaleDeedBookNoValue = muteSaleDeedBookNo.value.trim();

    // Check if the field is empty
    if (muteSaleDeedBookNoValue === "") {
      muteSaleDeedBookNoError.textContent = "Book number is required.";
      muteSaleDeedBookNoError.style.display = "block";
      return false;
    }
    
    // Check if the Book number is numeric
    if (!/^\d+$/.test(muteSaleDeedBookNoValue)) {
      muteSaleDeedBookNoError.textContent = "Book number must be a numeric value.";
      muteSaleDeedBookNoError.style.display = "block";
      return false;
    }

    // Check if the Book number is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteSaleDeedBookNoValue) <= 0) {
      muteSaleDeedBookNoError.textContent =
        "Book number must be a positive number.";
      muteSaleDeedBookNoError.style.display = "block";
      return false;
    }

    // Check if the Book number exceeds 10 digits
    if (muteSaleDeedBookNoValue.length > 10) {
      muteSaleDeedBookNoError.textContent = "Book number cannot exceed 10 digits.";
      muteSaleDeedBookNoError.style.display = "block";
      return false;
    }

    muteSaleDeedBookNoError.style.display = "none";
    return true;
  }

  $(document).on("input blur change", "#saleDeedFrom", function () {
    validateMuteSaleDeedFrom();
  });

  function validateMuteSaleDeedFrom() {
    var muteSaleDeedFromValue = muteSaleDeedFrom.value.trim();
    var muteSaleDeedValueTo = muteSaleDeedTo.value.trim();

    // Check if the field is empty
    if (muteSaleDeedFromValue === "") {
      muteSaleDeedFromError.textContent = "Page number from is required.";
      muteSaleDeedFromError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteSaleDeedFromValue)) {
      muteSaleDeedFromError.textContent =
        "Page number from must be a numeric value.";
      muteSaleDeedFromError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteSaleDeedFromValue) <= 0) {
      muteSaleDeedFromError.textContent =
        "Page number from must be a positive number.";
      muteSaleDeedFromError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteSaleDeedFromValue.length > 4) {
      muteSaleDeedFromError.textContent = "Page number cannot exceed 4 digits.";
      muteSaleDeedFromError.style.display = "block";
      return false;
    }

    // Check if 'Page number From' is greater than 'Page number To'
    if (parseInt(muteSaleDeedFromValue) > parseInt(muteSaleDeedValueTo)) {
      muteSaleDeedFromError.textContent =
        "Page number from cannot be greater than page number to.";
      muteSaleDeedFromError.style.display = "block";
      return false;
    } else {
      muteSaleDeedFromError.style.display = "none";
      return true;
    }
  }

  $(document).on("input blur change", "#saleDeedTo", function () {
    validateMuteSaleDeedTo();
  });

  function validateMuteSaleDeedTo() {
    var muteSaleDeedToValue = muteSaleDeedTo.value.trim();
    var muteSaleDeedValueFrom = muteSaleDeedFrom.value.trim();
    // Check if the field is empty
    if (muteSaleDeedToValue === "") {
      muteSaleDeedToError.textContent = "Page number to is required.";
      muteSaleDeedToError.style.display = "block";
      // Check the value
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteSaleDeedToValue)) {
      muteSaleDeedToError.textContent = "Page number to must be a numeric value.";
      muteSaleDeedToError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteSaleDeedToValue) <= 0) {
      muteSaleDeedToError.textContent = "Page number to must be a positive number.";
      muteSaleDeedToError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteSaleDeedToValue.length > 4) {
      muteSaleDeedToError.textContent = "Page number cannot exceed 4 digits.";
      muteSaleDeedToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is less than 'Page number From'
    if (parseInt(muteSaleDeedToValue) < parseInt(muteSaleDeedValueFrom)) {
      muteSaleDeedToError.textContent =
        "Page number to cannot be less than page number from.";
      muteSaleDeedToError.style.display = "block";
      return false;
    } else {
      muteSaleDeedToError.style.display = "none";
      return true;
    }
  }

  function validateMuteSaleDeedRegDate() {
    var muteSaleDeedRegDateValue = muteSaleDeedRegDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteSaleDeedRegDateValue === "") {
      muteSaleDeedRegDateError.textContent = "Registration date is required.";
      muteSaleDeedRegDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteSaleDeedRegDateValue > today) {
      muteSaleDeedRegDateError.textContent =
        "Registration date cannot be in the future.";
      muteSaleDeedRegDateError.style.display = "block";
      muteSaleDeedRegDate.value = ""; // Clear invalid input
      return false;
    }

    muteSaleDeedRegDateError.style.display = "none";
    return true;
  }
  function validateMuteSaleDeedRegOfficeName() {
    var muteSaleDeedRegOfficeNameValue = muteSaleDeedRegOfficeName.value.trim();
    if (muteSaleDeedRegOfficeNameValue === "") {
      muteSaleDeedRegOfficeNameError.textContent =
        "Registration office name is required.";
      muteSaleDeedRegOfficeNameError.style.display = "block";
      return false;
    } else {
      muteSaleDeedRegOfficeNameError.style.display = "none";
    }

    // Check if the value contains only alphabetic characters, dot and spaces
    var regex = /^[A-Za-z\s.]+$/;
    if (!regex.test(muteSaleDeedRegOfficeNameValue)) {
      muteSaleDeedRegOfficeNameError.textContent =
        "Registration office name must contain letters only.";
      muteSaleDeedRegOfficeNameError.style.display = "block";
      return false;
    } else {
      muteSaleDeedRegOfficeNameError.style.display = "none";
    }
    return true;
  }
  // Sale deed Mutaition form step 3 add by anil on 17-02-2025 for validation

  // Regd. Will deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  function validateMuteWillRegdFile() {
    if (muteWillRegdFile.files.length > 0) {
      var file = muteWillRegdFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteWillRegdFileError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteWillRegdFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteWillRegdFileError.textContent = "";
        return true;
      }
    } else {
      if (muteWillRegdFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteWillRegdFileError.textContent =
        "Will/Codicil deed PDF file is required.";
      return false;
    }
  }

  function validateMuteWillTestatorName() {
    var muteWillTestatorNameValue = muteWillTestatorName.value.trim();
    if (muteWillTestatorNameValue === "") {
      muteWillTestatorNameError.textContent = "Testator name is required.";
      muteWillTestatorNameError.style.display = "Block";
      return false;
    }

    // Check if the value contains only alphabetic characters and spaces
    var testNameAlpha = /^[A-Za-z\s]+$/;
    if (!testNameAlpha.test(muteWillTestatorNameValue)) {
      muteWillTestatorNameError.textContent =
        "Testator name must contain letters only.";
      muteWillTestatorNameError.style.display = "block";
      return false;
    } else {
      muteWillTestatorNameError.style.display = "none";
    }
    return true;
  }

  function validateMuteWillRegno() {
  var muteWillRegnoValue = muteWillRegno.value.trim();

  // Check if the field is empty
  if (muteWillRegnoValue === "") {
    muteWillRegnoError.textContent = "Will/Codicil registration number is required.";
    muteWillRegnoError.style.display = "block";
    return false;
  }

  // Check if the value exceeds 30 digits
  if (muteWillRegnoValue.length > 30) {
    muteWillRegnoError.textContent = "Registration number cannot exceed 30 digits.";
    muteWillRegnoError.style.display = "block";
    return false;
  }

  // Check if the value contains only digits (no spaces, no letters)
  if (!/^\d+$/.test(muteWillRegnoValue)) {
    muteWillRegnoError.textContent = "Registration number must be a numeric value.";
    muteWillRegnoError.style.display = "block";
    return false;
  }

  // Passed all checks
  muteWillRegnoError.style.display = "none";
  return true;
}

  function validateMuteWillVolume() {
    var muteWillVolumeValue = muteWillVolume.value.trim();

    // Check if the field is empty
    if (muteWillVolumeValue === "") {
      muteWillVolumeError.textContent = "Volume number is required.";
      muteWillVolumeError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteWillVolumeValue)) {
      muteWillVolumeError.textContent = "Volume number must be a numeric value.";
      muteWillVolumeError.style.display = "block";
      return false;
    }

    // Check if the value is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteWillVolumeValue) <= 0) {
      muteWillVolumeError.textContent = "Volume must be a positive number.";
      muteWillVolumeError.style.display = "block";
      return false;
    }

    // Check if the number exceeds 10 digits
    if (muteWillVolumeValue.length > 10) {
      muteWillVolumeError.textContent = "Volume number cannot exceed 10 digits.";
      muteWillVolumeError.style.display = "block";
      return false;
    }

    muteWillVolumeError.style.display = "none";
    return true;
  }
  function validateMuteWillBookNo() {
    var muteWillBookNoValue = muteWillBookNo.value.trim();

    // Check if the field is empty
    if (muteWillBookNoValue === "") {
      muteWillBookNoError.textContent = "Book number is required.";
      muteWillBookNoError.style.display = "block";
      return false;
    }
    
    // Check if the Book number is numeric
    if (!/^\d+$/.test(muteWillBookNoValue)) {
      muteWillBookNoError.textContent = "Book number must be a numeric value.";
      muteWillBookNoError.style.display = "block";
      return false;
    }

    // Check if the Book number is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteWillBookNoValue) <= 0) {
      muteWillBookNoError.textContent = "Book number must be a positive number.";
      muteWillBookNoError.style.display = "block";
      return false;
    }

    // Check if the Book number exceeds 10 digits
    if (muteWillBookNoValue.length > 10) {
      muteWillBookNoError.textContent = "Book number cannot exceed 10 digits.";
      muteWillBookNoError.style.display = "block";
      return false;
    }

    muteWillBookNoError.style.display = "none";
    return true;
  }

  $(document).on("input blur change", "#regWillDeedFrom", function () {
    validateMuteWillFrom();
  });

  function validateMuteWillFrom() {
    var muteWillFromValue = muteWillFrom.value.trim();
    var muteWillValueTo = muteWillTo.value.trim();

    // Check if the field is empty
    if (muteWillFromValue === "") {
      muteWillFromError.textContent = "Page number from is required.";
      muteWillFromError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteWillFromValue)) {
      muteWillFromError.textContent = "Page number from must be a numeric value.";
      muteWillFromError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteWillFromValue) <= 0) {
      muteWillFromError.textContent = "Page number from must be a positive number.";
      muteWillFromError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteWillFromValue.length > 4) {
      muteWillFromError.textContent = "Page number cannot exceed 4 digits.";
      muteWillFromError.style.display = "block";
      return false;
    }

    // Check if 'Page number From' is greater than 'Page number To'
    if (parseInt(muteWillFromValue) > parseInt(muteWillValueTo)) {
      muteWillFromError.textContent = "Page number from cannot be greater than page number to.";
      muteWillFromError.style.display = "block";
      return false;
    } else {
      muteWillFromError.style.display = "none";
      return true;
    }
  }

  $(document).on("input blur change", "#regWillDeedTo", function () {
    validateMuteWillTo();
  });

  function validateMuteWillTo() {
    var muteWillToValue = muteWillTo.value.trim();
    var muteWillValueFrom = muteWillFrom.value.trim();
    // Check if the field is empty
    if (muteWillToValue === "") {
      muteWillToError.textContent = "Page number to is required.";
      muteWillToError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteWillToValue)) {
      muteWillToError.textContent = "Page number to must be a numeric value.";
      muteWillToError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteWillToValue) <= 0) {
      muteWillToError.textContent = "Page number to must be a positive number.";
      muteWillToError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteWillToValue.length > 4) {
      muteWillToError.textContent = "Page number cannot exceed 4 digits.";
      muteWillToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is less than 'Page number From'
    if (parseInt(muteWillToValue) < parseInt(muteWillValueFrom)) {
      muteWillToError.textContent =
        "Page number to cannot be less than page number from.";
      muteWillToError.style.display = "block";
      return false;
    } else {
      muteWillToError.style.display = "none";
      return true;
    }
  }

  function validateMuteWillRegDate() {
    var muteWillRegDateValue = muteWillRegDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteWillRegDateValue === "") {
      muteWillRegDateError.textContent = "Date of registration is required.";
      muteWillRegDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteWillRegDateValue > today) {
      muteWillRegDateError.textContent =
        "Date of registration cannot be in the future.";
      muteWillRegDateError.style.display = "block";
      muteWillRegDate.value = ""; // Clear invalid input
      return false;
    }

    muteWillRegDateError.style.display = "none";
    return true;
  }
  function validateMuteWillRegOfficeName() {
    var muteWillRegOfficeNameValue = muteWillRegOfficeName.value.trim();
    if (muteWillRegOfficeNameValue === "") {
      muteWillRegOfficeNameError.textContent =
        "Registration office name is required.";
      muteWillRegOfficeNameError.style.display = "block";
      return false;
    }
    var RegOfficeAlpha = /^[A-Za-z\s.]+$/;
    if (!RegOfficeAlpha.test(muteWillRegOfficeNameValue)) {
      muteWillRegOfficeNameError.textContent =
        "Attested by must contain letters only.";
      muteWillRegOfficeNameError.style.display = "block";
      return false;
    } else {
      muteWillRegOfficeNameError.style.display = "none";
    }
    return true;
  }
  // Regd. Will deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Unregd. Will deed Mutaition form step 3 add by anil on 20-02-2025 for validation
  function validateMuteUnregdWillFile() {
    if (muteUnregdWillFile.files.length > 0) {
      var file = muteUnregdWillFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteUnregdWillFileError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteUnregdWillFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteUnregdWillFileError.textContent = "";
        return true;
      }
    } else {
      if (muteUnregdWillFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteUnregdWillFileError.textContent =
        "Unregd. will/codicil deed PDF file is required.";
      return false;
    }
  }

  function validateMuteUnregdWillTestatorName() {
    var muteUnregdWillTestatorNameValue =
      muteUnregdWillTestatorName.value.trim();
    if (muteUnregdWillTestatorNameValue === "") {
      muteUnregdWillTestatorNameError.textContent = "Testator name is required.";
      muteUnregdWillTestatorNameError.style.display = "Block";
      return false;
    }

    // Check if the value contains only alphabetic characters and spaces
    var testNameAlpha = /^[A-Za-z\s]+$/;
    if (!testNameAlpha.test(muteUnregdWillTestatorNameValue)) {
      muteUnregdWillTestatorNameError.textContent =
        "Testator name must contain letters only.";
      muteUnregdWillTestatorNameError.style.display = "block";
      return false;
    } else {
      muteUnregdWillTestatorNameError.style.display = "none";
    }
    return true;
  }
  function validateMuteUnregdWillDate() {
    var muteUnregdWillDateValue = muteUnregdWillDate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteUnregdWillDateValue === "") {
      muteUnregdWillDateError.textContent = "Date of registration is required.";
      muteUnregdWillDateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteUnregdWillDateValue > today) {
      muteUnregdWillDateError.textContent =
        "Date of registration cannot be in the future.";
      muteUnregdWillDateError.style.display = "block";
      muteUnregdWillDate.value = ""; // Clear invalid input
      return false;
    }

    muteUnregdWillDateError.style.display = "none";
    return true;
  }
  // Unregd. Will deed Mutaition form step 3 add by anil on 20-02-2025 for validation

  // Registered Relinquishment deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  function validateMuteRelinquishDeedFile() {
    if (muteRelinquishDeedFile.files.length > 0) {
      var file = muteRelinquishDeedFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteRelinquishDeedFileError.textContent =
          "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteRelinquishDeedFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteRelinquishDeedFileError.textContent = "";
        return true;
      }
    } else {
      if (muteRelinquishDeedFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteRelinquishDeedFileError.textContent =
        "Relinquishment deed PDF file is required.";
      return false;
    }
  }

  function validateMuteRelinquishDeedReleaserName() {
    var muteRelinquishDeedReleaserNameValue =
      muteRelinquishDeedReleaserName.value.trim();
    if (muteRelinquishDeedReleaserNameValue === "") {
      muteRelinquishDeedReleaserNameError.textContent =
        "Releaser name is required.";
      muteRelinquishDeedReleaserNameError.style.display = "Block";
      return false;
    }

    // Check if the value contains only alphabetic characters and spaces
    var releaserNameAlpha = /^[A-Za-z\s]+$/;
    if (!releaserNameAlpha.test(muteRelinquishDeedReleaserNameValue)) {
      muteRelinquishDeedReleaserNameError.textContent =
        "Releaser name must contain letters only.";
      muteRelinquishDeedReleaserNameError.style.display = "block";
      return false;
    } else {
      muteRelinquishDeedReleaserNameError.style.display = "none";
    }
    return true;
  }

  function validateMuteRelinquishDeedRegNo() {
    var muteRelinquishDeedRegNoValue = muteRelinquishDeedRegNo.value.trim();

    // Check if the field is empty
    if (muteRelinquishDeedRegNoValue === "") {
      muteRelinquishDeedRegNoError.textContent =
        "Relinquishment registration number is required.";
      muteRelinquishDeedRegNoError.style.display = "block";
      return false;
    }

    // Check if it exceeds 30 digits
    if (muteRelinquishDeedRegNoValue.length > 30) {
      muteRelinquishDeedRegNoError.textContent =
        "Registration number cannot exceed 30 digits.";
      muteRelinquishDeedRegNoError.style.display = "block";
      return false;
    }

    // Check if it is only numeric (no spaces or letters)
    if (!/^\d+$/.test(muteRelinquishDeedRegNoValue)) {
      muteRelinquishDeedRegNoError.textContent =
        "Registration number must be a numeric value.";
      muteRelinquishDeedRegNoError.style.display = "block";
      return false;
    }

    // All validations passed
    muteRelinquishDeedRegNoError.style.display = "none";
    return true;
  }


  function validateMuteRelinquishDeedVolume() {
    var muteRelinquishDeedVolumeValue = muteRelinquishDeedVolume.value.trim();

    // Check if the field is empty
    if (muteRelinquishDeedVolumeValue === "") {
      muteRelinquishDeedVolumeError.textContent = "Volume number is required.";
      muteRelinquishDeedVolumeError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteRelinquishDeedVolumeValue)) {
      muteRelinquishDeedVolumeError.textContent =
        "Volume number must be a numeric value.";
      muteRelinquishDeedVolumeError.style.display = "block";
      return false;
    }

    // Check if the value is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteRelinquishDeedVolumeValue) <= 0) {
      muteRelinquishDeedVolumeError.textContent =
        "Volume must be a positive number.";
      muteRelinquishDeedVolumeError.style.display = "block";
      return false;
    }

    // Check if the number exceeds 10 digits
    if (muteRelinquishDeedVolumeValue.length > 10) {
      muteRelinquishDeedVolumeError.textContent = "Volume number cannot exceed 10 digits.";
      muteRelinquishDeedVolumeError.style.display = "block";
      return false;
    }

    muteRelinquishDeedVolumeError.style.display = "none";
    return true;
  }

  function validateMuteRelinquishDeedBookno() {
    var muteRelinquishDeedBooknoValue = muteRelinquishDeedBookno.value.trim();

    // Check if the field is empty
    if (muteRelinquishDeedBooknoValue === "") {
      muteRelinquishDeedBooknoError.textContent = "Book number is required.";
      muteRelinquishDeedBooknoError.style.display = "block";
      return false;
    }
    
    // Check if the Book number is numeric
    if (!/^\d+$/.test(muteRelinquishDeedBooknoValue)) {
      muteRelinquishDeedBooknoError.textContent =
        "Book number must be a numeric value.";
      muteRelinquishDeedBooknoError.style.display = "block";
      return false;
    }

    // Check if the Book number is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteRelinquishDeedBooknoValue) <= 0) {
      muteRelinquishDeedBooknoError.textContent =
        "Book number must be a positive number.";
      muteRelinquishDeedBooknoError.style.display = "block";
      return false;
    }

    // Check if the Book number exceeds 10 digits
    if (muteRelinquishDeedBooknoValue.length > 10) {
      muteRelinquishDeedBooknoError.textContent = "Book number cannot exceed 10 digits.";
      muteRelinquishDeedBooknoError.style.display = "block";
      return false;
    }

    muteRelinquishDeedBooknoError.style.display = "none";
    return true;
  }

  $(document).on("input blur change", "#relinquishDeedFrom", function () {
    validateMuteRelinquishDeedFrom();
  });

  function validateMuteRelinquishDeedFrom() {
    var muteRelinquishDeedFromValue = muteRelinquishDeedFrom.value.trim();
    var muteRelinquishDeedValueTo = muteRelinquishDeedTo.value.trim();

    // Check if the field is empty
    if (muteRelinquishDeedFromValue === "") {
      muteRelinquishDeedFromError.textContent = "Page number from is required.";
      muteRelinquishDeedFromError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteRelinquishDeedFromValue)) {
      muteRelinquishDeedFromError.textContent =
        "Page number from must be a numeric value.";
      muteRelinquishDeedFromError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteRelinquishDeedFromValue) <= 0) {
      muteRelinquishDeedFromError.textContent =
        "Page number from must be a positive number.";
      muteRelinquishDeedFromError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteRelinquishDeedFromValue.length > 4) {
      muteRelinquishDeedFromError.textContent = "Page number cannot exceed 4 digits.";
      muteRelinquishDeedFromError.style.display = "block";
      return false;
    }

    // Check if 'Page number From' is greater than 'Page number To'
    if (
      parseInt(muteRelinquishDeedFromValue) >
      parseInt(muteRelinquishDeedValueTo)
    ) {
      muteRelinquishDeedFromError.textContent =
        "Page number from cannot be greater than page number to.";
      muteRelinquishDeedFromError.style.display = "block";
      return false;
    } else {
      muteRelinquishDeedFromError.style.display = "none";
      return true;
    }
  }

  $(document).on("input blur change", "#relinquishDeedTo", function () {
    validateMuteRelinquishDeedTo();
  });

  function validateMuteRelinquishDeedTo() {
    var muteRelinquishDeedToValue = muteRelinquishDeedTo.value.trim();
    var muteRelinquishDeedValueFrom = muteRelinquishDeedFrom.value.trim();
    // Check if the field is empty
    if (muteRelinquishDeedToValue === "") {
      muteRelinquishDeedToError.textContent = "Page number to is required.";
      muteRelinquishDeedToError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteRelinquishDeedToValue)) {
      muteRelinquishDeedToError.textContent =
        "Page number to must be a numeric value.";
      muteRelinquishDeedToError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteRelinquishDeedToValue) <= 0) {
      muteRelinquishDeedToError.textContent =
        "Page number to must be a positive number.";
      muteRelinquishDeedToError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteRelinquishDeedToValue.length > 4) {
      muteRelinquishDeedToError.textContent = "Page number cannot exceed 4 digits.";
      muteRelinquishDeedToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is less than 'Page number From'
    if (
      parseInt(muteRelinquishDeedToValue) <
      parseInt(muteRelinquishDeedValueFrom)
    ) {
      muteRelinquishDeedToError.textContent =
        "Page number to cannot be less than page number from.";
      muteRelinquishDeedToError.style.display = "block";
      return false;
    } else {
      muteRelinquishDeedToError.style.display = "none";
      return true;
    }
  }

  function validateMuteRelinquishDeedRegdate() {
    var muteRelinquishDeedRegdateValue = muteRelinquishDeedRegdate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteRelinquishDeedRegdateValue === "") {
      muteRelinquishDeedRegdateError.textContent =
        "Date of registration is required.";
      muteRelinquishDeedRegdateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteRelinquishDeedRegdateValue > today) {
      muteRelinquishDeedRegdateError.textContent =
        "Date of registration cannot be in the future.";
      muteRelinquishDeedRegdateError.style.display = "block";
      muteRelinquishDeedRegdate.value = ""; // Clear invalid input
      return false;
    }

    muteRelinquishDeedRegdateError.style.display = "none";
    return true;
  }

  function validateMuteRelinquishDeedRegname() {
    var muteRelinquishDeedRegnameValue = muteRelinquishDeedRegname.value.trim();
    if (muteRelinquishDeedRegnameValue === "") {
      muteRelinquishDeedRegnameError.textContent =
        "Registration office name is required.";
      muteRelinquishDeedRegnameError.style.display = "block";
      return false;
    } else {
      muteRelinquishDeedRegnameError.style.display = "none";
    }

    // Check if the value contains only alphabetic characters and spaces
    var willNameAlpha = /^[A-Za-z\s.]+$/;
    if (!willNameAlpha.test(muteRelinquishDeedRegnameValue)) {
      muteRelinquishDeedRegnameError.textContent =
        "Registration office name must contain letters only.";
      muteRelinquishDeedRegnameError.style.display = "block";
      return false;
    } else {
      muteRelinquishDeedRegnameError.style.display = "none";
    }
    return true;
  }
  // Registered Relinquishment deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Gift deed Mutaition form step 3 add by anil on 18-02-2025 for validation
  function validateMuteGiftDeedFile() {
    if (muteGiftDeedFile.files.length > 0) {
      var file = muteGiftDeedFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteGiftDeedFileError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteGiftDeedFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteGiftDeedFileError.textContent = "";
        return true;
      }
    } else {
      if (muteGiftDeedFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteGiftDeedFileError.textContent = "Gift deed PDF file is required.";
      return false;
    }
  }

  function validateMuteGiftDeedRegno() {
    var muteGiftDeedRegnoValue = muteGiftDeedRegno.value.trim();

    // Check if the field is empty
    if (muteGiftDeedRegnoValue === "") {
      muteGiftDeedRegnoError.textContent =
        "Gift deed registration number is required.";
      muteGiftDeedRegnoError.style.display = "block";
      return false;
    }

    // Check if it exceeds 30 digits
    if (muteGiftDeedRegnoValue.length > 30) {
      muteGiftDeedRegnoError.textContent =
        "Registration number cannot exceed 30 digits.";
      muteGiftDeedRegnoError.style.display = "block";
      return false;
    }

    // Check if it contains only digits (no spaces or letters)
    if (!/^\d+$/.test(muteGiftDeedRegnoValue)) {
      muteGiftDeedRegnoError.textContent =
        "Gift deed registration number must be numeric.";
      muteGiftDeedRegnoError.style.display = "block";
      return false;
    }

    // All validations passed
    muteGiftDeedRegnoError.style.display = "none";
    return true;
  }

  function validateMuteGiftDeedVolume() {
    var muteGiftDeedVolumeValue = muteGiftDeedVolume.value.trim();

    // Check if the field is empty
    if (muteGiftDeedVolumeValue === "") {
      muteGiftDeedVolumeError.textContent = "Volume number is required.";
      muteGiftDeedVolumeError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteGiftDeedVolumeValue)) {
      muteGiftDeedVolumeError.textContent =
        "Volume number must be a numeric value.";
      muteGiftDeedVolumeError.style.display = "block";
      return false;
    }

    // Check if the value is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteGiftDeedVolumeValue) <= 0) {
      muteGiftDeedVolumeError.textContent = "Volume must be a positive number.";
      muteGiftDeedVolumeError.style.display = "block";
      return false;
    }

    // Check if the number exceeds 10 digits
    if (muteGiftDeedVolumeValue.length > 10) {
      muteGiftDeedVolumeError.textContent = "Volume number cannot exceed 10 digits.";
      muteGiftDeedVolumeError.style.display = "block";
      return false;
    }

    muteGiftDeedVolumeError.style.display = "none";
    return true;
  }

  function validateMuteGiftDeedBookno() {
    var muteGiftDeedBooknoValue = muteGiftDeedBookno.value.trim();

    // Check if the field is empty
    if (muteGiftDeedBooknoValue === "") {
      muteGiftDeedBooknoError.textContent = "Book number is required.";
      muteGiftDeedBooknoError.style.display = "block";
      return false;
    }
    
    // Check if the Book number is numeric
    if (!/^\d+$/.test(muteGiftDeedBooknoValue)) {
      muteGiftDeedBooknoError.textContent = "Book number must be a numeric value.";
      muteGiftDeedBooknoError.style.display = "block";
      return false;
    }

    // Check if the Book number is a positive number (optional, if you want to restrict to positive values)
    if (parseFloat(muteGiftDeedBooknoValue) <= 0) {
      muteGiftDeedBooknoError.textContent =
        "Book number must be a positive number.";
      muteGiftDeedBooknoError.style.display = "block";
      return false;
    }

    // Check if the Book number exceeds 10 digits
    if (muteGiftDeedBooknoValue.length > 10) {
      muteGiftDeedBooknoError.textContent = "Book number cannot exceed 10 digits.";
      muteGiftDeedBooknoError.style.display = "block";
      return false;
    }

    muteGiftDeedBooknoError.style.display = "none";
    return true;
  }

  $(document).on("input blur change", "#giftdeedFrom", function () {
    validateMuteGiftDeedFrom();
  });

  function validateMuteGiftDeedFrom() {
    var muteGiftDeedFromValue = muteGiftDeedFrom.value.trim();
    var muteGiftDeedValueTo = muteGiftDeedTo.value.trim();

    // Check if the field is empty
    if (muteGiftDeedFromValue === "") {
      muteGiftDeedFromError.textContent = "Page number from is required.";
      muteGiftDeedFromError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteGiftDeedFromValue)) {
      muteGiftDeedFromError.textContent =
        "Page number from must be a numeric value.";
      muteGiftDeedFromError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteGiftDeedFromValue) <= 0) {
      muteGiftDeedFromError.textContent =
        "Page number from must be a positive number.";
      muteGiftDeedFromError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteGiftDeedFromValue.length > 4) {
      muteGiftDeedFromError.textContent = "Page number cannot exceed 4 digits.";
      muteGiftDeedFromError.style.display = "block";
      return false;
    }
    
    // Check if 'Page number From' is greater than 'Page number To'
    if (parseInt(muteGiftDeedFromValue) > parseInt(muteGiftDeedValueTo)) {
      muteGiftDeedFromError.textContent =
        "Page number from cannot be greater than page number to.";
      muteGiftDeedFromError.style.display = "block";
      return false;
    } else {
      muteGiftDeedFromError.style.display = "none";
      return true;
    }
  }

  $(document).on("input blur change", "#giftdeedTo", function () {
    validateMuteGiftDeedTo();
  });

  function validateMuteGiftDeedTo() {
    var muteGiftDeedToValue = muteGiftDeedTo.value.trim();
    var muteGiftDeedValueFrom = muteGiftDeedFrom.value.trim();
    // Check if the field is empty
    if (muteGiftDeedToValue === "") {
      muteGiftDeedToError.textContent = "Page number to is required.";
      muteGiftDeedToError.style.display = "block";
      return false;
    }
    
    // Check if the value is numeric
    if (!/^\d+$/.test(muteGiftDeedToValue)) {
      muteGiftDeedToError.textContent = "Page number to must be a numeric value.";
      muteGiftDeedToError.style.display = "block";
      return false;
    }

    // Check if the value is positive
    if (parseFloat(muteGiftDeedToValue) <= 0) {
      muteGiftDeedToError.textContent = "Page number to must be a positive number.";
      muteGiftDeedToError.style.display = "block";
      return false;
    }

    // Check if the Page number Max 4 digits
    if (muteGiftDeedToValue.length > 4) {
      muteGiftDeedToError.textContent = "Page number cannot exceed 4 digits.";
      muteGiftDeedToError.style.display = "block";
      return false;
    }

    // Check if 'Page number To' is less than 'Page number From'
    if (parseInt(muteGiftDeedToValue) < parseInt(muteGiftDeedValueFrom)) {
      muteGiftDeedToError.textContent =
        "Page number to cannot be less than page number from.";
      muteGiftDeedToError.style.display = "block";
      return false;
    } else {
      muteGiftDeedToError.style.display = "none";
      return true;
    }
  }

  function validateMuteGiftDeedRegdate() {
    var muteGiftDeedRegdateValue = muteGiftDeedRegdate.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteGiftDeedRegdateValue === "") {
      muteGiftDeedRegdateError.textContent = "Date of registration is required.";
      muteGiftDeedRegdateError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteGiftDeedRegdateValue > today) {
      muteGiftDeedRegdateError.textContent =
        "Date of registration cannot be in the future.";
      muteGiftDeedRegdateError.style.display = "block";
      muteGiftDeedRegdate.value = ""; // Clear invalid input
      return false;
    }

    muteGiftDeedRegdateError.style.display = "none";
    return true;
  }

  function validateMuteGiftDeedRegOfficeName() {
    var muteGiftDeedRegOfficeNameValue = muteGiftDeedRegOfficeName.value.trim();
    if (muteGiftDeedRegOfficeNameValue === "") {
      muteGiftDeedRegOfficeNameError.textContent =
        "Registration office name is required.";
      muteGiftDeedRegOfficeNameError.style.display = "block";
      return false;
    } else {
      muteGiftDeedRegOfficeNameError.style.display = "none";
    }

    // Check if the value contains only alphabetic characters and spaces
    var giftNameAlpha = /^[A-Za-z\s.]+$/;
    if (!giftNameAlpha.test(muteGiftDeedRegOfficeNameValue)) {
      muteGiftDeedRegOfficeNameError.textContent =
        "Registration office name must contain letters only.";
      muteGiftDeedRegOfficeNameError.style.display = "block";
      return false;
    } else {
      muteGiftDeedRegOfficeNameError.style.display = "none";
    }
    return true;
  }
  // Gift deed Mutaition form step 3 add by anil on 18-02-2025 for validation

  // Surviving Member Certificate Mutaition form step 3 add by anil on 18-02-2025 for validation
  function validateMuteSmcFile() {
    if (muteSmcFile.files.length > 0) {
      var file = muteSmcFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        muteSmcFileError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        muteSmcFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        muteSmcFileError.textContent = "";
        return true;
      }
    } else {
      if (muteSmcFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      muteSmcFileError.textContent = "SMC PDF file is required.";
      return false;
    }
  }

  function validateMuteSmcCertificateNo() {
    var muteSmcCertificateNoValue = muteSmcCertificateNo.value.trim();
    var allowedPattern = /^[A-Za-z0-9:\/\-\s]+$/; // Regex allows alphabets, numbers, spaces, and : - /
    if (muteSmcCertificateNoValue === "") {
      muteSmcCertificateNoError.textContent = "SMC certificate number is required.";
      muteSmcCertificateNoError.style.display = "block";
      return false;
    } else if (!allowedPattern.test(muteSmcCertificateNoValue)) {
      muteSmcCertificateNoError.textContent =
        "Only letters, numbers, and : - / are allowed.";
      muteSmcCertificateNoError.style.display = "block";
      return false;
    } else {
      muteSmcCertificateNoError.style.display = "none";
    }
    return true;
  }

  function validateMuteSmcDateOfIssue() {
    var muteSmcDateOfIssueValue = muteSmcDateOfIssue.value.trim();
    var today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    if (muteSmcDateOfIssueValue === "") {
      muteSmcDateOfIssueError.textContent = "Date of issue is required.";
      muteSmcDateOfIssueError.style.display = "block";
      return false;
    }

    // Future date validation
    if (muteSmcDateOfIssueValue > today) {
      muteSmcDateOfIssueError.textContent =
        "Date of issue cannot be in the future.";
      muteSmcDateOfIssueError.style.display = "block";
      muteSmcDateOfIssue.value = ""; // Clear invalid input
      return false;
    }

    muteSmcDateOfIssueError.style.display = "none";
    return true;
  }

  // Propate/LOA/Court Decree/Order Mutaition form step 3 add by anil on 15-05-2025 for validation
  function validateMutePropateFile() {
    if (mutePropateFile.files.length > 0) {
      var file = mutePropateFile.files[0];
      if (file.size > 5 * 1024 * 1024) {
        mutePropateFileError.textContent = "File size must be less than 5 MB.";
        return false;
      } else if (!file.name.endsWith(".pdf")) {
        mutePropateFileError.textContent = "Only PDF files are allowed.";
        return false;
      } else {
        mutePropateFileError.textContent = "";
        return true;
      }
    } else {
      if (mutePropateFile.getAttribute("data-should-validate") == 1) {
        return true;
      }
      mutePropateFileError.textContent = "Propate/LOA/Court Decree/ Court Order PDF file is required.";
      return false;
    }
  }

  // Function to validate the Terms & Conditions checkbox
  function validateAgreeConsentMut() {
    if (!MutAgreeConsent.checked) {
      MutAgreeconsentError.textContent = "Please accept terms & conditions.";
      MutAgreeconsentError.style.display = "block";
      return false;
    } else {
      MutAgreeconsentError.style.display = "none";
      return true;
    }
  }

    //step three forms validation
  function validateForm3MUT() {
    var isMutValidateForm3Valid = true; // Start assuming the form is valid

    // Select only visible divs inside #stepThreeDiv
    $("#stepThreeDiv > div:visible").each(function () {
      var divId = $(this).attr("id");

      switch (divId) {
        case "deathCertificate_check":
          isMutValidateForm3Valid =
            validateMuteDethCertificate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteDethDeceaseName() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteDethDate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteDethCertificateIssueDate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteDethCertificateNumber() && isMutValidateForm3Valid;
          break;

        case "saleDeed_check":
          isMutValidateForm3Valid =
            validateMuteSaleDeed() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedRegno() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedVolume() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedBookNo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedFrom() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedTo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedRegDate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSaleDeedRegOfficeName() && isMutValidateForm3Valid;
          break;

        case "regdWillDeed_check":
          isMutValidateForm3Valid =
            validateMuteWillRegdFile() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillTestatorName() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillRegno() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillVolume() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillBookNo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillFrom() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillTo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillRegDate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteWillRegOfficeName() && isMutValidateForm3Valid;
          break;
        case "unregdWillCodocil_check":
          isMutValidateForm3Valid =
            validateMuteUnregdWillFile() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteUnregdWillTestatorName() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteUnregdWillDate() && isMutValidateForm3Valid;
          break;

        case "relinquishmentDeed_check":
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedFile() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedReleaserName() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedRegNo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedVolume() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedBookno() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedFrom() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedTo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedRegdate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteRelinquishDeedRegname() && isMutValidateForm3Valid;
          break;

        case "giftDeed_check":
          isMutValidateForm3Valid =
            validateMuteGiftDeedFile() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedRegno() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedVolume() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedBookno() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedFrom() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedTo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedRegdate() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteGiftDeedRegOfficeName() && isMutValidateForm3Valid;
          break;

        case "survivingMemberCertificate_check":
          isMutValidateForm3Valid =
            validateMuteSmcFile() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSmcCertificateNo() && isMutValidateForm3Valid;
          isMutValidateForm3Valid =
            validateMuteSmcDateOfIssue() && isMutValidateForm3Valid;
          break;

        case "propateLoaCourtDecreeOrder_check":
          isMutValidateForm3Valid =
            validateMutePropateFile() && isMutValidateForm3Valid;
          break;
      }
    });

    // Validate Additional Document fields
    // isMutValidateForm3Valid &= validateMuteAod();

    // Validate Terms & Conditions
    let isAgreeConsentMutValid = validateAgreeConsentMut(); // Check if Terms & Conditions is accepted
    var isAppOtherDoc = validateAppOtherDoc("MUTATION-3");
    let isPoAValid = validatePOADoc("MUTATION-3");

    if (!isAgreeConsentMutValid) {
      isMutValidateForm3Valid = false; // If the consent is not checked, mark the form as invalid
    }

    return isMutValidateForm3Valid && isAppOtherDoc && isPoAValid;
  }

  // function validateForm3MUT() {
  //   var isAgreeConsentMutValid = validateAgreeConsentMut();
  //   return isAgreeConsentMutValid && isDethCertificateMuteValid;
  // }

  var statusofapplicant = document.getElementById("statusofapplicant");
  var statusofapplicantError = document.getElementById("statusofapplicantError");

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

// for storing second step of mutation- Sourav Chauhan (19/sep/2024)
function mutationStepThird(callback) {
  var updateId = $("input[name='updateId']").val();
  var deathCertificateDeceasedName = $(
    "input[name='deathCertificateDeceasedName']"
  ).val();
  var deathCertificateDeathdate = $(
    "input[name='deathCertificateDeathdate']"
  ).val();
  var deathCertificateIssuedate = $(
    "input[name='deathCertificateIssuedate']"
  ).val();
  var deathCertificateDocumentCertificate = $(
    "input[name='deathCertificateDocumentCertificate']"
  ).val();
  var SaleDeedRegno = $("input[name='SaleDeedRegno']").val();
  var SaleDeedVolume = $("input[name='SaleDeedVolume']").val();
  var saleDeedBookNo = $("input[name='saleDeedBookNo']").val();
  var saleDeedPageNo = $("input[name='saleDeedPageNo']").val();
  var saleDeedFrom = $("input[name='saleDeedFrom']").val();
  var saleDeedTo = $("input[name='saleDeedTo']").val();
  var saleDeedRegDate = $("input[name='saleDeedRegDate']").val();
  var saleDeedRegOfficeName = $("input[name='saleDeedRegOfficeName']").val();
  var regWillDeedTestatorName = $(
    "input[name='regWillDeedTestatorName']"
  ).val();
  var regWillDeedRegNo = $("input[name='regWillDeedRegNo']").val();
  var regWillDeedVolume = $("input[name='regWillDeedVolume']").val();
  var regWillDeedBookNo = $("input[name='regWillDeedBookNo']").val();
  var regWillDeedPageNo = $("input[name='regWillDeedPageNo']").val();
  var regWillDeedFrom = $("input[name='regWillDeedFrom']").val();
  var regWillDeedTo = $("input[name='regWillDeedTo']").val();
  var regWillDeedRegDate = $("input[name='regWillDeedRegDate']").val();
  var regWillDeedRegOfficeName = $(
    "input[name='regWillDeedRegOfficeName']"
  ).val();
  var unregWillCodicilTestatorName = $(
    "input[name='unregWillCodicilTestatorName']"
  ).val();
  var unregWillCodicilDateOfWillCodicil = $(
    "input[name='unregWillCodicilDateOfWillCodicil']"
  ).val();
  var relinquishDeedRegNo = $("input[name='relinquishDeedRegNo']").val();
  var relinquishDeedVolume = $("input[name='relinquishDeedVolume']").val();
  var relinquishDeedBookno = $("input[name='relinquishDeedBookno']").val();
  var relinquishDeedPageno = $("input[name='relinquishDeedPageno']").val();
  var relinquishDeedFrom = $("input[name='relinquishDeedFrom']").val();
  var relinquishDeedTo = $("input[name='relinquishDeedTo']").val();
  var relinquishDeedRegdate = $("input[name='relinquishDeedRegdate']").val();
  var relinquishDeedRegname = $("input[name='relinquishDeedRegname']").val();
  var giftdeedRegno = $("input[name='giftdeedRegno']").val();
  var giftdeedVolume = $("input[name='giftdeedVolume']").val();
  var giftdeedBookno = $("input[name='giftdeedBookno']").val();
  var giftdeedPageno = $("input[name='giftdeedPageno']").val();
  var giftdeedFrom = $("input[name='giftdeedFrom']").val();
  var giftdeedTo = $("input[name='giftdeedTo']").val();
  var giftdeedRegdate = $("input[name='giftdeedRegdate']").val();
  var giftdeedRegOfficeName = $("input[name='giftdeedRegOfficeName']").val();
  var smcCertificateNo = $("input[name='smcCertificateNo']").val();
  var smcDateOfIssue = $("input[name='smcDateOfIssue']").val();
  var sbpDateOfIssue = $("input[name='sbpDateOfIssue']").val();
  var otherDocumentRemark = $("textarea[name='otherDocumentRemark']").val();
  var agreeConsent = $("#agreeconsent").is(":checked") ? 1 : 0;
  console.log(agreeConsent);

  var baseUrl = getBaseURL();
  var csrfToken = $('meta[name="csrf-token"]').attr("content");
  $.ajax({
    url: baseUrl + "/mutation-step-third",
    type: "POST",
    dataType: "JSON",
    data: {
      _token: csrfToken,
      updateId: updateId,
      deathCertificateDeceasedName: deathCertificateDeceasedName,
      deathCertificateDeathdate: deathCertificateDeathdate,
      deathCertificateIssuedate: deathCertificateIssuedate,
      deathCertificateDocumentCertificate: deathCertificateDocumentCertificate,
      SaleDeedRegno: SaleDeedRegno,
      SaleDeedVolume: SaleDeedVolume,
      saleDeedBookNo: saleDeedBookNo,
      saleDeedPageNo: saleDeedPageNo,
      saleDeedFrom: saleDeedFrom,
      saleDeedTo: saleDeedTo,
      saleDeedRegDate: saleDeedRegDate,
      saleDeedRegOfficeName: saleDeedRegOfficeName,
      regWillDeedTestatorName: regWillDeedTestatorName,
      regWillDeedRegNo: regWillDeedRegNo,
      regWillDeedVolume: regWillDeedVolume,
      regWillDeedBookNo: regWillDeedBookNo,
      regWillDeedPageNo: regWillDeedPageNo,
      regWillDeedFrom: regWillDeedFrom,
      regWillDeedTo: regWillDeedTo,
      regWillDeedRegDate: regWillDeedRegDate,
      regWillDeedRegOfficeName: regWillDeedRegOfficeName,
      unregWillCodicilTestatorName: unregWillCodicilTestatorName,
      unregWillCodicilDateOfWillCodicil: unregWillCodicilDateOfWillCodicil,
      relinquishDeedRegNo: relinquishDeedRegNo,
      relinquishDeedVolume: relinquishDeedVolume,
      relinquishDeedBookno: relinquishDeedBookno,
      relinquishDeedPageno: relinquishDeedPageno,
      relinquishDeedFrom: relinquishDeedFrom,
      relinquishDeedTo: relinquishDeedTo,
      relinquishDeedRegdate: relinquishDeedRegdate,
      relinquishDeedRegname: relinquishDeedRegname,
      giftdeedRegno: giftdeedRegno,
      giftdeedVolume: giftdeedVolume,
      giftdeedBookno: giftdeedBookno,
      giftdeedPageno: giftdeedPageno,
      giftdeedFrom: giftdeedFrom,
      giftdeedTo: giftdeedTo,
      giftdeedRegdate: giftdeedRegdate,
      giftdeedRegOfficeName: giftdeedRegOfficeName,
      smcCertificateNo: smcCertificateNo,
      smcDateOfIssue: smcDateOfIssue,
      sbpDateOfIssue: sbpDateOfIssue,
      otherDocumentRemark: otherDocumentRemark,
      agreeConsent: agreeConsent,
    },
    success: function (result) {
      if (result.status) {
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
