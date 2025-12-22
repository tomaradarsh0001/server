
@extends('layout.main')

@section('content')
<div class="main-panel">
    <div class="content-wrapper">
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <div style="position: absolute; right: 0;">
                <nav aria-label="breadcrumb">
                    <ol class="breadcrumb" style="margin-bottom: 20px;">
                        <li class="breadcrumb-item"><a href="{{ route('dashboard') }}">Home</a></li>
                        <li class="breadcrumb-item active" aria-current="page">Screen Reader Access</li>
                    </ol>
                </nav>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px;">
            <h3 class="page-title">
                <span class="page-title-icon bg-gradient-primary text-white mr-2">
                    <i class="mdi mdi-menu"></i>
                </span>
                Screen Reader
            </h3>
        </div>
     
        <div class="row">
            <div class="col-md-12 grid-margin stretch-card">
                <div class="card">               
                        <form class="forms-sample" method="POST" action="{{ route('screen-readers.update', $screenReader->id) }}">
                        @csrf
                        <div class="card-header">
                            <h4 class="card-title">Screen Reader Access</h4>
                           
                        </div>
                        <div class="card-body">
                            @include('include.statusAlert')
                            @csrf @method('PUT')
                            <div class="mb-3">
                                <label class="form-label">Screen Reader (English)</label>
                                <input type="text" name="screen_reader_eng" class="form-control" value="{{ $screenReader->screen_reader }}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Screen Reader (Hindi)</label>
                                <input type="text" name="screen_reader_hin" class="form-control" value="{{ $screenReader->screen_reader }}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Website</label>
                                <input type="text" name="website" class="form-control" value="{{ $screenReader->website }}" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Type</label>
                                <select name="type" class="form-control" required>
                                    <option value="Free" {{ $screenReader->type == 'Free' ? 'selected' : '' }}>Free</option>
                                    <option value="Commercial" {{ $screenReader->type == 'Commercial' ? 'selected' : '' }}>Commercial</option>
                                </select>
                            </div>
                        </div>
                        <div class="card-footer">
                        @if(Route::currentRouteName() != 'viewUser')
                        <div class="card-footer">
                            <button type="submit" class="btn btn-gradient-primary mr-2">Update</button>
                            <button type="button" class="btn btn-danger" onclick="window.location.href='{{ route('screen-readers.index') }}';">Cancel</button>
                        </div>
                        @endif
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>


@endsection
