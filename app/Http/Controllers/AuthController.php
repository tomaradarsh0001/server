<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login()
    {
        if (!Auth::check())
            return view('auth.login');
        else
            return redirect()->route('dashboard');
    }
    public function register()
    {
        return view('auth.register');
    }

    public function createUser(Request $request)
    {
        $request->validate([
            "name" => 'required',
            'email' => 'required|email|unique:users'
        ]);
        $user = [
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make('pass')
        ];

        $savedUser = User::create($user);
        if ($savedUser) {
            return back()->with('status', 'user saved successfully');
        } else {
            return back()->with('error', 'user can not be saved');
        }
    }

    // SwatiMishra 04-05-2024 11:00AM login checks Start

    public function loginUser(Request $request)
    {
      //  $request->validate([
       //     'email' => ['required', 'email'],
        //    'password' => ['required'],
      //  ]);
$request->validate([
                'email' => 'required|email',
                'password' => 'required',
                'emailCaptcha' => 'required|captcha'
            ], [
                'email.required' => 'Email address is required.',
                'email.email' => 'The email address must be a valid format.',

                'password.required' => 'Password is required.',

                'emailCaptcha.required' => 'Captcha is required.',
                'emailCaptcha.captcha' => 'Invalid captcha. Please try again.',
            ]);
        $user = User::where('email', $request->email)->first();
         $key = "aa11ss22dd33ff44gg55hh66jj77kk88";
        $iv = "a1s2d3f4g5h6j7k8";
        $encryptedPassword = $request->password;
        $decryptedPassword = openssl_decrypt(
            base64_decode($encryptedPassword),
            'AES-256-CBC',
            $key,
            OPENSSL_RAW_DATA,
            $iv
        );
        if ($user && $user->status == 1) {
            if (Auth::attempt(['email' => $request->email, 'password' =>  $decryptedPassword])) {
                $request->session()->regenerate();
                return redirect()->intended('/admin/dashboard');
            } else {
                return back()->withErrors([
                    'password' => 'The password you entered is incorrect.',
                ])->onlyInput('email');
            }
        } else if ($user && $user->status == 0) {
            return back()->withErrors([
                'email' => 'Your account is not active. Please contact support.',
            ])->onlyInput('email');
        } else {
            return back()->withErrors([
                'email' => 'No account found with this email.',
            ])->onlyInput('email');
        }
    }

    // SwatiMishra 04-05-2024 11:00AM login checks end

    public function logout(Request $request)
    {
        if (Auth::check()) {
            Auth::logout();
        }
        return redirect()->route('login');
    }
}
