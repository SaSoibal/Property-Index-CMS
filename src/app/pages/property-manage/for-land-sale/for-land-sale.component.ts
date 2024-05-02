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
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';
import {Location} from '@angular/common';

export interface DialogData {
  lat: string;
  long: string;
}

@Component({
  selector: 'app-add-new-property',
  templateUrl: './for-land-sale.component.html',
  styleUrls: ['./for-land-sale.component.scss']
})
export class ForLandSaleComponent implements OnInit {
  @ViewChild('stepper') private myStepper: MatStepper;
  tokenId = this.common.mycookie.bearertoken;
  basicFormGroup!: FormGroup;
  imageVideoForm!: FormGroup;
  priceAndContactDetails!: FormGroup;
  extraInformation!: FormGroup;

  location_list = [];
  city_list = [];
  area_list = [];
  project_list = [];
  project_type_list = [];
  rootUrl =  this.common.rootUrl + 'public/uploads/property/';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;
  AreaSelectedFile: File;
  AreaImageFile = this.defaultImage;
  AreaChangeImg = false;
  AreaselectImg = true;
  selectedDocFile: File | null = null;
  upload_documents: any[] = [];
  agreementFile: File | null = null;
  upload_agreement: any[] = [];
  pageBuffer = false;
  channel = 0;
  step = 0;
  dcInformation = '';
  edit_id = '';
  submitButton = false;
  showPropertyReg = true;
  showPaperStatus = false;
  showProjectInput = 0;
  listing_property = [];
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
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private _router: Router,
    private http: HttpClient,
    private _location: Location) { }
  ngOnInit(): void {
    this.common.checkCookie();
    this.getBranch();
    this.unique_id();
    this.projectList();
    this.getCity();
    this.projectType();
    this.route.params.subscribe(params => {
      this.edit_id = params['id'];
      if (this.edit_id) {
        this.getEditData();
      }
    });
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.unique_id();
      this.projectList();
      this.getCity();
      this.projectType();
    });

    this.basicFormGroup = this.fb.group({
      api_token: this.tokenId,
      pid: [null],
      reference_id: [null],
      listing_id: [null],
      property_id: [null],
      title: [null, [Validators.required]],

      leads_type:[0],
      product_type: [1, [Validators.required]],
      product: [null],
      project_name: [null],
      project_type: [null],
      property_type: [1],

      property_location: [null, [Validators.required]],
      city: [null, [Validators.required]],
      area: [null, [Validators.required]],
      block: [null],
      sector: [null],
      road: [null],
      road_size: [null],
      plot_no: [null],
      plot_size: [null],
      facing: [null],
      category: [null],
      plot_boundary: [null],
      property_registration: [null],
      paper_status: [null],
      description: [null],
      property_address: [null],
      latitude: [null],
      longitude: [null],
      is_publish: [1],
    });

    this.imageVideoForm = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      is_publish: [1],
    });

    this.priceAndContactDetails = this.fb.group({
      api_token: this.tokenId,
      property_id: [null],
      offer_price: [null],
      bottom_price: [null],
      property_owner_commission_percent: [null],
      property_owner_commission_fixed: [null],
      property_owner_commission_amount: [null],
      property_channel: [null],
      product_person: [null],
      source: [null],
      company_name: [null],
      company_website: [null],
      designation: [null],
      contact_person: [null],
      contact_number: [null],
      contact_address: [null],
      contact_zipcode: [null],
      contact_email: [null],
      contact_phone_no: [null],
      alternative_contact_no: [null],
      representative_name: [null],
      agreement_upload: [null],
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
          this.common.openTost('error', 'ERROR', 'Please try again later');
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

  leadsTypeChange(event) {
    this.showProjectInput = event;
  }
  changeProductName(event){
    this.show_type_of_product = event; 
  }

  changePropertyType(event) {
    if (event === 1) {
      this.showPropertyReg = true;
    } else {
      this.showPropertyReg = false;
    }
    if (event === 2) {
      this.showPaperStatus = true;
    } else {
      this.showPaperStatus = false;
    }
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
      pre.AreaImageFile = e.target.result;
      pre.AreaSelectedFile = e.target.result;
      pre.AreaChangeImg = true;
      pre.AreaselectImg = false;
    },
      reader.readAsDataURL(area.target.files[0]);
  }
}
AreaRemoveImage() {
  this.AreaSelectedFile = null;
  this.AreaChangeImg = false;
  this.AreaImageFile = this.defaultImage;
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
      'type': 'for-land-sale',
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

  changePropertyChannel(event) {
    this.channel = event;
  }

  changeComissionAmount(event: number) {
    const percent = this.priceAndContactDetails.controls.property_owner_commission_percent.value;
    const fixed = this.priceAndContactDetails.controls.property_owner_commission_fixed.value;
    if (Number(percent) > 0) {
      const comission = (Number(event) * Number(percent)) / 100;
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(comission);
    } else if (Number(fixed) > 0) {
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(fixed);
    } else {
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(null);
    }

  }
  changeComissionPercent(event: number) {
    const offer_price = this.priceAndContactDetails.controls.offer_price.value;
    if (event > 0) {
      const comission = (Number(offer_price) * Number(event)) / 100;
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(comission);
    } else {
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(null);
    }
    this.priceAndContactDetails.controls['property_owner_commission_fixed'].setValue(null);
  }

  changeComissionFixed(event: number) {
    if (event > 0) {
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(event);
    } else {
      this.priceAndContactDetails.controls['property_owner_commission_amount'].setValue(null);
    }
    this.priceAndContactDetails.controls['property_owner_commission_percent'].setValue(null);
  }


  // agrement upload
  onAgrementUpload(fileEvent) {
    const pre = this;
    if (fileEvent.target.files && fileEvent.target.files[0]) {
      const name = fileEvent.target.files[0].name;
      const ext = name.split('.').pop();
      const reader = new FileReader();
      reader.onload = function (e: any) {
        pre.agreementFile = e.target.result;
        const fileUpload = {
          extension: ext,
          base64: pre.agreementFile
        };
        const data = {
          'action': 'create',
          'type': ext,
          'name': name,
          'file': fileUpload,
          'view_file': pre.agreementFile,
          'edit_file': true,
        };
        pre.upload_agreement.push(data);
      };
      reader.readAsDataURL(fileEvent.target.files[0]);
    }

  }
  AgrementRemoveImage(remove_id: any) {
    this.upload_agreement.forEach((value, index) => {
      if (value === remove_id) {
        this.upload_agreement.splice(index, 1);
      }
    });
  }


  submitBasicForm() {
    this.submitForm();
  }
  submitForm(): void {
    if (this.basicFormGroup.valid) {
      this.pageBuffer = true;
      const inputData = this.basicFormGroup.value;
      this.dataService.create(inputData, 'for-land-sale-property/post-basic-info')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.common.openTost('success', 'SUCCESS', data.message);
          this.basicFormGroup.controls['property_id'].setValue(data.id);
          this.imageVideoForm.controls['property_id'].setValue(data.id);
          this.priceAndContactDetails.controls['property_id'].setValue(data.id);
          this.extraInformation.controls['property_id'].setValue(data.id);
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
          'is_publish': this.imageVideoForm.controls.is_publish.value,
          'thumbnail': this.SelectedFile ? this.SelectedFile : '',
          'area_map': this.AreaSelectedFile ? this.AreaSelectedFile : '',
          'upload_files': this.upload_documents,
        };
       this.dataService.postEncodedData(postData, 'for-land-sale-property/post-image-video')
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
      const priceData = {
        'api_token': this.priceAndContactDetails.controls.api_token.value,
        'property_id': this.priceAndContactDetails.controls.property_id.value,
        'offer_price': this.priceAndContactDetails.controls.offer_price.value,
        'bottom_price': this.priceAndContactDetails.controls.bottom_price.value,
        'property_owner_commission_percent': this.priceAndContactDetails.controls.property_owner_commission_percent.value,
        'property_owner_commission_fixed': this.priceAndContactDetails.controls.property_owner_commission_fixed.value,
        'property_owner_commission_amount': this.priceAndContactDetails.controls.property_owner_commission_amount.value,
        'property_channel': this.priceAndContactDetails.controls.property_channel.value,
        'product_person': this.priceAndContactDetails.controls.product_person.value,
        'source': this.priceAndContactDetails.controls.source.value,
        'company_name': this.priceAndContactDetails.controls.company_name.value,
        'company_website': this.priceAndContactDetails.controls.company_website.value,
        'designation': this.priceAndContactDetails.controls.designation.value,
        'contact_person': this.priceAndContactDetails.controls.contact_person.value,
        'contact_number': this.priceAndContactDetails.controls.contact_number.value,
        'contact_address': this.priceAndContactDetails.controls.contact_address.value,
        'contact_zipcode': this.priceAndContactDetails.controls.contact_zipcode.value,
        'contact_email': this.priceAndContactDetails.controls.contact_email.value,
        'contact_phone_no': this.priceAndContactDetails.controls.contact_phone_no.value,
        'alternative_contact_no': this.priceAndContactDetails.controls.alternative_contact_no.value,
        'representative_name': this.priceAndContactDetails.controls.representative_name.value,
        'agreement_upload': this.upload_agreement,
        'is_publish': this.priceAndContactDetails.controls.is_publish.value,
      };
      this.dataService.create(priceData, 'for-land-sale-property/post-price-contact')
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
    this.dataService.create(this.extraInformation.value, 'for-land-sale-property/post-other-information')
    .subscribe(data => {
      this.pageBuffer = false;
      if (data.response === 200) {
        this.common.openTost('success', 'SUCCESS', data.message);
        if(this.edit_id){
          this._location.back();
        }else{
          this._router.navigate(['/property-management/qc-land-sale-property-list']);
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

  showMap(): void {
    const dialogRef = this.dialog.open( LandSaleMapModel, {
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
    this.dataService.create(inputData, 'for-land-sale-property/edit')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            // this.dcInformation = data.list.basic_info.dc_info;
            this.basicFormGroup.controls['property_id'].setValue(data.list.basic_info.id);
            this.imageVideoForm.controls['property_id'].setValue(data.list.basic_info.id);
            this.priceAndContactDetails.controls['property_id'].setValue(data.list.basic_info.id);
            this.extraInformation.controls['property_id'].setValue(data.list.basic_info.id);
            this.showEditForm(data.list);

            if (data.list.price_contact.agreement_upload) {
              const agreement = JSON.parse(data.list.price_contact.agreement_upload);
              if (agreement.length > 0) {
                agreement.forEach((element, index) => {
                  const age = {
                    'action': 'edit',
                    'type': element.url.split('.').pop(),
                    'name': element.url,
                    'file':  element.url,
                    'view_file': element.url,
                    'edit_file': true,
                  };
                  this.upload_agreement.push(age);
                });
              }
            }
            this.ImageFile = this.rootUrl + data.list.thumbnail?.url;
            this.AreaImageFile = this.rootUrl + data.list.areamap?.url;
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
    this.dataService.create(inputData, 'for-land-sale-property/filter-listing-id')
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
    this.dataService.create(inputData, 'for-land-sale-property/id-wise-property')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.showEditForm(data.list);
            if (data.list.price_contact.agreement_upload) {
              const agreement = JSON.parse(data.list.price_contact.agreement_upload);
              if (agreement.length > 0) {
                agreement.forEach((element, index) => {
                  const age = {
                    'action': 'edit',
                    'type': element.url.split('.').pop(),
                    'name': element.url,
                    'file':  element.url,
                    'view_file': element.url,
                    'edit_file': true,
                  };
                  this.upload_agreement.push(age);
                });
              }
            }
            this.ImageFile = this.rootUrl + data.list.thumbnail?.url;
            this.AreaImageFile = this.rootUrl + data.list.areamap?.url;
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
    this.basicFormGroup.patchValue({
      pid: data.basic_info?.property_id,
      reference_id: data.basic_info ? (data.basic_info.reference_id ? data.basic_info.reference_id : '') : '',
      listing_id: data.basic_info ? (data.basic_info.listing_id ? data.basic_info.listing_id : '') : '',
      title: data.basic_info?.title,
      leads_type: data.basic_info?.leads_type,
      product_type: data.basic_info?.product_type,
      product: data.basic_info?.product,
      property_type: data.basic_info?.property_type,
      project_name: data.basic_info?.project_name,
      project_type: data.basic_info?.project_type,
      city: data.basic_info?.city,
      area: data.basic_info?.area,
      property_location: data.basic_info?.property_location,
      block: data.basic_info?.block,
      sector: data.basic_info?.sector,
      road: data.basic_info?.road,
      road_size: data.basic_info?.road_size,
      plot_no: data.basic_info?.plot_no,
      plot_size: data.basic_info?.plot_size,
      facing: data.basic_info?.facing,
      category: data.basic_info?.category,
      plot_boundary: data.basic_info?.plot_boundary,
      property_registration: data.basic_info?.property_registration,
      paper_status: data.basic_info?.paper_status,
      description: data.basic_info?.description,
      property_address: data.basic_info?.property_address,
      latitude: data.basic_info?.latitude,
      longitude: data.basic_info?.longitude,
      is_publish: data.basic_info?.status
    });
    this.imageVideoForm.patchValue({
      is_publish: data.basic_info?.status
    });
    this.priceAndContactDetails.patchValue({
      offer_price: data.price_contact?.offer_price,
      bottom_price: data.price_contact?.bottom_price,
      property_owner_commission_percent: data.price_contact?.property_owner_commission_percent,
      property_owner_commission_fixed: data.price_contact?.property_owner_commission_fixed,
      property_owner_commission_amount: data.price_contact?.property_owner_commission_amount,
      property_channel: data.price_contact?.property_channel,
      product_person: data.price_contact?.product_person,
      source: data.price_contact?.source,
      company_name: data.price_contact?.company_name,
      company_website: data.price_contact?.company_website,
      designation: data.price_contact?.designation,
      contact_person: data.price_contact?.contact_person,
      contact_number: data.price_contact?.contact_number,
      contact_address: data.price_contact?.contact_address,
      contact_zipcode: data.price_contact?.contact_zipcode,
      contact_email: data.price_contact?.contact_email,
      contact_phone_no: data.price_contact?.contact_phone_no,
      alternative_contact_no: data.price_contact?.alternative_contact_no,
      representative_name: data.price_contact?.representative_name,
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

}

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.html',
  styleUrls: ['./for-land-sale.component.scss']
})
export class LandSaleMapModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl = this.common.rootUrl + 'public/uploads/';

  constructor(public dialogRef: MatDialogRef<LandSaleMapModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }
}

