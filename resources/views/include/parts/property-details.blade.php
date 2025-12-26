<div class="row">
    <div class="col-lg-12">
        <table class="table table-bordered table-striped">
            <tr>
                <td colspan="4">Property Details</td>
            </tr>
            <tr>
                <th>Known As</th>
                <td>{{$property->propertyLeaseDetail->presently_known_as}}</td>
                <th>Property ID</th>
                <td>{{$property->old_propert_id}}</td>
            </tr>
        </table>
    </div>
</div>
<form method="post" id="paymentDetailForm" action="{{route('applicant.applicantPayment')}}">
    @csrf
    <div class="col-lg-12">
        <h5 class="mt-2 mb-2">Fill payment details</h5>
    </div>
    <input type="hidden" name="property_id" value="{{$property->old_propert_id}}">
    <input type="hidden" name="payment_type" value="{{$paymentType}}">
    <div class="row">
        <div class="col-lg-4">
            <table class="table table-bordered table-striped mt-2">
                <tr>
                    <th>S No.</th>
                    <th>Fill Payment Amount</th>
                </tr>
                <tr>
                    <td>1</td>
                    <td>
                        <input type="number" name="paid_amount" class="form-control amountToPay" min="0" max="99999999999999">
                    </td>
                </tr>
                <tr>
                    <th colspan="">Total amount to pay</th>
                    <th id="totalAmountToPay">₹ 0</th>
                </tr>
            </table>
        </div>
    </div>
    <div class="row mt-2">
        <div class="col-lg-12">
            <button type="button" class="btn btn-primary" id="btnSubmitDemandPayment">Procced</button>
        </div>
    </div>
    <div class="row d-none mt-2" id="form-part-2">
        @include('include.parts.payer-details')
    </div>
</form>