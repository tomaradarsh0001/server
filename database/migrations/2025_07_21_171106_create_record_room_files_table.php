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
        Schema::create('record_room_files', function (Blueprint $table) {
            $table->id();
            $table->integer('old_property_id')->nullable();
            $table->string('new_property_id')->nullable();
            $table->integer('property_master_id')->nullable();
            $table->integer('splited_property_detail_id')->nullable();
            $table->string('record_id')->nullable();
            $table->string('colony_code')->nullable();
            $table->integer('colony_id')->nullable();
            $table->string('block')->nullable();
            $table->string('plot')->nullable();
            $table->string('file_location')->nullable();
            $table->string('section_code')->nullable();
            $table->string('current_section_code')->nullable();
            $table->string('transaction_section_code')->nullable();
            $table->date('transaction_date')->nullable();
            $table->string('transfered_section_code')->nullable();
            $table->date('transfered_date')->nullable();
            $table->boolean('is_active')->default(true);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('record_room_files');
    }
};
