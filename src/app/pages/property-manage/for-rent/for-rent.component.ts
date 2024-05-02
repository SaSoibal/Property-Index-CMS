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
import {ActivatedRoute} from '@angular/router';
import {Router} from '@angular/router';
import {MatStepper} from '@angular/material/stepper';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Location} from '@angular/common';

export interface DialogData {
  lat: string;
  long: string;
}

@Component({
  selector: 'app-add-new-property',
  templateUrl: './for-rent.component.html',
  styleUrls: ['./for-rent.component.scss']
})
export class ForRentComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  tokenId = this.common.mycookie.bearertoken;
  rent_type_list = [];
  location_list = [];
  country_list = [];
  city_list = [];
  area_list = [];
  const_status = [];
  preferred_tenant_list = [];

  project_type_list = [];
  basicFormGroup!: FormGroup;
  projectFeatureForm!: FormGroup;
  imageVideoForm!: FormGroup;
  priceAndContactDetails!: FormGroup;
  extraInformation!: FormGroup;

  rootUrl =  this.common.rootUrl + 'public/uploads/property/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  FloorSelectedFile: File;
  FloorImageFile = this.defaultImage;
  FloorChangeImg = false;
  FloorselectImg = true;
  selectedDocFile: File | null = null;
  upload_documents: any[] = [];
  pageBuffer = false;
  step = 0;
  elevatorBuildingInput = 0;
  dcInformation = '';
  edit_id = '';
  submitButton = false;
  tannent = [];
  listing_property = [];
  project_list = [];
  showProjectInput = 0;
  show_type_of_product = 1;

  branch_list =[];
  team_list = [];
  team_member = [];
  changeBranch = '';
  team_id = '';
  member_id = '';


  setStep(index: number) {
    this.step = index;
  }
  nextStep() {
    this.step++;
  }
  prevStep() {
    this.step--;
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.upload_documents, event.previousIndex, event.currentIndex);
  }
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _router: Router,
    public dialog: MatDialog,
    private _location: Location) { }
  ngOnInit(): void {
    this.common.checkCookie();
    this.getBranch();
    this.unique_id();
    this.projectType();
    this.rentType();
    this.projectList();
    this.getCountry();
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
    .subscribe((data: string) => {
      this.unique_id();
      this.projectType();
      this.rentType();
      this.projectList();
      this.getCountry();
      this.getCity();
      this.preferredTenant();
      this.constructionStatus();
    });

    this.basicFormGroup = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      pid: [null],
      use_listing_id: [null],
      reference_id: [null],
      listing_id: [null],
      title: [null, [Validators.required]],

      leads_type:[0],
      rent_type: [1, [Validators.required]],
      product: [null],
      project_name: [null],
      project_type: [null],

      property_location: [null, [Validators.required]],
      city: [null, [Validators.required]],
      area: [null, [Validators.required]],
      block: [null],
      sector: [null],
      road: [null],
      house_no: [null],
      plot_size: [null],
      square_feet: [null],
      bedroom: [null],
      bathroom: [null],
      balcony: [null],
      servant_room: [null],
      available_floor: [null],
      available_unit: [null],
      facing: [null],
      total_unit_per_floor: [null],
      building_storied: [null],
      parking: [null],
      construction_status: [null],
      country: [null],
      developer_name: [null],
      handover_year: [null],
      property_current_status: [null],
      description: [null],
      property_address: [null],
      preferred_tenants: [null],
      last_time_entry: [null],
      latitude: [null],
      longitude: [null],
      is_publish: [1],
    });

    this.projectFeatureForm = this.fb.group({
      api_token: this.tokenId,
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
      fire_alarm: [null],
      is_publish: [1],
    });

    this.imageVideoForm = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      is_publish: [1],
      youtube_url_01: [null],
      youtube_url_02: [null],
      youtube_url_03: [null],
    });

    this.priceAndContactDetails = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      monthly_rent: [null],
      rent_commission_percent: [null],
      rent_commission_fixed: [null],
      rent_advance: [null],
      rent_service_charge: [null],
      rent_increment_policy: [null],
      product_person: [null],
      source: [null],
      contact_person: [null],
      contact_number: [null],
      contact_address: [null],
      contact_email: [null],
      representative_name: [null],
      representative_phone_no: [null],
      is_publish: [1],
    });
    this.extraInformation = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      others_info: [null],
      branch_id: [this.changeBranch],
      team_id: [this.team_id],
      member_id: [this.member_id],
      is_publish: [1],
    });
  }

  getBranch(){
    const postdatet = {
      'api_token': this.tokenId,
    }
    this.dataService.create(postdatet, 'sys-branch-list')
    .subscribe(
      data => {
        if (data.response === 200) {
          this.branch_list = data.branch;
          this.changeBranch = data.branch[0].id;
          this.onBranch(this.changeBranch);
        } else if (data.response === 400) {
          this.branch_list =[];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  onBranch(event){
    this.team_id = '';
    this.member_id = '';
    this.changeBranch = event?event:'';
    const postdatet = {
      'api_token': this.tokenId,
      'branch_id': event
    };
    this.dataService.create(postdatet, 'common/branch-wise-team-list')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.team_list = data.list;
            if(data.list.length == 1){
              this.team_id = data.list[0].id;
              this.teamWiseMember(data.list[0].id)
            }
          } else {
            this.team_list = [];
          }
        },
        (error: AppError) => {
          // this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });

  }

  teamWiseMember(event) {
    this.team_member = [];
    this.team_id = event?event:'';
    this.member_id = '';
    if(event){
      const postdatet = {
        'api_token': this.tokenId,
        'team_id': event,
      };
      this.dataService.create(postdatet, 'common/team-member')
        .subscribe(
          data => {
            if (data.response === 200) {
              this.team_member = data.team_member;
              if(data.team_member.length == 1){
                this.member_id = data.team_member[0].systemuser_id;
              }
            } else {
              this.team_member = [];
            }
          },
          (error: AppError) => {
            this.common.openTost('error', 'ERROR', 'Please try again later');
            if (error instanceof BadInput) {
            } else { throw error; }
          });
      }

  }

  permission(type) {
    return this.common.permission('property-management/for-sales', type);
  }

  changeProductName(event){
    this.show_type_of_product = event;
  }

  leadsTypeChange(event) {
    this.showProjectInput = event;
  }

// project thumbnail Image start
Changed(fileInput) {
  const pre = this;
  if (fileInput.target.files && fileInput.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      pre.ImageFile = e.target.result;
      pre.SelectedFile = e.target.result;
      pre.ChangeImg = true;
      pre.selectImg = false;
    },
      reader.readAsDataURL(fileInput.target.files[0]);
  }
}
RemoveImage() {
  this.SelectedFile = null;
  this.ChangeImg = false;
  this.ImageFile = this.defaultImage;
}
// project thumbnail Image end
// Area Changed thumbnail Image start
AreaChanged(area) {
  const pre = this;
  if (area.target.files && area.target.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e: any) {
      pre.FloorImageFile = e.target.result;
      pre.FloorSelectedFile = e.target.result;
      pre.FloorChangeImg = true;
      pre.FloorselectImg = false;
    },
      reader.readAsDataURL(area.target.files[0]);
  }
}
AreaRemoveImage() {
  this.FloorSelectedFile = null;
  this.FloorChangeImg = false;
  this.FloorImageFile = this.defaultImage;
}
//  Area Changed thumbnail end

onFileUpload(event) {
  if (event.target.files && event.target.files[0]) {
      const pre = this;
      const filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
          const name = event.target.files[i].name;
          const ext = name.split('.').pop();
          const reader = new FileReader();
          reader.onload = (event: any) => {
              const fileUpload = {
                  extension: ext,
                  base64: event.target.result
              }
              const image = {
                'action': 'create',
                'type': ext,
                'name': name,
                'file': fileUpload,
                'view_file': event.target.result,
                'edit_file': true,
              };

              this.upload_documents.push(image);
              // this.getProgressValue();
          }
          reader.readAsDataURL(event.target.files[i]);
      }
  }
}

removeFile(remove_id: any) {
  this.upload_documents.forEach((value, index) => {
    if (value === remove_id) {
      this.upload_documents.splice(index, 1);
    }
  });
}

  unique_id() {
    const postdatet = {
      'api_token': this.tokenId,
      'type': 'for-rent',
    };
    this.dataService.create(postdatet, 'common/unique-id')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.basicFormGroup.controls['listing_id'].setValue(data.listing_id);
            this.basicFormGroup.controls['pid'].setValue(data.pid);
          } else {
            this.basicFormGroup.controls['listing_id'].setValue(data.listing_id);
            this.basicFormGroup.controls['pid'].setValue(data.pid);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  projectList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/project')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.project_list = data.list;
          } else {
            this.project_list = [];
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
  rentType() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/product-type')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.rent_type_list = data.list;
          } else {
            this.rent_type_list = [];
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
      'area_id': area_id
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
  getCountry() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/country-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.country_list = data.list;
          } else {
            this.country_list = [];
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
    this.dataService.create(postdatet, 'common/construction-status')
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


  showForm(data) {
    this.basicFormGroup.patchValue({
      product_type: data.type_of_Product,
      property_location: data.property_location,
      city: data.city,
      area: data.area,
      block: data.block,
      sector: data.sector,
      road: data.road,
      house_no: data.house_no,
      square_feet: data.square_feet,
      bedroom: data.bedroom,
      bathroom: data.bathroom,
      balcony: data.balcony,
      servant_room: data.servant_room,
      available_floor: data.available_floor,
      facing: data.facing,
      total_unit_per_floor: data.unit_per_floor,
      construction_status: data.construction_status,
      developer_name: data.developer_name,
      description: data.description,
      property_address: data.property_address,
    });
  }


  submitBasicForm() {
    this.submitForm();
  }
  submitForm(): void {
    if (this.basicFormGroup.valid) {
      this.pageBuffer = true;
      const inputData = this.basicFormGroup.value;
      this.dataService.create(inputData, 'for-rent-property/post-basic-info')
        .subscribe(data => {
            this.pageBuffer = false;
            if (data.response === 200) {
              this.common.openTost('success', 'SUCCESS', data.message);
              this.basicFormGroup.controls['property_id'].setValue(data.id);
              this.projectFeatureForm.controls['property_id'].setValue(data.id);
              this.imageVideoForm.controls['property_id'].setValue(data.id);
              this.priceAndContactDetails.controls['property_id'].setValue(data.id);
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
  submitFeatureForm() {
    this.featureForm();
  }
  featureForm(): void {
    if (this.projectFeatureForm.valid) {
      this.pageBuffer = true;
      const featureData = this.projectFeatureForm.value;
      this.dataService.create(featureData, 'for-rent-property/post-property-feature')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.common.openTost('success', 'SUCCESS', data.message);
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
  imageAndVideoForm(): void {
    this.imageForm();
  }
  imageForm() {
       this.pageBuffer = true;
    // tslint:disable-next-line:prefer-const
        const postData = {
          'api_token': this.imageVideoForm.controls.api_token.value,
          'property_id': this.imageVideoForm.controls.property_id.value,
          'thumbnail': this.SelectedFile ? this.SelectedFile : '',
          'is_publish': this.imageVideoForm.controls.is_publish.value,
          'floor_plan': this.FloorSelectedFile ? this.FloorSelectedFile : '',
          'upload_files': this.upload_documents,
          'youtube_url_01': this.imageVideoForm.controls.youtube_url_01.value,
          'youtube_url_02': this.imageVideoForm.controls.youtube_url_02.value,
          'youtube_url_03': this.imageVideoForm.controls.youtube_url_03.value,
        };
       this.dataService.postEncodedData(postData, 'for-rent-property/post-image-video')
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

   // submit price & contact
  submitPriceContactForm(): void {
    this.priceContactForm();
  }
  priceContactForm(): void {
    if (this.priceAndContactDetails.valid) {
      this.pageBuffer = true;
      const priceData = this.priceAndContactDetails.value
      this.dataService.create(priceData, 'for-rent-property/post-price-contact')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.common.openTost('success', 'SUCCESS', data.message);
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
        this.common.openTost('error', 'ERROR',  'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
    } else {
      Object.values(this.priceAndContactDetails.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

    // submit Others Information
    submitExtraInformation(): void {
      this.pageBuffer = true;
      this.dataService.create(this.extraInformation.value, 'for-rent-property/post-other-information')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.common.openTost('success', 'SUCCESS', data.message);
          if(this.edit_id){
            this._location.back();
          }else{
            this._router.navigate(['/property-management/qc-rent-property-list']);
          }

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

  getEditData() {
    this.submitButton = true;
    const inputData = {
      'api_token': this.tokenId,
      'edit_id': this.edit_id,
    };
    this.dataService.create(inputData, 'for-rent-property/edit')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.dcInformation = data.list.basic_info.dc_info;
            this.basicFormGroup.controls['property_id'].setValue(data.list.basic_info.id);
            this.projectFeatureForm.controls['property_id'].setValue(data.list.basic_info.id);
            this.imageVideoForm.controls['property_id'].setValue(data.list.basic_info.id);
            this.priceAndContactDetails.controls['property_id'].setValue(data.list.basic_info.id);
            this.extraInformation.controls['property_id'].setValue(data.list.basic_info.id);
            this.showEditForm(data.list);
            this.ImageFile = this.rootUrl + data.list.thumbnail?.url;
            this.FloorImageFile = this.rootUrl + data.list.floorplan?.url;
            if (data.list.image_video.length > 0) {
              data.list.image_video.forEach((element, index) => {
                const doc = {
                  'action': 'edit',
                  'type': element.url.split('.').pop(),
                  'name': element.url,
                  'file':  element.url,
                  'view_file': element.url,
                  'edit_file': true,
                };
                this.upload_documents.push(doc);
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
    this.dataService.create(inputData, 'for-rent-property/filter-listing-id')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.listing_property = data.list;
            this.basicFormGroup.controls['pid'].setValue(data.pid);
          } else if (data.code === 400) {
            this.listing_property = [];
            this.basicFormGroup.controls['pid'].setValue(1);
            this.common.openTost('warning', 'WARNING', data.message);
          } else if (data.code === 404) {
            this.listing_property = [];
            this.basicFormGroup.controls['pid'].setValue(1);
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

  idWiseProperty(pid) {
    this.submitButton = true;
    const inputData = {
      'api_token': this.tokenId,
      'property_id': pid,
      'listing_id': this.basicFormGroup.controls.listing_id.value,
    };
    this.dataService.create(inputData, 'for-rent-property/id-wise-property')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.dcInformation = data.list.basic_info.dc_info;
            this.showEditForm(data.list);
            this.ImageFile = this.rootUrl + data.list.thumbnail?.url;
            this.FloorImageFile = this.rootUrl + data.list.floorplan?.url;
            if (data.list.image_video.length > 0) {
              data.list.image_video.forEach((element, index) => {
                const doc = {
                  'action': 'edit',
                  'type': element.url.split('.').pop(),
                  'name': element.url,
                  'file':  element.url,
                  'view_file': element.url,
                  'edit_file': true,
                };
                this.upload_documents.push(doc);
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
    this.basicFormGroup.patchValue({
      pid: data.basic_info?.property_id,
      reference_id: data.basic_info ? (data.basic_info.reference_id ? data.basic_info.reference_id : '') : '',
      listing_id: data.basic_info ? (data.basic_info.listing_id ? data.basic_info.listing_id : '') : '',
      title: data.basic_info?.title,
      leads_type: data.basic_info?.leads_type,
      rent_type: data.basic_info?.rent_type,
      product: data.basic_info?.product,
      project_name: data.basic_info?.project_name,
      project_type: data.basic_info?.project_type,
      city: data.basic_info?.city,
      area: data.basic_info?.area,
      property_location: data.basic_info?.property_location,
      block: data.basic_info?.block,
      sector: data.basic_info?.sector,
      road: data.basic_info?.road,
      house_no: data.basic_info?.house_no,
      plot_size: data.basic_info?.plot_size,
      square_feet: data.basic_info?.square_feet,
      bedroom: data.basic_info?.bedroom,
      bathroom: data.basic_info?.bathroom,
      balcony: data.basic_info?.balcony,
      servant_room: data.basic_info?.servant_room,
      available_floor: data.basic_info?.available_floor,
      available_unit: data.basic_info?.available_unit,
      facing: data.basic_info?.facing,
      total_unit_per_floor: data.basic_info?.total_unit_per_floor,
      building_storied: data.basic_info?.building_storied,
      parking: data.basic_info?.parking,
      construction_status: data.basic_info?.construction_status,
      country: data.basic_info?.country,
      developer_name: data.basic_info?.developer_name,
      handover_year: data.basic_info?.handover_year,
      property_current_status: data.basic_info?.property_current_status,
      description: data.basic_info?.description,
      property_address: data.basic_info?.property_address,
      preferred_tenants: this.tannent,
      last_time_entry: data.basic_info?.last_time_entry,
      latitude: data.basic_info?.latitude,
      longitude: data.basic_info?.longitude,
      is_publish: data.basic_info?.status
    });
    this.projectFeatureForm.patchValue({
      belcony_or_terrace: data.feature?.belcony_or_terrace,
      lobby_in_building: data.feature?.lobby_in_building,
      double_giazed_windows: data.feature?.double_giazed_windows,
      central_air_con: data.feature?.central_air_con,
      central_heating: data.feature?.central_heating,
      electricity_backup: data.feature?.electricity_backup,
      waste_disposal: data.feature?.waste_disposal,
      flooring: data.feature?.flooring,
      elevator_in_building: data.feature?.elevator_in_building,
      no_of_elevator: data.feature?.no_of_elevator,
      service_elevator: data.feature?.service_elevator,
      tenant: data.feature?.tenant,
      furnished: data.feature?.furnished,
      twenty_four_hour_concierge: data.feature?.twenty_four_hour_concierge,
      gas: data.feature?.gas,
      electricity: data.feature?.electricity,
      prayer_room: data.feature?.prayer_room,
      other_rooms: data.feature?.other_rooms,
      waiting_area: data.feature?.waiting_area,
      storage_area: data.feature?.storage_area,
      community_space: data.feature?.community_space,
      broadband_internet: data.feature?.broadband_internet,
      satellite: data.feature?.satellite,
      business_center: data.feature?.business_center,
      conference_room: data.feature?.conference_room,
      intercom: data.feature?.intercom,
      atm_facility: data.feature?.atm_facility,
      other_facilities: data.feature?.other_facilities,
      barbeque_area: data.feature?.barbeque_area,
      day_care_center: data.feature?.day_care_center,
      first_aid_medical_center: data.feature?.first_aid_medical_center,
      gym: data.feature?.gym,
      garden: data.feature?.garden,
      swimming_pool: data.feature?.swimming_pool,
      steam_room: data.feature?.steam_room,
      sauna: data.feature?.sauna,
      jacuzzi: data.feature?.jacuzzi,
      sports_area: data.feature?.sports_area,
      nearby_schools: data.feature?.nearby_schools,
      nearby_hospitals: data.feature?.nearby_hospitals,
      nearby_shopping_mall: data.feature?.nearby_shopping_mall,
      airport_distance: data.feature?.airport_distance,
      nearby_public_transport: data.feature?.nearby_public_transport,
      other_nearby_places: data.feature?.other_nearby_places,
      pet_policy: data.feature?.pet_policy,
      maintenance_staff: data.feature?.maintenance_staff,
      canteen: data.feature?.canteen,
      laundry: data.feature?.laundry,
      shared_kitchen: data.feature?.shared_kitchen,
      facilities_for_disabled: data.feature?.facilities_for_disabled,
      cleaning_services: data.feature?.cleaning_services,
      change_interior: data.feature?.change_interior,
      cctv_security: data.feature?.cctv_security,
      fire_exit: data.feature?.fire_exit,
      fire_extinguisher: data.feature?.fire_extinguisher,
      fire_hose: data.feature?.fire_hose,
      sprinkler: data.feature?.sprinkler,
      guard: data.feature?.guard,
      visitor_log: data.feature?.visitor_log,
      fire_alarm: data.feature?.fire_alarm,
      is_publish: data.basic_info?.status
    });

    this.priceAndContactDetails.patchValue({
      monthly_rent: data.price_contact?.monthly_rent,
      rent_commission_percent: data.price_contact?.rent_commission_percent,
      rent_commission_fixed: data.price_contact?.rent_commission_fixed,
      rent_advance: data.price_contact?.rent_advance,
      rent_service_charge: data.price_contact?.rent_service_charge,
      rent_increment_policy: data.price_contact?.rent_increment_policy,
      product_person: data.price_contact?.product_person,
      source: data.price_contact?.source,
      contact_person: data.price_contact?.contact_person,
      contact_number: data.price_contact?.contact_number,
      contact_address: data.price_contact?.contact_address,
      contact_email: data.price_contact?.contact_email,
      representative_name: data.price_contact?.representative_name,
      representative_phone_no: data.price_contact?.representative_phone_no,
      is_publish: data.basic_info?.status
    });
    this.imageVideoForm.patchValue({
      youtube_url_01: data.youtube_video ? data.youtube_video[0]?.url : '',
      youtube_url_02: data.youtube_video ? data.youtube_video[1]?.url : '',
      youtube_url_03: data.youtube_video ? data.youtube_video[2]?.url : '',
      is_publish: data.basic_info?.status
    });
    this.extraInformation.patchValue({
      others_info: data.other_info?.others_info,
      branch_id: data.assign_info?.branch_id,
      team_id: data.assign_info?.team_id,
      member_id: data.assign_info?.allocated_to,
      is_publish: data.basic_info?.status
    });
  }

  showMap(): void {
    const dialogRef = this.dialog.open( RentMapModel, {
      width: '800px',
      data: {
        lat: this.basicFormGroup.controls.latitude.value,
        long : this.basicFormGroup.controls.longitude.value,
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
}
@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.html',
  styleUrls: ['./for-rent.component.scss']
})
export class RentMapModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl = this.common.rootUrl + 'public/uploads/';

  constructor(public dialogRef: MatDialogRef<RentMapModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }
}
