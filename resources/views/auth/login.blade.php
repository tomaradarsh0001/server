<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>

    <link rel="stylesheet" href="{{asset('theme/assets/vendors/mdi/css/materialdesignicons.min.css')}}">
    <link rel="stylesheet" href="{{asset('theme/assets/vendors/css/vendor.bundle.base.css')}}">
    <link rel="stylesheet" href="{{asset('theme/assets/css/style.css')}}">
    <link rel="stylesheet" href="{{asset('theme/assets/css/custom.css')}}">
    <link rel="stylesheet" href="{{asset('theme/assets/css/form.css')}}">
   <script src="{{asset('jquery/jquery-3.7.1.min.js')}}"></script>

</head>

<body>
                        
    <div class="container-scroller">
        <div class="container-fluid page-body-wrapper full-page-wrapper">
            <div class="content-wrapper d-flex align-items-center auth">
                <div class="row flex-grow">
                    <div class="col-lg-4 mx-auto">
                        <div class="auth-form-light text-left p-5">
                            <div class="brand-logo" align="center">
                                <img src="theme/assets/images/National_Emblem_India.jpg" style="width: 25%; height: auto;"/>
                            </div>
                            <h4>Hello! let's get started</h4>
                            <h6 class="font-weight-light">Sign in to continue.</h6>

                        
                            <form class="pt-3" autocomplete="off"  method="POST" action="{{ route('loginUser') }}" id="loginForm">
                                @csrf
                                    
                                    <div class="form-group">
                                        <label for="email">Email</label>
                                        <input type="text" name="email" id="email" class="form-control" value="{{ old('email') }}" autocomplete="off">
                                        @error('email')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                    </div>


   	                                 <div class="form-group">
                                        <label for="password">Password</label>
                                        <input type="password"  id="password" class="form-control" autocomplete="off">
                                         @error('password')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror
                                        <input type="hidden" name="password" id="hiddenPassword">
                                    </div>

                                      <div class="checkbox form-group flex flex-col">
                                         <label for="captcha">Captcha</label>
                                        <input type="text" autocomplete="off" name="emailCaptcha" id="emailCaptcha" class="form-control" placeholder="Enter captcha from below image">    
                                        @error('emailCaptcha')
                                            <span class="text-danger">{{ $message }}</span>
                                        @enderror                                                                                          
                                        <div class="flex align-items-center gap-1" style="padding: 10px 0px;">
                                            <img src="{{ route('captcha', ['config' => 'default']) }}" alt="captcha" id="captchaImage"
                                                class="captcha-image">
                                            <span class="btn btn-primary btn-sm refresh-captcha" id="refreshCaptcha" style="padding: 10px 13px;">
                                                <i class="mdi mdi-refresh"></i>
                                            </span>
                                        </div>   
                                    </div>
                                    <div class="mt-3">
                                    <button type="submit" class="btn btn-block btn-gradient-primary btn-lg font-weight-medium auth-form-btn">Login</button>
                                    </div>


                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="{{asset('theme\assets\js\crypto-js.min.js')}}"></script>
    <script src="{{asset('theme\assets\js\commonFunctions.js')}}"></script>
  <script>
        $('#loginForm').submit(function (e) {
            e.preventDefault();
            let password = $('#password').val();
            if (password !== "") {
                var encryptedPassword = encryptString(password);
                // const encrypted = CryptoJS.AES.encrypt(password, 'somekey').toString();
                $('#hiddenPassword').val(encryptedPassword);
            }
            else{
                $('#hiddenPassword').val('');
            }
            this.submit();
        });
    </script>
<script>
         $('#refreshCaptcha').on('click', function() {
                $.ajax({
                    url: "{{ route('refresh.captcha') }}",
                    type: "GET",
                    success: function(data) {
                        $('#captchaImage').attr('src', data.captcha);
                    }
                });
            });
    </script>

</body>

</html>
