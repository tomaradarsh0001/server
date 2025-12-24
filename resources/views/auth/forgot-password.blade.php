@extends('layouts.public.app')
@section('title', 'Login')

@section('content')

    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">


    <div class="login-8 forgot-passwrap">

        <div class="container">
            <div class="row login-box">
                {{-- <div class="col-lg-12">
                    <div class="fixed_login_container">
                        <div class="title">
                            <div class="bottom-container">
                                Welcome to eDharti<sup>2.0</sup>
                            </div>
                            <div class="top-container">
                                Welcome to eDharti<sup>2.0</sup>
                            </div>
                        </div>

                    </div>
                </div> --}}
                <div class="col-lg-3">
                    {{-- <figure class="swing">
                        <div class="wall-swing">
                            <p>Important Notice</p>
                            <div class="marquee">
                                <ul>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> e-Dharti Geo-Portal 2.0</a>
                                    </li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> e-Dharti</a></li>
                                    <li><a href="/appointment-detail"><i class="fas fa-chevron-right"></i> Office Visit
                                            Appointment</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Club Membership</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Order dt 19-3-2024 reg Public
                                            meetings in LDO English version</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Public Notice reg. Public
                                            Hearing in Land and Development Office</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Public Notice in News Paper -
                                            instructions</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Public Notice in News Paper -
                                            instructions</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Public Notice in News Paper -
                                            instructions</a></li>
                                    <li><a href="#"><i class="fas fa-chevron-right"></i> Public Notice in News Paper -
                                            instructions</a></li>
                                </ul>
                            </div>
                        </div>
                    </figure> --}}
                </div>
                <div class="col-lg-6 mx-auto form-section">
                    <div class="form-inner" style="color: #116d6e;">
                        <div class="mb-4 text-sm text-gray-600 dark:text-gray-400 text-start">
                            Forgot your password? No problem. Just let us know your email address or phone no. and we will
                            send you OTP that will allow you to choose a new one.
                        </div>
                        <form method="POST" action="{{ route('password.otp') }}" autocomplete="off">
                            @csrf

                            <div class="mb-4">
                                {{-- <label for="email" class="form-label">Email</label> --}}
                                <input id="email" type="email" class="form-control" name="email"
                                    placeholder="Enter Registered Email" autofocus>
                                @if ($errors->has('email'))
                                    <div class="text-danger mt-2 text-start">{{ $errors->first('email') }}</div>
                                @endif
                            </div>

                            <hr>
                            <div class="text-center"
                                style="color: #fff; background: #116d6e; width: 50px; margin: -15px auto 20px auto; padding: 5px;">
                                OR
                            </div>

                            <div class="mb-4">
                                {{-- <label for="phone" class="form-label">Phone No.</label> --}}
                                <input id="phone" type="text" class="form-control" name="phone"
                                    placeholder="Enter Registered Mobile Number" pattern="[0-9]{8,12}" autofocus>
                                @if ($errors->has('phone'))
                                    <div class="text-danger mt-2 text-start">{{ $errors->first('phone') }}</div>
                                @endif
                            </div>

                            <div class="d-flex justify-content-end mt-4">
                                <button type="submit" class="btn btn-primary">Get OTP</button>
                            </div>
                        </form>

                    </div>
                </div>
                <div class="col-lg-3">
                    {{-- <div class="gallery">
                        <div class="block-33 display--inline-top">
                            <div class="gutter relative">
                                <div class="gallery-h">
                                    <div class="gallery-image relative">
                                        <div class="gallery-image__img relative">
                                            <div class="fill-dimensions cover-img"
                                                style="background-image:url('{{ asset('assets/frontend/assets/img/slider/Golf-Course-Club.jpg') }}')">
                                            </div>
                                            <h5>Golf Course Club</h5>
                                        </div>
                                    </div>
                                    <div class="gallery-image">
                                        <div class="gallery-image__img relative">
                                            <div class="fill-dimensions cover-img"
                                                style="background-image:url('{{ asset('assets/frontend/assets/img/slider/habitat-center.jpg') }}')">
                                            </div>
                                            <h5>Habitat Center</h5>
                                        </div>
                                    </div>
                                    <div class="gallery-image">
                                        <div class="gallery-image__img relative">
                                            <div class="fill-dimensions cover-img"
                                                style="background-image:url('{{ asset('assets/frontend/assets/img/slider/india-gate.jpg') }}')">
                                            </div>
                                            <h5>India Gate</h5>
                                        </div>
                                    </div>
                                    <div class="gallery-image">
                                        <div class="gallery-image__img relative">
                                            <div class="fill-dimensions cover-img"
                                                style="background-image:url('{{ asset('assets/frontend/assets/img/slider/Parliament-house.jpg') }}')">
                                            </div>
                                            <h5>Parliament House</h5>
                                        </div>
                                    </div>
                                    <div class="gallery-image">
                                        <div class="gallery-image__img relative">
                                            <div class="fill-dimensions cover-img"
                                                style="background-image:url('{{ asset('assets/frontend/assets/img/slider/rasthtrapati-bhawan.jpg') }}')">
                                            </div>
                                            <h5>Rasthtrapati Bhawan</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> --}}
                </div>
            </div>
        </div>
        <div class="ocean">
            <div class="wave"></div>
            <div class="wave"></div>
        </div>
    </div>




@endsection

@section('footerScript')
    <script></script>
@endsection
