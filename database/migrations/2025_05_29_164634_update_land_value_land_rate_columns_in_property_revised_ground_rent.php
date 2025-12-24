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
        Schema::table('property_revivised_ground_rent', function (Blueprint $table) {
            $table->decimal('lndo_land_rate', 15, 2)->change();
            $table->decimal('circle_land_rate', 15, 2)->change();
            $table->decimal('lndo_land_value', 15, 2)->change();
            $table->decimal('circle_land_value', 15, 2)->change();
            $table->decimal('lndo_rgr_per_annum', 15, 2)->change();
            $table->decimal('lndo_rgr', 15, 2)->change();
            $table->decimal('circle_rgr', 15, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('property_revivised_ground_rent', function (Blueprint $table) {
            $table->decimal('lndo_land_rate', 12, 2)->change();
            $table->decimal('circle_land_rate', 12, 2)->change();
            $table->decimal('lndo_land_value', 12, 2)->change();
            $table->decimal('circle_land_value', 12, 2)->change();
            $table->decimal('lndo_rgr_per_annum', 12, 2)->change();
            $table->decimal('lndo_rgr', 12, 2)->change();
            $table->decimal('circle_rgr', 12, 2)->change();
        });
    }
};
