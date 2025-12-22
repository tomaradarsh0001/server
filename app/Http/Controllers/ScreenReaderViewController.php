<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ScreenReader;

class ScreenReaderViewController extends Controller
{
    public function index()
    {
        $screenReaders = ScreenReader::all();
        return view('screen_readers.index', compact('screenReaders'));
    }

    public function create()
    {
        return view('screen_readers.create');
    }

    public function edit($id)
    {
        $screenReader = ScreenReader::findOrFail($id);
        return view('screen_readers.edit', compact('screenReader'));
    }
}
