@extends('layout.main')

@section('content')
<style>
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 20px;
    }
    
    .btn-icon {
            display: inline-flex;
            justify-content: center;
            align-items: center;
        }
    
    .slider:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
    
    input:checked + .slider {
      background-color: #28a745;
    }
    
    input:checked + .slider:before {
      transform: translateX(16px);
    }
    </style>
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
            <a href="{{route('screen-readers.create')}}" class="btn btn-gradient-primary">Add Screen Reader</a>
        </div>

<div class="row">
    <div class="col-lg-12 grid-margin stretch-card">
        <div class="card">
            <div class="card-header">
                <h4 class="card-title">Screen Reader Access</h4>
            </div>
            <div class="card-body">

                <table class="table table-striped" id="myDataTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Screen Reader English</th>
                            <th>Screen Reader Hindi</th>
                            <th>Website</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        @forelse ($screenReaders as $reader)
                        <tr>
                            <td>{{ $reader->id }}</td>
                            <td>{{ $reader->screen_reader_eng }}</td>
                            <td>{{ $reader->screen_reader_hin }}</td>
                            <td><a href="{{ $reader->website }}" target="_blank">{{ $reader->website }}</a></td>
                            <td>{{ $reader->type }}</td>
                            <td>
                                <label class="switch" style="position: relative; display: inline-block; width: 40px; height: 23px;">
                                    <input type="checkbox" class="status-toggle" {{ $reader->status==1 ? 'checked' : '' }} data-id="{{$reader->id}}" style="opacity: 0; width: 0; height: 0;">
                                    <span class="slider"></span>
                                </label>
                            </td>
                           
                            <td>
                                <a href="{{ route('screen-readers.edit', $reader->id) }}" class="btn btn-warning">Edit</a>
                                <form action="{{ route('screen-readers.destroy', $reader->id) }}" method="POST" class="d-inline" onsubmit="return confirm('Are you sure you want to delete this?');">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn btn-danger">Delete</button>
                                </form>
                            </td>
                        </tr>
                        @empty
                        <tr>
                            <td colspan="6" class="text-center">No Screen Readers Found</td>
                        </tr>
                        @endforelse
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>
</div>
</div>

<script>
    $('.status-toggle').change(function() {
        const userId = $(this).data('id');
        const status = $(this).is(':checked') ? 1 : 0; // 1 for active, 0 for inactive

        $.ajax({
            type: 'post',
            url: '{{ route("updateReaderStatus") }}',
            data: {
                _token: '{{ csrf_token() }}',
                userId: userId,
                status: status
            },
            success: (response) => {
                console.log('Status updated', response);
            },
            error: (error) => {
                console.error('Error updating status', error);
                $(this).prop('checked', !status);
            }
        });
    });

</script>
@endsection
