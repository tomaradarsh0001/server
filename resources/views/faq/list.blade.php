@extends('layout.main')

@section('content')
<style>
    .table-responsive {
        overflow-x: auto; 
    }
    .table th, .table td {
        white-space: normal; 
        word-wrap: break-word; 
        padding: 15px; 
        font-size: 14px; 
    }
    .btn-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;
    }
    .switch {
    position: relative;
    display: inline-block;
    width: 34px; /* Adjust width */
    height: 20px; /* Adjust height */
}

/* Hide the default checkbox */
.switch input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 20px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: #28a745;
}

input:checked + .slider:before {
    transform: translateX(14px);
}


</style>

<div class="main-panel">
    <div class="content-wrapper">

        <!-- Breadcrumb start -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div style="position: absolute; right: 0;">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb" style="margin-bottom: 20px;">
                        <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">FAQ List</li>
                    </ol>
                </nav>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h3 class="page-title">
                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                    <i class="mdi mdi-account-card-details"></i>
                </span>
                Manage FAQ
            </h3>
            <a href="{{route('createFaq')}}" class="btn btn-gradient-primary">Add FAQ</a>
        </div>
        <!-- Breadcrumb end -->

        <div class="row">
            <div class="col-md-12 grid-margin stretch-card">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title">FAQ List</h4>
                    </div>
                    <div class="card-body">

                        @include('include.statusAlert')

                        <div class="table-responsive">
                            <table class="table" id="myFaqDataTable">
                                <thead>
                                    <tr>
                                        <th style="width: 2%;">S. No.</th>
                                        <th style="width: 10%;">Module</th>
                                        <th style="width: 25%;">Question</th>
                                        <th style="width: 25%;">Answer</th>
                                        <th style="width: 8%;">Link</th>
                                        <th style="width: 8%;">Active</th>
                                        <th style="width: 17%;">Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="faq-list">
                                    @forelse ($faqs as $item)
                                        <tr>
                                            <td>{{$loop->iteration}}</td>
                                            <td>{{ $item->related_to_eng }}</td>
                                            <td>{{ $item->question_eng }}</td>
                                            <td>{{ $item->answer_eng }}</td>
                                            <td>{{ $item->link_eng ?? 'No link' }}</td>
                                            <td>
                                                <label class="switch">
                                                    <input type="checkbox" class="status-toggle" {{ $item->is_active == 1 ? 'checked' : '' }} data-id="{{$item->id}}">
                                                    <span class="slider"></span>
                                                </label>
                                            </td>
                                            <td>
                                                <a href="{{ route('viewFaq', $item->id) }}" class="btn btn-icon btn-gradient-info btn-rounded mr-2"title="view">
                                                <i class="mdi mdi-eye"></i></a>
                                                <a href="{{ route('editFaq', $item->id) }}" class="btn btn-icon btn-gradient-primary btn-rounded mr-2"title="edit">
                                                <i class="mdi mdi-grease-pencil"></i></a>
                                                <form action="{{ route('deleteFaq', $item->id) }}" method="POST" style="display: inline-block;">
                                                    @csrf
                                                    @method('DELETE')
                                                    <button type="submit" class="btn btn-icon btn-gradient-danger btn-rounded" title="delete"><i class="mdi mdi-delete"></i></button>
                                                </form>
                                            </td>
                                        </tr>
                                    @empty
                                    @endforelse
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>    
    </div>
</div>
@endsection

@section('footerScript')
<script>
 $(document).ready(function() {
        $('#myFaqDataTable').DataTable({
            "processing": true,
            "serverSide": false,
            "language": {
                "emptyTable": "No questions found"
            },
            "columns": [
                { "data": "id", "defaultContent": "" }, 
                { "data": "related_to_eng", "defaultContent": "N/A" }, 
                { "data": "question_eng", "defaultContent": "N/A" }, 
                { "data": "answer_eng", "defaultContent": "N/A" }, 
                { "data": "link_eng", "defaultContent": "No link" }, 
                { "data": "is_active", "defaultContent": "Inactive" }, 
                { "data": "actions", "orderable": false, "defaultContent": "" }
            ]
        });

        const updateFaqStatusUrl = "{{ route('updateFaqStatus', ['id' => '__ID__']) }}";

        $(document).on('change', '.status-toggle', function() {
            const faqId = $(this).data('id');
            const isActive = $(this).is(':checked') ? 1 : 0;
            const finalUrl = updateFaqStatusUrl.replace('__ID__', faqId);

            $.ajax({
                type: 'POST',
                url: finalUrl,
                data: {
                    _token: '{{ csrf_token() }}',
                    is_active: isActive
                },
                success: (response) => {
                    console.log('Status updated', response);
                },
                error: (error) => {
                    console.error('Error updating status', error);
                    $(this).prop('checked', !isActive);
                }
            });
        });
    });
</script>

@endsection
