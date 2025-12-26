@extends('layouts.app')
@section('title', 'Scanned Property Files')

@section('content')

@php
    // Get sections user is allowed to see
    [$limitToAssigned, $userSectionIds] = getUserAssignedSections();
    $allowedSections = getRequiredSections(); // returns a Collection<Section>

    if ($limitToAssigned) {
        $allowedSections = $allowedSections->whereIn('id', $userSectionIds);
    }

    // Normalize to clean, comparable codes like "PS2"
    $allowedCodes = $allowedSections->pluck('section_code')
        ->map(fn($c) => strtoupper(trim($c)))
        ->values()
        ->all();
@endphp


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
                <li class="breadcrumb-item active" aria-current="page">Scanning Report</li>
            </ol>
        </nav>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <div class="col-lg-12 order-lg-1 mb-4">
            <div class="widget-card">
                <div class="card-header rounded-0 text-center">
                    <h5 class="mt-3">
                        <a href="{{ route('scanning.index') }}">Total Scanned Files:
                            <span id="scan-totalCount">{{ number_format($totalCount ?? 0) }}</span>
                        </a>
                    </h5>
                </div>
                <!-- <div class="card-body"> -->
                    <div class="row">
                        @if(in_array('PS1', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-primary b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'PS1']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Property Section 1 (PS1)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ps1">{{ $sectionCounts['PS1'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('PS2', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-reddis b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'PS2']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon"><i class="fa-solid fa-house"></i></div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Property Section 2 (PS2)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ps2">{{ $sectionCounts['PS2'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('PS3', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-light-green b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'PS3']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Property Section 3 (PS3)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ps3">{{ $sectionCounts['PS3'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('LS1', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-secondary b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'LS1']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Lease Section 1 (LS1)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls1">{{ $sectionCounts['LS1'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('LS2A', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-yellow b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'LS2A']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Lease Section 2A (LS2A)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls2a">{{ $sectionCounts['LS2A'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('LS2B', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-dark-orange b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'LS2B']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Lease Section 2B (LS2B)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls2b">{{ $sectionCounts['LS2B'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('LS3', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-deer b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'LS3']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Lease Section 3 (LS3)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls3">{{ $sectionCounts['LS3'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('LS4', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6 d-flex mb-2">
                            <div class="card o-hidden border-0 h-100 w-100">
                                <div class="bg-lightishblue b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'LS4']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Lease Section 4 (LS4)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls5">{{ $sectionCounts['LS4'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('LS5', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6">
                            <div class="card o-hidden border-0">
                                <div class="bg-assigned b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'LS5']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">Lease Section 5 (LS5)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls5">{{ $sectionCounts['LS5'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif

                        @if(in_array('RPC', $allowedCodes))
                        <div class="col-sm-6 col-xl-4 col-lg-6">
                            <div class="card o-hidden border-0">
                                <div class="bg-assigned b-r-4 card-body">
                                    <a href="{{ route('scanning.index', ['section' => 'RPC']) }}">
                                        <div class="widget-media">
                                            <div class="align-self-center text-center widget-media-icon">
                                                <i class="fa-solid fa-house"></i>
                                            </div>
                                            <div class="widget-media-body">
                                                <span class="m-0">RP Cell (RPC)</span>
                                                <h4 class="mb-0 counter"><span id="scan-ls5">{{ $sectionCounts['RPC'] ?? 0 }}</span></h4>
                                                <i class="fa-solid fa-copy"></i>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        </div>
                        @endif
                    </div>

                <!-- </div> -->
            </div>
        </div>

    </div>
</div>

@endsection
