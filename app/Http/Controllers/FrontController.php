<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontController extends Controller
{
    public function index()
    {
        return view('front.index');
    }

    public function about()
    {
        return view('front.about');
    }

    public function contact()
    {
        return view('front.contact');
    }

    public function courses()
    {
        return view('front.courses');
    }

    public function courseSingle($slug)
    {
        return view('front.course-single');
    }

    public function instructors()
    {
        return view('front.instructors');
    }

    public function instructorSingle($id)
    {
        return view('front.instructor-single');
    }

    public function blog()
    {
        return view('front.blog');
    }

    public function blogSingle($slug)
    {
        return view('front.blog-single');
    }
}
