@extends('layouts.app')
@section('title', 'Scanning Request List')

@section('content')

<style>
    div.dt-buttons {
        float: none !important;
        /* width: 19%; */
        width: 33%;
        /* chagned by anil on 28-08-2025 to fix in resposive */
    }

    div.dt-buttons.btn-group {
        margin-bottom: 20px;
    }

    div.dt-buttons.btn-group .btn {
        font-size: 12px;
        padding: 5px 10px;
        border-radius: 4px;
    }

    @media (max-width: 768px) {
        div.dt-buttons {
            width:100%;
        }
        
        div.dt-buttons.btn-group {
            flex-direction: column;
            align-items: flex-start;
        }

        div.dt-buttons.btn-group .btn {
            width: 100%;
            text-align: left;
        }
    }
</style>

<div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
    <div class="breadcrumb-title pe-3">Property Scanning</div>
    <div class="ps-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 p-0">
                <li class="breadcrumb-item"><a href="{{route('dashboard')}}"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Scanning Request List</li>
            </ol>
        </nav>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <!-- @can('add.scanning.files')
            <div class="d-flex justify-content-end py-3">
                <a href="{{ route('property.scanning.create') }}">
                    <button type="button" class="btn btn-primary py-2">+ Upload Scanned File</button>
                </a>
            </div>
        @endcan -->


        <table id="scannedRequestsTable" class="display nowrap" style="width:100%">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Request ID</th>
                    <th>Property ID</th>
                    <th>Block/Plot/Flat</th>
                    <th>Colony</th>
                    <th>File No</th>
                    <th>Property Status</th>
                    <th>Reason</th>
                    <th>Request Status</th>
                    <th>Section</th>
                    <th>Action</th>

                </tr>
            </thead>
        </table>
    </div>
</div>

@include('include.alerts.ajax-alert')

@include('include.alerts.scan-confirmation')
@include('include.alerts.scan-close-confirmation')
@include('include.alerts.return-record-confirmation')
@include('include.alerts.scan-delete-request-confirmation')

<script>
    $(document).ready(function () {
        $('#scannedRequestsTable').DataTable({
            processing: true,
            serverSide: true,
            ajax: "{{ route('scanned.request.data') }}", 
            columns: [
                { data: null, render: function (data, type, row, meta) {
                    return meta.row + meta.settings._iDisplayStart + 1;
                }},
                { data: 'unique_id' },
                { data: 'old_property_id' },
                { data: 'plot_or_flat' },
                { data: 'colony_name' },
                { data: 'file_no' },
                { data: 'property_status' },
                { data: 'reason' },
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        const statusClasses = {
                            'SCAN_NEW': 'badge-new',
                            'SEND_TO_SCAN': 'badge-pending',
                            'SCAN_CLOSED': 'badge-cancelled',
                            'RETURNED_TO_RECORD': 'badge-resolved'
                        };

                        const statusCode = row.status_code || '';
                        const statusText = row.status || '-';
                        const badgeClass = statusClasses[statusCode] || 'badge-secondary';

                        return `<span class="badge ${badgeClass}">${statusText}</span>`;
                    }
                },
                { data: 'section'},
                {
                    data: null,
                    render: function (data, type, row, meta) {
                        let html = '';
                        if (row.status_code === 'SCAN_NEW') {
                            html += `<button class="btn btn-sm btn-primary send-to-scan-btn" data-id="${row.id}">Send to Scan</button> `;
                        }

                        @if(auth()->user()->getRoleNames()->first() !== 'scan-admin')
                            if (row.status_code === 'RETURNED_TO_RECORD') {
                                html += `<button class="btn btn-sm btn-danger close-scan-btn ms-1" data-id="${row.id}">Close Scan</button>`;
                            }
                        @endif



                       @if(auth()->user()->getRoleNames()->first() === 'scan-admin')
                            html += (row.status_code === 'SEND_TO_SCAN')
                                ? `<a href="{{ route('property.scanning.create') }}?property_id=${row.old_property_id}" class="btn btn-sm btn-success ms-1">Upload Files</a>`
                                : '';
                        @endif

                        @if(auth()->user()->getRoleNames()->first() === 'scan-admin')
                            if (row.status_code === 'SEND_TO_SCAN' && row.has_scanned_files) {
                                html += `<button class="btn btn-sm btn-warning ms-1 return-to-record-btn" data-id="${row.id}">Return to Record</button>`;
                            }
                        @endif

                        @if(auth()->user()->getRoleNames()->first() === 'super-admin')
                            if (row.status_code !== 'SCAN_CLOSED') {
                                html += `<button class="btn btn-sm btn-danger ms-1 delete-request-btn" data-id="${row.id}">
                                            Delete
                                        </button>`;
                            }
                        @endif



                        return html;
                    },
                    orderable: false,
                    searchable: false
                }



            ],
            order: [[10, 'desc']],
            scrollX: true,
            buttons: ['csv', 'excel'],
            dom: '<"top"Blf>rt<"bottom"ip><"clear">'
        });
    });
    let selectedRequestId = null;

    // When user clicks "Send to Scan" button in table
    $(document).on('click', '.send-to-scan-btn', function () {
        selectedRequestId = $(this).data('id');
        $('#sendToScanModal').modal('show');
    });

    $('.confirm-send-to-scan').on('click', function () {
        if (!selectedRequestId) return;

        const $btn = $(this);
        $btn.prop('disabled', true).text('Sending...');

        $.ajax({
            url: "{{ route('property.scanning.sendToScan') }}",
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                id: selectedRequestId
            },
            success: function (response) {
                $('#sendToScanModal').modal('hide');
                selectedRequestId = null;
                $btn.prop('disabled', false).text('Yes');

                if (response.status === 'success') {
                    showSuccess(response.message);
                    $('#scannedRequestsTable').DataTable().ajax.reload(null, false);
                } else {
                    showError(response.message || 'Something went wrong.');
                }
            },
            error: function (xhr) {
                $('#sendToScanModal').modal('hide');
                selectedRequestId = null;
                $btn.prop('disabled', false).text('Yes');

                const errorMsg = xhr.responseJSON?.message || 'Something went wrong.';
                showError(errorMsg);
            }
        });
    });

    let selectedCloseId = null;

$(document).on('click', '.close-scan-btn', function () {
    selectedCloseId = $(this).data('id');
    $('#closeScanModal').modal('show');
});

$('.confirm-close-scan').on('click', function () {
    if (!selectedCloseId) return;

    const $btn = $(this);
    $btn.prop('disabled', true).text('Closing...');

    $.ajax({
        url: "{{ route('property.scanning.closeScan') }}",
        method: 'POST',
        data: {
            _token: '{{ csrf_token() }}',
            id: selectedCloseId
        },
        success: function (response) {
            $('#closeScanModal').modal('hide');
            selectedCloseId = null;
            $btn.prop('disabled', false).text('Yes');

            if (response.status === 'success') {
                showSuccess(response.message);
                $('#scannedRequestsTable').DataTable().ajax.reload(null, false);
            } else {
                showError(response.message || 'Something went wrong.');
            }
        },
        error: function (xhr) {
            $('#closeScanModal').modal('hide');
            selectedCloseId = null;
            $btn.prop('disabled', false).text('Yes');

            const errorMsg = xhr.responseJSON?.message || 'Something went wrong.';
            showError(errorMsg);
        }
    });
});

let selectedReturnId = null;

$(document).on('click', '.return-to-record-btn', function () {
    selectedReturnId = $(this).data('id');
    $('#returnToRecordModal').modal('show');
});

$('.confirm-return-to-record').on('click', function () {
    if (!selectedReturnId) return;

    const $btn = $(this);
    $btn.prop('disabled', true).text('Returning...');

    $.ajax({
        url: "{{ route('property.scanning.returnToRecord') }}",
        method: 'POST',
        data: {
            _token: '{{ csrf_token() }}',
            id: selectedReturnId
        },
        success: function (response) {
            $('#returnToRecordModal').modal('hide');
            selectedReturnId = null;
            $btn.prop('disabled', false).text('Yes');

            if (response.status === 'success') {
                showSuccess(response.message);
                $('#scannedRequestsTable').DataTable().ajax.reload(null, false);
            } else {
                showError(response.message || 'Something went wrong.');
            }
        },
        error: function (xhr) {
            $('#returnToRecordModal').modal('hide');
            selectedReturnId = null;
            $btn.prop('disabled', false).text('Yes');

            const errorMsg = xhr.responseJSON?.message || 'Something went wrong.';
            showError(errorMsg);
        }
    });
});

    let selectedDeleteId = null;

    // Open confirm modal
    $(document).on('click', '.delete-request-btn', function () {
        selectedDeleteId = $(this).data('id');
        $('#deleteRequestModal').modal('show');
    });

    // Confirm delete
    $('.confirm-delete-request').on('click', function () {
        if (!selectedDeleteId) return;

        const $btn = $(this);
        $btn.prop('disabled', true).text('Deleting...');

        $.ajax({
            url: "{{ route('property.scanning.deleteRequest') }}",
            method: 'POST',
            data: {
                _token: '{{ csrf_token() }}',
                id: selectedDeleteId
            },
            success: function (response) {
                $('#deleteRequestModal').modal('hide');
                selectedDeleteId = null;
                $btn.prop('disabled', false).text('Yes');

                if (response.status === 'success') {
                    showSuccess(response.message);
                    $('#scannedRequestsTable').DataTable().ajax.reload(null, false);
                } else {
                    showError(response.message || 'Something went wrong.');
                }
            },
            error: function (xhr) {
                $('#deleteRequestModal').modal('hide');
                selectedDeleteId = null;
                $btn.prop('disabled', false).text('Yes');

                const errorMsg = xhr.responseJSON?.message || 'Something went wrong.';
                showError(errorMsg);
            }
        });
    });


</script>


@endsection
