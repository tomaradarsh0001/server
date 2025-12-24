<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('club_membership_applications', function (Blueprint $table) {
            $table->string('unique_id')->after('id');
        });
    }

    public function down(): void
    {
        Schema::table('club_membership_applications', function (Blueprint $table) {
            $table->dropColumn('unique_id');
        });
    }
};

