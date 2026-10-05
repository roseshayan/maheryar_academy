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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->text('syllabus')->nullable(); // JSON or Text
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->foreignId('instructor_id')->constrained()->cascadeOnDelete();
            $table->decimal('price', 15, 2)->default(0); // in Tomans
            $table->integer('duration_hours')->nullable();
            $table->integer('capacity')->nullable();
            $table->integer('enrolled')->default(0);
            $table->string('status')->default('upcoming'); // upcoming, ongoing, completed
            $table->date('start_date')->nullable();
            $table->string('image')->nullable();
            $table->boolean('has_certificate')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
