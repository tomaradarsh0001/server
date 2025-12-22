<?php

namespace App\Http\Controllers;
use App\Models\Faq;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FaqController extends Controller
{
    //

    public function index()
    {
        $faqs = Faq::all();
        return view('faq.list', ['faqs' => $faqs]);
    }
    public function create(){
        return view('faq.input-form');
    }
    public function store(Request $request)
    {
        $request->validate([
            'related_to_eng' => 'required|string',
            'related_to_hin' => 'required|string',
            'question_eng' => 'required|string',
            'question_hin' => 'required|string',
            'answer_eng' => 'required|string',
            'answer_hin' => 'required|string',
            'link_eng' => 'nullable|url',
            'link_hin' => 'nullable|url',
            'sort_order' => 'nullable|integer',
            'is_active' => 'required|boolean',
        ]);

        // dd($request);

        Faq::create([
            'related_to_eng' => $request->related_to_eng,
            'related_to_hin' => $request->related_to_hin,
            'question_eng' => $request->question_eng,
            'question_hin' => $request->question_hin,
            'answer_eng' => $request->answer_eng,
            'answer_hin' => $request->answer_hin,
            'link_eng' => $request->link_eng,
            'link_hin' => $request->link_hin,
            'sort_order' => $request->sort_order,
            'is_active' => $request->is_active,
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
        ]);

        return back()->with('status', 'FAQ added successfully!');
    }
     /**
     * Display the specified FAQ.
     */
    public function show(Faq $faq)
    {
        return view('faq.input-form', ['faqs' => $faq, 'mode' => 'view']);
    }

    /**
     * Show the form for editing an FAQ.
     */
    public function edit(Faq $faq)
    {
        return view('faq.input-form', ['faqs' => $faq]);
    }

    /**
     * Update the specified FAQ in storage.
     */
    public function update(Request $request, Faq $faq)
    {
        $request->validate([
            'related_to_eng' => 'required|string',
            'related_to_hin' => 'required|string',
            'question_eng' => 'required|string',
            'question_hin' => 'required|string',
            'answer_eng' => 'required|string',
            'answer_hin' => 'required|string',
            'link_eng' => 'nullable|url',
            'link_hin' => 'nullable|url',
            'sort_order' => 'nullable|integer',
            'is_active' => 'required|boolean',
        ]);

        $faq->update([
            'related_to_eng' => $request->related_to_eng,
            'related_to_hin' => $request->related_to_hin,
            'question_eng' => $request->question_eng,
            'question_hin' => $request->question_hin,
            'answer_eng' => $request->answer_eng,
            'answer_hin' => $request->answer_hin,
            'link_eng' => $request->link_eng,
            'link_hin' => $request->link_hin,
            'sort_order' => $request->sort_order,
            'is_active' => $request->is_active,
            'updated_by' => Auth::id(),
        ]);

        return redirect()->route('listFaq')->with('success', 'FAQ updated successfully!');
    }

    public function updateStatus(Request $request, $id)
    {
        $faqs = Faq::find($id);
        if ($faqs) {
            $faqs->is_active = $request->is_active;
            $faqs->save();
            return response()->json(['success' => true]);
        }
        return response()->json(['success' => false]);
    }    


    public function delete($id)
    {
        if ($id && $id != "") {
            $deleted = Faq::where('id', $id)->delete();
            if ($deleted) {
                return back()->with('status', 'FAQ deleted successfully');
            } else {
                return back()->with('error', 'Something went wrong. FAQ not deleted');
            }
        }
    }


    public function getFaqData($relatedTo, $lang = 'english')
    {
        $relatedTo = trim(strtolower($relatedTo));

        if (!in_array($lang, ['english', 'hindi'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid language parameter. Use "english" or "hindi".'
            ], 400);
        }

        // Use LIKE to match just the value portion before the delimiter
        $column = 'related_to_eng';

        $faqs = Faq::whereRaw("LOWER($column) LIKE ?", ["$relatedTo%"])
            ->where('is_active', 1)
            ->orderBy('sort_order')
            ->get();

        if ($faqs->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No FAQs found for the given category.'
            ], 404);
        }

        $faqList = [];

        foreach ($faqs as $faq) {
            $rawAnswer = $lang === 'hindi' ? $faq->answer_hin : $faq->answer_eng;
            $question = $lang === 'hindi' ? $faq->question_hin : $faq->question_eng;
            $link = $lang === 'hindi' ? $faq->link_hin : $faq->link_eng;

            // Parse answer formatting
            if (strpos($rawAnswer, '::list::') !== false) {
                [$description, $listRaw] = explode('::list::', $rawAnswer, 2);
                $listItems = array_map('trim', explode('|', $listRaw));
                $answerType = 'mixed';
                $answerData = [
                    'description' => $description,
                    'list' => $listItems,
                ];
            } elseif (strpos($rawAnswer, '|') !== false) {
                $answerType = 'list';
                $answerData = array_map('trim', explode('|', $rawAnswer));
            } else {
                $answerType = 'html';
                $answerData = $rawAnswer;
            }

            // Use accessors for related_to_value and description
            $relatedToValue = $lang === 'hindi' ? $faq->related_to_hin_value : $faq->related_to_eng_value;
            $relatedToDescription = $lang === 'hindi' ? $faq->related_to_hin_description : $faq->related_to_eng_description;

            $faqList[] = [
                'id' => $faq->id,
                'related_to_value' => $relatedToValue,
                'related_to_description' => $relatedToDescription,
                'question' => $question,
                'answer_type' => $answerType,
                'answer_data' => $answerData,
                'link' => $link,
                'sort_order' => $faq->sort_order,
            ];
        }

        return response()->json([
            'status' => 'success',
            'faqs' => $faqList
        ], 200, [], JSON_UNESCAPED_UNICODE);
    }

}
