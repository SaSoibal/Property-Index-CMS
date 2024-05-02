import { Component,ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-customer-care-edit-lead',
  templateUrl: './customer-care-edit-lead.component.html',
  styleUrls: ['./customer-care-edit-lead.component.scss']
})
export class CustomerCareEditLeadComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  showAffiletInput = 0;
  showProjectInput = 0;
  projectType = 'PROJECT TYPE'
  projectSubType = 'PROJECT SUB TYPE'
  country = [];
  client_type = [];
  occupation = [];
  client_rating = [];
  classification = [];
  select_source = [];
  lead_status = [];
  // task_type = [];
  sub_type = [];
  project = [];
  project_type = [];
  project_sub_type = [];
  location_list = [];
  allocated_to = [];
  filter_no = '';
  createLeadsForm!: FormGroup;
  basicImageFile :any;
  notExistsMessage = '';
  existsMessage = '';
  typeWiseInput = '';
  productOption = '';
  showMaxPrice = false;
  showBudgetMax = false;
  pageBuffer = false;
  edit_lead_id = '';
  branch_list =[];
  team_list = [];
  team_member = [];
  changeBranch = '';
  show_type_of_product=1;

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getCountry();
    this.clientType();
    this.occupationList();
    this.classificationList();
    this.sourceList();
    this.leadStatus();
    this.locationList();
    this.projectList();
    this.getProjectType('0');
    this.getBranch();
    this.route.params.subscribe(params => {
        this.edit_lead_id = params['id'];
        if(this.edit_lead_id) {
          this.getEditData();
        }
    });

    this.createLeadsForm = this.fb.group({
      client: ['0', [Validators.required]],
      country_code: [18, [Validators.required]],
      cell_no: [null, [Validators.required]],
      information_type: ['0', [Validators.required]],
      full_name: [null, [Validators.required]],
      affiliate_name: [null],
      gender: [null, [Validators.required]],
      govt_id: [null],
      passport_no: [null],
      email: [null],
      phone_code: [18],
      phone_no: [null, [Validators.required]],
      country: [18],
      date_of_birth: [null],
      dob_greeting_sms: [null],
      dob_greeting_email: [null],
      client_type: [null],
      client_occupation: [null],
      client_rating: [null],
      product_type: [1],
      product: [null],
      property_type: [1],
      leads_type: ['0', [Validators.required]],
      project: [null],
      classification: [null, [Validators.required]],
      project_type: [null],
      select_source: [null, [Validators.required]],
      budget_min: [null],
      budget_max: [null],
      minimum_size: [null],
      maximum_size: [null],
      beds: [null],
      baths: [null],
      lead_status: [null],
      location: [null],
      block_sector: [null],
      subject: [null, [Validators.required]],
      message: [null],

      team_id: [null],
      team_manager_id: [null],
      allocated_to: [null],
      task_type: [null],
      allocated_date: [null],
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
          if(data.branch.length > 0){
            this.changeBranch = data.branch[0].id;
            this.onBranch(this.changeBranch)
          }  
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

 // branch-wise- all team-list
 onBranch(event){
  this.changeBranch = event;
  this.createLeadsForm.controls['team_id'].setValue('');
  const postdatet = {
    'api_token': this.tokenId,
    'branch_id': event
  };
  this.dataService.create(postdatet, 'common/branch-all-team-list')
    .subscribe(
      data => {
        if (data.code === 200) {
          this.team_list = data.list;
        } else {
          this.team_list = [];
          this.createLeadsForm.controls['team_id'].setValue('');
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
}

teamWiseMember(event) {
  if(event){
    this.createLeadsForm.controls['allocated_to'].setValue('');
    const postdatet = {
      'api_token': this.tokenId,
      'team_id': event,
    };
    this.dataService.create(postdatet, 'common/team-all-member')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.team_member = data.team_member;
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
    // return this.common.permission('customer-care/edit-lead', type);
    return true;
  }

  getCountry() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/country-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.country = data.list;
          } else {
            this.country = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  clientType() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/client-type')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.client_type = data.list;
          } else {
            this.client_type = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  occupationList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/occupation')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.occupation = data.list;
          } else {
            this.occupation = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  classificationList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/classification')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.classification = data.list;
          } else {
            this.classification = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  sourceList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/select-source')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.select_source = data.list;
          } else {
            this.select_source = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  leadStatus() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/lead-status')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.lead_status = data.list;
          } else {
            this.lead_status = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  locationList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/all-location-list')
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
  projectList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/project')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.project = data.list;
          } else {
            this.project = [];
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  searchInput() {
    this.pageBuffer = true;
    var country_code = this.createLeadsForm.value.country_code;
    var number = this.createLeadsForm.value.cell_no;
    const leads = {
      'api_token': this.tokenId,
      'client': this.createLeadsForm.value.client,
      'country_code': country_code,
      'number': number,
    }
    if(number){
      this.dataService.create(leads, 'lead/existing-check')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.existsMessage = data.message;
          this.notExistsMessage = '';
          this.createLeadsForm.controls['client'].setValue(data.client);
          this.setDataList(data);
          // tslint:disable-next-line: max-line-length
        } else if (data.response === 400) {
          this.existsMessage = '';
          this.notExistsMessage = data.message;
          this.createLeadsForm.controls['client'].setValue(data.client);
          this.createLeadsForm.controls['full_name'].setValue('');
          this.createLeadsForm.controls['affiliate_name'].setValue('');
          this.createLeadsForm.controls['gender'].setValue('');
          this.createLeadsForm.controls['govt_id'].setValue('');
          this.createLeadsForm.controls['passport_no'].setValue('');
          this.createLeadsForm.controls['email'].setValue('');
          this.createLeadsForm.controls['phone_code'].setValue(18);
          this.createLeadsForm.controls['phone_no'].setValue('');
          this.createLeadsForm.controls['country'].setValue(18);
          this.createLeadsForm.controls['date_of_birth'].setValue('');
          this.createLeadsForm.controls['dob_greeting_sms'].setValue(false);
          this.createLeadsForm.controls['dob_greeting_email'].setValue(false);
          this.createLeadsForm.controls['client_type'].setValue(null);
          this.createLeadsForm.controls['client_occupation'].setValue(null);
          this.createLeadsForm.controls['client_rating'].setValue(null);
          this.createLeadsForm.controls['product_type'].setValue(1);
          this.createLeadsForm.controls['product'].setValue(null);
          this.createLeadsForm.controls['property_type'].setValue(null);
          this.createLeadsForm.controls['classification'].setValue(null);
          this.createLeadsForm.controls['select_source'].setValue(null);
          this.createLeadsForm.controls['leads_type'].setValue('0');
          this.createLeadsForm.controls['project'].setValue(null);
          this.createLeadsForm.controls['project_type'].setValue(null);

          this.createLeadsForm.controls['budget_min'].setValue(null);
          this.createLeadsForm.controls['budget_max'].setValue(null);
          this.createLeadsForm.controls['minimum_size'].setValue(null);
          this.createLeadsForm.controls['maximum_size'].setValue(null);
          this.createLeadsForm.controls['lead_status'].setValue(null);
          this.createLeadsForm.controls['location'].setValue(null);
          this.createLeadsForm.controls['block_sector'].setValue(null);
          this.createLeadsForm.controls['subject'].setValue(null);
          this.createLeadsForm.controls['message'].setValue(null);
          this.createLeadsForm.controls['beds'].setValue(null);
          this.createLeadsForm.controls['baths'].setValue(null);
        }
      },
      (error: AppError) => {
        this.common.onMainEvent.emit(false);
        this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
        } else { throw error; }
      });
      this.filter_no =  number.toString();
    }else{
      this.notExistsMessage = 'Please Input Phone Number...';
      this.pageBuffer = false;
    }
  }
  getEditData() {
      this.pageBuffer = true;
      const otherData = {
        'api_token': this.tokenId,
        'lead_id': this.edit_lead_id
      };
      this.dataService.create(otherData, 'lead/lead-edit')
      .subscribe(data => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.changeBranch = data.information?.lead_task?.branch_id;
          this.createLeadsForm.controls['client'].setValue(data.lead.client);
          this.createLeadsForm.controls['country_code'].setValue(data.lead.phone_code);
          this.createLeadsForm.controls['cell_no'].setValue(data.lead.phone_no);
          this.createLeadsForm.controls['allocated_to'].setValue(data.information.lead_task ? data.information.lead_task.allocated_to : '');
          this.createLeadsForm.controls['allocated_date'].setValue(data.information.lead_task ? data.information.lead_task.allocated_date : '');
          if (data.information.lead_details.budget_max > 0) {
            this.showBudgetMax = true;
          }
          if (data.information.lead_details.maximum_size > 0) {
            this.showMaxPrice = true;
          }
          this.setDataList(data);
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
  setDataList(data) {
    this.createLeadsForm.patchValue({
      information_type: data.information.information_type,
      full_name: data.information.full_name,
      affiliate_name: data.information.affiliate_name,
      gender: data.information.gender,
      govt_id: data.information.govt_id,
      passport_no: data.information.passport_no,
      email: data.information.email,
      phone_code: data.information.phone_code,
      phone_no: data.information.phone_no,
      country: data.information.country,
      date_of_birth: data.information.date_of_birth,
      dob_greeting_sms: data.information.dob_greeting_sms==1?true:false,
      dob_greeting_email: data.information.dob_greeting_email==1?true:false,
      client_type: data.information.client_type,
      client_occupation: data.information.client_occupation,
      client_rating: data.information.client_rating,
      leads_type: data.information.opportunity ? data.information.opportunity.leads_type : 0,
      product_type: data.information.product_type,
      product: data.information.product,
      project: data.information.opportunity ? data.information.opportunity.project : 0,
      classification: data.information.opportunity ? data.information.opportunity.classification : '',
      project_type: data.information.opportunity ? data.information.opportunity.project_type : 0,
      property_type: data.information.opportunity ? data.information.opportunity.property_type : 0,
      select_source: data.information.opportunity ? data.information.opportunity.select_source : '',
      // budget_pre: data.information.lead_details ? data.information.lead_details.budget_pre : null,
      budget_min: data.information.lead_details ? data.information.lead_details.budget_min : null,
      budget_max: data.information.lead_details ? data.information.lead_details.budget_max : null,
      minimum_size: data.information.lead_details ? data.information.lead_details.minimum_size : null,
      maximum_size: data.information.lead_details ? data.information.lead_details.maximum_size : null,
      
      beds: data.information.lead_details ? data.information.lead_details.beds : null,
      baths: data.information.lead_details ? data.information.lead_details.baths : null,
      lead_status: data.information.lead_details ? data.information.lead_details.lead_status : null,
      location: data.information.lead_details ? data.information.lead_details.location : null,
      block_sector: data.information.lead_details ? data.information.lead_details.block_sector : null,
      subject: data.information.lead_details ? data.information.lead_details.subject : null,
      message: data.information.lead_details ? data.information.lead_details.message : null,
      team_id: data.information.lead_task?data.information.lead_task.team_id: null,
      allocated_to: data.information.lead_task?data.information.lead_task.allocated_to: null,
      allocated_date: data.information.lead_task?data.information.lead_task.allocated_date: null
      });
    }

  clearInput() {
    this.createLeadsForm.controls['cell_no'].setValue('');
    this.createLeadsForm.controls['phone_no'].setValue('');
    this.filter_no = '';
  }

  clickToAddBtn() {
    var code = this.createLeadsForm.value.country_code;
    var number = this.createLeadsForm.value.cell_no;
    this.createLeadsForm.controls['phone_code'].setValue(code);
    this.createLeadsForm.controls['phone_no'].setValue(number);
  }

  informationType(event) {
    this.showAffiletInput = event;
  }

  leadsTypeChange(event) {
    this.showProjectInput = event;
    this.getProjectType(event);
  }
  getProjectType(setting_type) {
    const inputData = {
      'api_token': this.tokenId,
      'setting_type': setting_type,
    };
    this.dataService.create(inputData, 'lead/project-type')
    .subscribe(async(data) => {
      if (data.response === 200) {
        this.project_type = await data.project_type;
      } else if (data.response === 400) {
        this.project_type = [];
      }
    },
    (error: AppError) => {
      this.common.onMainEvent.emit(false);
      this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
      } else { throw error; }
    });
  }

  changeProductName(event){
    this.show_type_of_product = event; 
  }

  addBudgetMax() {
    this.showBudgetMax = true;
  }
  hideBudgetMax() {
    this.showBudgetMax = false;
  }

  addMaxPrice() {
    this.showMaxPrice = true;
  }
  hideMaxPrice() {
    this.showMaxPrice = false;
  }

  changeProjectType(event){
    if(event > 0){
      const p_type = this.project_type?.find(x => x.id == event);
      if(p_type){
        this.typeWiseInput = p_type.options;
        if(p_type.options =='apartment'){
          this.createLeadsForm.controls['beds'].setValue(null);
          this.createLeadsForm.controls['baths'].setValue(null);
        }else{
          this.createLeadsForm.controls['beds'].setValue(null);
          this.createLeadsForm.controls['baths'].setValue(null);
        }
      }
    }
  }


   // tslint:disable-next-line: typedef
  Changed(fileInput) {
    this.basicImageFile = this.common.up_image_data(fileInput);
  }
 @ViewChild('fileInput') myInputVariable: ElementRef;
 // tslint:disable-next-line: typedef
 removeFile() {
   this.common.fileUpload ='';
   this.myInputVariable.nativeElement.value = '';
 }

  submitLeadsForm(): void {
    if (this.createLeadsForm.valid) {
      const inputData = {
        'api_token': this.tokenId,
        'id': this.edit_lead_id,
        'operation':this.edit_lead_id ? 'update' : 'create',
        'branch_id': this.changeBranch,
        'client': this.createLeadsForm.value.client,
        'country_code': this.createLeadsForm.value.country_code,
        'cell_no': this.createLeadsForm.value.cell_no,

        'information_type': this.createLeadsForm.value.information_type,
        'affiliate_name': this.createLeadsForm.value.affiliate_name,
        'full_name': this.createLeadsForm.value.full_name,
        'gender': this.createLeadsForm.value.gender,
        'govt_id': this.createLeadsForm.value.govt_id,
        'passport_no': this.createLeadsForm.value.passport_no,
        'email': this.createLeadsForm.value.email,
        'phone_code': this.createLeadsForm.value.phone_code,
        'phone_no': this.createLeadsForm.value.phone_no,
        'country': this.createLeadsForm.value.country,
        'date_of_birth': this.createLeadsForm.value.date_of_birth,
        'attachment': this.common.fileUpload,
        'dob_greeting_sms': this.createLeadsForm.value.dob_greeting_sms,
        'dob_greeting_email': this.createLeadsForm.value.dob_greeting_email,

        'client_type': this.createLeadsForm.value.client_type,
        'client_occupation': this.createLeadsForm.value.client_occupation,
        'client_rating': this.createLeadsForm.value.client_rating,
        'product_type': this.createLeadsForm.value.product_type,
        'product': this.createLeadsForm.value.product,

        'leads_type': this.createLeadsForm.value.leads_type,
        'project': this.createLeadsForm.value.project,
        'classification': this.createLeadsForm.value.classification,
        'project_type': this.createLeadsForm.value.project_type,
        'property_type': this.createLeadsForm.value.property_type,
        'sub_type': this.createLeadsForm.value.sub_type,
        'select_source': this.createLeadsForm.value.select_source,

        'budget_min': this.createLeadsForm.value.budget_min,
        'budget_max': this.createLeadsForm.value.budget_max,
        'minimum_size': this.createLeadsForm.value.minimum_size,
        'maximum_size': this.createLeadsForm.value.maximum_size,

        'land_area': this.createLeadsForm.value.land_area,
        'land_area_min': this.createLeadsForm.value.land_area_min,
        'land_area_max': this.createLeadsForm.value.land_area_max,
        'land_area_size': this.createLeadsForm.value.land_area_size,

        'beds': this.createLeadsForm.value.beds,
        'baths': this.createLeadsForm.value.baths,
        'lead_status': this.createLeadsForm.value.lead_status,
        'location': this.createLeadsForm.value.location,
        'block_sector': this.createLeadsForm.value.block_sector,
        'subject': this.createLeadsForm.value.subject,
        'message': this.createLeadsForm.value.message,

        'team_id': this.createLeadsForm.value.team_id,
        'team_manager_id': this.createLeadsForm.value.team_manager_id,
        'allocated_to': this.createLeadsForm.value.allocated_to,
        'task_type': this.createLeadsForm.value.task_type,
        'allocated_date': this.createLeadsForm.value.allocated_date ? this.createLeadsForm.value.allocated_date:''

    };
      this.dataService.create(inputData, 'lead/create')
        .subscribe(data => {
          if (data.response === 200) {
            this.common.openTost('success', 'SUCCESS', data.message);
            this.router.navigate(['/customer-care/lead-list']);
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
      Object.values(this.createLeadsForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }


}



