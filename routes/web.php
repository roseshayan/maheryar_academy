<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FrontController;

Route::get('/', [FrontController::class, 'index'])->name('home');
Route::get('/about', [FrontController::class, 'about'])->name('about');
Route::get('/contact', [FrontController::class, 'contact'])->name('contact');
Route::get('/courses', [FrontController::class, 'courses'])->name('courses');
Route::get('/courses/{slug}', [FrontController::class, 'courseSingle'])->name('course.single');
Route::get('/instructors', [FrontController::class, 'instructors'])->name('instructors');
Route::get('/instructors/{id}', [FrontController::class, 'instructorSingle'])->name('instructor.single');
Route::get('/blog', [FrontController::class, 'blog'])->name('blog');
Route::get('/blog/{slug}', [FrontController::class, 'blogSingle'])->name('blog.single');
