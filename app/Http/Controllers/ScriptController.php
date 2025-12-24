<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PropertyMaster;
use App\Models\LndoLandRate;
use App\Models\CircleLandRate;
use App\Models\PropertyLeaseDetail;
use App\Models\CurrentLesseeDetail;
use App\Models\PropertyTransferredLesseeDetail;
use App\Models\SplitedPropertyDetail;
use App\Models\CircleResidentialLandRate;
use App\Models\LndoResidentialLandRate;
use App\Models\CircleCommercialLandRate;
use App\Models\LndoCommercialLandRate;
use App\Models\CircleInstitutionalLandRate;
use App\Models\LndoInstitutionalLandRate;
use App\Models\CircleIndustrialLandRate;
use App\Models\LndoIndustrialLandRate;
use App\Models\PropertyLeaseDetailHistory;
use App\Models\OldDemand;
use App\Models\OldDemandSubhead;
use DateTime;
use App\Models\UnallottedPropertyDetail;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;
use App\Models\Flat;
use Illuminate\Support\Facades\DB;
use App\Services\PropertyMasterService;
use App\Jobs\ProcessOldDemands;
use App\Models\Item;
use App\Models\Application;
use App\Models\Section;

class ScriptController extends Controller
{

    //function to update new Cirle and LNDO rates on basis of property type - SOURAV CHAUHAN (27/Nov/2024)
    public function updateLandRates()
    {
        //query for getting records from this id to that
        $properties = PropertyMaster::whereBetween('id', array('20001', '30000'))->get();

        //Properties colony Wise
        // $properties = PropertyMaster::where('new_colony_name',173)->get();

        // $properties = PropertyMaster::whereIn('new_colony_name', ['416', '194'])->get();
        foreach ($properties as $property) {
            $propertyStatus = $property->status;
            $propertyId = $property->id;
            if ($propertyStatus == 1476) {
                echo "Unallotted Property ID:- " . $propertyId . " <b> Not Updated</b><br>";
            } else {
                $propertyType = $property->property_type;
                $newColonyName = $property->new_colony_name;
                $circleRate = null;
                $lndoRate = null;
                switch ($propertyType) {
                    case '47': //Residential
                        $circleRate = Self::fetchLatestLandRate(CircleResidentialLandRate::class, $newColonyName);
                        $lndoRate = Self::fetchLatestLandRate(LndoResidentialLandRate::class, $newColonyName);
                        // $dataCir = CircleLandRate::where("old_colony_id", $newColonyName)
                        //         ->orderBy('date_from', 'desc')
                        //         ->first();
                        // $circleRate = $dataCir ? $dataCir['residential_land_rate'] : null;


                        // $dataLndo = LndoLandRate::where("old_colony_id", $newColonyName)
                        //         ->orderBy('date_from', 'desc')
                        //         ->first();
                        // $lndoRate = $dataLndo ? $dataLndo['residential_land_rate'] : null;
                        break;
                    case '48': //Commercial
                    case '72': //Mixed
                        $circleRate = Self::fetchLatestLandRate(CircleCommercialLandRate::class, $newColonyName);
                        $lndoRate = Self::fetchLatestLandRate(LndoCommercialLandRate::class, $newColonyName);
                        break;
                    case '49': //Institutional
                        $circleRate = Self::fetchLatestLandRate(CircleInstitutionalLandRate::class, $newColonyName);
                        $lndoRate = Self::fetchLatestLandRate(LndoInstitutionalLandRate::class, $newColonyName);
                        break;
                    case '469': //industrial
                        $circleRate = Self::fetchLatestLandRate(CircleIndustrialLandRate::class, $newColonyName);
                        $lndoRate = Self::fetchLatestLandRate(LndoIndustrialLandRate::class, $newColonyName);
                        break;
                }
                $propertyLeaseDetails = PropertyLeaseDetail::where('property_master_id', $propertyId)->first();
                $plotAreaInSqm = round($propertyLeaseDetails['plot_area_in_sqm'], 2);
                // dd($lndoRate , (float)$plotAreaInSqm);
                if ($lndoRate !== null) {
                    $propertyLeaseDetails->plot_value = round($lndoRate * (float)$plotAreaInSqm, 2);
                }
                if ($circleRate !== null) {
                    $propertyLeaseDetails->plot_value_cr = round($circleRate * (float)$plotAreaInSqm, 2);
                }
                if ($propertyLeaseDetails->save()) {
                    echo "Parent Property ID:- " . $propertyId . " <b>Updated</b><br>";
                    if ($property->is_joint_property) {
                        $childPropertyDetails = SplitedPropertyDetail::where('property_master_id', $propertyId)->get();
                        if ($childPropertyDetails) {
                            foreach ($childPropertyDetails as $childPropertyDetail) {
                                $childPropertyId = $childPropertyDetail['id'];
                                $childPlotAreaInSqm = round($childPropertyDetail['area_in_sqm'], 2);
                                if ($lndoRate !== null) {
                                    $childPropertyDetail->plot_value = round($lndoRate * (float)$childPlotAreaInSqm, 2);
                                }
                                if ($circleRate !== null) {

                                    $childPropertyDetail->plot_value_cr = round($circleRate * (float)$childPlotAreaInSqm, 2);
                                }
                                if ($childPropertyDetail->save()) {
                                    echo "Child Property ID:- " . $childPropertyId . " <b>Updated</b><br>";
                                } else {
                                    echo "Child Property ID:- " . $childPropertyId . " <b>not Updated ----------------------**********<b><br>";
                                }
                            }
                        }
                    }
                } else {
                    echo "Parent Property ID:- " . $propertyId . " <b>not Updated ----------------------**********<b><br>";
                }
            }
        }
    }

    //to fetch land ates from different models
    function fetchLatestLandRate($modelClass, $colonyId)
    {
        $data = $modelClass::where("colony_id", $colonyId)
            ->orderBy('date_from', 'desc')
            ->first();

        return $data ? $data->land_rate : 0;
    }

    public function updateLandValue($id)
    {


        $colonyId = $id;
        $properties = PropertyMaster::where('new_colony_name', $colonyId)->get();

        $lndoRate = LndoLandRate::where("old_colony_id", $colonyId)
            ->orderBy('date_from', 'desc')
            ->first();

        $circleRate = CircleLandRate::where("old_colony_id", $colonyId)
            ->orderBy('date_from', 'desc')
            ->first();

        if ($lndoRate || $circleRate) {
            foreach ($properties as $property) {
                $propertyLeaseDetails = PropertyLeaseDetail::where('property_master_id', $property->id)->first();

                if ($propertyLeaseDetails) {
                    $propertyType = $propertyLeaseDetails['is_land_use_changed'] == 1
                        ? $propertyLeaseDetails['property_type_at_present']
                        : $propertyLeaseDetails['property_type_as_per_lease'];

                    $lndoRateInv = null;
                    $circleRateInv = null;

                    switch ($propertyType) {
                        case '47':
                            $lndoRateInv = $lndoRate ? $lndoRate['residential_land_rate'] : null;
                            $circleRateInv = $circleRate ? $circleRate['residential_land_rate'] : null;
                            break;
                        case '48':
                            $lndoRateInv = $lndoRate ? $lndoRate['commercial_land_rate'] : null;
                            $circleRateInv = $circleRate ? $circleRate['commercial_land_rate'] : null;
                            break;
                        case '49':
                            $lndoRateInv = $lndoRate ? $lndoRate['institutional_land_rate'] : null;
                            $circleRateInv = $circleRate ? $circleRate['institutional_land_rate'] : null;
                            break;
                    }
                    $plotAreaInSqm = round($propertyLeaseDetails['plot_area_in_sqm'], 2);
                    if ($lndoRateInv !== null) {
                        $propertyLeaseDetails->plot_value = round($lndoRateInv * $plotAreaInSqm, 2);
                    }
                    if ($circleRateInv !== null) {
                        $propertyLeaseDetails->plot_value_cr = round($circleRateInv * $plotAreaInSqm, 2);
                    }
                    $propertyLeaseDetails->save();
                } else {
                    return "Property lease details not found for property ID: {$property->id}";
                }
            }

            return "Land value updated successfully";
        } else {
            return "Colony ID not available in LNDO Rates or Circle Rates Table";
        }
    }

    //For updating the land values according to LNDO rates and Circle Rates in Splited Table
    public function updateLandValueInChild($id)
    {
        $colonyId = $id;
        $properties = PropertyMaster::where('is_joint_property', 1)->where('new_colony_name', $colonyId)->get();

        $lndoRate = LndoLandRate::where("old_colony_id", $colonyId)
            ->orderBy('date_from', 'desc')
            ->first();

        $circleRate = CircleLandRate::where("old_colony_id", $colonyId)
            ->orderBy('date_from', 'desc')
            ->first();

        if ($lndoRate || $circleRate) {
            foreach ($properties as $property) {
                // $propertyLeaseDetails = PropertyLeaseDetail::where('property_master_id', $property->id)->first();
                $childPropertyDetails = SplitedPropertyDetail::where('property_master_id', $property->id)->get();
                if ($childPropertyDetails) {
                    foreach ($childPropertyDetails as $childPropertyDetail) {

                        $propertyType = $property->property_type;
                        $lndoRateInv = null;
                        $circleRateInv = null;
                        switch ($propertyType) {
                            case '47':
                                $lndoRateInv = $lndoRate ? $lndoRate['residential_land_rate'] : null;
                                $circleRateInv = $circleRate ? $circleRate['residential_land_rate'] : null;
                                break;
                            case '48':
                                $lndoRateInv = $lndoRate ? $lndoRate['commercial_land_rate'] : null;
                                $circleRateInv = $circleRate ? $circleRate['commercial_land_rate'] : null;
                                break;
                            case '49':
                                $lndoRateInv = $lndoRate ? $lndoRate['institutional_land_rate'] : null;
                                $circleRateInv = $circleRate ? $circleRate['institutional_land_rate'] : null;
                                break;
                        }

                        $plotAreaInSqm = round($childPropertyDetail['area_in_sqm'], 2);
                        if ($lndoRateInv !== null) {
                            $childPropertyDetail->plot_value = round($lndoRateInv * $plotAreaInSqm, 2);
                        }
                        if ($circleRateInv !== null) {

                            $childPropertyDetail->plot_value_cr = round($circleRateInv * $plotAreaInSqm, 2);
                        }
                        $childPropertyDetail->save();
                    }
                } else {
                    return "Property not available in Splited Table for property ID: {$property->id}";
                }
            }

            return "Land value updated successfully";
        } else {
            return "Colony ID not available in LNDO Rates or Circle Rates Table";
        }
    }

    //for updating the current lessee in seperate table
    public function updateCurrentLessee($id)
    {
        try {
            // $colonyId = $id;
            // $properties = PropertyMaster::where('new_colony_name', $colonyId)->get();
            $propertyId = $id;
            $properties = PropertyMaster::where('new_colony_name', $propertyId)->get();

            if ($properties->isEmpty()) {
                return "No properties found for the given colony ID.";
            }

            foreach ($properties as $property) {

                //if property is joint
                if ($property->is_joint_property == 1) {

                    $splitedPropertyDetails = SplitedPropertyDetail::where('property_master_id', $property->id)->get();
                    foreach ($splitedPropertyDetails as $splitedPropertyDetail) {
                        // dd('Inside foreach');
                        // Property Details
                        $propertyMasterIdChild = $property->id;
                        $splitedPropertyDetailId = $splitedPropertyDetail->id;
                        $oldPropertyIdChild = $splitedPropertyDetail->old_property_id;
                        $propertyStatusChild = $splitedPropertyDetail->property_status;
                        $currentArea = $splitedPropertyDetail->current_area;
                        $areaInSqm = $splitedPropertyDetail->area_in_sqm;
                        $unitChild = $splitedPropertyDetail->unit;
                        $presentlyKnownAsChild = $splitedPropertyDetail->presently_known_as;
                        $createdByChild = $splitedPropertyDetail->created_by;


                        // Find lessees
                        $latestBatchIdChild = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)->where('splited_property_detail_id', $splitedPropertyDetailId)->max('batch_transfer_id');
                        // if ($latestBatchIdChild === null) {
                        //     return "No lessee details found for property ID: {$property->id} and Splitted property id {$splitedPropertyDetailId}";
                        // }

                        if ($latestBatchIdChild) {

                            $lesseesWithLatestBatchIdChild = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)
                                ->where('splited_property_detail_id', $splitedPropertyDetailId)
                                ->where('batch_transfer_id', $latestBatchIdChild)
                                ->pluck('lessee_name')
                                ->toArray();

                            $lesseesNamesChild = implode(",", $lesseesWithLatestBatchIdChild);
                            $currentLesseeDetailChild = CurrentLesseeDetail::where('property_master_id', $property->id)->where('splited_property_detail_id', $splitedPropertyDetail->id)->first();
                            // If current lessee details already saved
                            if (!empty($currentLesseeDetailChild)) {
                                if ($currentLesseeDetailChild['lessees_name'] != $lesseesNamesChild) {
                                    $currentLesseeDetailChild->property_status = $propertyStatusChild;
                                    $currentLesseeDetailChild->lessees_name = $lesseesNamesChild;
                                    $currentLesseeDetailChild->property_known_as = $presentlyKnownAsChild;
                                    $currentLesseeDetailChild->area = $currentArea;
                                    $currentLesseeDetailChild->unit = $unitChild;
                                    $currentLesseeDetailChild->area_in_sqm = $areaInSqm;
                                    $currentLesseeDetailChild->save();
                                }
                            } else {
                                CurrentLesseeDetail::create([
                                    'property_master_id' => $propertyMasterIdChild,
                                    'splited_property_detail_id' => $splitedPropertyDetailId,
                                    'old_property_id' => $oldPropertyIdChild,
                                    'property_status' => $propertyStatusChild,
                                    'lessees_name' => $lesseesNamesChild,
                                    'property_known_as' => $presentlyKnownAsChild,
                                    'area' => $currentArea,
                                    'unit' => $unitChild,
                                    'area_in_sqm' => $areaInSqm,
                                    'created_by' => $createdByChild
                                ]);
                            }
                        }
                    }
                } else {

                    // Property Details
                    $propertyMasterId = $property->id;
                    $oldPropertyId = $property->old_propert_id;
                    $propertyStatus = $property->status;

                    // Find lessees
                    $latestBatchId = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)->max('batch_transfer_id');
                    if ($latestBatchId === null) {
                        return "No lessee details found for property ID: {$property->id}";
                    }

                    $lesseesWithLatestBatchId = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)
                        ->where('batch_transfer_id', $latestBatchId)
                        ->pluck('lessee_name')
                        ->toArray();

                    $lesseesNames = implode(",", $lesseesWithLatestBatchId);

                    // Details from lease details
                    $leaseDetails = PropertyLeaseDetail::where('property_master_id', $property->id)->first();
                    if ($leaseDetails === null) {
                        return "No lease details found for property ID: {$property->id}";
                    }

                    $presentlyKnown = $leaseDetails['presently_known_as'] ?? '';
                    $plotArea = $leaseDetails['plot_area'] ?? 0;
                    $unit = $leaseDetails['unit'] ?? '';
                    $plotAreaInSqm = round($leaseDetails['plot_area_in_sqm'] ?? 0, 2);
                    $createdBy = $leaseDetails['created_by'] ?? '';

                    $currentLesseeDetail = CurrentLesseeDetail::where('property_master_id', $property->id)->first();

                    // If current lessee details already saved
                    if (!empty($currentLesseeDetail)) {
                        if ($currentLesseeDetail['lessees_name'] != $lesseesNames) {
                            $currentLesseeDetail->property_status = $propertyStatus;
                            $currentLesseeDetail->lessees_name = $lesseesNames;
                            $currentLesseeDetail->property_known_as = $presentlyKnown;
                            $currentLesseeDetail->area = $plotArea;
                            $currentLesseeDetail->unit = $unit;
                            $currentLesseeDetail->area_in_sqm = $plotAreaInSqm;
                            $currentLesseeDetail->save();
                        }
                    } else {
                        CurrentLesseeDetail::create([
                            'property_master_id' => $propertyMasterId,
                            'splited_property_detail_id' => null,
                            'old_property_id' => $oldPropertyId,
                            'property_status' => $propertyStatus,
                            'lessees_name' => $lesseesNames,
                            'property_known_as' => $presentlyKnown,
                            'area' => $plotArea,
                            'unit' => $unit,
                            'area_in_sqm' => $plotAreaInSqm,
                            'created_by' => $createdBy
                        ]);
                    }
                }
            }

            return "Current lessee details updated successfully.";
        } catch (\Exception $e) {
            return "An error occurred: " . $e->getMessage();
        }
    }

    // To convert the area to square meter
    public function convertToSquareMeter($value, $fromUnit)
    {
        if ($fromUnit != 29) {
            $conversionFactors = [
                '27' => 4046.86,
                '28' => 0.092903,
                '30' => 0.836127,
                '589' => 10000,
            ];

            // Convert value to square meters
            if (array_key_exists($fromUnit, $conversionFactors)) {
                return $value * $conversionFactors[$fromUnit];
            } else {
                return null;
            }
        } else {
            return $value;
        }
    }


    //function to update unit and area for property - LALIT TIWARI (08/Jan/2025)
    public function updatePropertyAreaUnit()
    {
        // Property Ids Array LALIT TIWARI (08/Jan/2025)
        // $propertyIds = [10255, 27959];
        // $unitToCovert = 30;
        $propertyIds = [];
        $unitToCovert = null;
        //Quary for fething record from Property Master LALIT TIWARI (08/Jan/2025)
        $properties = PropertyMaster::whereIn('id', $propertyIds)->get();
        if (count($properties) > 0) {
            foreach ($properties as $property) {
                $circleRate = $lndoRate = null;
                $propertyStatus = $property->status; // Fetch Property Status 
                $propertyId = $property->id; // Fetch Property Id 
                $colonyId = $property->new_colony_name; // Fetch Colony Id
                $propertyType = $property->property_type; // Fetch Property Type
                if ($propertyStatus == 1476) {
                    //Fetch Unallotted Property Details LALIT TIWARI (08/Jan/2025)
                    $unallotedPropertyObj = UnallottedPropertyDetail::where('property_master_id', $propertyId)->first();
                    if (!empty($unallotedPropertyObj)) {
                        Log::info('Unalloted Property Before Updated:', ['unalloted_property_id' => $unallotedPropertyObj->id, 'property_master_id' => $propertyId, 'unit' => $unallotedPropertyObj->unit, 'plot_area_in_sqm' => $unallotedPropertyObj->plot_area_in_sqm, 'plot_value' => $unallotedPropertyObj->plot_value, 'plot_value_cr' => $unallotedPropertyObj->plot_value_cr]);
                        echo "Unalloted Property Before Updated: unalloted_property_id = " . $unallotedPropertyObj->id . ",property_master_id = " . $propertyId . ", unit = " . $unallotedPropertyObj->unit . ", plot_area_in_sqm = " . $unallotedPropertyObj->plot_area_in_sqm . ", plot_value = " . $unallotedPropertyObj->plot_value . ", plot_value_cr = " . $unallotedPropertyObj->plot_value_cr . "<br>";

                        //Convert plot area into square meter by given unit LALIT TIWARI (08/Jan/2025)
                        $plotAreaInSqmForUnallotedProperty = self::convertToSquareMeter($unallotedPropertyObj->plot_area,  $unitToCovert);

                        // Calculated Circle & Lndo Rate  LALIT TIWARI (08/Jan/2025)
                        $circleRateForUnallotedProperty = Self::fetchLatestLandRate(CircleResidentialLandRate::class, $colonyId);
                        $lndoRateForUnallotedProperty = Self::fetchLatestLandRate(LndoResidentialLandRate::class, $colonyId);
                        $plotAreaRoundedForUnallotedProperty = round($plotAreaInSqmForUnallotedProperty, 2);
                        if ($lndoRateForUnallotedProperty !== null) {
                            $plotValueForUnallotedProperty = round($lndoRateForUnallotedProperty * $plotAreaRoundedForUnallotedProperty, 2);
                        }
                        if ($circleRateForUnallotedProperty !== null) {
                            $plotValueCrForUnallotedProperty = round($circleRateForUnallotedProperty * $plotAreaRoundedForUnallotedProperty, 2);
                        }
                        $unallotedPropertyObj->unit = $unitToCovert;
                        $unallotedPropertyObj->plot_area_in_sqm = $plotAreaInSqmForUnallotedProperty;
                        $unallotedPropertyObj->plot_value = $plotValueForUnallotedProperty;
                        $unallotedPropertyObj->plot_value_cr = $plotValueCrForUnallotedProperty;
                        //Undate record in to Unalloted Property Details Table LALIT TIWARI (08/Jan/2025)
                        $unallotedPropertyObj->save();
                        Log::info('Unalloted Property After Updated:', ['unalloted_property_id' => $unallotedPropertyObj->id, 'property_master_id' => $propertyId, 'unit' => $unitToCovert, 'plot_area_in_sqm' => $plotAreaRoundedForUnallotedProperty, 'plot_value' => $plotValueForUnallotedProperty, 'plot_value_cr' => $plotValueCrForUnallotedProperty]);
                        echo "Unalloted Property After Updated: unalloted_property_id = " . $unallotedPropertyObj->id . ",property_master_id = " . $propertyId . ", unit = " . $unitToCovert . ", plot_area_in_sqm = " . $plotAreaRoundedForUnallotedProperty . ", plot_value = " . $plotValueForUnallotedProperty . ", plot_value_cr = " . $plotValueCrForUnallotedProperty . "<br>";
                    }
                } else {
                    switch ($propertyType) {
                        case '47': //Residential
                            $circleRate = Self::fetchLatestLandRate(CircleResidentialLandRate::class, $colonyId);
                            $lndoRate = Self::fetchLatestLandRate(LndoResidentialLandRate::class, $colonyId);
                            break;
                        case '48': //Commercial
                        case '72': //Mixed
                            $circleRate = Self::fetchLatestLandRate(CircleCommercialLandRate::class, $colonyId);
                            $lndoRate = Self::fetchLatestLandRate(LndoCommercialLandRate::class, $colonyId);
                            break;
                        case '49': //Institutional
                            $circleRate = Self::fetchLatestLandRate(CircleInstitutionalLandRate::class, $colonyId);
                            $lndoRate = Self::fetchLatestLandRate(LndoInstitutionalLandRate::class, $colonyId);
                            break;
                        case '469': //industrial
                            $circleRate = Self::fetchLatestLandRate(CircleIndustrialLandRate::class, $colonyId);
                            $lndoRate = Self::fetchLatestLandRate(LndoIndustrialLandRate::class, $colonyId);
                            break;
                    }
                    $propertyLeaseDetails = PropertyLeaseDetail::where('property_master_id', $propertyId)->first();
                    Log::info('Property Before Updated:', ['property_lease_details_id' => $propertyLeaseDetails->id, 'property_master_id' => $propertyId, 'unit' => $propertyLeaseDetails->unit, 'plot_area_in_sqm' => $propertyLeaseDetails->plot_area_in_sqm, 'plot_value' => $propertyLeaseDetails->plot_value, 'plot_value_cr' => $propertyLeaseDetails->plot_value_cr]);
                    echo "Property Before Updated: property_lease_details_id = " . $propertyLeaseDetails->id . ",property_master_id = " . $propertyId . ", unit = " . $propertyLeaseDetails->unit . ", plot_area_in_sqm = " . $propertyLeaseDetails->plot_area_in_sqm . ", plot_value =" . $propertyLeaseDetails->plot_value . ", plot_value_cr = " . $propertyLeaseDetails->plot_value_cr . "<br>";
                    $plotAreaForPropertyLeaseDetails = self::convertToSquareMeter($propertyLeaseDetails['plot_area'],  $unitToCovert);
                    $plotAreaInSqmForPropertyLeaseDetails = round($plotAreaForPropertyLeaseDetails, 2);
                    if ($lndoRate !== null) {
                        $propertyPlotValueForPropertyLeaseDetails = round($lndoRate * (float)$plotAreaInSqmForPropertyLeaseDetails, 2);
                    }
                    if ($circleRate !== null) {
                        $propertyPlotValueCrForPropertyLeaseDetails = round($circleRate * (float)$plotAreaInSqmForPropertyLeaseDetails, 2);
                    }
                    $propertyLeaseDetails->unit = $unitToCovert;
                    $propertyLeaseDetails->plot_area_in_sqm = $plotAreaInSqmForPropertyLeaseDetails;
                    $propertyLeaseDetails->plot_value = $propertyPlotValueForPropertyLeaseDetails;
                    $propertyLeaseDetails->plot_value_cr = $propertyPlotValueCrForPropertyLeaseDetails;

                    if ($propertyLeaseDetails->save()) {
                        Log::info('Property After Updated:', ['property_lease_details_id' => $propertyLeaseDetails->id, 'property_master_id' => $propertyId, 'unit' => $unitToCovert, 'plot_area_in_sqm' => $plotAreaInSqmForPropertyLeaseDetails, 'plot_value' => $propertyPlotValueForPropertyLeaseDetails, 'plot_value_cr' => $propertyPlotValueCrForPropertyLeaseDetails]);
                        echo "Property After Updated: property_lease_details_id = " . $propertyLeaseDetails->id . ",property_master_id = " . $propertyId . ", unit = " . $unitToCovert . ", plot_area_in_sqm = " . $plotAreaInSqmForPropertyLeaseDetails . ", plot_value =" . $propertyPlotValueForPropertyLeaseDetails . ", plot_value_cr = " . $propertyPlotValueCrForPropertyLeaseDetails . "<br>";

                        if ($property->is_joint_property) {
                            $childPropertyDetails = SplitedPropertyDetail::where('property_master_id', $propertyId)->get();
                            if (count($childPropertyDetails) > 0) {
                                foreach ($childPropertyDetails as $childPropertyDetail) {
                                    $childPropertyId = $childPropertyDetail['id'];
                                    $plotAreaInSqmSplittedPropertyDetails = self::convertToSquareMeter($childPropertyDetail['current_area'],  $unitToCovert);
                                    $childPlotAreaInSqmSplittedPropertyDetails = round($plotAreaInSqmSplittedPropertyDetails, 2);
                                    if ($lndoRate !== null) {
                                        $childPropertyPlotValueSplittedProperty = round($lndoRate * (float)$childPlotAreaInSqmSplittedPropertyDetails, 2);
                                    }
                                    if ($circleRate !== null) {
                                        $childPropertyPlotValueCrSplittedProperty = round($circleRate * (float)$childPlotAreaInSqmSplittedPropertyDetails, 2);
                                    }
                                    $childPropertyDetail->unit = $unitToCovert;
                                    $childPropertyDetail->area_in_sqm = $childPlotAreaInSqmSplittedPropertyDetails;
                                    $childPropertyDetail->plot_value = $childPropertyPlotValueSplittedProperty;
                                    $childPropertyDetail->plot_value_cr = $childPropertyPlotValueCrSplittedProperty;
                                    Log::info('Child Property Before Updated:', ['child_property_id' => $childPropertyDetail->id, 'property_master_id' => $propertyId, 'unit' => $childPropertyDetail->unit, 'area_in_sqm' => $childPropertyDetail->area_in_sqm, 'plot_value' => $childPropertyDetail->plot_value, 'plot_value_cr' => $childPropertyDetail->plot_value_cr]);
                                    echo "Child Property Before Updated: child_property_id = " . $childPropertyDetail->id . ", property_master_id = " . $propertyId . ", unit = " . $childPropertyDetail->unit . ", area_in_sqm = " . $childPropertyDetail->area_in_sqm . ", plot_value = " . $childPropertyDetail->plot_value . ", plot_value_cr = " . $childPropertyDetail->plot_value_cr . "<br>";
                                    if ($childPropertyDetail->save()) {
                                        Log::info('Child Property After Updated:', ['child_property_id' => $childPropertyDetail->id, 'property_master_id' => $propertyId, 'unit' => $unitToCovert, 'area_in_sqm' => $childPlotAreaInSqmSplittedPropertyDetails, 'plot_value' => $childPropertyPlotValueSplittedProperty, 'plot_value_cr' => $childPropertyPlotValueCrSplittedProperty]);
                                        echo "Child Property After Updated: child_property_id = " . $childPropertyDetail->id . ", property_master_id = " . $propertyId . ", unit = " . $unitToCovert . ", area_in_sqm = " . $childPlotAreaInSqmSplittedPropertyDetails . ", plot_value = " . $childPropertyPlotValueSplittedProperty . ", plot_value_cr = " . $childPropertyPlotValueCrSplittedProperty . "<br>";
                                    } else {
                                        echo "Child Property ID:- " . $childPropertyId . " <b>not Updated ----------------------**********<b><br>";
                                    }
                                }
                            }
                        }
                    } else {
                        echo "Parent Property ID:- " . $propertyId . " <b>not Updated ----------------------**********<b><br>";
                    }
                }
            }
        }
    }
    /*Writing this function to update the current lessees of leased properties where conversion record got entered as blank and current lessee as blank 
    as blank string --Amita Srivastava & Sourav [09-01-2025]*/
    public function updateCurrentLesseeOfLeasedProperty(){

        $properties = PropertyMaster::where('status', 951)->get();
        foreach ($properties as $property) {
            $propertyId = $property->id;
                $isConversionRecordAvailable = PropertyTransferredLesseeDetail::where('property_master_id',$propertyId)->where('process_of_transfer','Conversion')->where('lessee_name', NULL)->get();
                if(count($isConversionRecordAvailable) > 0){
                    foreach($isConversionRecordAvailable as $conversionRecord){
                        if($conversionRecord->delete()){
                            echo "Conversion deleted for property ID:- ".$propertyId. "<br>";
                        }
                    }
                    self::updateNewCurrentLessee($propertyId);
                }
            
        }

    }

    //for updating the current lessee in seperate table
     public function updateNewCurrentLessee($id)
     {
         try {
             $propertyId = $id;
             $properties = PropertyMaster::where('id', $propertyId)->get();
 
             if ($properties->isEmpty()) {
                 echo "No properties found for the given ID.";
             }
 
             foreach ($properties as $property) {
 
                 //if property is joint
                 if ($property->is_joint_property == 1) {
 
                     $splitedPropertyDetails = SplitedPropertyDetail::where('property_master_id', $property->id)->get();
                     foreach ($splitedPropertyDetails as $splitedPropertyDetail) {
                         // Property Details
                         $propertyMasterIdChild = $property->id;
                         $splitedPropertyDetailId = $splitedPropertyDetail->id;
                         $oldPropertyIdChild = $splitedPropertyDetail->old_property_id;
                         $propertyStatusChild = $splitedPropertyDetail->property_status;
                         $currentArea = $splitedPropertyDetail->current_area;
                         $areaInSqm = $splitedPropertyDetail->area_in_sqm;
                         $unitChild = $splitedPropertyDetail->unit;
                         $presentlyKnownAsChild = $splitedPropertyDetail->presently_known_as;
                         $createdByChild = $splitedPropertyDetail->created_by;
 
 
                         // Find lessees
                         $latestBatchIdChild = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)->where('splited_property_detail_id', $splitedPropertyDetailId)->max('batch_transfer_id');
                         // if ($latestBatchIdChild === null) {
                         //     return "No lessee details found for property ID: {$property->id} and Splitted property id {$splitedPropertyDetailId}";
                         // }
 
                         if ($latestBatchIdChild) {
 
                             $lesseesWithLatestBatchIdChild = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)
                                 ->where('splited_property_detail_id', $splitedPropertyDetailId)
                                 ->where('batch_transfer_id', $latestBatchIdChild)
                                 ->pluck('lessee_name')
                                 ->toArray();
 
                             $lesseesNamesChild = implode(",", $lesseesWithLatestBatchIdChild);
                             $currentLesseeDetailChild = CurrentLesseeDetail::where('property_master_id', $property->id)->where('splited_property_detail_id', $splitedPropertyDetail->id)->first();
                             // If current lessee details already saved
                             if (!empty($currentLesseeDetailChild)) {
                                 if ($currentLesseeDetailChild['lessees_name'] != $lesseesNamesChild) {
                                     $currentLesseeDetailChild->property_status = $propertyStatusChild;
                                     $currentLesseeDetailChild->lessees_name = $lesseesNamesChild;
                                     $currentLesseeDetailChild->property_known_as = $presentlyKnownAsChild;
                                     $currentLesseeDetailChild->area = $currentArea;
                                     $currentLesseeDetailChild->unit = $unitChild;
                                     $currentLesseeDetailChild->area_in_sqm = $areaInSqm;
                                     $currentLesseeDetailChild->save();
                                 }
                             } else {
                                 CurrentLesseeDetail::create([
                                     'property_master_id' => $propertyMasterIdChild,
                                     'splited_property_detail_id' => $splitedPropertyDetailId,
                                     'old_property_id' => $oldPropertyIdChild,
                                     'property_status' => $propertyStatusChild,
                                     'lessees_name' => $lesseesNamesChild,
                                     'property_known_as' => $presentlyKnownAsChild,
                                     'area' => $currentArea,
                                     'unit' => $unitChild,
                                     'area_in_sqm' => $areaInSqm,
                                     'created_by' => $createdByChild
                                 ]);
                             }
                         }
                     }
                 } else {
 
                     // Property Details
                     $propertyMasterId = $property->id;
                     $oldPropertyId = $property->old_propert_id;
                     $propertyStatus = $property->status;
 
                     // Find lessees
                     $latestBatchId = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)->max('batch_transfer_id');
                     if ($latestBatchId === null) {
                         echo "No lessee details found for property ID: {$property->id}";
                     }
 
                     $lesseesWithLatestBatchId = PropertyTransferredLesseeDetail::where('property_master_id', $property->id)
                         ->where('batch_transfer_id', $latestBatchId)
                         ->pluck('lessee_name')
                         ->toArray();
 
                     $lesseesNames = implode(",", $lesseesWithLatestBatchId);
 
                     // Details from lease details
                     $leaseDetails = PropertyLeaseDetail::where('property_master_id', $property->id)->first();
                     if ($leaseDetails === null) {
                         echo "No lease details found for property ID: {$property->id}";
                     }
 
                     $presentlyKnown = $leaseDetails['presently_known_as'] ?? '';
                     $plotArea = $leaseDetails['plot_area'] ?? 0;
                     $unit = $leaseDetails['unit'] ?? '';
                     $plotAreaInSqm = round($leaseDetails['plot_area_in_sqm'] ?? 0, 2);
                     $createdBy = $leaseDetails['created_by'] ?? '';
 
                     $currentLesseeDetail = CurrentLesseeDetail::where('property_master_id', $property->id)->first();
 
                     // If current lessee details already saved
                     if (!empty($currentLesseeDetail)) {
                         if ($currentLesseeDetail['lessees_name'] != $lesseesNames) {
                             $currentLesseeDetail->property_status = $propertyStatus;
                             $currentLesseeDetail->lessees_name = $lesseesNames;
                             $currentLesseeDetail->property_known_as = $presentlyKnown;
                             $currentLesseeDetail->area = $plotArea;
                             $currentLesseeDetail->unit = $unit;
                             $currentLesseeDetail->area_in_sqm = $plotAreaInSqm;
                             $currentLesseeDetail->save();
                         }
                     } else {
                         CurrentLesseeDetail::create([
                             'property_master_id' => $propertyMasterId,
                             'splited_property_detail_id' => null,
                             'old_property_id' => $oldPropertyId,
                             'property_status' => $propertyStatus,
                             'lessees_name' => $lesseesNames,
                             'property_known_as' => $presentlyKnown,
                             'area' => $plotArea,
                             'unit' => $unit,
                             'area_in_sqm' => $plotAreaInSqm,
                             'created_by' => $createdBy
                         ]);
                     }
                 }
             }
 
             echo "Current lessee details updated successfully.";
         } catch (\Exception $e) {
             echo "An error occurred: " . $e->getMessage();
         }
     }

     public function deactivateInactiveRegisteredApplicants()
     {
         $users = User::where('user_type', 'applicant')->get();
         $currentDate = Carbon::now();
         $maxInactiveDays = config('constants.MAX_INACTIVE_DAYS_FOR_REGISTERED_USER');
     
         foreach ($users as $user) {
             $createdAt = $user->created_at;
             $daysSinceCreation = $createdAt->diffInDays($currentDate);
     
             // if user has NO applications and was created more than 15 days ago
             if (!$user->applications()->exists() && $daysSinceCreation > $maxInactiveDays) {
                 DB::beginTransaction(); 
                 try {
                     $user->status = 0;
                     $user->save();
                     $user->userProperties()->delete();// Soft delete the user-properties
     
                     // Soft delete the user
                     if ($user->delete()) {
                         Log::info("User ({$user->id}) deactivated by cron, as the user had no applications and was created more than 15 days ago.");
                         DB::commit(); 
                     } else {
                         Log::warning("User ({$user->id}) should have been deactivated by cron, but soft deletion failed.");
                         DB::rollBack(); 
                     }
                 } catch (\Exception $e) {
                     DB::rollBack(); 
                     Log::error("Transaction failed for user ({$user->id}): " . $e->getMessage());
                 }
             }
         }
     }
     
    //Function to soft delete applicants whose application is approved/rejected and are inactive from 15 days
    public function deactivateUsersWithInactiveApplications() 
    {
        $currentDate = Carbon::now();
        $statusIds = Item::whereIn('item_code', ['APP_APR', 'APP_REJ'])->pluck('id')->toArray();
        $applications = Application::whereIn('status', $statusIds)->get();
        $maxInactiveDays = config('constants.MAX_INACTIVE_DAYS_AFTER_APPLICATION_DISPOSED');

        foreach ($applications as $application) {
            $updatedAt = $application->updated_at;
            $daysSinceUpdate = $updatedAt->diffInDays($currentDate);

            // If the application has been inactive for more than 15 days
            if ($daysSinceUpdate > $maxInactiveDays) {
                $user = User::find($application->created_by);

                if ($user) {
                    $hasActiveApplications = Application::where('created_by', $user->id)
                        ->whereNotIn('status', $statusIds)
                        ->exists();

                    if (!$hasActiveApplications) {
                        DB::beginTransaction(); 
                        try {
                            $user->status = 0;
                            $user->save(); 
                            $user->userProperties()->delete(); // Soft delete the user-properties
                            // Soft delete the user
                            if ($user->delete()) {
                                Log::info("User ({$user->id}) deactivated (status=0) and soft deleted after 15 days of inactivity.");
                            } else {
                                Log::warning("User ({$user->id}) soft deletion failed.");
                                DB::rollBack(); 
                                continue;
                            }
    
                            DB::commit(); 
                        } catch (\Exception $e) {
                            DB::rollBack(); 
                            Log::error("Transaction failed for user ({$user->id}): " . $e->getMessage());
                        }
                    }
                }
            }
        }
    }

    
    //by Swati Mishra on 04-03-2024 for updating flat rates of existing records
    public function updateExistingFlatsRateAndValue()
    {
        try {
            $flats = Flat::all();
            $updatedCount = 0;
            $updatedIds = [];
            $skippedIds = [];

            foreach ($flats as $flat) {
                // Skipping the record if area is NULL
                if (is_null($flat->area) || trim($flat->area) === '') {
                    $skippedIds[] = $flat->id;
                    continue;
                }
                
                $area_in_sqm = $flat->area_in_sqm;

                // Fetch property type ID from property_masters
                $propertyTypeId = DB::table('property_masters')
                    ->where('id', $flat->property_master_id)
                    ->value('property_type');

                // Fetch property type name from items table
                $propertyTypeName = DB::table('items')
                    ->where('id', $propertyTypeId)
                    ->value('item_name');

                // Initialize rate and value
                $rate = null;
                $value = null;

                // Fetch rate only if property is Residential or Commercial
                if (in_array($propertyTypeName, ['Residential', 'Commercial'])) {
                    $rate = DB::table('flat_rates')
                        ->where('property_type', $propertyTypeId)
                        ->whereNull('date_to')
                        ->value('rate');
                }

                // Calculate value only if area_in_sqm and rate are available
                if (!is_null($area_in_sqm) && !is_null($rate)) {
                    $value = $area_in_sqm * $rate;
                }

                // Check if the new values are different from existing ones before updating
                $flat->update([
                    'rate' => $rate,
                    'value' => $value
                ]);
                
                $updatedCount++;
                $updatedIds[] = $flat->id;
                
            }

             // Log updated and skipped flat IDs
             Log::info("Updated Flats: " . json_encode($updatedIds));
             Log::info("Skipped Flats (Due to NULL/Empty Area): " . json_encode($skippedIds));
    
            return response()->json([
                'status' => 'success',
                'message' => "{$updatedCount} flat records updated successfully.",
                'updated_ids' => $updatedIds 
            ]);

        } catch (\Exception $e) {
            Log::error('Failed to update flats rate and value: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred while updating flat records.',
                'error' => $e->getMessage()
            ]);
        }
    }


    // for storing demands from old system - SOURAV CHAUHAN (10 March 2025)
    public function getOldDemands(){
        $properties = PropertyMaster::get();
        foreach($properties as $property){
            $propertyId = $property->id;
            $propertyStatus = $property->status;
            if ($propertyStatus == 1476) {//unalloted property
                echo "Unallotted Property Master ID:- " . $propertyId . " <b> Not Updated</b><br>";
            } else {
                $isJointProperty = $property->is_joint_property;
                if($isJointProperty == 1){
                    $splitedProperties = SplitedPropertyDetail::where('property_master_id', $propertyId)->get();
                    foreach($splitedProperties as $splitedProperty){
                        $splittedOldPropertyId = $splitedProperty->old_property_id;
                        $sptedPropertyStatus = $splitedProperty->property_status;
                        $splittedPropertyId = $splitedProperty->id;
                        // $this->processOldDemand($splittedOldPropertyId,$sptedPropertyStatus,"Splitted Property",$splittedPropertyId);
                        ProcessOldDemands::dispatch($splittedOldPropertyId,$sptedPropertyStatus,"Splitted Property",$splittedPropertyId);
                    }
                } else {
                    $oldPropertyId = $property->old_propert_id;
                    ProcessOldDemands::dispatch($oldPropertyId,$propertyStatus,'Property Master',$propertyId);
                    // $this->processOldDemand($oldPropertyId,$propertyStatus,'Property Master',$propertyId);
                }
            }
        }
    }

    // private function processOldDemand($oldPropertyId,$propertyStatus,$propertyType,$propertyId){

    //     $storeDemand = true;
    //     //delete old demand if available
    //     $previousSavedDemands = OldDemand::where('property_id', $oldPropertyId)->get();
    //     if ($previousSavedDemands->isNotEmpty()) {
    //         foreach ($previousSavedDemands as $psd) {
    //             $isNewDemandAvailabe = $psd->new_demand_id;
    //             if($isNewDemandAvailabe == null){
    //                 OldDemandSubhead::where('DemandID', $psd->demand_id)->delete();
    //             } else {
    //                 $storeDemand = false;
    //             }
    //         }
    //         OldDemand::where('property_id', $oldPropertyId)->whereNull('new_demand_id')->delete();
    //     }


    //     if($storeDemand){
    //         $pms = new PropertyMasterService();
    //         $oldDemandData = $pms->getPreviousDemands($oldPropertyId);
    //         if($oldDemandData){
    //             $demands = $oldDemandData->LatestDemanddetails;
    //             foreach ($demands as $demand) {
    //                 $paidAmount = $demand->Amount - $demand->Outstanding;
    //                 $demandData = collect($demand)->merge([
    //                     'PaidAmount' => $paidAmount,
    //                     'PropertyStatus' => $propertyStatus
    //                     ])->only([
    //                     'PropertyID',
    //                     'DemandID',
    //                     'Amount',
    //                     'PaidAmount',
    //                     'Outstanding',
    //                     'DemandDate',
    //                     'PropertyStatus',
    //                 ])->mapWithKeys(function ($value, $key) {
    //                     return [
    //                         match ($key) {
    //                             'DemandID' => 'demand_id',
    //                             'PropertyID' => 'property_id',
    //                             'Amount' => 'amount',
    //                             'PaidAmount' => 'paid_amount',
    //                             'Outstanding' => 'outstanding',
    //                             'DemandDate' => 'demand_date',
    //                             'PropertyStatus' => 'property_status',
    //                             default => $key
    //                         } => $value
    //                     ];
    //                 })->toArray();
    //                 OldDemand::create($demandData);
    //             }
    //             $demandSubheads = $oldDemandData->SubHeadwiseBreakup;
    //             foreach ($demandSubheads as $oldSubhead) {
    //                 $oldSubheadData = collect($oldSubhead)->all();
    //                 OldDemandSubhead::create($oldSubheadData);
    //             }
    //             echo $propertyType ." ID:- " . $propertyId. " <b> Updated</b><br>";
    //         }   
    //     } else {
    //         echo $propertyType ." ID:- " . $propertyId. " <b style='color:red;'> Not Updated as New Demand Available.</b><br>";
    //     }
    // }

    //added by swati mishra on 03-04-2025 to run script of update section codes in property master start

    public function updateSectionCodesInPropertyMaster()
    {
        try {
            $desiredSectionCodes = ['PS1', 'PS2', 'PS3'];
            $batchColonyIds = [266, 105, 370];

            // Step 1: Get all section mappings (with colony, type, subtype, and section code)
            $mappings = Section::fullMappings($desiredSectionCodes);

            // Step 2: Filter for batch colony IDs only
            $batchMappings = $mappings->filter(fn($map) =>
                in_array($map->colony_id, $batchColonyIds)
            );

            if ($batchMappings->isEmpty()) {
                return response()->json([
                    'status' => 'skipped',
                    'message' => 'No mappings found for the selected batch of colonies.',
                    'batch_colony_ids' => $batchColonyIds
                ]);
            }

            // Step 3: Build OR-based conditions to fetch only matching PropertyMaster rows
            $matchingTriplets = $batchMappings->map(function ($map) {
                return [
                    'new_colony_name' => $map->colony_id,
                    'property_type' => $map->property_type,
                    'property_sub_type' => $map->property_subtype,
                ];
            });

            $propertyMastersQuery = PropertyMaster::query();

            $matchingTriplets->each(function ($conditions) use ($propertyMastersQuery) {
                $propertyMastersQuery->orWhere(function ($query) use ($conditions) {
                    $query->where('new_colony_name', $conditions['new_colony_name'])
                        ->where('property_type', $conditions['property_type'])
                        ->where('property_sub_type', $conditions['property_sub_type']);
                });
            });

            $propertyMasters = $propertyMastersQuery->get();

            $updatedIds = [];
            $skippedIds = [];
            $rpcellUpdated = [];

            // Step 4: Update matched properties and detect partial matches
            foreach ($propertyMasters as $property) {
                $matched = $batchMappings->first(function ($map) use ($property) {
                    return $map->colony_id == $property->new_colony_name &&
                        $map->property_type == $property->property_type &&
                        $map->property_subtype == $property->property_sub_type;
                });

                if ($matched) {
                    if (stripos($property->file_no, 'RPCELL') !== false) {
                        // Special case: override section code with 'RPC'
                        $property->update(['section_code' => 'RPC']);
                        $rpcellUpdated[] = [
                            'id' => $property->id,
                            'file_no' => $property->file_no,
                            'colony_id' => $property->new_colony_name,
                            'property_type' => $property->property_type,
                            'property_sub_type' => $property->property_sub_type,
                        ];
                    } else {
                        $property->update(['section_code' => $matched->section_code]);
                    }
                    $updatedIds[] = $property->id;
                } else {
                    $skippedIds[] = $property->id;
                }
            }

            // Log everything
            Log::info("Updated property IDs: " . json_encode($updatedIds));
            Log::info("RPCELL overrides: " . json_encode($rpcellUpdated));
            Log::info("Skipped (no match) property IDs: " . json_encode($skippedIds));

            return response()->json([
                'status' => 'success',
                'message' => count($updatedIds) . " properties updated for colonies: " . implode(', ', $batchColonyIds),
                'updated_ids' => $updatedIds,
                'rpcell_overrides' => $rpcellUpdated,
                'skipped_ids' => $skippedIds
            ]);

        } catch (\Exception $e) {
            Log::error("Section code update failed: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during section code update.',
                'error' => $e->getMessage()
            ]);
        }
    }


    //added by swati mishra on 03-04-2025 to run script of update section codes in property master end

    public function syncLndoPropertiesFromPropertyMaster()
    {
        try {
            $yesterdayStart = now()->subDay()->startOfDay();
            $yesterdayEnd = now()->subDay()->endOfDay();
            $itemsMap = Item::pluck('item_name', 'id')->toArray();

            $updatedCount = 0;
            $skippedCount = 0;
            $leaseUpdatedCount = 0;
            $leaseSkippedCount = 0;
            $lesseeUpdatedCount = 0;
            $lesseeSkippedCount = 0;

            // SYNC FROM PROPERTY_MASTERS
            PropertyMaster::whereBetween('updated_at', [$yesterdayStart, $yesterdayEnd])
                ->orderBy('id')
                ->chunk(500, function ($masters) use (&$updatedCount, &$skippedCount, $itemsMap) {
                    foreach ($masters as $master) {
                        $lndo = LndoProperty::where('old_proper', $master->old_propert_id)->first();

                        if (!$lndo) {
                            $skippedCount++;
                            continue;
                        }

                        $fieldsToUpdate = [];

                        $landTypeName = $itemsMap[$master->land_type] ?? null;
                        $statusName = $itemsMap[$master->status] ?? null;

                        if ($lndo->unique_pro !== $master->unique_propert_id) {
                            $fieldsToUpdate['unique_pro'] = $master->unique_propert_id;
                        }

                        if ($lndo->land_type !== $landTypeName) {
                            $fieldsToUpdate['land_type'] = $landTypeName;
                        }

                        if ($lndo->status !== $statusName) {
                            $fieldsToUpdate['status'] = $statusName;
                        }

                        if ($lndo->land_use !== $master->property_type) {
                            $fieldsToUpdate['land_use'] = $master->property_type;
                        }

                        if ($lndo->localityn !== $master->new_colony_name) {
                            $fieldsToUpdate['localityn'] = $master->new_colony_name;
                        }

                        if (!empty($fieldsToUpdate)) {
                            $fieldsToUpdate['updated_at'] = now();
                            $lndo->update($fieldsToUpdate);
                            $updatedCount++;
                        } else {
                            $skippedCount++;
                        }
                    }
                });

            // SYNC FROM PROPERTY_LEASE_DETAILS
            PropertyLeaseDetail::whereBetween('updated_at', [$yesterdayStart, $yesterdayEnd])
                ->orderBy('id')
                ->chunk(500, function ($leases) use (&$leaseUpdatedCount, &$leaseSkippedCount) {
                    foreach ($leases as $lease) {
                        $propertyMaster = PropertyMaster::find($lease->property_master_id);

                        if (!$propertyMaster) {
                            $leaseSkippedCount++;
                            continue;
                        }

                        $oldProper = $propertyMaster->old_propert_id;
                        $lndo = LndoProperty::where('old_proper', $oldProper)->first();

                        if (!$lndo) {
                            $leaseSkippedCount++;
                            continue;
                        }

                        $fieldsToUpdate = [];

                        if ($lndo->area_in_sq != $lease->plot_area_in_sqm) {
                            $fieldsToUpdate['area_in_sq'] = $lease->plot_area_in_sqm;
                        }

                        if ($lndo->address !== $lease->presently_known_as) {
                            $fieldsToUpdate['address'] = $lease->presently_known_as;
                        }

                        if ($lndo->ground_ren != $lease->gr_in_re_rs) {
                            $fieldsToUpdate['ground_ren'] = $lease->gr_in_re_rs;
                        }

                        // lease_tenu calculation from doe and date_of_expiration
                        if ($lease->doe && $lease->date_of_expiration) {
                            $start = Carbon::parse($lease->doe);
                            $end = Carbon::parse($lease->date_of_expiration);

                            $tenure = round($start->floatDiffInYears($end), 2); // In years with decimal

                            if ($lndo->lease_tenu != $tenure) {
                                $fieldsToUpdate['lease_tenu'] = $tenure;
                            }
                        }

                        if (!empty($fieldsToUpdate)) {
                            $fieldsToUpdate['updated_at'] = now();
                            $lndo->update($fieldsToUpdate);
                            $leaseUpdatedCount++;
                        } else {
                            $leaseSkippedCount++;
                        }
                    }
                });

            // SYNC FROM CURRENT_LESSEE_DETAILS
            CurrentLesseeDetail::whereBetween('updated_at', [$yesterdayStart, $yesterdayEnd])
                ->orderBy('id')
                ->chunk(500, function ($lessees) use (&$lesseeUpdatedCount, &$lesseeSkippedCount) {
                    foreach ($lessees as $record) {
                        $lndo = LndoProperty::where('old_proper', $record->old_property_id)->first();

                        if (!$lndo) {
                            $lesseeSkippedCount++;
                            continue;
                        }

                        if ($lndo->lesse_name !== $record->lessee_name) {
                            $lndo->update([
                                'lesse_name' => $record->lessee_name,
                                'updated_at' => now(),
                            ]);
                            $lesseeUpdatedCount++;
                        } else {
                            $lesseeSkippedCount++;
                        }
                    }
                });

            return response()->json([
                'status' => 'success',
                'message' => 'Sync completed.',
                'property_master_updates' => $updatedCount,
                'property_master_skipped' => $skippedCount,
                'lease_detail_updates' => $leaseUpdatedCount,
                'lease_detail_skipped' => $leaseSkippedCount,
                'lessee_updates' => $lesseeUpdatedCount,
                'lessee_skipped' => $lesseeSkippedCount,
            ]);

        } catch (\Exception $e) {
            Log::error("Lndo property sync failed: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during sync.',
                'error' => $e->getMessage()
            ]);
        }
    }


    public function filterSavedDemandsByProvidedDemands(){
        $propertyDemandIds = [
            "12714" =>  3763,
            "12934" =>  152428,
            "12945" =>  1902,
            "13463" =>  130544,
            "13495" =>  5819,
            "13855" =>  39002,
            "13863" =>  5970,
            "13901" =>  39001,
            "14374" =>  99810,
            "14721" =>  110174,
            "14785" =>  4059,
            "14795" =>  6978,
            "15118" =>  4705,
            "15956" =>  99571,
            "16105" =>  5993,
            "16933" =>  1037,
            "18253" =>  99781,
            "18254" =>  152430,
            "18946" =>  6149,
            "19937" =>  5635,
            "20651" =>  4323,
            "20659" =>  1749,
            "20755" =>  142136,
            "20785" =>  8135,
            "20786" =>  3962,
            "20792" =>  99532,
            "20829" =>  99545,
            "20894" =>  3383,
            "20926" =>  89437,
            "21007" =>  5634,
            "21038" =>  141141,
            "21072" =>  6494,
            "21084" =>  100027,
            "21085" =>  100030,
            "21095" =>  130315,
            "21133" =>  99676,
            "21138" =>  6076,
            "21149" =>  2091,
            "21208" =>  99706,
            "21493" =>  99548,
            "21494" =>  79323,
            "21666" =>  99695,
            "22493" =>  18723,
            "24085" =>  89358,
            "24478" =>  3066,
            "24481" =>  5428,
            "24487" =>  99735,
            "24489" =>  99692,
            "24493" =>  99664,
            "24592" =>  99540,
            "24593" =>  3514,
            "24597" =>  4109,
            "24600" =>  100012,
            "24630" =>  100007,
            "24650" =>  140664,
            "24652" =>  6295,
            "24669" =>  1592,
            "24674" =>  99608,
            "24675" =>  8080,
            "24679" =>  99579,
            "24682" =>  4991,
            "24692" =>  130368,
            "24696" =>  99866,
            "24698" =>  99531,
            "24702" =>  7758,
            "24707" =>  99700,
            "24711" =>  6417,
            "24713" =>  7946,
            "24737" =>  130362,
            "24753" =>  6964,
            "24755" =>  5415,
            "24791" =>  99786,
            "25014" =>  7067,
            "25019" =>  140890,
            "25028" =>  99721,
            "25029" =>  99590,
            "25046" =>  5041,
            "25322" =>  39039,
            "25395" =>  5263,
            "25668" =>  4303,
            "25871" =>  140658,
            "25943" =>  8183,
            "26013" =>  99668,
            "26151" =>  99533,
            "26351" =>  7754,
            "26391" =>  7106,
            "26510" =>  6114,
            "26512" =>  6074,
            "26744" =>  7927,
            "26805" =>  2601,
            "27109" =>  39014,
            "27163" =>  1954,
            "27210" =>  6714,
            "27256" =>  5969,
            "27257" =>  99863,
            "27448" =>  99757,
            "28075" =>  4846,
            "28364" =>  2628,
            "29096" =>  2180,
            "29566" =>  4302,
            "29625" =>  79301,
            "30010" =>  3910,
            "30349" =>  99759,
            "30509" =>  2141,
            "31281" =>  4552,
            "31344" =>  3625,
            "31846" =>  4162,
            "31941" =>  2734,
            "32357" =>  99673,
            "32948" =>  3475,
            "34047" =>  130546,
            "34204" =>  99730,
            "34412" =>  141463,
            "34624" =>  6164,
            "34673" =>  7672,
            "34804" =>  99859,
            "34866" =>  3911,
            "35013" =>  18550,
            "35014" =>  8272,
            "35019" =>  99831,
            "35022" =>  8058,
            "35041" =>  6935,
            "35071" =>  6725,
            "35112" =>  99801,
            "35118" =>  99543,
            "35176" =>  6489,
            "35218" =>  5308,
            "35476" =>  99691,
            "35513" =>  7004,
            "35608" =>  4564,
            "35617" =>  140738,
            "35624" =>  99917,
            "35704" =>  38982,
            "35736" =>  7079,
            "35737" =>  6101,
            "35808" =>  140638,
            "35812" =>  6943,
            "35821" =>  7374,
            "35844" =>  7862,
            "35881" =>  89372,
            "35916" =>  79305,
            "48952" =>  99693,
            "50159" =>  99999,
            "50160" =>  99983,
            "50161" =>  7943,
            "50162" =>  142278,
            "50536" =>  99541,
            "51078" =>  130359,
            "51424" =>  99734,
            "52855" =>  7527,
            "52885" =>  7962,
            "52897" =>  8090,
            "52909" =>  18705,
            "52915" =>  8159,
            "52916" =>  8162,
            "65970" =>  49147,
            "74579" =>  99729,
            "21164" =>  99684,
            "21331" =>  59195,
            "21332" =>  89453,
            "21343" =>  6395,
            "21345" =>  4885,
            "21346" =>  7337,
            "21353" =>  99490,
            "21462" =>  5220,
            "23586" =>  7750,
            "23641" =>  7479,
            "23793" =>  4161,
            "25341" =>  99553,
            "25465" =>  4377,
            "25495" =>  69201,
            "25595" =>  99498,
            "25633" =>  59183,
            "25843" =>  99645,
            "25844" =>  99485,
            "25845" =>  89454,
            "25856" =>  89461,
            "25986" =>  89457,
            "26767" =>  28847,
            "27137" =>  4222,
            "33809" =>  59181,
            "33817" =>  6923,
            "33900" =>  7515,
            "34115" =>  18710,
            "34145" =>  142262,
            "34168" =>  3140,
            "34209" =>  7362,
            "34230" =>  4376,
            "34271" =>  59184,
            "34312" =>  4027,
            "34568" =>  4051,
            "34574" =>  4022,
            "34587" =>  4410,
            "34591" =>  4166,
            "34609" =>  4018,
            "34628" =>  99927,
            "34630" =>  18642,
            "34635" =>  8146,
            "34644" =>  69211,
            "34646" =>  69224,
            "34647" =>  59194,
            "34650" =>  59182,
            "34653" =>  69225,
            "34656" =>  49171,
            "34671" =>  69226,
            "34672" =>  4099,
            "34674" =>  99496,
            "34681" =>  99796,
            "34684" =>  69257,
            "34687" =>  4052,
            "34688" =>  59179,
            "34730" =>  4101,
            "34736" =>  28795,
            "35169" =>  4670,
            "35253" =>  4489,
            "35280" =>  4061,
            "35291" =>  99491,
            "35409" =>  4390,
            "35488" =>  4498,
            "35506" =>  4468,
            "35619" =>  99486,
            "35622" =>  69208,
            "35637" =>  99487,
            "37348" =>  99846,
            "47712" =>  5578,
            "48755" =>  3042,
            "52826" =>  7383,
            "52889" =>  7720,
            "53055" =>  59180,
            "53250" =>  69210,
            "63111" =>  18758,
            "64981" =>  89429,
            "65054" =>  141144,
            "65059" =>  49154,
            "65060" =>  49173,
            "65061" =>  49172,
            "65152" =>  59174,
            "65292" =>  59189,
            "65901" =>  49155,
            "65906" =>  99538,
            "72344" =>  99500,
            "75657" =>  110132,
            "75687" =>  130450,
            "75688" =>  130451,
            "75689" =>  130452,
            "75691" =>  130454,
            "75707" =>  130481,
            "78840" =>  141925,
            "89357" =>  69278,
            "99465" =>  59186,
            "99466" =>  59187,
            "13923" =>  99526,
            "14309" =>  2782,
            "14607" =>  130327,
            "15983" =>  5074,
            "16451" =>  6327,
            "18419" =>  6749,
            "20714" =>  7420,
            "20746" =>  120241,
            "20812" =>  130423,
            "20813" =>  5478,
            "20860" =>  4207,
            "20878" =>  3870,
            "20969" =>  141774,
            "20997" =>  4213,
            "20998" =>  4626,
            "21025" =>  6670,
            "21073" =>  7227,
            "21083" =>  141719,
            "21131" =>  89399,
            "21146" =>  6342,
            "21171" =>  7782,
            "21224" =>  5897,
            "21285" =>  4499,
            "21297" =>  5264,
            "21367" =>  6638,
            "21368" =>  130409,
            "21369" =>  110096,
            "21373" =>  1789,
            "21374" =>  5445,
            "21377" =>  141188,
            "21378" =>  89428,
            "21380" =>  7179,
            "21381" =>  5457,
            "21383" =>  6918,
            "21386" =>  8309,
            "21388" =>  1952,
            "21389" =>  7262,
            "21441" =>  141638,
            "21466" =>  5756,
            "21469" =>  5078,
            "21471" =>  100026,
            "21475" =>  7369,
            "21484" =>  4816,
            "21485" =>  99850,
            "21486" =>  99827,
            "21487" =>  140685,
            "21495" =>  7094,
            "21499" =>  2508,
            "21503" =>  3725,
            "21506" =>  18664,
            "21520" =>  141521,
            "21530" =>  6655,
            "21534" =>  28868,
            "21535" =>  4683,
            "21537" =>  3571,
            "21549" =>  6282,
            "21553" =>  2950,
            "21560" =>  99709,
            "21588" =>  140634,
            "21590" =>  79325,
            "21598" =>  7181,
            "21601" =>  7477,
            "21604" =>  2105,
            "21647" =>  142037,
            "21649" =>  130420,
            "21652" =>  4258,
            "21669" =>  130464,
            "21671" =>  2627,
            "21677" =>  4436,
            "21681" =>  2188,
            "21714" =>  1807,
            "21718" =>  4031,
            "21719" =>  4145,
            "21733" =>  5418,
            "21738" =>  140933,
            "21742" =>  6472,
            "23056" =>  8096,
            "23467" =>  5695,
            "23603" =>  7729,
            "25811" =>  18759,
            "26534" =>  130563,
            "26535" =>  8021,
            "26541" =>  38979,
            "26615" =>  141041,
            "26688" =>  4342,
            "26699" =>  99895,
            "26702" =>  8049,
            "26704" =>  130523,
            "26705" =>  110095,
            "27121" =>  141341,
            "27122" =>  8051,
            "27126" =>  8042,
            "28437" =>  3229,
            "28857" =>  5563,
            "29134" =>  130318,
            "29135" =>  130352,
            "29453" =>  7230,
            "29460" =>  79328,
            "29996" =>  6429,
            "30284" =>  99631,
            "31040" =>  141052,
            "32090" =>  3109,
            "32488" =>  6781,
            "33683" =>  8089,
            "33785" =>  5678,
            "33963" =>  4629,
            "34106" =>  8379,
            "34246" =>  141575,
            "34415" =>  6686,
            "34441" =>  141682,
            "34519" =>  120208,
            "34537" =>  8284,
            "34538" =>  140959,
            "34539" =>  142306,
            "35314" =>  89401,
            "35920" =>  4210,
            "62201" =>  141071,
            "63775" =>  99575,
            "11164" =>  4521,
            "13754" =>  99849,
            "14105" =>  130531,
            "15196" =>  7710,
            "16055" =>  18634,
            "20222" =>  8043,
            "20231" =>  1574,
            "20235" =>  18744,
            "20238" =>  69249,
            "20244" =>  5496,
            "20246" =>  99593,
            "20304" =>  99572,
            "20306" =>  142171,
            "20309" =>  28861,
            "20310" =>  28882,
            "20316" =>  7718,
            "20385" =>  1587,
            "20387" =>  7737,
            "20389" =>  18595,
            "20390" =>  99570,
            "20394" =>  99824,
            "20398" =>  89466,
            "20774" =>  18764,
            "20927" =>  6909,
            "20961" =>  18507,
            "20987" =>  39132,
            "20989" =>  5630,
            "20990" =>  142173,
            "20996" =>  79333,
            "21043" =>  99903,
            "21046" =>  6205,
            "21047" =>  99957,
            "21075" =>  89436,
            "21254" =>  3351,
            "21259" =>  8352,
            "21268" =>  7711,
            "21323" =>  99652,
            "21366" =>  4798,
            "21391" =>  99861,
            "21554" =>  6901,
            "21597" =>  99483,
            "21657" =>  5147,
            "21658" =>  130576,
            "21702" =>  38942,
            "24049" =>  5434,
            "24050" =>  7043,
            "24055" =>  1701,
            "24058" =>  6577,
            "24068" =>  3349,
            "24226" =>  18657,
            "24227" =>  141096,
            "24615" =>  8254,
            "24659" =>  99784,
            "24683" =>  6197,
            "24687" =>  6194,
            "24834" =>  99900,
            "24922" =>  99877,
            "24924" =>  99976,
            "24968" =>  6189,
            "24979" =>  99899,
            "25173" =>  5901,
            "25916" =>  8442,
            "26420" =>  69197,
            "26827" =>  6747,
            "26872" =>  6199,
            "26895" =>  39052,
            "26903" =>  130377,
            "27021" =>  6200,
            "27065" =>  5439,
            "27158" =>  141146,
            "27292" =>  6206,
            "28051" =>  39066,
            "30065" =>  99573,
            "31925" =>  28792,
            "33171" =>  59196,
            "34734" =>  7691,
            "34914" =>  5483,
            "34999" =>  3737,
            "35021" =>  3741,
            "36104" =>  5130,
            "37548" =>  49167,
            "37593" =>  5452,
            "59365" =>  99901,
            "63131" =>  39140,
            "63133" =>  39136,
            "63156" =>  69294,
            "10249" =>  2770,
            "10293" =>  18652,
            "10627" =>  6215,
            "10638" =>  5003,
            "10760" =>  8471,
            "10790" =>  3466,
            "10974" =>  141200,
            "11209" =>  7874,
            "11278" =>  79300,
            "11336" =>  2385,
            "11415" =>  38969,
            "11539" =>  1498,
            "11672" =>  3139,
            "13319" =>  18698,
            "13471" =>  7949,
            "13504" =>  3075,
            "13695" =>  4988,
            "15162" =>  99814,
            "19159" =>  6119,
            "20215" =>  1983,
            "21080" =>  3040,
            "21152" =>  120205,
            "21272" =>  7292,
            "21282" =>  5029,
            "21308" =>  7083,
            "21356" =>  3333,
            "21404" =>  99826,
            "21422" =>  1773,
            "21645" =>  7846,
            "21793" =>  4945,
            "21812" =>  2582,
            "21813" =>  6557,
            "21820" =>  5197,
            "21823" =>  2140,
            "21845" =>  8400,
            "21849" =>  6622,
            "21850" =>  1591,
            "21865" =>  3304,
            "21877" =>  130342,
            "21878" =>  7295,
            "21880" =>  4601,
            "21882" =>  7355,
            "21885" =>  2241,
            "21888" =>  4043,
            "21891" =>  7791,
            "21893" =>  4081,
            "21895" =>  99799,
            "21905" =>  5403,
            "21914" =>  7919,
            "21931" =>  3714,
            "21942" =>  6702,
            "21950" =>  142070,
            "21958" =>  130406,
            "21973" =>  110108,
            "21984" =>  6589,
            "22001" =>  7259,
            "22003" =>  142032,
            "22023" =>  1822,
            "22037" =>  3767,
            "22066" =>  2349,
            "22077" =>  39142,
            "22082" =>  3301,
            "22086" =>  4992,
            "22092" =>  3177,
            "22097" =>  1876,
            "22104" =>  1903,
            "22106" =>  1934,
            "22108" =>  6019,
            "22114" =>  8069,
            "22116" =>  5566,
            "22121" =>  6859,
            "22128" =>  39139,
            "22131" =>  2193,
            "22132" =>  4364,
            "22137" =>  7352,
            "22138" =>  4485,
            "22139" =>  5588,
            "22142" =>  5159,
            "22143" =>  28803,
            "22148" =>  5637,
            "22149" =>  6633,
            "22150" =>  8217,
            "22152" =>  3501,
            "22153" =>  5249,
            "22154" =>  6965,
            "22157" =>  3753,
            "22159" =>  2374,
            "22163" =>  2317,
            "22181" =>  3495,
            "22187" =>  3372,
            "22198" =>  8389,
            "22208" =>  110151,
            "22516" =>  4584,
            "22519" =>  4989,
            "22521" =>  4932,
            "22530" =>  130524,
            "22535" =>  4824,
            "22602" =>  6607,
            "22603" =>  110112,
            "22604" =>  4783,
            "22607" =>  38928,
            "22616" =>  110133,
            "22818" =>  2622,
            "22832" =>  7536,
            "22852" =>  2834,
            "22873" =>  3590,
            "22887" =>  130589,
            "23581" =>  18593,
            "24219" =>  1485,
            "24409" =>  1809,
            "24602" =>  6851,
            "24603" =>  99943,
            "24607" =>  8104,
            "24608" =>  2132,
            "24609" =>  3791,
            "24620" =>  28784,
            "24623" =>  4724,
            "24624" =>  3597,
            "26496" =>  1632,
            "27070" =>  5397,
            "27994" =>  4170,
            "29578" =>  7979,
            "30004" =>  5266,
            "30006" =>  8099,
            "30052" =>  2064,
            "30943" =>  6735,
            "31131" =>  8387,
            "31389" =>  4757,
            "31425" =>  6590,
            "31829" =>  4129,
            "32161" =>  99813,
            "33221" =>  4071,
            "33354" =>  2821,
            "33478" =>  4134,
            "33636" =>  28852,
            "33682" =>  141537,
            "33875" =>  140930,
            "34067" =>  130435,
            "34071" =>  8399,
            "34224" =>  3368,
            "34494" =>  28786,
            "34547" =>  100048,
            "34639" =>  99779,
            "34648" =>  99478,
            "35087" =>  4655,
            "35089" =>  4036,
            "35101" =>  6445,
            "35156" =>  99790,
            "35226" =>  6456,
            "35364" =>  140713,
            "35528" =>  4033,
            "52852" =>  7559,
            "57399" =>  130533,
            "64012" =>  120185,
            "64223" =>  130383,
            "66895" =>  110106,
            "13810" =>  18683,
            "18424" =>  6261,
            "20992" =>  7438,
            "21158" =>  7154,
            "21189" =>  8028,
            "21190" =>  8022,
            "21193" =>  141293,
            "21316" =>  130532,
            "21398" =>  7812,
            "21599" =>  99752,
            "21696" =>  140620,
            "24027" =>  6071,
            "24188" =>  6311,
            "24937" =>  6307,
            "24983" =>  7743,
            "25192" =>  7751,
            "25265" =>  99584,
            "25598" =>  6355,
            "25623" =>  7951,
            "26020" =>  8338,
            "26218" =>  130568,
            "26570" =>  8017,
            "26821" =>  99513,
            "26938" =>  141599,
            "26942" =>  7286,
            "27405" =>  39094,
            "27838" =>  18656,
            "28419" =>  6761,
            "29207" =>  6681,
            "29348" =>  7409,
            "29909" =>  5733,
            "31940" =>  6819,
            "33172" =>  7236,
            "34637" =>  28836,
            "34704" =>  130537,
            "35179" =>  89342,
            "35246" =>  7151,
            "35268" =>  6695,
            "35292" =>  141302,
            "35297" =>  8039,
            "35631" =>  6676,
            "48551" =>  6096,
            "51548" =>  130344,
            "52895" =>  141227,
            "52900" =>  18501,
            "52911" =>  7910,
            "63125" =>  99991,
            "75176" =>  99851,
            "55555" =>  142005,
            "10062" =>  1883,
            "11141" =>  7850,
            "11169" =>  4936,
            "11185" =>  1769,
            "11856" =>  6280,
            "12589" =>  3520,
            "14362" =>  6360,
            "19638" =>  6880,
            "19837" =>  1819,
            "20727" =>  3409,
            "20796" =>  2082,
            "20836" =>  2138,
            "20928" =>  3153,
            "21048" =>  2779,
            "21049" =>  5579,
            "21061" =>  8402,
            "21062" =>  1500,
            "21101" =>  3547,
            "21102" =>  2559,
            "21157" =>  2810,
            "21185" =>  3582,
            "21207" =>  1756,
            "21237" =>  1499,
            "21263" =>  3951,
            "21264" =>  3049,
            "21302" =>  1728,
            "21303" =>  4314,
            "21539" =>  5223,
            "21571" =>  2052,
            "21575" =>  2306,
            "21654" =>  4619,
            "21667" =>  1725,
            "21679" =>  6565,
            "21747" =>  7049,
            "21748" =>  8426,
            "21881" =>  6400,
            "22012" =>  28838,
            "22020" =>  5491,
            "22034" =>  5671,
            "22040" =>  3186,
            "22043" =>  8335,
            "22054" =>  4649,
            "22060" =>  4700,
            "22062" =>  6318,
            "22067" =>  18533,
            "22071" =>  2677,
            "22080" =>  4581,
            "22085" =>  6305,
            "22087" =>  49146,
            "22266" =>  2256,
            "22274" =>  141797,
            "22279" =>  141440,
            "22389" =>  3455,
            "22405" =>  141803,
            "22650" =>  142205,
            "22657" =>  142224,
            "22659" =>  130277,
            "22793" =>  2449,
            "23122" =>  3995,
            "23183" =>  2604,
            "23222" =>  1867,
            "23609" =>  2818,
            "23659" =>  1914,
            "23696" =>  7057,
            "23739" =>  1522,
            "23841" =>  7452,
            "23846" =>  6756,
            "23861" =>  3006,
            "23951" =>  2096,
            "23991" =>  2149,
            "24045" =>  3013,
            "24069" =>  8233,
            "24167" =>  1501,
            "24192" =>  4149,
            "24204" =>  3069,
            "24243" =>  7044,
            "24318" =>  1502,
            "24359" =>  1947,
            "24371" =>  1507,
            "24383" =>  1509,
            "24561" =>  2347,
            "24589" =>  2561,
            "24688" =>  141749,
            "24747" =>  1516,
            "24801" =>  8038,
            "24806" =>  5995,
            "25020" =>  4375,
            "25044" =>  2156,
            "25103" =>  1598,
            "25332" =>  1538,
            "25424" =>  1847,
            "25565" =>  1550,
            "25661" =>  3526,
            "25689" =>  7883,
            "25690" =>  7882,
            "25692" =>  1639,
            "25839" =>  3408,
            "25878" =>  1573,
            "25938" =>  1578,
            "25961" =>  1579,
            "26004" =>  2157,
            "26015" =>  1588,
            "26088" =>  1585,
            "26099" =>  141582,
            "26161" =>  2334,
            "26224" =>  2600,
            "26286" =>  1760,
            "26289" =>  4858,
            "26333" =>  1605,
            "26347" =>  5323,
            "26353" =>  7867,
            "26369" =>  1621,
            "26390" =>  1611,
            "26401" =>  1615,
            "26402" =>  1616,
            "26407" =>  1617,
            "26452" =>  1722,
            "26502" =>  7593,
            "26531" =>  6427,
            "26540" =>  5185,
            "26680" =>  3234,
            "26693" =>  4205,
            "26710" =>  6942,
            "26726" =>  2576,
            "26766" =>  3068,
            "26839" =>  6620,
            "26921" =>  1660,
            "26964" =>  1665,
            "26986" =>  141241,
            "27034" =>  4532,
            "27041" =>  1754,
            "27060" =>  1683,
            "27073" =>  1685,
            "27094" =>  1879,
            "27116" =>  6752,
            "27153" =>  3415,
            "27164" =>  5640,
            "27165" =>  8441,
            "27176" =>  3542,
            "27193" =>  7871,
            "27194" =>  1837,
            "27199" =>  99653,
            "27208" =>  28871,
            "27222" =>  2191,
            "27225" =>  1705,
            "27227" =>  3903,
            "27238" =>  1709,
            "27241" =>  6414,
            "27251" =>  1712,
            "27291" =>  2011,
            "27315" =>  140623,
            "27440" =>  2034,
            "27452" =>  141180,
            "27466" =>  130307,
            "27474" =>  7913,
            "27503" =>  1768,
            "27616" =>  5500,
            "27639" =>  7152,
            "27814" =>  3160,
            "27837" =>  4278,
            "27915" =>  100058,
            "27918" =>  28845,
            "27954" =>  8253,
            "27967" =>  6004,
            "27968" =>  2365,
            "28006" =>  1910,
            "28009" =>  2580,
            "28024" =>  1792,
            "28044" =>  3026,
            "28058" =>  1796,
            "28099" =>  1803,
            "28127" =>  142141,
            "28189" =>  3752,
            "28198" =>  1813,
            "28455" =>  2785,
            "28493" =>  130263,
            "28525" =>  4572,
            "28594" =>  2891,
            "28656" =>  3507,
            "28668" =>  2452,
            "28710" =>  6969,
            "28756" =>  6560,
            "28766" =>  5328,
            "28866" =>  18522,
            "28891" =>  4263,
            "28906" =>  3176,
            "28922" =>  28780,
            "28987" =>  1855,
            "29001" =>  1856,
            "29063" =>  18581,
            "29122" =>  2339,
            "29132" =>  3999,
            "29309" =>  3110,
            "29328" =>  3884,
            "29385" =>  2058,
            "29386" =>  4333,
            "29392" =>  1899,
            "29396" =>  4068,
            "29494" =>  8116,
            "29512" =>  1918,
            "29531" =>  2654,
            "29599" =>  6233,
            "29604" =>  1950,
            "29628" =>  2432,
            "29631" =>  99655,
            "29634" =>  3276,
            "29636" =>  2260,
            "29638" =>  1968,
            "29654" =>  2085,
            "29663" =>  2152,
            "29675" =>  8377,
            "29700" =>  4385,
            "29892" =>  2006,
            "29901" =>  2333,
            "29908" =>  2013,
            "29916" =>  4520,
            "29922" =>  140773,
            "29937" =>  2491,
            "29951" =>  140693,
            "29962" =>  2367,
            "30009" =>  6520,
            "30235" =>  141976,
            "30251" =>  2556,
            "30285" =>  2196,
            "30332" =>  2790,
            "30418" =>  2450,
            "30466" =>  3977,
            "30483" =>  2337,
            "30549" =>  38987,
            "30561" =>  4955,
            "30632" =>  5549,
            "30687" =>  6267,
            "30727" =>  6791,
            "30756" =>  2695,
            "30784" =>  99805,
            "30785" =>  99807,
            "30822" =>  5014,
            "31034" =>  5608,
            "31053" =>  2215,
            "31054" =>  1735,
            "31200" =>  2548,
            "31270" =>  2541,
            "31287" =>  8458,
            "31288" =>  3457,
            "31299" =>  3768,
            "31304" =>  2451,
            "31365" =>  2788,
            "31407" =>  3787,
            "31436" =>  2778,
            "31439" =>  2353,
            "31462" =>  2736,
            "31465" =>  3583,
            "31580" =>  4054,
            "31588" =>  99699,
            "31609" =>  3782,
            "31612" =>  39064,
            "31685" =>  2494,
            "31738" =>  2456,
            "31760" =>  8232,
            "31784" =>  3814,
            "31790" =>  5499,
            "31897" =>  141895,
            "31953" =>  3193,
            "32031" =>  7851,
            "32038" =>  2446,
            "32092" =>  3745,
            "32120" =>  2455,
            "32141" =>  2671,
            "32169" =>  2714,
            "32177" =>  18541,
            "32346" =>  7347,
            "32568" =>  28870,
            "32624" =>  5018,
            "32704" =>  8171,
            "32705" =>  2820,
            "32763" =>  7411,
            "32800" =>  4550,
            "32813" =>  8375,
            "32829" =>  2526,
            "32866" =>  2534,
            "32907" =>  2572,
            "32927" =>  6572,
            "32930" =>  3733,
            "32977" =>  2721,
            "32985" =>  2727,
            "33087" =>  3263,
            "33116" =>  4012,
            "33198" =>  3058,
            "33201" =>  28867,
            "33219" =>  5348,
            "33302" =>  5805,
            "33367" =>  5489,
            "33395" =>  6640,
            "33437" =>  2758,
            "33584" =>  3453,
            "33641" =>  3712,
            "33645" =>  3258,
            "33723" =>  5062,
            "33725" =>  2875,
            "33734" =>  3771,
            "33737" =>  4739,
            "33740" =>  2998,
            "33754" =>  4209,
            "33768" =>  4175,
            "33781" =>  3010,
            "33788" =>  3047,
            "33795" =>  3073,
            "33799" =>  7826,
            "33800" =>  2922,
            "33801" =>  3541,
            "33802" =>  3498,
            "33803" =>  8231,
            "33820" =>  141067,
            "33821" =>  8057,
            "33824" =>  3103,
            "33826" =>  3563,
            "33861" =>  141733,
            "33886" =>  4566,
            "33939" =>  99565,
            "34017" =>  3085,
            "34024" =>  3385,
            "34027" =>  3848,
            "34037" =>  3236,
            "34038" =>  3064,
            "34039" =>  3228,
            "34110" =>  8421,
            "34135" =>  4372,
            "34140" =>  3114,
            "34150" =>  141627,
            "34156" =>  3324,
            "34177" =>  3543,
            "34178" =>  5095,
            "34214" =>  3210,
            "34217" =>  4123,
            "34292" =>  4366,
            "34316" =>  4357,
            "34328" =>  7089,
            "34333" =>  5188,
            "34346" =>  3579,
            "34349" =>  4289,
            "34357" =>  5480,
            "34372" =>  3539,
            "34380" =>  3452,
            "34382" =>  142184,
            "34395" =>  3952,
            "34396" =>  3842,
            "34403" =>  140793,
            "34428" =>  3534,
            "34430" =>  7156,
            "34431" =>  5934,
            "34435" =>  4767,
            "34442" =>  4241,
            "34458" =>  99748,
            "34459" =>  3735,
            "34478" =>  3658,
            "34479" =>  3719,
            "34485" =>  3888,
            "34497" =>  3629,
            "34505" =>  4481,
            "34515" =>  3522,
            "34518" =>  6579,
            "34525" =>  3729,
            "34544" =>  3628,
            "34615" =>  3593,
            "34744" =>  3861,
            "34748" =>  3809,
            "34753" =>  5124,
            "34758" =>  5963,
            "34795" =>  3982,
            "34827" =>  18649,
            "34829" =>  4168,
            "34830" =>  18535,
            "34831" =>  3750,
            "34842" =>  5084,
            "34845" =>  3634,
            "34859" =>  4090,
            "34863" =>  4159,
            "34870" =>  7646,
            "34902" =>  4000,
            "34916" =>  4362,
            "34969" =>  5815,
            "34981" =>  5043,
            "34982" =>  3766,
            "34983" =>  5770,
            "34993" =>  3929,
            "35046" =>  4046,
            "35047" =>  4084,
            "35068" =>  3984,
            "35075" =>  4195,
            "35076" =>  7014,
            "35078" =>  4445,
            "35079" =>  3991,
            "35090" =>  5375,
            "35091" =>  4192,
            "35092" =>  5187,
            "35130" =>  4078,
            "35131" =>  4426,
            "35154" =>  6054,
            "35158" =>  4882,
            "35214" =>  5424,
            "35238" =>  4620,
            "35240" =>  4245,
            "35241" =>  5025,
            "35242" =>  5026,
            "35267" =>  18531,
            "35432" =>  7794,
            "35465" =>  4017,
            "35494" =>  4558,
            "35561" =>  8235,
            "35564" =>  5914,
            "35576" =>  4262,
            "35593" =>  4266,
            "35594" =>  4650,
            "35600" =>  4257,
            "35605" =>  4412,
            "35606" =>  4336,
            "35607" =>  6731,
            "35717" =>  4565,
            "35727" =>  4378,
            "35729" =>  4657,
            "35731" =>  4720,
            "35732" =>  5768,
            "35734" =>  141985,
            "35739" =>  4256,
            "35764" =>  141399,
            "35872" =>  4787,
            "35900" =>  5991,
            "35917" =>  4850,
            "35924" =>  4857,
            "35925" =>  6316,
            "35961" =>  4427,
            "35967" =>  4559,
            "35983" =>  4818,
            "35994" =>  4690,
            "35995" =>  6161,
            "36006" =>  142060,
            "36018" =>  8440,
            "36020" =>  8072,
            "36044" =>  4714,
            "36047" =>  8364,
            "36127" =>  5004,
            "36163" =>  130565,
            "36175" =>  5502,
            "36201" =>  141398,
            "36212" =>  4839,
            "36214" =>  5007,
            "36232" =>  7886,
            "36299" =>  141780,
            "36300" =>  7571,
            "36335" =>  7759,
            "36337" =>  4972,
            "36351" =>  5246,
            "36409" =>  5665,
            "36531" =>  4954,
            "36595" =>  5450,
            "36648" =>  5961,
            "36701" =>  4881,
            "36833" =>  6486,
            "36861" =>  6323,
            "37052" =>  5107,
            "37105" =>  6209,
            "37135" =>  6283,
            "37369" =>  39069,
            "37417" =>  5652,
            "37667" =>  6117,
            "37681" =>  5186,
            "37705" =>  5106,
            "37718" =>  5049,
            "37946" =>  5048,
            "37989" =>  5259,
            "37990" =>  7918,
            "38246" =>  141779,
            "38275" =>  141799,
            "38312" =>  141801,
            "38340" =>  141777,
            "38342" =>  141747,
            "38365" =>  142221,
            "38394" =>  142223,
            "38675" =>  5057,
            "38782" =>  6023,
            "38783" =>  6022,
            "38818" =>  6051,
            "38859" =>  5324,
            "38889" =>  7012,
            "39386" =>  99581,
            "39431" =>  5334,
            "39475" =>  141310,
            "39828" =>  142220,
            "39833" =>  5252,
            "39844" =>  141600,
            "39917" =>  141569,
            "39969" =>  141597,
            "40036" =>  99755,
            "40041" =>  7073,
            "40156" =>  99996,
            "40182" =>  38968,
            "40223" =>  8255,
            "40270" =>  8491,
            "40345" =>  6782,
            "40361" =>  142226,
            "40365" =>  6903,
            "40428" =>  5138,
            "40669" =>  7976,
            "40938" =>  5297,
            "41182" =>  5892,
            "41278" =>  5272,
            "41302" =>  5619,
            "41443" =>  28843,
            "41449" =>  5243,
            "41450" =>  5465,
            "41715" =>  5261,
            "41777" =>  28820,
            "42061" =>  5437,
            "42122" =>  100077,
            "42189" =>  39115,
            "42214" =>  5338,
            "42674" =>  5292,
            "42735" =>  5446,
            "42773" =>  5464,
            "43505" =>  49157,
            "43577" =>  99467,
            "43650" =>  7427,
            "43660" =>  18557,
            "43745" =>  5595,
            "43767" =>  7588,
            "43779" =>  99599,
            "43870" =>  7766,
            "43887" =>  5516,
            "44089" =>  99858,
            "44131" =>  7872,
            "44201" =>  7844,
            "44279" =>  18692,
            "44425" =>  18693,
            "44559" =>  6150,
            "44584" =>  8181,
            "44639" =>  8123,
            "44657" =>  7336,
            "44744" =>  7834,
            "44764" =>  38981,
            "44910" =>  5586,
            "44978" =>  7114,
            "45036" =>  5702,
            "45066" =>  8483,
            "45073" =>  8154,
            "45085" =>  130460,
            "45095" =>  8365,
            "45099" =>  8490,
            "45162" =>  7954,
            "45214" =>  8140,
            "45266" =>  6483,
            "45301" =>  8437,
            "45303" =>  18762,
            "45306" =>  6989,
            "45307" =>  6990,
            "45314" =>  8427,
            "45343" =>  7858,
            "45437" =>  130397,
            "45441" =>  7770,
            "45449" =>  99820,
            "45511" =>  7994,
            "45537" =>  39071,
            "45547" =>  7832,
            "45558" =>  7909,
            "45603" =>  7849,
            "45609" =>  6289,
            "45648" =>  130437,
            "45750" =>  99648,
            "45751" =>  7769,
            "45755" =>  99842,
            "45799" =>  18524,
            "45805" =>  7923,
            "45819" =>  140932,
            "45860" =>  7765,
            "45901" =>  5645,
            "45984" =>  6762,
            "46030" =>  99740,
            "46057" =>  39030,
            "46058" =>  5778,
            "46135" =>  7827,
            "46147" =>  7995,
            "46163" =>  8087,
            "46166" =>  7917,
            "46295" =>  7016,
            "46296" =>  7906,
            "46413" =>  6437,
            "46447" =>  7626,
            "46502" =>  7461,
            "46508" =>  8016,
            "46552" =>  8355,
            "46561" =>  28840,
            "46580" =>  99788,
            "46681" =>  6451,
            "46695" =>  6677,
            "46696" =>  7141,
            "46732" =>  8351,
            "46734" =>  7225,
            "46823" =>  7761,
            "46836" =>  7807,
            "46846" =>  8108,
            "46901" =>  2975,
            "46904" =>  6113,
            "46941" =>  7011,
            "46942" =>  7010,
            "46944" =>  6585,
            "46955" =>  5606,
            "47018" =>  18655,
            "47121" =>  140702,
            "47123" =>  6038,
            "47131" =>  18571,
            "47139" =>  6959,
            "47198" =>  8012,
            "47204" =>  8141,
            "47205" =>  5812,
            "47211" =>  8142,
            "47231" =>  7983,
            "47232" =>  7982,
            "47243" =>  28794,
            "47244" =>  8315,
            "47249" =>  8165,
            "47256" =>  130346,
            "47345" =>  7977,
            "47347" =>  6488,
            "47352" =>  69228,
            "47426" =>  7576,
            "47427" =>  38967,
            "47492" =>  7605,
            "47526" =>  99510,
            "47542" =>  7238,
            "47543" =>  5747,
            "47549" =>  8304,
            "47613" =>  140950,
            "47622" =>  8071,
            "47630" =>  5522,
            "47652" =>  5929,
            "47707" =>  6455,
            "47719" =>  7753,
            "47748" =>  7397,
            "47752" =>  6574,
            "47756" =>  8334,
            "47776" =>  8394,
            "47903" =>  7932,
            "47904" =>  7933,
            "47920" =>  6820,
            "47922" =>  6543,
            "47938" =>  7764,
            "47939" =>  6490,
            "48112" =>  18558,
            "48113" =>  18559,
            "48192" =>  6707,
            "48233" =>  7253,
            "48249" =>  5984,
            "48268" =>  39092,
            "48317" =>  6148,
            "48333" =>  8211,
            "48381" =>  3483,
            "48454" =>  18592,
            "48469" =>  7760,
            "48513" =>  6434,
            "48524" =>  7642,
            "48533" =>  7878,
            "48571" =>  69207,
            "48589" =>  18553,
            "48602" =>  6754,
            "48610" =>  7399,
            "48612" =>  8492,
            "48647" =>  18696,
            "48701" =>  110103,
            "48702" =>  140994,
            "48707" =>  110180,
            "48713" =>  6986,
            "48722" =>  99707,
            "48733" =>  7829,
            "48784" =>  6357,
            "50292" =>  39068,
            "50823" =>  130556,
            "50828" =>  130441,
            "51823" =>  6673,
            "52393" =>  6998,
            "52540" =>  1886,
            "52653" =>  7134,
            "52760" =>  6950,
            "52763" =>  7936,
            "52766" =>  7013,
            "52778" =>  6991,
            "52801" =>  7158,
            "52856" =>  7880,
            "52863" =>  7787,
            "52866" =>  7831,
            "52869" =>  8184,
            "52871" =>  7636,
            "52878" =>  7864,
            "52880" =>  8187,
            "52904" =>  8323,
            "52905" =>  8324,
            "52945" =>  8213,
            "52989" =>  18547,
            "53035" =>  18508,
            "55364" =>  152409,
            "56727" =>  141751,
            "56736" =>  130554,
            "56782" =>  140780,
            "57477" =>  140841,
            "57510" =>  140918,
            "59834" =>  3724,
            "61280" =>  130374,
            "61284" =>  130357,
            "61421" =>  6700,
            "61460" =>  130472,
            "61496" =>  130266,
            "61534" =>  141802,
            "61666" =>  142225,
            "63091" =>  18736,
            "63112" =>  120248,
            "63785" =>  120255,
            "64722" =>  79313,
            "73242" =>  152410,
            "74468" =>  2849,
            "78813" =>  89402,
            "79940" =>  2164,
            "80048" =>  141837,
            "10424" =>  8438,
            "10517" =>  1897,
            "10583" =>  6843,
            "10590" =>  7170,
            "11082" =>  7349,
            "13328" =>  1631,
            "13517" =>  3664,
            "13911" =>  1829,
            "14510" =>  3670,
            "18426" =>  2394,
            "20585" =>  100063,
            "20866" =>  3255,
            "20868" =>  2392,
            "20876" =>  130459,
            "20887" =>  1659,
            "20920" =>  3846,
            "20947" =>  1504,
            "21011" =>  5998,
            "21014" =>  6967,
            "21020" =>  1693,
            "21032" =>  1586,
            "21066" =>  1716,
            "21144" =>  1687,
            "21180" =>  8371,
            "21212" =>  7316,
            "21275" =>  2789,
            "21421" =>  7086,
            "21526" =>  7860,
            "21642" =>  5215,
            "21653" =>  1503,
            "21749" =>  3218,
            "21806" =>  2393,
            "22172" =>  1984,
            "22377" =>  39086,
            "22423" =>  8291,
            "22486" =>  5773,
            "22489" =>  6314,
            "22566" =>  2418,
            "22623" =>  8290,
            "22627" =>  6785,
            "22636" =>  6172,
            "22670" =>  5156,
            "22674" =>  4822,
            "22713" =>  1820,
            "22718" =>  6694,
            "22720" =>  5143,
            "22721" =>  79326,
            "22765" =>  4895,
            "22778" =>  2895,
            "22808" =>  2136,
            "22809" =>  8048,
            "22822" =>  6366,
            "22843" =>  3831,
            "22870" =>  6334,
            "22886" =>  3555,
            "22891" =>  6596,
            "22895" =>  3097,
            "22935" =>  18561,
            "22937" =>  2071,
            "22938" =>  2200,
            "22941" =>  4188,
            "22942" =>  4405,
            "22960" =>  5479,
            "23065" =>  7771,
            "23104" =>  5171,
            "23106" =>  3340,
            "23114" =>  7099,
            "23159" =>  2305,
            "23208" =>  5449,
            "23209" =>  8008,
            "23251" =>  89408,
            "23271" =>  1600,
            "23275" =>  7665,
            "23281" =>  49148,
            "23286" =>  130288,
            "23312" =>  1971,
            "23319" =>  2623,
            "23345" =>  6138,
            "23373" =>  7072,
            "23375" =>  2184,
            "23376" =>  8262,
            "23379" =>  5850,
            "23407" =>  3778,
            "23449" =>  8486,
            "23453" =>  5506,
            "23459" =>  4708,
            "23466" =>  2239,
            "23480" =>  7379,
            "23484" =>  2672,
            "23488" =>  8299,
            "23503" =>  4781,
            "23509" =>  3765,
            "23510" =>  1906,
            "23515" =>  6569,
            "23516" =>  4125,
            "23531" =>  4116,
            "23560" =>  4476,
            "23567" =>  4937,
            "23577" =>  7869,
            "23582" =>  5030,
            "23643" =>  6491,
            "23669" =>  5430,
            "23707" =>  2538,
            "23735" =>  5922,
            "23736" =>  6070,
            "23748" =>  5144,
            "23753" =>  38933,
            "23788" =>  4613,
            "23795" =>  7107,
            "23799" =>  18515,
            "23826" =>  2866,
            "23923" =>  1966,
            "23924" =>  1967,
            "23930" =>  5165,
            "23981" =>  4788,
            "24001" =>  2133,
            "24032" =>  4487,
            "24035" =>  5679,
            "24042" =>  6369,
            "24161" =>  4965,
            "24169" =>  1481,
            "24193" =>  1484,
            "24221" =>  1487,
            "24236" =>  5256,
            "24237" =>  1492,
            "24238" =>  5032,
            "24275" =>  8169,
            "24276" =>  7544,
            "24298" =>  3243,
            "24303" =>  7804,
            "24316" =>  6072,
            "24361" =>  142335,
            "24364" =>  6171,
            "24369" =>  7847,
            "24382" =>  4924,
            "24412" =>  99672,
            "24415" =>  7888,
            "24417" =>  1534,
            "24429" =>  8240,
            "24452" =>  8347,
            "24472" =>  5854,
            "24474" =>  6784,
            "24519" =>  3656,
            "24548" =>  5667,
            "24571" =>  4662,
            "24763" =>  89375,
            "24783" =>  4536,
            "24792" =>  4791,
            "24869" =>  4382,
            "24896" =>  7264,
            "24901" =>  3111,
            "24953" =>  99942,
            "25012" =>  6612,
            "25163" =>  6887,
            "25166" =>  3002,
            "25190" =>  1533,
            "25191" =>  141271,
            "25232" =>  3204,
            "25312" =>  1536,
            "25356" =>  28893,
            "25357" =>  4983,
            "25359" =>  5365,
            "25431" =>  3391,
            "25481" =>  18622,
            "25482" =>  2754,
            "25529" =>  28782,
            "25563" =>  1620,
            "25645" =>  7201,
            "25667" =>  6401,
            "25673" =>  7036,
            "25685" =>  5458,
            "25693" =>  28863,
            "25697" =>  3760,
            "25698" =>  130405,
            "25703" =>  5319,
            "25710" =>  5462,
            "25754" =>  3235,
            "25794" =>  8134,
            "25858" =>  7855,
            "25889" =>  2186,
            "25906" =>  2528,
            "25910" =>  7071,
            "25954" =>  4472,
            "25983" =>  2277,
            "26023" =>  8485,
            "26025" =>  3213,
            "26058" =>  7950,
            "26130" =>  7806,
            "26139" =>  5737,
            "26162" =>  3224,
            "26164" =>  4279,
            "26190" =>  7088,
            "26191" =>  7053,
            "26220" =>  5519,
            "26233" =>  7960,
            "26246" =>  1599,
            "26365" =>  3581,
            "26426" =>  1622,
            "26478" =>  1629,
            "26479" =>  1630,
            "26582" =>  3914,
            "26604" =>  2431,
            "26614" =>  8455,
            "26625" =>  3060,
            "26686" =>  7628,
            "26698" =>  2878,
            "26718" =>  1646,
            "26740" =>  28827,
            "26771" =>  6584,
            "26800" =>  3798,
            "26814" =>  7255,
            "26826" =>  6566,
            "26853" =>  5473,
            "26854" =>  2902,
            "26870" =>  5841,
            "26891" =>  4549,
            "26920" =>  2774,
            "26923" =>  7188,
            "26949" =>  3639,
            "26972" =>  3857,
            "26976" =>  3223,
            "26982" =>  4370,
            "26992" =>  8350,
            "27008" =>  1672,
            "27011" =>  18568,
            "27012" =>  6058,
            "27017" =>  7773,
            "27018" =>  2723,
            "27019" =>  2722,
            "27026" =>  2383,
            "27033" =>  4548,
            "27055" =>  7955,
            "27066" =>  3051,
            "27075" =>  1774,
            "27092" =>  7842,
            "27103" =>  39078,
            "27201" =>  99622,
            "27204" =>  7705,
            "27211" =>  1948,
            "27215" =>  1929,
            "27217" =>  1969,
            "27298" =>  7581,
            "27300" =>  7562,
            "27305" =>  3030,
            "27311" =>  8392,
            "27316" =>  3098,
            "27322" =>  3860,
            "27328" =>  7121,
            "27341" =>  2835,
            "27380" =>  3692,
            "27417" =>  2859,
            "27420" =>  7147,
            "27422" =>  2910,
            "27443" =>  2318,
            "27453" =>  1750,
            "27455" =>  3371,
            "27471" =>  1757,
            "27477" =>  5533,
            "27579" =>  8033,
            "27581" =>  69212,
            "27620" =>  3643,
            "27638" =>  7069,
            "27640" =>  4443,
            "27683" =>  2362,
            "27690" =>  4277,
            "27691" =>  4811,
            "27697" =>  2783,
            "27711" =>  7211,
            "27712" =>  7108,
            "27717" =>  6128,
            "27754" =>  142199,
            "27756" =>  7922,
            "27776" =>  3120,
            "27795" =>  7524,
            "27803" =>  4891,
            "27808" =>  8318,
            "27810" =>  7335,
            "27815" =>  3510,
            "27820" =>  5615,
            "27857" =>  8070,
            "27862" =>  4567,
            "27901" =>  4837,
            "27902" =>  6473,
            "27945" =>  7100,
            "27987" =>  1949,
            "28001" =>  4425,
            "28007" =>  5390,
            "28028" =>  18609,
            "28095" =>  5920,
            "28096" =>  2009,
            "28111" =>  7382,
            "28117" =>  7075,
            "28120" =>  3465,
            "28123" =>  4919,
            "28124" =>  4337,
            "28131" =>  4894,
            "28141" =>  7143,
            "28144" =>  3764,
            "28158" =>  69291,
            "28216" =>  141236,
            "28249" =>  1890,
            "28250" =>  7856,
            "28255" =>  8314,
            "28325" =>  5438,
            "28330" =>  4848,
            "28344" =>  2029,
            "28353" =>  7825,
            "28355" =>  3054,
            "28361" =>  7795,
            "28369" =>  3862,
            "28423" =>  6501,
            "28436" =>  7380,
            "28459" =>  6097,
            "28462" =>  4236,
            "28478" =>  3953,
            "28490" =>  3389,
            "28516" =>  1830,
            "28543" =>  4864,
            "28546" =>  38960,
            "28557" =>  2000,
            "28588" =>  69274,
            "28591" =>  7074,
            "28613" =>  5484,
            "28627" =>  6339,
            "28639" =>  4663,
            "28689" =>  6092,
            "28692" =>  4346,
            "28698" =>  3248,
            "28725" =>  3981,
            "28765" =>  6891,
            "28802" =>  3493,
            "28809" =>  3195,
            "28815" =>  5363,
            "28841" =>  39145,
            "28844" =>  7845,
            "28845" =>  69204,
            "28869" =>  89392,
            "28880" =>  3642,
            "28882" =>  3641,
            "28898" =>  5959,
            "28929" =>  5467,
            "28930" =>  4880,
            "28938" =>  7798,
            "28943" =>  1851,
            "28970" =>  2342,
            "28976" =>  2454,
            "28992" =>  5134,
            "28996" =>  18517,
            "29016" =>  2384,
            "29043" =>  28844,
            "29076" =>  7228,
            "29077" =>  8380,
            "29087" =>  3227,
            "29093" =>  8473,
            "29111" =>  39144,
            "29115" =>  8358,
            "29125" =>  7419,
            "29126" =>  2378,
            "29136" =>  5942,
            "29167" =>  2128,
            "29173" =>  8228,
            "29203" =>  3564,
            "29230" =>  3776,
            "29231" =>  3585,
            "29245" =>  8337,
            "29248" =>  2903,
            "29269" =>  4506,
            "29300" =>  6512,
            "29303" =>  2390,
            "29323" =>  7493,
            "29347" =>  8423,
            "29370" =>  7975,
            "29376" =>  8328,
            "29484" =>  18514,
            "29487" =>  3291,
            "29544" =>  2125,
            "29550" =>  4676,
            "29565" =>  2516,
            "29605" =>  1951,
            "29632" =>  1962,
            "29682" =>  2794,
            "29707" =>  3448,
            "29718" =>  6031,
            "29720" =>  3461,
            "29746" =>  4647,
            "29753" =>  3923,
            "29754" =>  4801,
            "29767" =>  3220,
            "29778" =>  39005,
            "29782" =>  6526,
            "29794" =>  1992,
            "29825" =>  5228,
            "29827" =>  6564,
            "29842" =>  8170,
            "29847" =>  6772,
            "29851" =>  4603,
            "29862" =>  3556,
            "29874" =>  4687,
            "29895" =>  8317,
            "29905" =>  100038,
            "29923" =>  3980,
            "29935" =>  2155,
            "29940" =>  2437,
            "29944" =>  6787,
            "29950" =>  7803,
            "29953" =>  6008,
            "29963" =>  2702,
            "29978" =>  2637,
            "29990" =>  3404,
            "29992" =>  2345,
            "30094" =>  7756,
            "30095" =>  7887,
            "30111" =>  2652,
            "30112" =>  4067,
            "30132" =>  2499,
            "30161" =>  6080,
            "30185" =>  6340,
            "30202" =>  3941,
            "30222" =>  2603,
            "30228" =>  6302,
            "30232" =>  3230,
            "30234" =>  3477,
            "30281" =>  28903,
            "30311" =>  8368,
            "30361" =>  3611,
            "30362" =>  3232,
            "30405" =>  2435,
            "30406" =>  2321,
            "30415" =>  4800,
            "30417" =>  7444,
            "30434" =>  2414,
            "30437" =>  7784,
            "30443" =>  5108,
            "30451" =>  2713,
            "30464" =>  4142,
            "30475" =>  8327,
            "30486" =>  5827,
            "30500" =>  3467,
            "30645" =>  18563,
            "30648" =>  6857,
            "30777" =>  3898,
            "30831" =>  2599,
            "30842" =>  2275,
            "30843" =>  4386,
            "30911" =>  2309,
            "30951" =>  2577,
            "30960" =>  2427,
            "30961" =>  3124,
            "31039" =>  142018,
            "31056" =>  7435,
            "31075" =>  2688,
            "31096" =>  49149,
            "31135" =>  2331,
            "31151" =>  2495,
            "31154" =>  4500,
            "31206" =>  2396,
            "31207" =>  2461,
            "31209" =>  2488,
            "31223" =>  8497,
            "31246" =>  2376,
            "31267" =>  2341,
            "31272" =>  4538,
            "31282" =>  3136,
            "31292" =>  2490,
            "31293" =>  2471,
            "31310" =>  4112,
            "31315" =>  2567,
            "31318" =>  2325,
            "31409" =>  3758,
            "31450" =>  8384,
            "31452" =>  3578,
            "31455" =>  2565,
            "31517" =>  8155,
            "31554" =>  7788,
            "31570" =>  2938,
            "31595" =>  3142,
            "31627" =>  89449,
            "31631" =>  8174,
            "31633" =>  7908,
            "31646" =>  3428,
            "31653" =>  3322,
            "31671" =>  4189,
            "31720" =>  5482,
            "31722" =>  3253,
            "31791" =>  130518,
            "31810" =>  5835,
            "31839" =>  2955,
            "31840" =>  2848,
            "31854" =>  7231,
            "31856" =>  3757,
            "31862" =>  2726,
            "31896" =>  3298,
            "31924" =>  2611,
            "31927" =>  8249,
            "31930" =>  4392,
            "31931" =>  2994,
            "31939" =>  6368,
            "31945" =>  5316,
            "31952" =>  2661,
            "31986" =>  141632,
            "31996" =>  4092,
            "31999" =>  28777,
            "32035" =>  7029,
            "32070" =>  5240,
            "32078" =>  4009,
            "32082" =>  3472,
            "32083" =>  4218,
            "32094" =>  2793,
            "32100" =>  140947,
            "32102" =>  4028,
            "32104" =>  3189,
            "32105" =>  6367,
            "32176" =>  2535,
            "32225" =>  18527,
            "32248" =>  38935,
            "32276" =>  7873,
            "32279" =>  7800,
            "32282" =>  6516,
            "32312" =>  6030,
            "32401" =>  4875,
            "32409" =>  2969,
            "32410" =>  3096,
            "32463" =>  7169,
            "32467" =>  6356,
            "32475" =>  6615,
            "32557" =>  39019,
            "32584" =>  141320,
            "32639" =>  5833,
            "32642" =>  8179,
            "32761" =>  3206,
            "32762" =>  3145,
            "32764" =>  2900,
            "32805" =>  3233,
            "32891" =>  2872,
            "32894" =>  3943,
            "32897" =>  7510,
            "32902" =>  7959,
            "32903" =>  6858,
            "32904" =>  4694,
            "32917" =>  2719,
            "32919" =>  3299,
            "32924" =>  5711,
            "32925" =>  4428,
            "32951" =>  2956,
            "32986" =>  4272,
            "32991" =>  3533,
            "33042" =>  18539,
            "33056" =>  130287,
            "33152" =>  130455,
            "33177" =>  2775,
            "33226" =>  4641,
            "33239" =>  8333,
            "33242" =>  7790,
            "33244" =>  2615,
            "33291" =>  5295,
            "33331" =>  2867,
            "33361" =>  4029,
            "33387" =>  3370,
            "33409" =>  3252,
            "33434" =>  7848,
            "33480" =>  3203,
            "33493" =>  3743,
            "33534" =>  6066,
            "33569" =>  2913,
            "33659" =>  3386,
            "33662" =>  2840,
            "33669" =>  7797,
            "33684" =>  2918,
            "33687" =>  6047,
            "33701" =>  4597,
            "33702" =>  3759,
            "33707" =>  3187,
            "33726" =>  2869,
            "33755" =>  2912,
            "33769" =>  3478,
            "33779" =>  2921,
            "33792" =>  3076,
            "33793" =>  4607,
            "33814" =>  7840,
            "33819" =>  3164,
            "33832" =>  4122,
            "33845" =>  4749,
            "33847" =>  5268,
            "33851" =>  3524,
            "33855" =>  3323,
            "33864" =>  99583,
            "33866" =>  4225,
            "33870" =>  3672,
            "33872" =>  3188,
            "33874" =>  8472,
            "33889" =>  2888,
            "33893" =>  8182,
            "33894" =>  3091,
            "33903" =>  4255,
            "33916" =>  4050,
            "34014" =>  8241,
            "34015" =>  7405,
            "34026" =>  2947,
            "34035" =>  2953,
            "34066" =>  3269,
            "34099" =>  3157,
            "34103" =>  4491,
            "34108" =>  8265,
            "34122" =>  3506,
            "34161" =>  3197,
            "34170" =>  6696,
            "34213" =>  3412,
            "34220" =>  3633,
            "34299" =>  4212,
            "34326" =>  3927,
            "34335" =>  5131,
            "34337" =>  5350,
            "34344" =>  6086,
            "34348" =>  7224,
            "34356" =>  7229,
            "34359" =>  3602,
            "34377" =>  3492,
            "34389" =>  3530,
            "34418" =>  3549,
            "34446" =>  4570,
            "34449" =>  4978,
            "34450" =>  8143,
            "34452" =>  6337,
            "34461" =>  3560,
            "34465" =>  7809,
            "34469" =>  3622,
            "34472" =>  5427,
            "34483" =>  3805,
            "34495" =>  4668,
            "34503" =>  5503,
            "34507" =>  4789,
            "34510" =>  5736,
            "34526" =>  6431,
            "34545" =>  7614,
            "34562" =>  4176,
            "34563" =>  4974,
            "34640" =>  3905,
            "34711" =>  3931,
            "34717" =>  3682,
            "34720" =>  3645,
            "34726" =>  3686,
            "34754" =>  5202,
            "34802" =>  4684,
            "34803" =>  4785,
            "34809" =>  7813,
            "34812" =>  5554,
            "34816" =>  3967,
            "34833" =>  5000,
            "34834" =>  3826,
            "34865" =>  4330,
            "34879" =>  4072,
            "34908" =>  18511,
            "34922" =>  3762,
            "34933" =>  4490,
            "34955" =>  18607,
            "34966" =>  5463,
            "34989" =>  4227,
            "34991" =>  4240,
            "34998" =>  4200,
            "35057" =>  5311,
            "35065" =>  4002,
            "35074" =>  4042,
            "35116" =>  5720,
            "35203" =>  4329,
            "35205" =>  4259,
            "35220" =>  4606,
            "35221" =>  4403,
            "35222" =>  4449,
            "35243" =>  4353,
            "35372" =>  4107,
            "35429" =>  7519,
            "35539" =>  4503,
            "35578" =>  4441,
            "35585" =>  4347,
            "35623" =>  6879,
            "35671" =>  4450,
            "35680" =>  4379,
            "35765" =>  4633,
            "35848" =>  4804,
            "35879" =>  4423,
            "35911" =>  39135,
            "35922" =>  5122,
            "35935" =>  8393,
            "35939" =>  6503,
            "35941" =>  4994,
            "35955" =>  4751,
            "35975" =>  5923,
            "36000" =>  4595,
            "36013" =>  4492,
            "36029" =>  6155,
            "36038" =>  8303,
            "36041" =>  4475,
            "36062" =>  4631,
            "36064" =>  4418,
            "36082" =>  5613,
            "36094" =>  5087,
            "36126" =>  5298,
            "36133" =>  5055,
            "36135" =>  6085,
            "36162" =>  7801,
            "36222" =>  8191,
            "36226" =>  5510,
            "36239" =>  6386,
            "36258" =>  7901,
            "36326" =>  6758,
            "36329" =>  4910,
            "36333" =>  8250,
            "36397" =>  6852,
            "36407" =>  5766,
            "36469" =>  5299,
            "36477" =>  4817,
            "36481" =>  6235,
            "36492" =>  38994,
            "36501" =>  6994,
            "36585" =>  7998,
            "36682" =>  18562,
            "36721" =>  6382,
            "36735" =>  5016,
            "36751" =>  18625,
            "36768" =>  4843,
            "36769" =>  7187,
            "36783" =>  5127,
            "36794" =>  4898,
            "36802" =>  8144,
            "36804" =>  5068,
            "36807" =>  8227,
            "36824" =>  5072,
            "36830" =>  4859,
            "36841" =>  8064,
            "36857" =>  6238,
            "36865" =>  4862,
            "36898" =>  6951,
            "36967" =>  5238,
            "36980" =>  6214,
            "37025" =>  18523,
            "37038" =>  69272,
            "37055" =>  7793,
            "37058" =>  69290,
            "37065" =>  6610,
            "37069" =>  89376,
            "37108" =>  4957,
            "37162" =>  6126,
            "37193" =>  69275,
            "37223" =>  6822,
            "37242" =>  5318,
            "37246" =>  7063,
            "37252" =>  7814,
            "37279" =>  5553,
            "37325" =>  7431,
            "37330" =>  5569,
            "37411" =>  5599,
            "37412" =>  6939,
            "37441" =>  7775,
            "37448" =>  8103,
            "37470" =>  7103,
            "37473" =>  6540,
            "37531" =>  18591,
            "37581" =>  5182,
            "37582" =>  4775,
            "37604" =>  18747,
            "37605" =>  18748,
            "37635" =>  7930,
            "37679" =>  4920,
            "37683" =>  7426,
            "37702" =>  7835,
            "37714" =>  7818,
            "37723" =>  18564,
            "37843" =>  6884,
            "37922" =>  8186,
            "37944" =>  5746,
            "37965" =>  5466,
            "37969" =>  8118,
            "38105" =>  5431,
            "38167" =>  6042,
            "38228" =>  7970,
            "38230" =>  8175,
            "38273" =>  5061,
            "38381" =>  7889,
            "38385" =>  7915,
            "38390" =>  7112,
            "38405" =>  6535,
            "38494" =>  5651,
            "38640" =>  7952,
            "38649" =>  18583,
            "38873" =>  6896,
            "38892" =>  2959,
            "38940" =>  8075,
            "38963" =>  6333,
            "38983" =>  8466,
            "39015" =>  8203,
            "39045" =>  18602,
            "39047" =>  8222,
            "39085" =>  7792,
            "39095" =>  2148,
            "39122" =>  38958,
            "39148" =>  5840,
            "39154" =>  6759,
            "39174" =>  7985,
            "39175" =>  7199,
            "39182" =>  8404,
            "39254" =>  18532,
            "39435" =>  5967,
            "39441" =>  7935,
            "39448" =>  5081,
            "39494" =>  5997,
            "39588" =>  6508,
            "39605" =>  7310,
            "39682" =>  8330,
            "39683" =>  7081,
            "39908" =>  6162,
            "39940" =>  6794,
            "39994" =>  39067,
            "40035" =>  6241,
            "40074" =>  6237,
            "40186" =>  7314,
            "40264" =>  7890,
            "40310" =>  89364,
            "40322" =>  7785,
            "40326" =>  7786,
            "40327" =>  38966,
            "40371" =>  6833,
            "40403" =>  38912,
            "40410" =>  28829,
            "40422" =>  8339,
            "40551" =>  18697,
            "40621" =>  7972,
            "40647" =>  18702,
            "40730" =>  6050,
            "40789" =>  6872,
            "40986" =>  99698,
            "41025" =>  5719,
            "41090" =>  89359,
            "41148" =>  39084,
            "41284" =>  39051,
            "41380" =>  18545,
            "41421" =>  8079,
            "41500" =>  18605,
            "41572" =>  5192,
            "41851" =>  7367,
            "41929" =>  6453,
            "41937" =>  8496,
            "42086" =>  8199,
            "42346" =>  7968,
            "42383" =>  6484,
            "42409" =>  6961,
            "42416" =>  7836,
            "42459" =>  7284,
            "42905" =>  5366,
            "43334" =>  7591,
            "43442" =>  8077,
            "43488" =>  7604,
            "43711" =>  5940,
            "43811" =>  7421,
            "43813" =>  18616,
            "43838" =>  6384,
            "43842" =>  8361,
            "43846" =>  8480,
            "43853" =>  8251,
            "43859" =>  8189,
            "43863" =>  7590,
            "43867" =>  7828,
            "43878" =>  6561,
            "43993" =>  99686,
            "44017" =>  7552,
            "44031" =>  4709,
            "45319" =>  5980,
            "45796" =>  6181,
            "46122" =>  5581,
            "46726" =>  6648,
            "46772" =>  8322,
            "47547" =>  141118,
            "47597" =>  6037,
            "48010" =>  6174,
            "48020" =>  38998,
            "48761" =>  6371,
            "49906" =>  2027,
            "49910" =>  2066,
            "49912" =>  2330,
            "50566" =>  6632,
            "50586" =>  6656,
            "51722" =>  6692,
            "52241" =>  7475,
            "52482" =>  6705,
            "52777" =>  18671,
            "52784" =>  7096,
            "52810" =>  8452,
            "52823" =>  7306,
            "52825" =>  7463,
            "52876" =>  7811,
            "52888" =>  7974,
            "52913" =>  8035,
            "52924" =>  8133,
            "52928" =>  8173,
            "52943" =>  8220,
            "52958" =>  8194,
            "53063" =>  18614,
            "53066" =>  18526,
            "64467" =>  1505,
            "64502" =>  141274,
            "64800" =>  1715,
            "64848" =>  3838,
            "64901" =>  6466,
            "65017" =>  1770,
            "66298" =>  99567,
            "66519" =>  1724,
            "76318" =>  4678,
            "76682" =>  141428,
            "76948" =>  4999,
            "80342" =>  2115,
            "81033" =>  3525,
            "10020" =>  28773,
            "10480" =>  2521,
            "10488" =>  4860,
            "10897" =>  2252,
            "11063" =>  2054,
            "11443" =>  38957,
            "11718" =>  140934,
            "11912" =>  1783,
            "11959" =>  5386,
            "12234" =>  5487,
            "12377" =>  3515,
            "13476" =>  18763,
            "13492" =>  7999,
            "13527" =>  6771,
            "13652" =>  39033,
            "13665" =>  2025,
            "13666" =>  3912,
            "13682" =>  140694,
            "13862" =>  3746,
            "13888" =>  140625,
            "13959" =>  1762,
            "14053" =>  38910,
            "14097" =>  2929,
            "14272" =>  7210,
            "14481" =>  39017,
            "14616" =>  7744,
            "14716" =>  2483,
            "14793" =>  4451,
            "14816" =>  3784,
            "15615" =>  142273,
            "16057" =>  7459,
            "16579" =>  1873,
            "16625" =>  7694,
            "18798" =>  5617,
            "19401" =>  3909,
            "19766" =>  7277,
            "20473" =>  5753,
            "20567" =>  39118,
            "20692" =>  1795,
            "20712" =>  140971,
            "20758" =>  3311,
            "20767" =>  8321,
            "20776" =>  7449,
            "20781" =>  2084,
            "20788" =>  1723,
            "20800" =>  7865,
            "20804" =>  4374,
            "20806" =>  1959,
            "20825" =>  1721,
            "20835" =>  141281,
            "20859" =>  3957,
            "20888" =>  89419,
            "20899" =>  8151,
            "20900" =>  89356,
            "20913" =>  5860,
            "20916" =>  7839,
            "20924" =>  8157,
            "20938" =>  3099,
            "20941" =>  2234,
            "20949" =>  2015,
            "20964" =>  28853,
            "20972" =>  3088,
            "20976" =>  1935,
            "21012" =>  1811,
            "21017" =>  4669,
            "21026" =>  3607,
            "21034" =>  4221,
            "21039" =>  2808,
            "21076" =>  8488,
            "21086" =>  2226,
            "21087" =>  3420,
            "21106" =>  142245,
            "21107" =>  4339,
            "21110" =>  28854,
            "21113" =>  141258,
            "21114" =>  1678,
            "21150" =>  1753,
            "21159" =>  4461,
            "21162" =>  2679,
            "21168" =>  1688,
            "21222" =>  3325,
            "21226" =>  141734,
            "21241" =>  2121,
            "21242" =>  2145,
            "21273" =>  1518,
            "21280" =>  2750,
            "21292" =>  5002,
            "21293" =>  1691,
            "21334" =>  8156,
            "21363" =>  1553,
            "21412" =>  3059,
            "21425" =>  1732,
            "21523" =>  3077,
            "21544" =>  1777,
            "21566" =>  141359,
            "21576" =>  1755,
            "21577" =>  4815,
            "21606" =>  69244,
            "21662" =>  1708,
            "21680" =>  141291,
            "21684" =>  1734,
            "21711" =>  8482,
            "21712" =>  1482,
            "21713" =>  1546,
            "21737" =>  1930,
            "21751" =>  152396,
            "21766" =>  2351,
            "21770" =>  2756,
            "21771" =>  6723,
            "21775" =>  4527,
            "21791" =>  7776,
            "21796" =>  2817,
            "21804" =>  1689,
            "21807" =>  1626,
            "21808" =>  8376,
            "21843" =>  4589,
            "21846" =>  3365,
            "21853" =>  99953,
            "21860" =>  3833,
            "21867" =>  99703,
            "21869" =>  140606,
            "21876" =>  3531,
            "21913" =>  99558,
            "21945" =>  5210,
            "21957" =>  3949,
            "21959" =>  3016,
            "21962" =>  3367,
            "21979" =>  8498,
            "21986" =>  1908,
            "21990" =>  3390,
            "22000" =>  2131,
            "22002" =>  7953,
            "22190" =>  1791,
            "22197" =>  38976,
            "22201" =>  7991,
            "22213" =>  3567,
            "22215" =>  28909,
            "22216" =>  2095,
            "22217" =>  6306,
            "22218" =>  130410,
            "22222" =>  2235,
            "22223" =>  7372,
            "22226" =>  4316,
            "22229" =>  7500,
            "22231" =>  5258,
            "22232" =>  2634,
            "22233" =>  4710,
            "22256" =>  4854,
            "22270" =>  3159,
            "22275" =>  3813,
            "22281" =>  3138,
            "22339" =>  6729,
            "22345" =>  7824,
            "22378" =>  3948,
            "22409" =>  6623,
            "22418" =>  2648,
            "22425" =>  1794,
            "22427" =>  1645,
            "22429" =>  3820,
            "22443" =>  4867,
            "22447" =>  5092,
            "22451" =>  18737,
            "22453" =>  142237,
            "22468" =>  5198,
            "22473" =>  7209,
            "22536" =>  3303,
            "22695" =>  6861,
            "22702" =>  28872,
            "22709" =>  18767,
            "22723" =>  7193,
            "22725" =>  28802,
            "22726" =>  4206,
            "22736" =>  8129,
            "22779" =>  1917,
            "22814" =>  3397,
            "22815" =>  6186,
            "22817" =>  5964,
            "22820" =>  3792,
            "22833" =>  5079,
            "22836" =>  5293,
            "22906" =>  3997,
            "22971" =>  4359,
            "22982" =>  2463,
            "22988" =>  4796,
            "22991" =>  3518,
            "22994" =>  5302,
            "23006" =>  4840,
            "23016" =>  4611,
            "23027" =>  5033,
            "23036" =>  4833,
            "23039" =>  2259,
            "23043" =>  2919,
            "23044" =>  2453,
            "23057" =>  7267,
            "23126" =>  3093,
            "23140" =>  99705,
            "23171" =>  8307,
            "23174" =>  3052,
            "23199" =>  152406,
            "23219" =>  18685,
            "23229" =>  4130,
            "23282" =>  1841,
            "23296" =>  2728,
            "23308" =>  2086,
            "23357" =>  5432,
            "23448" =>  6338,
            "23537" =>  6378,
            "23644" =>  4943,
            "23679" =>  8214,
            "23691" =>  4105,
            "23693" =>  5916,
            "23716" =>  6498,
            "23725" =>  1644,
            "23789" =>  2981,
            "23791" =>  6322,
            "23801" =>  5731,
            "23929" =>  100040,
            "24005" =>  7025,
            "24014" =>  1549,
            "24015" =>  6750,
            "24017" =>  2874,
            "24018" =>  3286,
            "24033" =>  1667,
            "24034" =>  1577,
            "24041" =>  7457,
            "24133" =>  1836,
            "24140" =>  2894,
            "24172" =>  3363,
            "24196" =>  1566,
            "24239" =>  1634,
            "24242" =>  1491,
            "24291" =>  5044,
            "24302" =>  7422,
            "24314" =>  1662,
            "24388" =>  5441,
            "24394" =>  6169,
            "24405" =>  3947,
            "24407" =>  4853,
            "24413" =>  1674,
            "24414" =>  8177,
            "24419" =>  18629,
            "24424" =>  1731,
            "24506" =>  1512,
            "24513" =>  1515,
            "24518" =>  6609,
            "24574" =>  2799,
            "24575" =>  6773,
            "24637" =>  7896,
            "24638" =>  1526,
            "24689" =>  39043,
            "24752" =>  3553,
            "24802" =>  2904,
            "24813" =>  3504,
            "25007" =>  5598,
            "25041" =>  6611,
            "25049" =>  3880,
            "25052" =>  6385,
            "25056" =>  7265,
            "25105" =>  2512,
            "25131" =>  3122,
            "25144" =>  8273,
            "25147" =>  2202,
            "25290" =>  3084,
            "25317" =>  6551,
            "25329" =>  6831,
            "25330" =>  2568,
            "25347" =>  4098,
            "25378" =>  4909,
            "25386" =>  1540,
            "25397" =>  2219,
            "25403" =>  18658,
            "25409" =>  4463,
            "25415" =>  1543,
            "25416" =>  3024,
            "25422" =>  28774,
            "25434" =>  2767,
            "25435" =>  7415,
            "25458" =>  3710,
            "25478" =>  7963,
            "25489" =>  4415,
            "25499" =>  3519,
            "25500" =>  2718,
            "25505" =>  3675,
            "25517" =>  18701,
            "25522" =>  142292,
            "25528" =>  89344,
            "25571" =>  3364,
            "25581" =>  5039,
            "25646" =>  7843,
            "25701" =>  141086,
            "25708" =>  39129,
            "25716" =>  2957,
            "25725" =>  3317,
            "25738" =>  4908,
            "25766" =>  1558,
            "25773" =>  7269,
            "25775" =>  3956,
            "25779" =>  1563,
            "25837" =>  141755,
            "25866" =>  1571,
            "25876" =>  7213,
            "25897" =>  18690,
            "25914" =>  7318,
            "25973" =>  6575,
            "25979" =>  5673,
            "26026" =>  3873,
            "26028" =>  3490,
            "26029" =>  5783,
            "26032" =>  2522,
            "26037" =>  7436,
            "26054" =>  5735,
            "26056" =>  4448,
            "26066" =>  1584,
            "26082" =>  6317,
            "26117" =>  28897,
            "26146" =>  2986,
            "26147" =>  3569,
            "26229" =>  2946,
            "26232" =>  3008,
            "26235" =>  4401,
            "26236" =>  2642,
            "26253" =>  8226,
            "26262" =>  39036,
            "26316" =>  4172,
            "26373" =>  3459,
            "26466" =>  7478,
            "26517" =>  3300,
            "26519" =>  4794,
            "26521" =>  1793,
            "26528" =>  2062,
            "26549" =>  4981,
            "26591" =>  3205,
            "26595" =>  99472,
            "26628" =>  3347,
            "26633" =>  3211,
            "26637" =>  4193,
            "26642" =>  39107,
            "26651" =>  7868,
            "26700" =>  7560,
            "26701" =>  1643,
            "26742" =>  2482,
            "26752" =>  1698,
            "26785" =>  130539,
            "26786" =>  5832,
            "26787" =>  3872,
            "26789" =>  8462,
            "26799" =>  18709,
            "26830" =>  7394,
            "26841" =>  6593,
            "26842" =>  142301,
            "26847" =>  1653,
            "26863" =>  89417,
            "26866" =>  5163,
            "26871" =>  4014,
            "26899" =>  1658,
            "26912" =>  7429,
            "26914" =>  8382,
            "26916" =>  4265,
            "26941" =>  18617,
            "27054" =>  2410,
            "27057" =>  2281,
            "27062" =>  2026,
            "27069" =>  2763,
            "27074" =>  2573,
            "27076" =>  2185,
            "27098" =>  1713,
            "27143" =>  2704,
            "27202" =>  8469,
            "27216" =>  1702,
            "27221" =>  1916,
            "27228" =>  99591,
            "27229" =>  1706,
            "27265" =>  141761,
            "27301" =>  2276,
            "27338" =>  1726,
            "27351" =>  1881,
            "27361" =>  7774,
            "27472" =>  18567,
            "27486" =>  6588,
            "27495" =>  2504,
            "27509" =>  1884,
            "27513" =>  2296,
            "27521" =>  18727,
            "27536" =>  8381,
            "27544" =>  5745,
            "27546" =>  8110,
            "27574" =>  3344,
            "27584" =>  6654,
            "27586" =>  3447,
            "27610" =>  141713,
            "27612" =>  4712,
            "27619" =>  2564,
            "27645" =>  3405,
            "27662" =>  7892,
            "27664" =>  2364,
            "27676" =>  6345,
            "27700" =>  5807,
            "27706" =>  3331,
            "27707" =>  2257,
            "27722" =>  3545,
            "27737" =>  3417,
            "27741" =>  6347,
            "27763" =>  5889,
            "27781" =>  2221,
            "27804" =>  5706,
            "27809" =>  8481,
            "27848" =>  4546,
            "27849" =>  1898,
            "27873" =>  4731,
            "27883" =>  120217,
            "27903" =>  141166,
            "27910" =>  7353,
            "27936" =>  8006,
            "27940" =>  1804,
            "27950" =>  6650,
            "27961" =>  69273,
            "27979" =>  8200,
            "28027" =>  2146,
            "28031" =>  7895,
            "28033" =>  6110,
            "28042" =>  5083,
            "28061" =>  6722,
            "28077" =>  7338,
            "28101" =>  2710,
            "28147" =>  7280,
            "28148" =>  3419,
            "28169" =>  2388,
            "28175" =>  2935,
            "28234" =>  99800,
            "28243" =>  3897,
            "28245" =>  4235,
            "28252" =>  7894,
            "28254" =>  4437,
            "28271" =>  3101,
            "28291" =>  18770,
            "28318" =>  7534,
            "28321" =>  1926,
            "28335" =>  4963,
            "28340" =>  7296,
            "28410" =>  2300,
            "28453" =>  1996,
            "28456" =>  1964,
            "28482" =>  1938,
            "28497" =>  3894,
            "28518" =>  2965,
            "28519" =>  5118,
            "28549" =>  7789,
            "28558" =>  1963,
            "28563" =>  4813,
            "28566" =>  3618,
            "28605" =>  5936,
            "28609" =>  2179,
            "28625" =>  99524,
            "28642" =>  4282,
            "28660" =>  2047,
            "28695" =>  8094,
            "28715" =>  2428,
            "28719" =>  18729,
            "28724" =>  5227,
            "28738" =>  39032,
            "28739" =>  7212,
            "28743" =>  4216,
            "28761" =>  4692,
            "28767" =>  5749,
            "28768" =>  6792,
            "28789" =>  99547,
            "28791" =>  110125,
            "28797" =>  2519,
            "28798" =>  4397,
            "28806" =>  5683,
            "28853" =>  4929,
            "28862" =>  4319,
            "28934" =>  39010,
            "28953" =>  6741,
            "28957" =>  2285,
            "28961" =>  2426,
            "28962" =>  99704,
            "28964" =>  38913,
            "28977" =>  5857,
            "28978" =>  28906,
            "28990" =>  6403,
            "29004" =>  6045,
            "29026" =>  1860,
            "29029" =>  28857,
            "29032" =>  7078,
            "29060" =>  2830,
            "29105" =>  140919,
            "29106" =>  7934,
            "29142" =>  2663,
            "29145" =>  1991,
            "29149" =>  2019,
            "29150" =>  7424,
            "29157" =>  2983,
            "29163" =>  2044,
            "29179" =>  5357,
            "29225" =>  2382,
            "29277" =>  3250,
            "29285" =>  3899,
            "29287" =>  18734,
            "29313" =>  2290,
            "29340" =>  1985,
            "29341" =>  4868,
            "29343" =>  1987,
            "29368" =>  2189,
            "29379" =>  5020,
            "29394" =>  2028,
            "29408" =>  2472,
            "29415" =>  5391,
            "29418" =>  4667,
            "29478" =>  7498,
            "29511" =>  4215,
            "29524" =>  2653,
            "29537" =>  2291,
            "29569" =>  5076,
            "29576" =>  7250,
            "29577" =>  3392,
            "29606" =>  2742,
            "29609" =>  18670,
            "29610" =>  4321,
            "29614" =>  18512,
            "29616" =>  18534,
            "29624" =>  2474,
            "29630" =>  2479,
            "29644" =>  7033,
            "29655" =>  141835,
            "29661" =>  2444,
            "29662" =>  2168,
            "29666" =>  18739,
            "29681" =>  99566,
            "29688" =>  3934,
            "29715" =>  8297,
            "29722" =>  2386,
            "29726" =>  3246,
            "29735" =>  2932,
            "29736" =>  6945,
            "29738" =>  3648,
            "29742" =>  7359,
            "29772" =>  7220,
            "29783" =>  2515,
            "29791" =>  7494,
            "29801" =>  7266,
            "29821" =>  18551,
            "29837" =>  6602,
            "29855" =>  8353,
            "29876" =>  3434,
            "29882" =>  4387,
            "29896" =>  2192,
            "29912" =>  2165,
            "29919" =>  2176,
            "29927" =>  2413,
            "29934" =>  4087,
            "29948" =>  4807,
            "29954" =>  2298,
            "29972" =>  4334,
            "29977" =>  2286,
            "29989" =>  2787,
            "29997" =>  2647,
            "30012" =>  2822,
            "30018" =>  6647,
            "30023" =>  7009,
            "30024" =>  3256,
            "30026" =>  2057,
            "30027" =>  18543,
            "30048" =>  2315,
            "30056" =>  3436,
            "30066" =>  2458,
            "30068" =>  2477,
            "30105" =>  18633,
            "30110" =>  3279,
            "30137" =>  28899,
            "30138" =>  8047,
            "30170" =>  18644,
            "30188" =>  8037,
            "30191" =>  4452,
            "30207" =>  8447,
            "30210" =>  4349,
            "30211" =>  28885,
            "30224" =>  2167,
            "30227" =>  2370,
            "30237" =>  142167,
            "30242" =>  6102,
            "30247" =>  2638,
            "30250" =>  7928,
            "30253" =>  8433,
            "30254" =>  4106,
            "30258" =>  3554,
            "30269" =>  3108,
            "30275" =>  7852,
            "30289" =>  3609,
            "30301" =>  28905,
            "30307" =>  8205,
            "30315" =>  2313,
            "30316" =>  2680,
            "30320" =>  2546,
            "30325" =>  2505,
            "30326" =>  2279,
            "30330" =>  4966,
            "30331" =>  6372,
            "30340" =>  4127,
            "30343" =>  7297,
            "30395" =>  6432,
            "30400" =>  2596,
            "30402" =>  2356,
            "30412" =>  7870,
            "30414" =>  6711,
            "30427" =>  2265,
            "30455" =>  3222,
            "30458" =>  8115,
            "30461" =>  152373,
            "30524" =>  6253,
            "30526" =>  6576,
            "30531" =>  38938,
            "30534" =>  2667,
            "30554" =>  5895,
            "30562" =>  5468,
            "30563" =>  7488,
            "30578" =>  7572,
            "30594" =>  18576,
            "30595" =>  5799,
            "30608" =>  2915,
            "30614" =>  8060,
            "30617" =>  99481,
            "30618" =>  3589,
            "30622" =>  3292,
            "30625" =>  69216,
            "30629" =>  5806,
            "30642" =>  3082,
            "30711" =>  3200,
            "30719" =>  8216,
            "30738" =>  140900,
            "30770" =>  7989,
            "30795" =>  4088,
            "30826" =>  2261,
            "30834" =>  2372,
            "30835" =>  2373,
            "30838" =>  89400,
            "30846" =>  4968,
            "30870" =>  141944,
            "30886" =>  7822,
            "30912" =>  2658,
            "30937" =>  4226,
            "30982" =>  2743,
            "31014" =>  2868,
            "31016" =>  2361,
            "31041" =>  4876,
            "31061" =>  6358,
            "31062" =>  3302,
            "31063" =>  141601,
            "31106" =>  2705,
            "31107" =>  2464,
            "31108" =>  5154,
            "31116" =>  7506,
            "31120" =>  2492,
            "31122" =>  8098,
            "31123" =>  6243,
            "31126" =>  3821,
            "31130" =>  141757,
            "31143" =>  4429,
            "31146" =>  5958,
            "31163" =>  7396,
            "31168" =>  99610,
            "31170" =>  8209,
            "31180" =>  5005,
            "31182" =>  5800,
            "31188" =>  4365,
            "31203" =>  2357,
            "31249" =>  2639,
            "31252" =>  3181,
            "31253" =>  3736,
            "31255" =>  2803,
            "31258" =>  3165,
            "31260" =>  2544,
            "31271" =>  5520,
            "31275" =>  3185,
            "31280" =>  8164,
            "31283" =>  2814,
            "31290" =>  28865,
            "31308" =>  2513,
            "31309" =>  2748,
            "31330" =>  4656,
            "31331" =>  8453,
            "31333" =>  8224,
            "31414" =>  3868,
            "31422" =>  8461,
            "31441" =>  2694,
            "31447" =>  2487,
            "31449" =>  4752,
            "31458" =>  6813,
            "31474" =>  3565,
            "31485" =>  6962,
            "31486" =>  8126,
            "31487" =>  7957,
            "31489" =>  28900,
            "31492" =>  7137,
            "31495" =>  8487,
            "31504" =>  5676,
            "31506" =>  18694,
            "31508" =>  7512,
            "31529" =>  3624,
            "31533" =>  7122,
            "31534" =>  7939,
            "31538" =>  4233,
            "31542" =>  8493,
            "31559" =>  3313,
            "31561" =>  8500,
            "31579" =>  141658,
            "31623" =>  28859,
            "31668" =>  3092,
            "31670" =>  6984,
            "31745" =>  2687,
            "31808" =>  2613,
            "31812" =>  3270,
            "31842" =>  7877,
            "31845" =>  2897,
            "31859" =>  3295,
            "31870" =>  7780,
            "31872" =>  38948,
            "31916" =>  7857,
            "31920" =>  2997,
            "31967" =>  5906,
            "32002" =>  3012,
            "32008" =>  5142,
            "32010" =>  5948,
            "32019" =>  7190,
            "32025" =>  6652,
            "32027" =>  6163,
            "32062" =>  8197,
            "32129" =>  18537,
            "32131" =>  6404,
            "32148" =>  7241,
            "32149" =>  3620,
            "32186" =>  7026,
            "32227" =>  28785,
            "32228" =>  4274,
            "32263" =>  6185,
            "32317" =>  2752,
            "32331" =>  3163,
            "32334" =>  3875,
            "32342" =>  4234,
            "32345" =>  4704,
            "32360" =>  3537,
            "32376" =>  2590,
            "32379" =>  5377,
            "32408" =>  2841,
            "32444" =>  5167,
            "32523" =>  2683,
            "32535" =>  7921,
            "32582" =>  3057,
            "32593" =>  3918,
            "32613" =>  18684,
            "32684" =>  3761,
            "32713" =>  4460,
            "32806" =>  6005,
            "32826" =>  3146,
            "32884" =>  4671,
            "32916" =>  6392,
            "32943" =>  6926,
            "32944" =>  7779,
            "32959" =>  38924,
            "32970" =>  4131,
            "32972" =>  6391,
            "32976" =>  141629,
            "32988" =>  3173,
            "32992" =>  2703,
            "33174" =>  3171,
            "33178" =>  4446,
            "33326" =>  3421,
            "33333" =>  3804,
            "33377" =>  4530,
            "33382" =>  3882,
            "33421" =>  4313,
            "33425" =>  7155,
            "33448" =>  4958,
            "33452" =>  2951,
            "33459" =>  39045,
            "33460" =>  4758,
            "33467" =>  8163,
            "33509" =>  5804,
            "33535" =>  4664,
            "33610" =>  3155,
            "33657" =>  2807,
            "33660" =>  2936,
            "33664" =>  3959,
            "33672" =>  3966,
            "33697" =>  2898,
            "33709" =>  4400,
            "33715" =>  3037,
            "33717" =>  5370,
            "33729" =>  8237,
            "33736" =>  8305,
            "33771" =>  2924,
            "33774" =>  4900,
            "33780" =>  3238,
            "33784" =>  5290,
            "33789" =>  2992,
            "33808" =>  3107,
            "33858" =>  3179,
            "33860" =>  3199,
            "33877" =>  2871,
            "33890" =>  4923,
            "33906" =>  4711,
            "33923" =>  141331,
            "33982" =>  3137,
            "34009" =>  3144,
            "34018" =>  3129,
            "34049" =>  3406,
            "34062" =>  140825,
            "34112" =>  3319,
            "34114" =>  4239,
            "34125" =>  3267,
            "34133" =>  3604,
            "34137" =>  3264,
            "34155" =>  3307,
            "34158" =>  3538,
            "34169" =>  7412,
            "34172" =>  7256,
            "34184" =>  3350,
            "34191" =>  3824,
            "34194" =>  3247,
            "34216" =>  3357,
            "34244" =>  5253,
            "34263" =>  8266,
            "34294" =>  5781,
            "34374" =>  4605,
            "34376" =>  4003,
            "34387" =>  8102,
            "34391" =>  3411,
            "34402" =>  3678,
            "34407" =>  28875,
            "34419" =>  3599,
            "34422" =>  141416,
            "34436" =>  3423,
            "34437" =>  4654,
            "34439" =>  3491,
            "34440" =>  3666,
            "34445" =>  3680,
            "34454" =>  8463,
            "34466" =>  7796,
            "34506" =>  4016,
            "34509" =>  3612,
            "34511" =>  4094,
            "34512" =>  4237,
            "34527" =>  3598,
            "34528" =>  4495,
            "34546" =>  4830,
            "34638" =>  3731,
            "34679" =>  38922,
            "34691" =>  3893,
            "34698" =>  3972,
            "34700" =>  3944,
            "34705" =>  4308,
            "34721" =>  3987,
            "34733" =>  3958,
            "34741" =>  3783,
            "34764" =>  5412,
            "34768" =>  4484,
            "34821" =>  6073,
            "34837" =>  4417,
            "34838" =>  4238,
            "34841" =>  4399,
            "34844" =>  3942,
            "34848" =>  5981,
            "34852" =>  4140,
            "34858" =>  4110,
            "34861" =>  3901,
            "34887" =>  4121,
            "34921" =>  3936,
            "34926" =>  4483,
            "34937" =>  5793,
            "34939" =>  7816,
            "34960" =>  4324,
            "34971" =>  4434,
            "34977" =>  3900,
            "34985" =>  4038,
            "35006" =>  69237,
            "35032" =>  4021,
            "35052" =>  3896,
            "35059" =>  4338,
            "35061" =>  4921,
            "35147" =>  4312,
            "35157" =>  4454,
            "35227" =>  4244,
            "35552" =>  8356,
            "35722" =>  4551,
            "35738" =>  4979,
            "35752" =>  5267,
            "35772" =>  4304,
            "35813" =>  5404,
            "35864" =>  4856,
            "35875" =>  4504,
            "35889" =>  4465,
            "35944" =>  5019,
            "35951" =>  6139,
            "35954" =>  4784,
            "36015" =>  5700,
            "36040" =>  5155,
            "36070" =>  5647,
            "36076" =>  4627,
            "36084" =>  4734,
            "36087" =>  8401,
            "36088" =>  6798,
            "36090" =>  5164,
            "36091" =>  7270,
            "36125" =>  7172,
            "36217" =>  5358,
            "36243" =>  6433,
            "36274" =>  7022,
            "36332" =>  4967,
            "36348" =>  5346,
            "36350" =>  5398,
            "36451" =>  4872,
            "36505" =>  5939,
            "36594" =>  5123,
            "36614" =>  7821,
            "36666" =>  5907,
            "36680" =>  5250,
            "36704" =>  28825,
            "36713" =>  4873,
            "36752" =>  7497,
            "36800" =>  6125,
            "36801" =>  141842,
            "36891" =>  5356,
            "36939" =>  6816,
            "36969" =>  5305,
            "36974" =>  5341,
            "37084" =>  6029,
            "37395" =>  5429,
            "37544" =>  5100,
            "37624" =>  6567,
            "37708" =>  6301,
            "37768" =>  89369,
            "37868" =>  6657,
            "37870" =>  110159,
            "38027" =>  5761,
            "38041" =>  8301,
            "38924" =>  8468,
            "38952" =>  5710,
            "39001" =>  141604,
            "39098" =>  100083,
            "39139" =>  38972,
            "39216" =>  28793,
            "39255" =>  69229,
            "39317" =>  18639,
            "39397" =>  6396,
            "39443" =>  140797,
            "39724" =>  6662,
            "39910" =>  8207,
            "39982" =>  8176,
            "40267" =>  7076,
            "40268" =>  6541,
            "40718" =>  38934,
            "40723" =>  8107,
            "40851" =>  7364,
            "41038" =>  142061,
            "41040" =>  18732,
            "41103" =>  6763,
            "41135" =>  5825,
            "41196" =>  18510,
            "41197" =>  5247,
            "41307" =>  69217,
            "41310" =>  120200,
            "41316" =>  8044,
            "41317" =>  7418,
            "41356" =>  140887,
            "41374" =>  6257,
            "42034" =>  6415,
            "42038" =>  140614,
            "42078" =>  140615,
            "42229" =>  140937,
            "42230" =>  39120,
            "42281" =>  5515,
            "42404" =>  8218,
            "42408" =>  18584,
            "42447" =>  18687,
            "42456" =>  140814,
            "42467" =>  7008,
            "42483" =>  7481,
            "42545" =>  8046,
            "42556" =>  18572,
            "42563" =>  38953,
            "42573" =>  7570,
            "42575" =>  7460,
            "42636" =>  8056,
            "42641" =>  6184,
            "42688" =>  7805,
            "42763" =>  28816,
            "42776" =>  8464,
            "42818" =>  8166,
            "42819" =>  5838,
            "42828" =>  6653,
            "42932" =>  7866,
            "42935" =>  7529,
            "43013" =>  6795,
            "43031" =>  7483,
            "43032" =>  8120,
            "43070" =>  7042,
            "43101" =>  8111,
            "43102" =>  7283,
            "43104" =>  28879,
            "43105" =>  18700,
            "43117" =>  6987,
            "43166" =>  7293,
            "43177" =>  18735,
            "43188" =>  130590,
            "43194" =>  8054,
            "43203" =>  59176,
            "43231" =>  39041,
            "43359" =>  6988,
            "43376" =>  6374,
            "43377" =>  130320,
            "43451" =>  7274,
            "43452" =>  7276,
            "43470" =>  8276,
            "43533" =>  99535,
            "43553" =>  6183,
            "43673" =>  28806,
            "43682" =>  8114,
            "43725" =>  38956,
            "43729" =>  79315,
            "43746" =>  8336,
            "43803" =>  8206,
            "43804" =>  7368,
            "43926" =>  5837,
            "44087" =>  5728,
            "44370" =>  6706,
            "44399" =>  7876,
            "44405" =>  18699,
            "44407" =>  28814,
            "44488" =>  5908,
            "44490" =>  7322,
            "44522" =>  8252,
            "44528" =>  18554,
            "44540" =>  8411,
            "44606" =>  7615,
            "44617" =>  6803,
            "44618" =>  69254,
            "44677" =>  140889,
            "44678" =>  7948,
            "44684" =>  39000,
            "44691" =>  7437,
            "44822" =>  6847,
            "44830" =>  6424,
            "44831" =>  89445,
            "44872" =>  6806,
            "44900" =>  6805,
            "44928" =>  18529,
            "44948" =>  18542,
            "44965" =>  7698,
            "44976" =>  8239,
            "44982" =>  8418,
            "44984" =>  18528,
            "44986" =>  6720,
            "44994" =>  5982,
            "45018" =>  7830,
            "45032" =>  6259,
            "45061" =>  5859,
            "45107" =>  6934,
            "45116" =>  99916,
            "45201" =>  7232,
            "45203" =>  18673,
            "45409" =>  7300,
            "45649" =>  39079,
            "45714" =>  6170,
            "46213" =>  8295,
            "46252" =>  28881,
            "46260" =>  6275,
            "46340" =>  18688,
            "46386" =>  8414,
            "46387" =>  110134,
            "46390" =>  6506,
            "46537" =>  18621,
            "46546" =>  7986,
            "46570" =>  141666,
            "46586" =>  7987,
            "46591" =>  7311,
            "46602" =>  8015,
            "46684" =>  7763,
            "46753" =>  7925,
            "46778" =>  69263,
            "46788" =>  6562,
            "46874" =>  39037,
            "47457" =>  6716,
            "47489" =>  7251,
            "47723" =>  6035,
            "47787" =>  7884,
            "47875" =>  7007,
            "48019" =>  8053,
            "48021" =>  6324,
            "48313" =>  7455,
            "48414" =>  49164,
            "48455" =>  6027,
            "48465" =>  7217,
            "48466" =>  7320,
            "48540" =>  6809,
            "48600" =>  6836,
            "48740" =>  6428,
            "50986" =>  6440,
            "51303" =>  7916,
            "51487" =>  6807,
            "51532" =>  6898,
            "51738" =>  6649,
            "52427" =>  7248,
            "52459" =>  7087,
            "52492" =>  7015,
            "52665" =>  7931,
            "52688" =>  7945,
            "52765" =>  6938,
            "52789" =>  7783,
            "52805" =>  7902,
            "52807" =>  7967,
            "52835" =>  28787,
            "52838" =>  7387,
            "52840" =>  7757,
            "52850" =>  8152,
            "52870" =>  28772,
            "52877" =>  7819,
            "52881" =>  8128,
            "52891" =>  8139,
            "52896" =>  7969,
            "52907" =>  8285,
            "52917" =>  18637,
            "52963" =>  18769,
            "52978" =>  99811,
            "52986" =>  18520,
            "53053" =>  8477,
            "53069" =>  18733,
            "63095" =>  38914,
            "63098" =>  18682,
            "63114" =>  38947,
            "63172" =>  99775,
            "63574" =>  38964,
            "69123" =>  2753,
            "72780" =>  142183,
            "79268" =>  110154,
            "29359" =>  2716,
            "34889" =>  4408,
            "37664" =>  8083,
            "47395" =>  6335,
            "47697" =>  6558,
            "48606" =>  7879,
            "52773" =>  18676,
            "52819" =>  7971,
            "52862" =>  8013
        ];

        try{ 
            foreach($propertyDemandIds as $key => $propertyDemandId) {
                $propertyDemands = OldDemand::where('property_id',$key)->get();
                if (!$propertyDemands->isEmpty()) {
                    foreach($propertyDemands as $propertyDemand) {
                        if($propertyDemand->demand_id != $propertyDemandId){
                            if($propertyDemand->delete()){
                                echo "Demand deleted for property id: <b> $key\n </b> <br>";
                                OldDemandSubhead::where('DemandId',$propertyDemand->demand_id)->delete();
                            }
                        }
                    }
                } 
                // else {
                //     echo "No demand found for property id: $key\n <br>";
                // }
            }
        } catch (\Exception $e) {
                echo $e->getMessage();
        }
    }
}
