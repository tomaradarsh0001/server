@extends('layouts.app')

@section('title', 'Users')

@section('content')
<!--Breadcrumb-->
<div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
    <div class="breadcrumb-title pe-3">Settings</div>
    <div class="ps-3">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb mb-0 p-0">
                <li class="breadcrumb-item"><a href="{{route('dashboard')}}"><i class="bx bx-home-alt"></i></a>
                </li>
                <li class="breadcrumb-item">Application Configuration</li>
                <li class="breadcrumb-item active" aria-current="page">Users</li>
            </ol>
        </nav>
    </div>
</div>
<!-- End -->
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

        /* Ensure responsiveness on smaller screens */
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
    <div>
        <div class="col pt-3">
            <div class="card">
                <div class="card-body">
                    <div class="d-flex pb-5 justify-content-between">
                        <a href="{{ route('users.add') }}"><button class="btn btn-primary">+ Add User</button></a>
                        <div class="d-flex gap-3">
                            @haspermission('view role')
                                <a href="{{ url('roles') }}"><button class="btn btn-info">Roles</button></a>
                            @endhaspermission
                            @haspermission('view permission')
                                <a href="{{ url('permissions') }}"><button class="btn btn-warning">Permissions</button></a>
                            @endhaspermission
                        </div>
                    </div>
                    <table id="example" class="display nowrap" style="width:100%">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Email</th>
                                <th scope="col">Roles</th>
                                <th scope="col">Status</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </div>


    </div>
@endsection

@section('footerScript')
    <script>
        $('#example').DataTable({
            processing: true,
            serverSide: true,
            responsive: false,
            ajax: {
                url: "{{ route('getUserList') }}",
                type: "GET",
            },
            columns: [{
                    data: 'id',
                    name: 'id',
                    orderable: false,
                    searchable: false
                },
                {
                    data: 'name',
                    name: 'users.name'
                },
                {
                    data: 'email',
                    name: 'users.email'
                },
                {
                    data: 'roles',
                    name: 'roles.name'
                },
                {
                    data: 'status',
                    name: 'users.status'
                },
                {
                    data: 'action',
                    name: 'action',
                    orderable: false,
                    searchable: false
                },
            ],
            dom: '<"top"Blf>rt<"bottom"ip><"clear">',
            buttons: ['csv', 'excel', 'pdf']
        });
    </script>

@endsection
