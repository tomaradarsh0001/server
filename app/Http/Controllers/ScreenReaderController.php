<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ScreenReader;

class ScreenReaderController extends Controller
{
    // Get all screen readers
    public function index()
    {
        return response()->json(ScreenReader::all());
    }

    // Store a new screen reader
    public function store(Request $request)
    {
        $request->validate([
            'screen_reader_eng' => 'required|string|max:255',
            'screen_reader_hin' => 'required|string|max:255',
            'website' => 'required|string|max:255',
            'type' => 'required|in:Free,Commercial',
        ]);

        $screenReader = ScreenReader::create($request->all());

        return response()->json($screenReader, 201);
    }

    // Show a single screen reader
    public function show($id)
    {
        return response()->json(ScreenReader::findOrFail($id));
    }

    // Update a screen reader
    public function update(Request $request, $id)
    {
        $screenReader = ScreenReader::findOrFail($id);

        $request->validate([
            'screen_reader_eng' => 'required|string|max:255',
            'screen_reader_hin' => 'required|string|max:255',
            'website' => 'required|string|max:255',
            'type' => 'required|in:Free,Commercial',
        ]);

        $screenReader->update($request->all());

        return response()->json($screenReader);
    }

    // Delete a screen reader
    public function destroy($id)
    {
        ScreenReader::destroy($id);
        return response()->json(['message' => 'Screen Reader deleted successfully']);
    }

    public function updateReaderStatus(Request $request)
    {
        $user = ScreenReader::find($request->userId);
        if ($user) {
            $user->status = $request->status;
            $user->save();
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'error', 'message' => 'Reader not found'], 404);
        }
    }
}
