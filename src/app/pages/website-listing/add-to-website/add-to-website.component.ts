import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl,
} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {MatStepper} from '@angular/material/stepper';

export interface DialogData {
  lat: string;
  long: string;
}
@Component({
  selector: 'app-add-new-property',
  templateUrl: './add-to-website.component.html',
  styleUrls: ['./add-to-website.component.scss']
})
export class AddToWebsiteComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  tokenId = this.common.mycookie.bearertoken;
  location_list = [];
  city_list = [];
  area_list = [];

  product_type_list = [];
  preferred_tenant_list = [];
  const_status = [];

  project_type_list = [];
  basicFormGroup!: FormGroup;
  projectFeatureForm!: FormGroup;
  imageVideoForm!: FormGroup;
  extraInformation!: FormGroup;

  rootUrl =  this.common.rootUrl + 'public/uploads/property/';
  defaultImage = './assets/img/theme/default.jpg';
  ownershipImageFile = this.defaultImage;
  ownershipSelectedFile: File;
  ownershipChangeImg = false;
  ownershipselectImg = true;

  floorPlanFile: File | null = null;
  upload_floorPlan: any[] = [];

  imageFile: File | null = null;
  upload_image: any[] = [];
  elevatorBuildingInput = 0;
  pageBuffer = false;
  step = 0;
  showPrefferedTannent =  false;
  showOtherOwner =  false;
  tannent = [];
  edit_id = '';
  dcInformation = '';
  submitButton = false;
  show_use_listing_id = 0;
  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    private route: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private _router: Router,
    private http: HttpClient, public dialog: MatDialog) { }
  ngOnInit(): void {
    this.common.checkCookie();
    this.unique_id();
    this.productType();
    this.projectType();
    this.getCity();
    this.preferredTenant();
    this.constructionStatus();
    this.route.params.subscribe(params => {
      this.edit_id = params['id'];
      if (this.edit_id) {
        this.getEditData();
      }
    });
    this.common.aClickedEvent
    .subscribe((data:string) => {
      this.unique_id();
      this.productType();
      this.projectType();
      this.getCity();
      this.preferredTenant();
      this.constructionStatus();
    });

    this.basicFormGroup = this.fb.group({
      api_token: this.tokenId,
      save_type: [1],
      property_id: [null],
      pid: [null],
      use_listing_id: [null],
      reference_id: [null],
      listing_id: [null],
      title: [null, [Validators.required]],
      product_type: [null, [Validators.required]],
      purpose: [null],
      project_name: [null, [Validators.required]],
      project_type: [null, [Validators.required]],
      property_location: [null, [Validators.required]],
      city: [null, [Validators.required]],
      area: [null, [Validators.required]],
      block: [null],
      sector: [null],
      road: [null],
      house_no: [null],
      square_feet: [null],
      bedroom: [null],
      bathroom: [null],
      balcony: [null],
      facing: [null],
      unit_per_floor: [null],
      parking: [null],
      construction_status: [null],
      price: [null, [Validators.required]],
      price_for: [null],
      description: [null],
      description_bangla: [null],
      ownership: [null, [Validators.required]],
      company_name: '',
      ownership_logo: '',
      preferred_tenants: [null],
      latitude: [null],
      longitude: [null]
    });

    this.projectFeatureForm = this.fb.group({
      api_token: this.tokenId,
      save_type: [1],
      property_id: [null],
      belcony_or_terrace: [null],
      lobby_in_building: [null],
      double_giazed_windows: [null],
      central_air_con: [null],
      central_heating: [null],
      electricity_backup: [null],
      waste_disposal: [null],
      flooring: [null],
      elevator_in_building: [null],
      no_of_elevator: [null],
      service_elevator: [null],
      tenant: [null],
      furnished: [null],
      twenty_four_hour_concierge: [null],
      gas: [null],
      electricity: [null],
      prayer_room: [null],
      other_rooms: [null],
      waiting_area: [null],
      storage_area: [null],
      community_space: [null],
      broadband_internet: [null],
      satellite: [null],
      business_center: [null],
      conference_room: [null],
      intercom: [null],
      atm_facility: [null],
      other_facilities: [null],
      barbeque_area: [null],
      day_care_center: [null],
      first_aid_medical_center: [null],
      gym: [null],
      garden: [null],
      swimming_pool: [null],
      steam_room: [null],
      sauna: [null],
      jacuzzi: [null],
      sports_area: [null],
      nearby_schools: [null],
      nearby_hospitals: [null],
      nearby_shopping_mall: [null],
      airport_distance: [null],
      nearby_public_transport: [null],
      other_nearby_places: [null],
      pet_policy: [null],
      maintenance_staff: [null],
      canteen: [null],
      laundry: [null],
      shared_kitchen: [null],
      facilities_for_disabled: [null],
      cleaning_services: [null],
      change_interior: [null],
      cctv_security: [null],
      fire_exit: [null],
      fire_extinguisher: [null],
      fire_hose: [null],
      sprinkler: [null],
      guard: [null],
      visitor_log: [null],
      fire_alarm: [null]
    });

    this.imageVideoForm = this.fb.group({
      api_token: this.tokenId,
      save_type: [1],
      property_id: [null],
      youtube_url_01: [null],
      youtube_url_02: [null],
      youtube_url_03: [null],
     });

     this.extraInformation = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      others_info: [null],
      is_publish: [3],
    });

  }
  permission(type) {
    return this.common.permission('website-listing/add-to-website', type);
  }

  changeUseListingID(event) {
    this.show_use_listing_id = event;
  }
  unique_id() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/unique-id')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.basicFormGroup.controls['pid'].setValue(data.pid);
          } else {
            this.basicFormGroup.controls['pid'].setValue(data.pid);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }



  projectType() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/project-type')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.project_type_list = data.list;
          } else {
            this.project_type_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  productType() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/product-type')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.product_type_list = data.list;
          } else {
            this.product_type_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  getCity() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/city-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.city_list = data.list;
          } else {
            this.city_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  changeCity(city_id) {
    this.basicFormGroup.controls['area'].setValue(null);
    this.basicFormGroup.controls['area'].setErrors(null);
    const postdatet = {
      'api_token': this.tokenId,
      'city_id': city_id
    };
    this.dataService.create(postdatet, 'common/city-wise-area-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.area_list = data.list;
          } else {
            this.area_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  changeArea(area_id) {
    this.basicFormGroup.controls['property_location'].setValue(null);
    this.basicFormGroup.controls['property_location'].setErrors(null);
    const postdatet = {
      'api_token': this.tokenId,
      'area_id': area_id,
    };
    this.dataService.create(postdatet, 'common/location-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.location_list = data.list;
          } else {
            this.location_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  preferredTenant() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/preferred-tenant')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.preferred_tenant_list = data.list;
          } else {
            this.preferred_tenant_list = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  constructionStatus() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/lead-status')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.const_status = data.list;
          } else {
            this.const_status = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  onChangeElevatorBuilding(event) {
    this.elevatorBuildingInput = event;
  }
  changePurpose(event) {
    this.basicFormGroup.controls['price_for'].setValue(event);
    if(event == 2){
      this.showPrefferedTannent =  true;
    }else{
      this.showPrefferedTannent =  false;
    }
  }
  ownershipChange(event){
    if(event == 2){
      this.showOtherOwner =  true;
    }else{
      this.showOtherOwner =  false;
    }
  }

  // project thumbnail Image start
  ownershipChanged(fileInput) {
    const pre = this;
    if (fileInput.target.files && fileInput.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
          pre.ownershipImageFile = e.target.result;
          pre.ownershipSelectedFile = e.target.result;
          pre.ownershipChangeImg = true;
          pre.ownershipselectImg = false;
      },
      reader.readAsDataURL(fileInput.target.files[0]);
      }
  }
  ownershipRemoveImage() {
    this.ownershipSelectedFile = null;
    this.ownershipChangeImg = false;
    this.ownershipImageFile = this.defaultImage;
  }

 // Floor Plan upload
 onFloorPlanUpload(fileEvent) {
  const pre = this;
  if (fileEvent.target.files && fileEvent.target.files[0]) {
    const name = fileEvent.target.files[0].name;
    const ext = name.split('.').pop();
    const length = pre.upload_floorPlan.length;
    const reader = new FileReader();
    reader.onload = function (e: any) {
      pre.floorPlanFile = e.target.result;
      const fileUpload = {
        extension: ext,
        base64: pre.floorPlanFile
      };
      const data = {
        'action': 'create',
        'type': ext,
        'name': name,
        'file': fileUpload,
        'view_file': pre.floorPlanFile,
        'edit_file': true,
      };
      pre.upload_floorPlan.push(data);
    };
    reader.readAsDataURL(fileEvent.target.files[0]);
  }

}
FloorPlanRemoveImage(remove_id: any) {
    this.upload_floorPlan.forEach((value, index) => {
      if (value === remove_id) {
        this.upload_floorPlan.splice(index, 1);
      }
    });
}
 // Floor Plan upload
 onImageUpload(fileEvent) {
  const pre = this;
  if (fileEvent.target.files && fileEvent.target.files[0]) {
    const name = fileEvent.target.files[0].name;
    const ext = name.split('.').pop();
    const length = pre.upload_floorPlan.length;
    const reader = new FileReader();
    reader.onload = function (e: any) {
      pre.imageFile = e.target.result;
      const fileUpload = {
        extension: ext,
        base64: pre.imageFile
      };
      const data = {
        'action': 'create',
        'type': ext,
        'name': name,
        'file': fileUpload,
        'view_file': pre.imageFile,
        'edit_file': true,
      };
      pre.upload_image.push(data);
    };
    reader.readAsDataURL(fileEvent.target.files[0]);
  }

}
onImageRemove(remove_id: any) {
    this.upload_image.forEach((value, index) => {
      if (value === remove_id) {
        this.upload_image.splice(index, 1);
      }
    });
}



  // submit basic info
  saveBasicDraft() {
    this.basicFormGroup.controls['save_type'].setValue(2);
    this.submitForm();
  }
  submitBasicForm() {
    this.basicFormGroup.controls['save_type'].setValue(1);
    this.submitForm();
  }
  submitForm(): void {
    if (this.basicFormGroup.valid) {
      this.pageBuffer = true;
      this.basicFormGroup.controls['ownership_logo'].setValue(this.ownershipSelectedFile);
      const inputData = this.basicFormGroup.value;
      this.dataService.create(inputData, 'website-property/post-basic-info')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.common.openTost('success', 'SUCCESS', data.message);
          this.basicFormGroup.controls['property_id'].setValue(data.id);
          this.projectFeatureForm.controls['property_id'].setValue(data.id);
          this.imageVideoForm.controls['property_id'].setValue(data.id);
          this.extraInformation.controls['property_id'].setValue(data.id);
          this.myStepper.next();
        // tslint:disable-next-line: max-line-length
        } else if (data.response === 400) {
          this.common.openTost('warning', 'WARNING', data.message);
        } else if (data.response === 404) {
          this.common.openTost('warning', 'WARNING', data.message);
        }
      },
      (error: AppError) => {
        this.common.onMainEvent.emit(false);
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
    } else {
      Object.values(this.basicFormGroup.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
  // submit basic info end

    // submit Feature
    saveFeatureDraft() {
      this.projectFeatureForm.controls['save_type'].setValue(2);
      this.featureForm();
    }
    submitFeatureForm() {
      this.projectFeatureForm.controls['save_type'].setValue(1);
      this.featureForm();
    }
   featureForm(): void {
     if (this.projectFeatureForm.valid) {
       this.pageBuffer = true;
       const featureData = this.projectFeatureForm.value;
       this.dataService.create(featureData, 'website-property/post-property-feature')
       .subscribe(data => {
         this.pageBuffer = false;
         if (data.response === 200) {
           this.common.openTost('success', 'SUCCESS', data.message);
           this.projectFeatureForm.controls['save_type'].setValue(1);
           this.myStepper.next();
         // tslint:disable-next-line: max-line-length
         } else if (data.response === 400) {
           // this.submitType = 1;
           this.common.openTost('warning', 'WARNING', data.message);
         } else if (data.response === 404) {
           // this.submitType = 1;
           this.common.openTost('warning', 'WARNING', data.message);
         }
       },
       (error: AppError) => {
         this.common.onMainEvent.emit(false);
         this.common.openTost('error', 'ERROR', 'Please try again later');
         if (error instanceof BadInput) {
         } else { throw error; }
       });
     } else {
       Object.values(this.projectFeatureForm.controls).forEach(control => {
         if (control.invalid) {
           control.markAsDirty();
           control.updateValueAndValidity({ onlySelf: true });
         }
       });
     }
   }

    // submit Image
  saveImageDraft() {
    this.imageVideoForm.controls['save_type'].setValue(2);
    this.imageForm();
  }
  imageAndVideoForm(): void {
    this.imageVideoForm.controls['save_type'].setValue(1);
    this.imageForm();
  }
  imageForm() {
       this.pageBuffer = true;
    // tslint:disable-next-line:prefer-const
        const postData = {
          'api_token': this.imageVideoForm.controls.api_token.value,
          'property_id': this.imageVideoForm.controls.property_id.value,
          'save_type': this.imageVideoForm.controls.save_type.value,
          'upload_floorPlan': this.upload_floorPlan ? this.upload_floorPlan : '',
          'upload_image': this.upload_image ? this.upload_image : '',
          'youtube_url_01': this.imageVideoForm.controls.youtube_url_01.value,
          'youtube_url_02': this.imageVideoForm.controls.youtube_url_02.value,
          'youtube_url_03': this.imageVideoForm.controls.youtube_url_03.value,
        };
       this.dataService.postEncodedData(postData, 'website-property/post-image-video')
       .subscribe(data => {
         this.pageBuffer = false;
         if (data.response === 200) {
           this.common.openTost('success', 'SUCCESS', data.message);
           this.myStepper.next();
         // tslint:disable-next-line: max-line-length
         } else if (data.response === 400) {
           this.common.openTost('warning', 'WARNING', data.message);
         }
       },
       (error: AppError) => {
         this.common.onMainEvent.emit(false);
         this.common.openTost('error', 'ERROR', 'Please try again later');
         if (error instanceof BadInput) {
         } else { throw error; }
       });
  }

    // submit Others Information
    submitExtraInformation(): void {
      this.pageBuffer = true;
      this.dataService.create(this.extraInformation.value, 'website-property/post-other-information')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.common.openTost('success', 'SUCCESS', data.message);
          this._router.navigate(['/website-listing/website-property-listing']);
        } else if (data.response === 400) {
          this.common.openTost('warning', 'WARNING', data.message);
        }
      },
      (error: AppError) => {
        this.common.onMainEvent.emit(false);
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
    }
  showMap(): void {
    const dialogRef = this.dialog.open( WebsiteMapModel, {
      width: '800px',
      data: {
        lat: this.basicFormGroup.controls.latitude.value,
        long : this.basicFormGroup.controls.longitude.value,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  getEditData() {
    this.submitButton = true;
    const inputData = {
      'api_token': this.tokenId,
      'edit_id': this.edit_id,
    };
    this.dataService.create(inputData, 'website-property/edit')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.basicFormGroup.controls['property_id'].setValue(data.list.basic_info.id);
            this.projectFeatureForm.controls['property_id'].setValue(data.list.basic_info.id);
            this.imageVideoForm.controls['property_id'].setValue(data.list.basic_info.id);
            this.extraInformation.controls['property_id'].setValue(data.list.basic_info.id);
            this.showEditForm(data.list);
            this.ownershipImageFile = this.rootUrl + data.list.basic_info?.ownership_logo;
            if (data.list.floor_plan.length > 0) {
              data.list.floor_plan.forEach((element, index) => {
                const doc = {
                  'action': 'edit',
                  'type': element.url.split('.').pop(),
                  'name': element.url,
                  'file':  element.url,
                  'view_file': element.url,
                  'edit_file': true,
                };
                this.upload_floorPlan.push(doc);
              });
            }
            if (data.list.image.length > 0) {
              data.list.image.forEach((element, index) => {
                const doc = {
                  'action': 'edit',
                  'type': element.url.split('.').pop(),
                  'name': element.url,
                  'file':  element.url,
                  'view_file': element.url,
                  'edit_file': true,
                };
                this.upload_image.push(doc);
              });
            }
          } else if (data.code === 400) {
            this.common.openTost('warning', 'WARNING', data.message);
          } else if (data.code === 404) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  checkListingID() {
    this.submitButton = true;
    const inputData = {
      'api_token': this.tokenId,
      'property_id': this.basicFormGroup.controls.pid.value,
      'listing_id': this.basicFormGroup.controls.listing_id.value,
    };
    this.dataService.create(inputData, 'website-property/filter-listing-id')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.showEditForm(data.list);

            this.ownershipImageFile = this.rootUrl + data.list.basic_info?.ownership_logo;
            if (data.list.floor_plan.length > 0) {
              data.list.floor_plan.forEach((element, index) => {
                const doc = {
                  'action': 'edit',
                  'type': element.url.split('.').pop(),
                  'name': element.url,
                  'file':  element.url,
                  'view_file': element.url,
                  'edit_file': true,
                };
                this.upload_floorPlan.push(doc);
              });
            }
            if (data.list.image.length > 0) {
              data.list.image.forEach((element, index) => {
                const doc = {
                  'action': 'edit',
                  'type': element.url.split('.').pop(),
                  'name': element.url,
                  'file':  element.url,
                  'view_file': element.url,
                  'edit_file': true,
                };
                this.upload_image.push(doc);
              });
            }
          } else if (data.code === 400) {
            this.common.openTost('warning', 'WARNING', data.message);
          } else if (data.code === 404) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  showEditForm(data) {
    if (data.basic_info.preferred_tenants.length > 0) {
      data.basic_info.preferred_tenants.forEach((element, index) => {
        this.tannent.push(element.preferred_tenant_id);
      });
    }
    if (data.basic_info.listing_id) {
      this.basicFormGroup.controls['use_listing_id'].setValue(1);
    }
    this.basicFormGroup.patchValue({
      pid: data.basic_info?.property_id,
      reference_id: data.basic_info ? (data.basic_info.reference_id ? data.basic_info.reference_id : '') : '',
      listing_id: data.basic_info ? (data.basic_info.listing_id ? data.basic_info.listing_id : '') : '',
      title: data.basic_info?.title,
      product_type: data.basic_info?.product_type,
      purpose: data.basic_info?.purpose,
      project_name: data.basic_info?.project_name,
      project_type: data.basic_info?.project_type,
      city: data.basic_info?.city,
      area: data.basic_info?.area,
      property_location: data.basic_info?.property_location,
      block: data.basic_info?.block,
      sector: data.basic_info?.sector,
      road: data.basic_info?.road,
      house_no: data.basic_info?.house_no,
      square_feet: data.basic_info?.square_feet,
      bedroom: data.basic_info?.bedroom,
      bathroom: data.basic_info?.bathroom,
      balcony: data.basic_info?.balcony,
      facing: data.basic_info?.facing,
      unit_per_floor: data.basic_info?.unit_per_floor,
      parking: data.basic_info?.parking,
      construction_status: data.basic_info?.construction_status,
      price: data.basic_info?.price,
      price_for: data.basic_info?.price_for,
      description: data.basic_info?.description,
      description_bangla: data.basic_info?.description_bangla,
      ownership: data.basic_info?.ownership,
      company_name: data.basic_info?.company_name,
      preferred_tenants: this.tannent,
      latitude: data.basic_info?.latitude,
      longitude: data.basic_info?.longitude,
    });
    this.projectFeatureForm.patchValue({
      belcony_or_terrace: data.feature.belcony_or_terrace,
      lobby_in_building: data.feature.lobby_in_building,
      double_giazed_windows: data.feature.double_giazed_windows,
      central_air_con: data.feature.central_air_con,
      central_heating: data.feature.central_heating,
      electricity_backup: data.feature.electricity_backup,
      waste_disposal: data.feature.waste_disposal,
      flooring: data.feature.flooring,
      elevator_in_building: data.feature.elevator_in_building,
      no_of_elevator: data.feature.no_of_elevator,
      service_elevator: data.feature.service_elevator,
      tenant: data.feature.tenant,
      furnished: data.feature.furnished,
      twenty_four_hour_concierge: data.feature.twenty_four_hour_concierge,
      gas: data.feature.gas,
      electricity: data.feature.electricity,
      prayer_room: data.feature.prayer_room,
      other_rooms: data.feature.other_rooms,
      waiting_area: data.feature.waiting_area,
      storage_area: data.feature.storage_area,
      community_space: data.feature.community_space,
      broadband_internet: data.feature.broadband_internet,
      satellite: data.feature.satellite,
      business_center: data.feature.business_center,
      conference_room: data.feature.conference_room,
      intercom: data.feature.intercom,
      atm_facility: data.feature.atm_facility,
      other_facilities: data.feature.other_facilities,
      barbeque_area: data.feature.barbeque_area,
      day_care_center: data.feature.day_care_center,
      first_aid_medical_center: data.feature.first_aid_medical_center,
      gym: data.feature.gym,
      garden: data.feature.garden,
      swimming_pool: data.feature.swimming_pool,
      steam_room: data.feature.steam_room,
      sauna: data.feature.sauna,
      jacuzzi: data.feature.jacuzzi,
      sports_area: data.feature.sports_area,
      nearby_schools: data.feature.nearby_schools,
      nearby_hospitals: data.feature.nearby_hospitals,
      nearby_shopping_mall: data.feature.nearby_shopping_mall,
      airport_distance: data.feature.airport_distance,
      nearby_public_transport: data.feature.nearby_public_transport,
      other_nearby_places: data.feature.other_nearby_places,
      pet_policy: data.feature.pet_policy,
      maintenance_staff: data.feature.maintenance_staff,
      canteen: data.feature.canteen,
      laundry: data.feature.laundry,
      shared_kitchen: data.feature.shared_kitchen,
      facilities_for_disabled: data.feature.facilities_for_disabled,
      cleaning_services: data.feature.cleaning_services,
      change_interior: data.feature.change_interior,
      cctv_security: data.feature.cctv_security,
      fire_exit: data.feature.fire_exit,
      fire_extinguisher: data.feature.fire_extinguisher,
      fire_hose: data.feature.fire_hose,
      sprinkler: data.feature.sprinkler,
      guard: data.feature.guard,
      visitor_log: data.feature.visitor_log,
      fire_alarm: data.feature.fire_alarm,
    });
    this.imageVideoForm.patchValue({
      youtube_url_01: data.youtube ? data.youtube[0]?.url : '',
      youtube_url_02: data.youtube ? data.youtube[1]?.url : '',
      youtube_url_03: data.youtube ? data.youtube[2]?.url : '',
    });
    this.extraInformation.patchValue({
      others_info: data.other_info?.others_info,
      is_publish: data.basic_info?.status
    });
  }

}

@Component({
  selector: 'app-wmap-modal',
  templateUrl: './map-modal.html',
  styleUrls: ['./add-to-website.component.scss']
})
export class WebsiteMapModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl = this.common.rootUrl + 'public/uploads/';

  constructor(public dialogRef: MatDialogRef<WebsiteMapModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }
}
