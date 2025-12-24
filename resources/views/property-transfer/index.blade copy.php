@extends('layouts.app')
@section('title', 'Property Transfer')
@section('content')
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>
    <link rel="stylesheet" href="{{ asset('assets/css/rgr.css') }}" />
    <style>
        .subhead-input {
            margin: 10px 0 !important;
            padding: 10px 0 !important;
            border-radius: 10px;
        }

        #detail-container>tr>td:not(:nth-child(2)) {
            width: 15%;
        }
    </style>
    <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
        <div class="breadcrumb-title pe-3">Miscellaneous</div>
        @include('include.partials.breadcrumbs')
    </div>
    <!--breadcrumb-->
    <div class="card shadow-sm mb-4">
        <div class="card-body">
            <div class="row">
                <div class="col-lg-12 mb-2" id="propertyDetailsDiv">
                    <div class="row g-3">
                        <div class="col-12 col-lg-3">
                            <label for="locality" class="form-label">Colony Name (Present)</label>
                            <select name="locality" id="locality" class="form-select">
                                <option value="">Select</option>
                                @foreach ($colonyList as $colony)
                                    <option value="{{ $colony->id }}">{{ $colony->name }}</option>
                                @endforeach
                            </select>
                            @error('locality')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                            <div class="text-danger" id="localityError"></div>
                        </div>
                        <div class="col-12 col-lg-3">
                            <label for="block" class="form-label">Block</label>
                            <select name="block" id="block" class="form-select">
                                <option value="">Select</option>
                            </select>
                            @error('block')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                            <div class="text-danger" id="blockError"></div>
                        </div>
                        <div class="col-12 col-lg-3">
                            <label for="plot" class="form-label">Plot No./Flat No.</label>
                            <select name="plot" id="plot" class="form-select">
                                <option value="">Select</option>
                            </select>
                            @error('plot')
                                <div class="text-danger">{{ $message }}</div>
                            @enderror
                            <div class="text-danger" id="plotError"></div>
                        </div>
                        <div class="col-12 col-lg-1 text-center"
                            style="padding-top: 27px; padding-left: 36px; font-size: 24px;">
                            <label class="form-label">OR</label>
                        </div>
                        <div class="col col-lg-2">
                            <label for="searchPropertyId" class="form-label">Search By Property Id</label>
                            <input type="text" id="searchPropertyId" name="searchPropertyId"
                                class="form-control numericOnly five-digit" placeholder="Enter Property ID">
                            <div id="suggestions" class="list-group" style="display: none;"></div>
                        </div>
                        <!-- Display Selected Property Details -->
                        <div class="text-danger" id="searchPropertyIdError"></div>
                    </div>
                </div>
                <div class="col-lg-12 col-12" id="propertyDetailsDiv">
                    <div class="row mb-3">
                        <div class="col-lg-3">
                            <label for="section" class="form-label">Section</label>
                            <select class="form-control" name="section" id="section">
                                <option value="">Select Section</option>
                                @foreach ($sections as $section)
                                    @if ($section->section_code !== 'ITC')
                                        <option value="{{ $section->id }}">{!! $section->name !!} -
                                            ({{ $section->section_code }})
                                        </option>
                                    @endif
                                @endforeach
                            </select>
                            <div id="sectionError" class="text-danger"></div>
                        </div>
                        <div class="col-lg-3" style="padding-top: 28px;">
                            <!-- Button to open modal -->
                            <button class="btn btn-primary" id="propertyTransferModalBtn">Transfer</button>
                        </div>
                    </div>
                </div>
                <div id="errorDiv" style="color: red; display: none;"></div> <!-- Error container -->
            </div>
        </div>
    </div>

    <!-- Transfer Property Modal -->
    <div class="modal fade" id="propertyTransferConfirmModal" tabindex="-1"
        aria-labelledby="propertyTransferConfirmModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="propertyTransferConfirmModalLabel">Property Transfer</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to transfer this property to selected section?
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="propertyTransferConfirmBtn">Confirm</button>
                </div>
            </div>
        </div>
    </div>
    @include('include.loader')
    @include('include.alerts.ajax-alert')
@endsection
@section('footerScript')
    <script>
        //get all blocks of selected locality
        $('#locality').on('change', function() {
            var locality = this.value;
            $("#block").html('');
            $.ajax({
                url: "{{ route('localityBlocks') }}",
                type: "POST",
                data: {
                    locality: locality,
                    _token: '{{ csrf_token() }}'
                },
                dataType: 'json',
                success: function(result) {
                    $('#block').html('<option value="">Select</option>');
                    $.each(result, function(key, value) {
                        $("#block").append('<option value="' + value.block_no + '">' + value
                            .block_no + '</option>');
                    });
                }
            });
        });
        //get all plots of selected block
        $('#block').on('change', function() {
            var locality = $('#locality').val();
            var block = this.value;
            $("#plot").html('');
            $.ajax({
                url: "{{ route('blockPlots') }}",
                type: "POST",
                data: {
                    locality: locality,
                    block: block,
                    _token: '{{ csrf_token() }}'
                },
                dataType: 'json',
                success: function(result) {
                    // console.log(result);
                    $('#plot').html('<option value="">Select</option>');
                    $.each(result, function(key, value) {
                        $("#plot").append('<option value="' + value + '">' +
                            value + '</option>');
                    });
                }
            });
        });
        //get known as of selected plot
        $('#plot').on('change', function() {
            var locality = $('#locality').val();
            var block = $('#block').val();
            var plot = this.value;
            $.ajax({
                url: "{{ route('getPropertyDetails') }}",
                type: "POST",
                data: {
                    locality: locality,
                    block: block,
                    plot: plot,
                    _token: '{{ csrf_token() }}'
                },
                dataType: 'json',
                success: function(result) {
                    console.log(result);
                    // Remove the previously appended content, if it exists
                    const previousContent = document.getElementById('appendedContent');
                    if (previousContent) {
                        previousContent.remove();
                    }
                    // Append new content inside a wrapper div
                    document.getElementById('propertyDetailsDiv').insertAdjacentHTML('beforeend',
                        `<div id="appendedContent" style="margin-bottom:19px;">${result.data}</div>`
                    );
                }
            });
        });

        $(document).ready(function() {
            let timeout = null;

            $('#searchPropertyId').on('input', function() {
                clearTimeout(timeout); // Clear previous timeout
                const query = $(this).val();

                if (query.length > 2) { // Start searching after 2 characters
                    timeout = setTimeout(function() {
                        $.ajax({
                            url: '{{ route('search.property') }}', // Keep this route as POST
                            method: 'POST', // Change method to POST
                            data: {
                                _token: '{{ csrf_token() }}', // Include CSRF token for POST requests
                                query: query
                            },
                            success: function(data) {
                                // Clear previous suggestions
                                $('#suggestions').empty();

                                // Check if there are results
                                if (data.length > 0) {
                                    $.each(data, function(index, property) {
                                        $('#suggestions').append(
                                            `<a href="#" class="list-group-item list-group-item-action suggestion-item" data-id="${property.old_propert_id}">${property.old_propert_id}</a>`
                                        );
                                    });
                                    $('#suggestions').show();
                                } else {
                                    $('#suggestions').hide();
                                }
                            }
                        });
                    }, 300); // Debounce for 300ms
                } else {
                    $('#suggestions').hide();
                }
            });

            // Handle suggestion click
            $(document).on('click', '.suggestion-item', function(e) {
                e.preventDefault();
                const propertyId = $(this).data('id');
                $('#searchPropertyId').val(propertyId);
                $('#suggestions').hide();
                fetchPropertyDetails(propertyId);
            });

            // Function to fetch property details based on selected ID
            function fetchPropertyDetails(propertyId) {
                $.ajax({
                    url: '/get-property-data/' + propertyId, // Create this route
                    method: 'GET',
                    dataType: 'json',
                    success: function(result) {
                        // Remove the previously appended content, if it exists
                        const previousContent = document.getElementById('appendedContent');
                        if (previousContent) {
                            previousContent.remove();
                        }
                        // Append new content inside a wrapper div
                        document.getElementById('propertyDetailsDiv').insertAdjacentHTML('beforeend',
                            `<div id="appendedContent" style="margin-bottom:19px;">${result.data}</div>`
                        );
                    }
                });
            }

            //maximum 5 digits allowed for property ID
            document.querySelectorAll('.five-digit').forEach(input => {
                input.addEventListener('input', function() {
                    // Remove non-numeric characters
                    this.value = this.value.replace(/\D/g, '');

                    // Limit input to 5 digits
                    if (this.value.length > 5) {
                        this.value = this.value.slice(0, 5);
                    }
                });
            });
        });

        $(document).ready(function() {
            let propertyMasterId; // Defined Variable propertyMasterId
            let sectionId;
            let errorDiv = document.getElementById('errorDiv');

            // Open modal and store the record ID from the button
            $('#propertyTransferModalBtn').click(function() {
                propertyMasterId = $('#property_master_id').val();
                sectionId = $('#section').val();
                if (!propertyMasterId) {
                    errorDiv.innerText = 'Search property to transfer!';
                    errorDiv.style.display = 'block'; // Show error
                    return false;
                }
                if (!sectionId) {
                    errorDiv.innerText = 'Select section to transfer property!';
                    errorDiv.style.display = 'block'; // Show error
                    return false;
                }
                $('#propertyTransferConfirmModal').modal('show'); // Show modal
            });

            // Handle Confirm button click inside modal
            $('#propertyTransferConfirmBtn').click(function() {
                propertyMasterId = $('#property_master_id').val();
                sectionId = $('#section').val();
                $.ajax({
                    url: '{{ route('property.transfer.section') }}', // Replace with your actual route
                    type: 'POST', // Change to DELETE if needed
                    data: {
                        _token: '{{ csrf_token() }}', // Laravel CSRF token
                        propertyMasterId: propertyMasterId, // Send property ID
                        sectionId: sectionId, // Send section ID
                    },
                    success: function(response) {
                        if (response.status == 'success') {
                            $('#propertyTransferConfirmModal').modal(
                                'hide'); // Hide modal on success
                            showSuccess(response.message);
                            location.reload(); // Reload page (optional)
                        } else {
                            $('#propertyTransferConfirmModal').modal(
                                'hide'); // Hide modal on success
                            // alert(response.message); // Show success message
                            showError(response.message);
                        }
                    },
                    error: function(xhr) {
                        $('#propertyTransferConfirmModal').modal('hide');
                        alert('Error: ' + xhr.responseJSON.message);

                    }
                });
            });
        });
    </script>

@endsection
