<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        // Step 1: Add new columns
        Schema::table('faq', function (Blueprint $table) {
            $table->text('question_eng')->after('related_to_eng');
            $table->text('answer_eng')->after('question_eng');
            $table->string('link_eng')->nullable()->after('answer_eng');
        });

        // Step 2: Copy data from old columns to new columns
        DB::statement('UPDATE faq SET question_eng = question');
        DB::statement('UPDATE faq SET answer_eng = answer');
        DB::statement('UPDATE faq SET link_eng = link');

        // Step 3: Remove old columns
        Schema::table('faq', function (Blueprint $table) {
            $table->dropColumn(['question', 'answer', 'link']);
        });

        // Step 4: Add new Hindi columns and sort_order
        Schema::table('faq', function (Blueprint $table) {
            $table->text('question_hin')->after('question_eng');
            $table->text('answer_hin')->after('answer_eng');
            $table->string('link_hin')->nullable()->after('link_eng');
            $table->integer('sort_order')->nullable()->after('link_hin');
        });
    }

    public function down(): void
    {
        // Step 1: Re-add old columns
        Schema::table('faq', function (Blueprint $table) {
            $table->text('question')->nullable();
            $table->text('answer')->nullable();
            $table->string('link')->nullable();
        });

        // Step 2: Copy data back to old columns
        DB::statement('UPDATE faq SET question = question_eng');
        DB::statement('UPDATE faq SET answer = answer_eng');
        DB::statement('UPDATE faq SET link = link_eng');

        // Step 3: Drop new columns
        Schema::table('faq', function (Blueprint $table) {
            $table->dropColumn([
                'question_eng', 'answer_eng', 'link_eng',
                'question_hin', 'answer_hin', 'link_hin', 'sort_order'
            ]);
        });
    }
};

