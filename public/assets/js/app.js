// Minified by Diwakar Sinha at 30-12-2024 (and commented by anil and and new minify js added some functions on 23-01-2025)
// $((function(){"use strict";new PerfectScrollbar(".header-message-list"),new PerfectScrollbar(".header-notifications-list"),$(".mobile-search-icon").on("click",(function(){$(".search-bar").addClass("full-search-bar")})),$(".search-close").on("click",(function(){$(".search-bar").removeClass("full-search-bar")})),$(".mobile-toggle-menu").on("click",(function(){$(".wrapper").addClass("toggled")})),$(document).ready((function(){$(".wrapper").addClass("toggled"),$(".toggle-icon").click((function(){$(".wrapper").hasClass("toggled")?($(".wrapper").removeClass("toggled"),$(".sidebar-wrapper").unbind("hover")):$(".wrapper").addClass("toggled")}))})),$(document).ready((function(){$(window).on("scroll",(function(){$(this).scrollTop()>300?$(".back-to-top").fadeIn():$(".back-to-top").fadeOut()})),$(".back-to-top").on("click",(function(){return $("html, body").animate({scrollTop:0},600),!1}))})),$((function(){for(var o=window.location,e=$(".metismenu li a").filter((function(){return this.href==o})).addClass("").parent().addClass("mm-active");e.is("li");)e=e.parent("").addClass("mm-show").parent("").addClass("mm-active")})),$((function(){$("#menu").metisMenu()})),$(".chat-toggle-btn").on("click",(function(){$(".chat-wrapper").toggleClass("chat-toggled")})),$(".chat-toggle-btn-mobile").on("click",(function(){$(".chat-wrapper").removeClass("chat-toggled")})),$(".email-toggle-btn").on("click",(function(){$(".email-wrapper").toggleClass("email-toggled")})),$(".email-toggle-btn-mobile").on("click",(function(){$(".email-wrapper").removeClass("email-toggled")})),$(".compose-mail-btn").on("click",(function(){$(".compose-mail-popup").show()})),$(".compose-mail-close").on("click",(function(){$(".compose-mail-popup").hide()})),$(".switcher-btn").on("click",(function(){$(".switcher-wrapper").toggleClass("switcher-toggled")})),$(".close-switcher").on("click",(function(){$(".switcher-wrapper").removeClass("switcher-toggled")})),$("#lightmode").on("click",(function(){$("html").attr("class","light-theme")})),$("#darkmode").on("click",(function(){$("html").attr("class","dark-theme")})),$("#semidark").on("click",(function(){$("html").attr("class","semi-dark")})),$("#minimaltheme").on("click",(function(){$("html").attr("class","minimal-theme")})),$("#headercolor1").on("click",(function(){$("html").addClass("color-header headercolor1"),$("html").removeClass("headercolor2 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")})),$("#headercolor2").on("click",(function(){$("html").addClass("color-header headercolor2"),$("html").removeClass("headercolor1 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")})),$("#headercolor3").on("click",(function(){$("html").addClass("color-header headercolor3"),$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8")})),$("#headercolor4").on("click",(function(){$("html").addClass("color-header headercolor4"),$("html").removeClass("headercolor1 headercolor2 headercolor3 headercolor5 headercolor6 headercolor7 headercolor8")})),$("#headercolor5").on("click",(function(){$("html").addClass("color-header headercolor5"),$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor3 headercolor6 headercolor7 headercolor8")})),$("#headercolor6").on("click",(function(){$("html").addClass("color-header headercolor6"),$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor3 headercolor7 headercolor8")})),$("#headercolor7").on("click",(function(){$("html").addClass("color-header headercolor7"),$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor3 headercolor8")})),$("#headercolor8").on("click",(function(){$("html").addClass("color-header headercolor8"),$("html").removeClass("headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor3")})),$("#sidebarcolor1").click((function(){$("html").attr("class","color-sidebar sidebarcolor1")})),$("#sidebarcolor2").click((function(){$("html").attr("class","color-sidebar sidebarcolor2")})),$("#sidebarcolor3").click((function(){$("html").attr("class","color-sidebar sidebarcolor3")})),$("#sidebarcolor4").click((function(){$("html").attr("class","color-sidebar sidebarcolor4")})),$("#sidebarcolor5").click((function(){$("html").attr("class","color-sidebar sidebarcolor5")})),$("#sidebarcolor6").click((function(){$("html").attr("class","color-sidebar sidebarcolor6")})),$("#sidebarcolor7").click((function(){$("html").attr("class","color-sidebar sidebarcolor7")})),$("#sidebarcolor8").click((function(){$("html").attr("class","color-sidebar sidebarcolor8")}))}));
//Minified by anil kumar at 23-01-2025
$(function () {
  "use strict";
  new PerfectScrollbar(".header-message-list"),
    new PerfectScrollbar(".header-notifications-list"),
    $(".mobile-search-icon").on("click", function () {
      $(".search-bar").addClass("full-search-bar");
    }),
    $(".search-close").on("click", function () {
      $(".search-bar").removeClass("full-search-bar");
    }),
    $(".mobile-toggle-menu").on("click", function () {
      $(".wrapper").addClass("toggled");
    }),
    $(document).ready(function () {
      // added by anil on 08-09-2025 for below ipad menu, default closed
      function handleResponsiveToggle() {
        if ($(window).width() <= 1024) {
          $(".wrapper").addClass("toggled"); // always toggled on small screens
          $(".overlay").fadeOut();
        } else {
          // respect whatever class Blade rendered (don’t force remove)
          if (!$(".wrapper").hasClass("toggled")) {
            $(".overlay").fadeIn();
          } else {
            $(".overlay").fadeOut();
          }
        }
      }

      // Run on load
      handleResponsiveToggle();

      // Run on resize
      $(window).resize(function () {
        handleResponsiveToggle();
      });
      // added by anil on 08-09-2025 for below ipad, menu default closed 

      // $(".wrapper").addClass("toggled"),
      $(".toggle-icon").click(function () {
        $(".wrapper").hasClass("toggled")
          ? ($(".wrapper").removeClass("toggled"),
            $(window).width() <= 1024 && $(".overlay").fadeIn())
          : ($(".wrapper").addClass("toggled"),
            $(window).width() <= 1024 && $(".overlay").fadeOut());
      }),
        $(document).click(function (o) {
          $(window).width() <= 1024 &&
            ($(o.target).closest(".sidebar-wrapper").length ||
              $(o.target).closest(".toggle-icon").length ||
              ($(".wrapper").addClass("toggled"), $(".overlay").fadeOut()));
        }),
        $(window).width() <= 1024 && $(".wrapper").hasClass("toggled")
          ? $(".overlay").fadeOut()
          : $(".overlay").fadeIn();
    }),
    $(document).ready(function () {
      $(window).on("scroll", function () {
        $(this).scrollTop() > 300
          ? $(".back-to-top").fadeIn()
          : $(".back-to-top").fadeOut();
      }),
        $(".back-to-top").on("click", function () {
          return $("html, body").animate({ scrollTop: 0 }, 600), !1;
        });
    }),
    $(function () {
      for (
        var o = window.location,
          e = $(".metismenu li a")
            .filter(function () {
              return this.href == o;
            })
            .addClass("")
            .parent()
            .addClass("mm-active");
        e.is("li");

      )
        e = e.parent("").addClass("mm-show").parent("").addClass("mm-active");
    }),
    $(function () {
      $("#menu").metisMenu();
    }),
    $(".chat-toggle-btn").on("click", function () {
      $(".chat-wrapper").toggleClass("chat-toggled");
    }),
    $(".chat-toggle-btn-mobile").on("click", function () {
      $(".chat-wrapper").removeClass("chat-toggled");
    }),
    $(".email-toggle-btn").on("click", function () {
      $(".email-wrapper").toggleClass("email-toggled");
    }),
    $(".email-toggle-btn-mobile").on("click", function () {
      $(".email-wrapper").removeClass("email-toggled");
    }),
    $(".compose-mail-btn").on("click", function () {
      $(".compose-mail-popup").show();
    }),
    $(".compose-mail-close").on("click", function () {
      $(".compose-mail-popup").hide();
    }),
    $(".switcher-btn").on("click", function () {
      $(".switcher-wrapper").toggleClass("switcher-toggled");
    }),
    $(".close-switcher").on("click", function () {
      $(".switcher-wrapper").removeClass("switcher-toggled");
    }),
    $("#lightmode").on("click", function () {
      $("html").attr("class", "light-theme");
    }),
    $("#darkmode").on("click", function () {
      $("html").attr("class", "dark-theme");
    }),
    $("#semidark").on("click", function () {
      $("html").attr("class", "semi-dark");
    }),
    $("#minimaltheme").on("click", function () {
      $("html").attr("class", "minimal-theme");
    }),
    $("#headercolor1").on("click", function () {
      $("html").addClass("color-header headercolor1"),
        $("html").removeClass(
          "headercolor2 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8"
        );
    }),
    $("#headercolor2").on("click", function () {
      $("html").addClass("color-header headercolor2"),
        $("html").removeClass(
          "headercolor1 headercolor3 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8"
        );
    }),
    $("#headercolor3").on("click", function () {
      $("html").addClass("color-header headercolor3"),
        $("html").removeClass(
          "headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor8"
        );
    }),
    $("#headercolor4").on("click", function () {
      $("html").addClass("color-header headercolor4"),
        $("html").removeClass(
          "headercolor1 headercolor2 headercolor3 headercolor5 headercolor6 headercolor7 headercolor8"
        );
    }),
    $("#headercolor5").on("click", function () {
      $("html").addClass("color-header headercolor5"),
        $("html").removeClass(
          "headercolor1 headercolor2 headercolor4 headercolor3 headercolor6 headercolor7 headercolor8"
        );
    }),
    $("#headercolor6").on("click", function () {
      $("html").addClass("color-header headercolor6"),
        $("html").removeClass(
          "headercolor1 headercolor2 headercolor4 headercolor5 headercolor3 headercolor7 headercolor8"
        );
    }),
    $("#headercolor7").on("click", function () {
      $("html").addClass("color-header headercolor7"),
        $("html").removeClass(
          "headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor3 headercolor8"
        );
    }),
    $("#headercolor8").on("click", function () {
      $("html").addClass("color-header headercolor8"),
        $("html").removeClass(
          "headercolor1 headercolor2 headercolor4 headercolor5 headercolor6 headercolor7 headercolor3"
        );
    }),
    $("#sidebarcolor1").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor1");
    }),
    $("#sidebarcolor2").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor2");
    }),
    $("#sidebarcolor3").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor3");
    }),
    $("#sidebarcolor4").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor4");
    }),
    $("#sidebarcolor5").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor5");
    }),
    $("#sidebarcolor6").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor6");
    }),
    $("#sidebarcolor7").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor7");
    }),
    $("#sidebarcolor8").click(function () {
      $("html").attr("class", "color-sidebar sidebarcolor8");
    });
});
// Minified by Diwakar Sinha at 30-12-2024
// function openMegaMenu(e,t){var a,n,l;for(n=document.getElementsByClassName("tabcontent"),a=0;a<n.length;a++)n[a].style.display="none";for(l=document.getElementsByClassName("tablinks"),a=0;a<l.length;a++)l[a].className=l[a].className.replace(" active","");document.getElementById(t).style.display="block",e.currentTarget.className+=" active"}
// Minified by Diwakar Sinha at 30-12-2024
// function openMegaMenu(e, t) {
//   var a, n, l;
//   for (
//     n = document.getElementsByClassName("tabcontent"), a = 0;
//     a < n.length;
//     a++
//   )
//     n[a].style.display = "none";
//   for (
//     l = document.getElementsByClassName("tablinks"), a = 0;
//     a < l.length;
//     a++
//   )
//     l[a].className = l[a].className.replace(" active", "");
//   (document.getElementById(t).style.display = "block"),
//     (e.currentTarget.className += " active");
// }
// change the function for onmouseenter to onclick by anil on 06-05-2025
function openMegaMenu(e, tabName) {
  var tabcontents = document.getElementsByClassName("tabcontent");
  var tablinks = document.getElementsByClassName("tablinks");

  for (var i = 0; i < tabcontents.length; i++) {
    tabcontents[i].style.display = "none";
  }

  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }

  document.getElementById(tabName).style.display = "block";
  e.currentTarget.className += " active";
}
// added for mega menu do not close on click inside blank space mega menu by anil on 06-05-2025
document.querySelectorAll(".dropdown-menu").forEach(function (menu) {
  menu.addEventListener("click", function (e) {
    e.stopPropagation(); // prevent dropdown from closing
  });
});

//function added by Nitin on 20/nov/24
// Minified by Diwakar Sinha at 30-12-2024
function customNumFormat(t) {
  const r = t < 0;
  t = Math.abs(t);
  if (t < 1e3) return r ? "-" + t.toString() : t.toString();
  const o = t.toString(),
    [n, s] = o.split(".");
  let e = parseInt(n, 10),
    a = [],
    i = 1e3;
  a.push(String(e % i).padStart(3, "0")), (e = Math.floor(e / i)), (i = 100);
  while (e > 99)
    a.push(String(e % i).padStart(2, "0")), (e = Math.floor(e / i));
  const u = e + "," + a.reverse().join(","),
    c = s ? u + "." + s : u;
  return r ? "-" + c : c;
}

//code added by Nitin after date of birth input is added
// Minified by Diwakar Sinha at 30-12-2024
function calculateAge(t) {
  const e = new Date();
  let n = e.getFullYear() - t.getFullYear();
  const a = e.getMonth() - t.getMonth();
  return (a < 0 || (0 === a && e.getDate() < t.getDate())) && n--, n;
}

function formatDateToDDMMYYYY(date) {
  let d = new Date(date);
  let day = String(d.getDate()).padStart(2, "0"); // Ensure two digits
  let month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  let year = d.getFullYear();

  return `${day}-${month}-${year}`;
}
function getBaseURL() {
  const { protocol, hostname, port } = window.location;
  return `${protocol}//${hostname}${port ? ":" + port : ""}`;
}

// add by anil for additional documents form validaition proff reading page on 29-04-2025
function validateProffDoc() {
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
    const $docTitleError = $editDocForm.find("#additionaldocumenttitlesError");
    const $docFileError = $editDocForm.find("#additionaldocumentsError");

    if ($docTitleInput.length === 0 && $docFileInput.length === 0) return true;

    const editDocTitleVal = $docTitleInput.val()?.trim() || "";
    const editDocFileVal = $docFileInput[0]?.files[0];

    // ✅ Skip validation if both title and file are empty
    if (!editDocTitleVal && !editDocFileVal) {
      $docTitleError.text("");
      $docFileError.text("");
      return true;
    }

    let editDocHasError = false;

    // One is filled but not the other
    if (
      (editDocTitleVal && !editDocFileVal) ||
      (!editDocTitleVal && editDocFileVal)
    ) {
      editDocHasError = true;

      if (!editDocTitleVal) {
        $docTitleError.text("Title is required when document is uploaded.");
      } else {
        $docTitleError.text("");
      }

      if (!editDocFileVal) {
        $docFileError.text("Document is required when title is .");
      } else {
        $docFileError.text("");
      }
    }

    // Validate title format
    if (editDocTitleVal) {
      if (!/^[A-Za-z\s]+$/.test(editDocTitleVal)) {
        editDocHasError = true;
        $docTitleError.text("Title must contain letters only.");
      } else {
        $docTitleError.text("");
      }
    }

    // Validate file format and size
    if (editDocFileVal) {
      const fileName = editDocFileVal.name.toLowerCase();
      const fileSize = editDocFileVal.size;

      if (!fileName.endsWith(".pdf")) {
        editDocHasError = true;
        $docFileError.text("Only PDF files are allowed.");
      } else if (fileSize > 5 * 1024 * 1024) {
        editDocHasError = true;
        $docFileError.text("File size must be less than 5MB.");
      } else {
        $docFileError.text("");
      }
    }

    if (editDocHasError) {
      isEditDocFormValid = false;
    }
  });

  return isEditDocFormValid;
}

$(document).ready(function () {
  $(".btn-proofreading").on("click", function (e) {
    if (!validateProffDoc()) {
      e.preventDefault(); // Prevent form submission if validation fails
    }
  });
});

// $(document).on("click", function (e) {
//   if (
//     !(
//       $(e.target).closest(".sidebar-wrapper").length ||
//       $(e.target).closest(".toggle-icon").length
//     )
//   ) {
//     $(".wrapper").addClass("toggled");
//   }
// });

const saveBtn = document.getElementById('saveBtn');

// Validation functions with conditional check
function validateEmail() {
    const emailField = document.getElementById('profileEmail');
    const emailError = document.getElementById('profileEmailError');
    if (!emailField) return true; // Skip if not present

    const email = emailField.value.trim();
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        emailError.innerText = "Email is required.";
        emailField.classList.add('error');
        return false;
    } else if (!pattern.test(email)) {
        emailError.innerText = "Enter a valid email.";
        emailField.classList.add('error');
        return false;
    } else {
        emailError.innerText = "";
        emailField.classList.remove('error');
        return true;
    }
}

function validateMobile() {
    const mobileField = document.getElementById('profileMobileNo');
    const mobileError = document.getElementById('profileMobileNoError');
    if (!mobileField) return true; // Skip if not present

    const mobile = mobileField.value.trim();
    const pattern = /^[0-9]{10}$/;

    if (mobile === "") {
        mobileError.innerText = "Mobile number is required.";
        mobileField.classList.add('error');
        return false;
    } else if (!pattern.test(mobile)) {
        mobileError.innerText = "Enter a valid 10-digit mobile number.";
        mobileField.classList.add('error');
        return false;
    } else {
        mobileError.innerText = "";
        mobileField.classList.remove('error');
        return true;
    }
}

function validateAddress() {
    const addressField = document.getElementById('profileAddress');
    const addressError = document.getElementById('profileAddressError');
    if (!addressField) return true; // Skip if not present

    const address = addressField.value.trim();

    if (address === "") {
        addressError.innerText = "Address cannot be empty.";
        addressField.classList.add('error');
        return false;
    } else {
        addressError.innerText = "";
        addressField.classList.remove('error');
        return true;
    }
}

// Enable/disable button based on validation
function toggleSaveBtn() {
    if (validateEmail() && validateMobile() && validateAddress()) {
        saveBtn.disabled = false;
    } else {
        saveBtn.disabled = true;
    }
}

// Real-time validation events (only if elements exist)
if (document.getElementById('profileEmail')) {
    document.getElementById('profileEmail').addEventListener('keyup', toggleSaveBtn);
}
if (document.getElementById('profileMobileNo')) {
    document.getElementById('profileMobileNo').addEventListener('keyup', toggleSaveBtn);
}
if (document.getElementById('profileAddress')) {
    document.getElementById('profileAddress').addEventListener('keyup', toggleSaveBtn);
}

// Initial check
toggleSaveBtn();

// Submit button click
saveBtn.addEventListener('click', function() {
    if (validateEmail() && validateMobile() && validateAddress()) {
        document.getElementById('profileForm').submit();
    }
});