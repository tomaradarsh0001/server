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
        Schema::create('communication_trackings', function (Blueprint $table) {
            $table->id();
            $table->string('application_no')->nullable();
            $table->integer('demand_id')->nullable();
            $table->string('communication_for');
            $table->string('communication_type');
            $table->integer('send_by_user');
            $table->integer('send_to_user')->nullable();
            $table->dateTime('sent_at');
            $table->boolean('status')->default(false);
            $table->longText('message')->nullable();
            $table->string('email')->nullable();
            $table->string('email_subject')->nullable();
            $table->string('mobile')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communication_trackings');
    }
};
