<?php

namespace App\Providers;
use Illuminate\Support\Facades\URL;
use App\Services\CustomCaptcha;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Contracts\Config\Repository;
use Intervention\Image\ImageManager;
use Illuminate\Session\Store;                 
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Support\Str;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton('captcha', function ($app) {
        return new CustomCaptcha(
            $app->make(Filesystem::class),
            $app->make(Repository::class),
            $app->make(ImageManager::class),
            $app->make(Store::class),
            $app->make(Hasher::class),
            $app->make(Str::class)
        );
    });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
      \URL::forceScheme('https');       
               
    }
}
