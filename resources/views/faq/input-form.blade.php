@extends('layout.main')
@section('content')
<div class="main-panel">
    <div class="content-wrapper">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div style="position: absolute; right: 0;">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb" style="margin-bottom: 20px;">
                        <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Home</a></li>
                        @if(isset($faqs) && $faqs->id)
                            @if(isset($mode) && $mode == 'view')
                                <li class="breadcrumb-item"><a href="{{ route('listFaq') }}">FAQ List</a></li>
                                <li class="breadcrumb-item active" aria-current="page">View FAQ</li>
                            @else
                                <li class="breadcrumb-item"><a href="{{ route('listFaq') }}">FAQ List</a></li>
                                <li class="breadcrumb-item active" aria-current="page">Edit FAQ</li>
                            @endif
                        @else
                            <li class="breadcrumb-item active" aria-current="page">Add FAQ</li>
                        @endif
                    </ol>
                </nav>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h3 class="page-title">
                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                    <i class="mdi mdi-account-card-details"></i>
                </span>
                @if(isset($mode) && $mode == 'view')
                    View FAQ
                @else
                    Manage FAQ
                @endif
            </h3>
            <a href="{{ route('listFaq') }}" class="btn btn-gradient-primary">FAQ List</a>
        </div>

        <div class="row">
            <div class="col-md-12 grid-margin stretch-card">
                <div class="card">
                    @if(isset($faqs) && $faqs->id)
                        @if(isset($mode) && $mode == 'view')
                            <form class="forms-sample">
                        @else
                            <form class="forms-sample" method="POST" action="{{ route('updateFaq', $faqs->id) }}" enctype="multipart/form-data">
                            @method('PUT')
                        @endif
                    @else
                        <form class="forms-sample" method="POST" action="{{ route('storeFaq') }}" enctype="multipart/form-data">
                    @endif
                        @csrf
                        <div class="card-header">
                            <h4 class="card-title">FAQ Form</h4>
                            <p class="card-description"> 
                                @if(isset($mode) && $mode == 'view')
                                    View faq details
                                @else
                                    Add or edit faq
                                @endif
                            </p>
                        </div>
                        <div class="card-body">
                            @include('include.statusAlert')

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="related_to_eng"><b>Related Module English</b></label>

                                        <select class="form-control" id="related_to_eng_select" onchange="updateRelatedToEng()" {{ isset($mode) && $mode == 'view' ? 'disabled' : '' }}>
                                            <option value="" data-description="">Choose Module</option>
                                            <option value="General Queries" data-description="Find answers to general queries about L&DO’s functions, services, office visits, contact information, application process, and more." {{ (isset($faqs) && str_starts_with($faqs->related_to_eng, 'General Queries')) ? 'selected' : '' }}>General Queries</option>
                                            <option value="Substitution/Mutation" data-description="Find answers to substitution and mutation-related queries including eligibility, required documents, fees, application process, and more." {{ (isset($faqs) && str_starts_with($faqs->related_to_eng, 'Substitution/Mutation')) ? 'selected' : '' }}>Substitution-Mutation</option>
                                            <option value="NOC" data-description="Find answers to NOC-related queries including purpose, how to apply, required documents, applicable rules, exemptions, and more." {{ (isset($faqs) && str_starts_with($faqs->related_to_eng, 'NOC')) ? 'selected' : '' }}>NOC</option>
                                            <option value="Conversion" data-description="Find answers to queries about converting leasehold properties to freehold, including eligibility, who can apply, documents, fees, timelines, and more." {{ (isset($faqs) && str_starts_with($faqs->related_to_eng, 'Conversion')) ? 'selected' : '' }}>Conversion</option>
                                        </select>

                                        <input type="hidden" name="related_to_eng" id="related_to_eng" value="{{ $faqs->related_to_eng ?? '' }}">
                                    </div>

                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="related_to_hin"><b>Related Module Hindi</b></label>

                                        <select class="form-control" id="related_to_hin_select" onchange="updateRelatedToHin()" {{ isset($mode) && $mode == 'view' ? 'disabled' : '' }}>
                                            <option value="" data-description="">मॉड्यूल चुनें</option>
                                            <option value="सामान्य प्रश्न" data-description="एल एंड डीओ के कार्यों, सेवाओं, कार्यालय यात्राओं, संपर्क जानकारी, आवेदन प्रक्रिया आदि के बारे में सामान्य प्रश्नों के उत्तर प्राप्त करें।" {{ (isset($faqs) && str_starts_with($faqs->related_to_hin, 'सामान्य प्रश्न')) ? 'selected' : '' }}>सामान्य प्रश्न</option>
                                            <option value="प्रतिस्थापन/दाखिल खारिज" data-description="पात्रता, आवश्यक दस्तावेज, शुल्क, आवेदन प्रक्रिया, आदि सहित प्रतिस्थापन और दाखिल खारिज से संबंधित प्रश्नों के उत्तर प्राप्त करें।" {{ (isset($faqs) && str_starts_with($faqs->related_to_hin, 'प्रतिस्थापन/दाखिल खारिज')) ? 'selected' : '' }}>प्रतिस्थापन-दाखिल खारिज</option>
                                            <option value="एनओसी" data-description="एनओसी से संबंधित प्रश्नों के उत्तर पाएं, जैसे उद्देश्य, आवेदन कैसे करें, आवश्यक दस्तावेज, लागू नियम, छूट आदि।" {{ (isset($faqs) && str_starts_with($faqs->related_to_hin, 'एनओसी')) ? 'selected' : '' }}>एनओसी</option>
                                            <option value="संपरिवर्तन" data-description="लीजहोल्ड संपत्तियों को फ्रीहोल्ड में परिवर्तित करने के बारे में प्रश्नों के उत्तर प्राप्त करें, जिसमें पात्रता, कौन आवेदन कर सकता है, दस्तावेज, शुल्क, समयसीमा आदि शामिल हैं।" {{ (isset($faqs) && str_starts_with($faqs->related_to_hin, 'संपरिवर्तन')) ? 'selected' : '' }}>संपरिवर्तन</option>
                                        </select>

                                        <input type="hidden" name="related_to_hin" id="related_to_hin" value="{{ $faqs->related_to_hin ?? '' }}">
                                    </div>
                                </div>
                            </div>

                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="questionEng"><b>Question English</b></label>
                                        <input type="text" class="form-control" id="questionEng" name="question_eng" placeholder="Question English" value="{{ $faqs->question_eng ?? '' }}" {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="questionHin"><b>Question Hindi</b></label>
                                        <input type="text" class="form-control" id="questionHin" name="question_hin" placeholder="प्रश्न हिन्दी" value="{{ $faqs->question_hin ?? '' }}" {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="answerEng"><b>Answer English</b></label>
                                        <input type="text" class="form-control" id="answerEng" name="answer_eng" placeholder="Answer English" value="{{ $faqs->answer_eng ?? '' }}" {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="answerHin"><b>Answer Hindi</b></label>
                                        <input type="text" class="form-control" id="answerHin" name="answer_hin" placeholder="उत्तर हिन्दी" value="{{ $faqs->answer_hin ?? '' }}" {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>
                            </div>

                            
                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="linkEng"><b>Link English</b></label>
                                        <input type="linkEng" class="form-control" id="linkEng" name="link_eng"
                                            placeholder="Link English"
                                            value="{{ $faqs->link_eng ?? '' }}"
                                            {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>

                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="linkHin"><b>Link Hindi</b></label>
                                        <input type="text" class="form-control" id="linkHin" name="link_hin"
                                            placeholder="लिंक हिन्दी"
                                            value="{{ $faqs->link_hin ?? '' }}"
                                            {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>
                            </div>


                            <div class="row">
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="sort_order"><b>Sort Order</b></label>
                                        <input type="number" class="form-control" id="sort_order" name="sort_order"
                                            placeholder="Enter Sort Order"
                                            value="{{ $faqs->sort_order ?? '' }}"
                                            {{ isset($mode) && $mode == 'view' ? 'readonly' : '' }}>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <div class="form-group">
                                        <label for="is_active"><b>Status</b></label>
                                        <select class="form-control" id="is_active" name="is_active" {{ isset($mode) && $mode == 'view' ? 'disabled' : '' }}>
                                            <option value="1" {{ (isset($faqs) && $faqs->is_active == 1) || !isset($faqs) ? 'selected' : '' }}>Active</option>
                                            <option value="0" {{ (isset($faqs) && $faqs->is_active == 0) ? 'selected' : '' }}>Inactive</option>
                                        </select>
                                    </div>
                                </div>
                            </div>



                            @if(Route::currentRouteName() != 'viewFaq')
                                <div class="card-footer">
                                    <button type="submit" class="btn btn-gradient-primary mr-2">Submit</button>
                                    <button type="button" class="btn btn-danger" onclick="window.location.href='{{ route('listFaq') }}';">Cancel</button>
                                </div>
                            @endif
                            
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    function updateRelatedToEng() {
        const select = document.getElementById('related_to_eng_select');
        const selected = select.options[select.selectedIndex];
        const value = selected.value;
        const desc = selected.dataset.description || '';
        document.getElementById('related_to_eng').value = value && desc ? `${value} --> ${desc}` : value;
    }

    function updateRelatedToHin() {
        const select = document.getElementById('related_to_hin_select');
        const selected = select.options[select.selectedIndex];
        const value = selected.value;
        const desc = selected.dataset.description || '';
        document.getElementById('related_to_hin').value = value && desc ? `${value} --> ${desc}` : value;
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateRelatedToEng();
        updateRelatedToHin();
    });
</script>

@endsection
