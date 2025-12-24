@extends('layouts.app')
@section('title', 'Dashboard')
@section('content')
    <style>
        .subtypes {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
        }

        .typeName {
            text-align: center;
        }

        .custom-col {
            flex: 1;
            margin: 0 5px;
        }

        .custom-col:first-child {
            margin-left: 0;
        }

        .custom-col:last-child {
            margin-right: 0;
        }

        h6 {
            font-size: 11px !important;
        }

        .status_name {
            color: #101010;
            font-size: 16px;
            font-weight: 500;
        }

        .status_name:after {
            content: ':';
            display: inline
        }

        .status_value {
            color: #101010;
            font-size: 16px;
            font-weight: 500;
        }

        /* added by swati on 16-07-2025 for status of application  */
        .badge {
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
        }
    </style>
    <div class="container-fluid">
        <div class="row justify-content-between mb-3">
            <div class="col-lg-6">
                <div class="page-breadcrumb d-none d-sm-flex align-items-center mb-3">
                    <div class="breadcrumb-title pe-3">Dashboard</div>
                    <div class="ps-3">
                        <nav aria-label="breadcrumb">
                            <ol class="breadcrumb mb-0 p-0">
                                <li class="breadcrumb-item"><a href="{{ route('dashboard') }}"><i
                                            class="bx bx-home-alt"></i></a>
                                </li>
                                <li class="breadcrumb-item">Dashboards</li>
                                {{-- <li class="breadcrumb-item active" aria-current="page">My Dashboard</li> --}}
                            </ol>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
        <div class="container-fluid dashboardcards">
            <div class="row row-flex mb-3">
                {{-- Applications --}}
                <a href="{{ route('regiserUserListings') }}" style="color: inherit; text-decoration: none;">
                    <div class="col-md-4 mb-3">
                        <div class="card bg-primary dash-cards">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <h4 class="mb-0"style="font-size:22px;">
                                        Registration{{ $registrationCount === 1 ? '' : 's' }}</h4>
                                </div>


                                <div class="dash-widgets">
                                    <div class="widget-media-body">
                                        <div class="widget-count">{{ $registrationCount }}</div>
                                    </div>
                                    <div class="dash-icons">
                                        <i class="fa-solid fa-house-user"></i>
                                    </div>
                                </div>
                </a>
            </div>
        </div>
        </a>
    </div>
    </div>
    </div>

    @include('include.alerts.ajax-alert')
@endsection

@section('footerScript')

@endsection
