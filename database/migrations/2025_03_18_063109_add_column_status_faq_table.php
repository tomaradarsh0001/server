<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        //// Step 1: Add new columns
        Schema::table('faq', function (Blueprint $table) {
            $table->boolean('is_active')->default(1)->after('link_hin');
            $table->string('related_to_hin')->after('related_to_eng');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //Drop new columns
        Schema::table('faq', function (Blueprint $table) {
            $table->dropColumn('is_active');
            $table->dropColumn('related_to_eng');
        });
    }
};
