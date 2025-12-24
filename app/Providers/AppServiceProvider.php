<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\URL;

use App\Services\CustomCaptcha;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Contracts\Config\Repository;
use Intervention\Image\ImageManager;
use Illuminate\Session\Store;                 
use Illuminate\Contracts\Hashing\Hasher;
use Illuminate\Support\Str;

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
        if (app()->environment('production')) {
            URL::forceScheme('https');
        }
        Paginator::useBootstrapFive();
        Paginator::useBootstrapFour();
    }
}
