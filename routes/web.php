<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ComponentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\RolePermmissionController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\EsoCourtController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsController;
use App\Http\Controllers\OfficeDocsController;
use App\Http\Controllers\DirectoryController;
use App\Http\Controllers\FaqController;
use App\Http\Controllers\ScreenReaderViewController;
use App\Http\Controllers\ScreenReaderController;
use App\Http\Controllers\CaptchaController;
use Mews\Captcha\CaptchaController as MewsCaptchaController;

Route::prefix('admin')->group(function () {
Route::get('refresh-captcha', [CaptchaController::class, 'refreshCaptcha'])->name('refresh.captcha');
Route::get('captcha/{config?}', [MewsCaptchaController::class, 'getCaptcha'])->name('captcha');
 
Route::get('/', [AuthController::class, 'login'])->name('login');
Route::post('/loginUser', [AuthController::class, 'loginUser'])->name('loginUser');
Route::get('/register', [AuthController::class, 'register'])->name('register');
Route::post('/createUser', [AuthController::class, 'createUser'])->name('createUser');

Route::middleware('auth')->group(function () {
    
    Route::get('dashboard', [DashboardController::class, 'dashboard'])->name('dashboard');
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    Route::group(['middleware' => ['isAdmin']], function () {

    Route::controller(MenuController::class)->group(function () {
        Route::get('create-menu', 'create')->name('createMenu');
        Route::get('edit-menu/{id}', 'edit')->name('editMenu');
        Route::post('store-menu', 'store')->name('storeMenu');
        Route::get('list-menu', 'list')->name('listMenu');
        Route::get('delete-menu/{id}', 'delete')->name('deleteMenu');
        Route::post('updateMenuStatus/{id}', 'updateStatus')->name('updateMenuStatus');
        Route::get('view-menu/{id}', 'view')->name('viewMenu');

    });


    // SwatiMishra 30-04-2024, 12:20 PM NewsController Routes Start
    Route::controller(NewsController::class)->group(function () {
        Route::get('create-news', 'create')->name('createNews');
        Route::get('list-news', 'list')->name('listNews');
        Route::post('store-news', 'store')->name('storeNews');
        Route::get('delete-doc/{id}', 'deleteDocument')->name('deleteDocument');
        Route::get('delete-news/{id}', 'delete')->name('deleteNews');
        Route::put('/update-news/{id}', 'update')->name('updateNews');
        Route::get('viewNews/{id}','view')->name('viewNews');
        Route::get('edit-news/{id}', 'edit')->name('editNews');
        Route::post('updateNewsStatus/{id}', 'updateStatus')->name('updateNewsStatus');
    });
    // SwatiMishra 30-04-2024, 12:20 PM NewsController Routes End


    // SwatiMishra 02-05-2024, 12:00 PM OfficedocsController Routes Start
    Route::controller(OfficeDocsController::class)->group(function () {
        Route::get('create-docs', 'create')->name('createDocs');
        Route::get('list-docs', 'list')->name('listDocs');
        Route::post('store-docs', 'store')->name('storeDocs');
        Route::get('delete-attachment/{id}/{lang}', 'deleteAttachment')->name('deleteAttachment');
        Route::get('delete-docs/{id}', 'delete')->name('deleteDocs');
        Route::put('/update-docs/{id}', 'update')->name('updateDocs');
        Route::get('viewDocs/{id}','view')->name('viewDocs');
        Route::get('edit-docs/{id}', 'edit')->name('editDocs');
        Route::post('updateDocStatus/{id}', 'updateStatus')->name('updateDocStatus');
    });
    
    // SwatiMishra 02-05-2024, 12:00 PM OfficedocsController Routes End

    Route::controller(RolePermmissionController::class)->group(function () {
        Route::get('list-role', 'listRole')->name('listRole');
        Route::get('list-permission', 'listPermission')->name('listPermission');
        Route::get('create-role', 'createRole')->name('createRole');
        Route::get('create-permission', 'createPermission')->name('createPermission');
        Route::post('store-role', 'storeRole')->name('storeRole');
        Route::post('store-permission', 'storePermission')->name('storePermission');
    });

    // SwatiMishra 03-05-2024, 5:50 PM routes add start
    Route::controller(UserController::class)->group(function () {
        Route::get('list-user', 'userList')->name('userList');
        Route::post('/assign-entity', 'assignRoleOrPermissionToUser')->name('assignRoleOrPermissionToUser');
        Route::post('store-user', 'store')->name('storeUser');
        Route::get('create-user', 'create')->name('createUsers');
        Route::get('viewUser/{id}', 'view')->name('viewUser');
        Route::post('update-user-status', 'updateUserStatus')->name('updateUserStatus');
        Route::get('update-user-role', 'updateUserRoleOrPermission')->name('updateUserRoleOrPermission');
        Route::get('/user-entities/{userId}', 'getUserRolesAndPermissions')->name('getUserRolesAndPermissions');
    });
    // SwatiMishra 03-05-2024, 5:50 PM routes add end    ///updated on 13-05-2024

    //directory controller added by SwatiMishra

    Route::controller(DirectoryController::class)->group(function () {
        Route::get('create-directory', 'create')->name('createDirectory');
        Route::get('list-directory', 'list')->name('listDirectory');
        Route::post('store-directory', 'store')->name('storeDirectory');
        Route::get('delete-directory/{id}', 'delete')->name('deleteDirectory');
        Route::put('/update-directory/{id}', 'update')->name('updateDirectory');
        Route::get('viewDirectory/{id}', 'view')->name('viewDirectory');
        Route::get('edit-directory/{id}', 'edit')->name('editDirectory');
        Route::post('updateDirStatus/{id}', 'updateStatus')->name('updateDirStatus');
    });

    Route::controller(ComponentController::class)->group(function () {
        Route::get('create-component', 'create')->name('createComponent');
        Route::get('list-component', 'list')->name('listComponent');
        Route::get('edit-component/{id}', 'edit')->name('editComponent');
        Route::post('store-component', 'store')->name('storeComponent');
        Route::post('updateComponentStatus/{id}', 'updateStatus')->name('updateComponentStatus');
        Route::get('viewComponent/{id}', 'view')->name('viewComponent');
    });

     Route::controller(EsoCourtController::class)->group(function () {
            Route::middleware(['permission:upload.multiple.eso.cases'])->group(function () {
                Route::get('eso-courts/import', 'excelUpload') ->name('excelUpload');
                Route::post('eso-courts/import', 'import')->name('eso-courts.import');
            });
    });
   Route::controller(FaqController::class)->group(function () {
        Route::get('create-faq', 'create')->name('createFaq');
        Route::get('list-faq', 'index')->name('listFaq');
        Route::post('store-faq', 'store')->name('storeFaq');
        Route::put('update-faq/{faq}', 'update')->name('updateFaq');
        Route::delete('delete-faq/{id}', 'delete')->name('deleteFaq');
        Route::post('updateFaqStatus/{id}', 'updateStatus')->name('updateFaqStatus');
        Route::get('view-faq/{faq}', 'show')->name('viewFaq');
        Route::get('edit-faq/{faq}', 'edit')->name('editFaq');

});
        //Routes for Screen Reader Access by Adarsh tomar 
    Route::get('/screen-readers', [ScreenReaderViewController::class, 'index'])->name('screen-readers.index');
    Route::get('/screen-readers/create', [ScreenReaderViewController::class, 'create'])->name('screen-readers.create');
    Route::get('/screen-readers/{id}/edit', [ScreenReaderViewController::class, 'edit'])->name('screen-readers.edit');
    Route::post('/screen-readers', [ScreenReaderController::class, 'store'])->name('screen-readers.store');
    Route::put('/screen-readers/{id}', [ScreenReaderController::class, 'update'])->name('screen-readers.update');
    Route::delete('/screen-readers/{id}', [ScreenReaderController::class, 'destroy'])->name('screen-readers.destroy');
    Route::post('update-reader-status', [ScreenReaderController::class, 'updateReaderStatus'])->name('updateReaderStatus');
});

Route::controller(EsoCourtController::class)->group(function () {
        Route::middleware(['permission:create.eso.detail'])->group(function () {
            Route::get('create-case', 'create')->name('createCase');
            Route::get('list-case', 'list')->name('listCase');
            Route::post('store-case', 'store')->name('storeCase');
            Route::get('delete-case/{id}', 'delete')->name('deleteCase');
            Route::get('delete-judgement/{id}', 'deleteJudgement')->name('deleteJudgement');
            Route::put('/update-case/{id}', 'update')->name('updateCase');
            Route::get('viewCase/{id}', 'view')->name('viewCase');
            Route::get('edit-case/{id}', 'edit')->name('editCase');
            Route::post('updateCaseStatus/{id}', 'updateStatus')->name('updateCaseStatus');
        });

    });
});

});


