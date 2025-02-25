import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, formatDate } from '@angular/common';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';


export interface DialogData {
  lead: any;
  branch_id: number;
  lead_id: string;
  lead_status: string;
  task_row_id: number;
  allocated_to: number;
  task_type: number;
  amount: number;
  no_opportunity: string;
  cheque_no: string;
  sub_type: number;
  location: number;
  complete_date: string;
  step_action: number;
  comments: string;
  comments_old: string;
  next_task: number;
  new_assign_date: string;
  reschedule_comments: string;
  classification: string;
  task_type_list: any;
  task_classify: any;
  next_task_list: any;
  next_task_list_count: number;
  previous_step: number;
  reallocated_team: any;
  team_id: number;
  team_manager: string;
  team_manager_id: number;
  allocated_date: any;
  user_type: number;
  deal_close: number;
  deal_close_type: string;
  stage_list: any;
  client_details: any;
  select_property_list: any;
  operation: string;
}

export interface DialogProperty {
  lead_id: number;
  branch_id: number;
  product_type: number;
  project_type: number;
  location: number;
  city: number;
  area: number;
  beds: any;
  baths: any;
  min_price: number;
  max_price: number;
  property_id: string;
  property_name: string;
  selected_property: any;
  api_token: string;
  operation: string;
}

@Component({
  selector: 'app-todolist',
  templateUrl: './todolist.component.html',
  styleUrls: ['./todolist.component.scss']
})
export class TodolistComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  process_step = [];
  task_type_list = [];
  reallocated_team = [];
  user_type;
  city_list = [];
  area_list = [];

  erroeMsg = '';
  totalrow = 0;
  itemPerPage = 10;
  public pageNumber: number = 1;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = false;
  sortColumn = 'allocated_date';
  public searchValues: string = '';
  collection = [];
  dataNotFound = '';
  today = new Date().toISOString().slice(0, 10);
  classification_id = '';
  selected_date = '';
  selected_date_type = 'only';
  taskStep = 1;
  day_wise_counting = '';
  filter_type = '';
  team_list = [];
  manager_list = [];
  task_type = '';
  date_to_date = '';
  date = null;
  pageBuffer = false;
  branch_list =[];
  changeBranch = '';
  team_id = '';
  member_id = '';
  team_member = [];

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getBranch();
    this.lead_process_list();
    this.showList();
    this.route.params.subscribe(params => {
      this.taskStep = params['step']?params['step']:1;
      this.showList();
    });
  }

  getTodoClass(allocatedDate: string): string {
    const today = new Date();
    const taskDate = new Date(allocatedDate);
    const diffInTime = taskDate.getTime() - today.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));

    if (diffInDays < 0) {
      return 'todo-orange'; // Overdue
    } else if (diffInDays === 0) {
      return 'todo-red'; // Today
    } else if (diffInDays === 1) {
      return 'todo-green'; // Tomorrow
    } else if (diffInDays <= 7) {
      return 'todo-blue'; // Within 7 days
    } else if (diffInDays <= 30) {
      return 'todo-yellow'; // Within 30 days
    }
    return ''; // No class for dates beyond 30 days
  }

  getBranch(){
    const postdatet = {
      'api_token': this.tokenId,
    }
    this.dataService.create(postdatet, 'sys-branch-list')
    .subscribe(
      async(data) => {
        if (data.response === 200) {
          this.branch_list = await data.branch;
          this.changeBranch = data.branch[0].id;
          this.onBranch(this.changeBranch);
          this.lead_process_list();
          this.showList();
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
        async(data) => {
          if (data.code === 200) {
            this.team_list = await data.list;
            if(data.list.length == 1){
              this.team_id = data.list[0].id;
              this.teamWiseMember(data.list[0].id)
            }
            this.lead_process_list();
            this.showList();
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
          async(data) => {
            if (data.response === 200) {
              this.team_member = await data.team_member;
              if(data.team_member.length == 1){
                this.member_id = data.team_member[0].systemuser_id;
              }
              this.lead_process_list();
              this.showList();
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

  clickMemberData(event){
    this.member_id = event?event:'';
    this.showList();
    this.lead_process_list();
  }

  permission(type) {
    return this.common.permission('leads/to-do-list', type);
  }

  lead_process_list() {
    const postdate = {
      'api_token': this.tokenId,
      'branch_id': this.changeBranch,
      'team_id': this.team_id,
      'member_id': this.member_id
    };
    this.dataService.create(postdate, 'lead_process_list')
    .subscribe(async(data) => {
        if (data.response === 200) {
          this.process_step = await data.process_step;
          this.task_type_list = await data.task_type;
          this.reallocated_team = await data.reallocated_team;
          this.filter_type = await data.filter_type;
          this.user_type = data.user_type;
          this.city_list = data.city_list;
        } else {
          this.filter_type = await data.filter_type;
          this.process_step = [];
          this.task_type_list = [];
          this.city_list = [];
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  openStepModel(lead) {
    this.pageBuffer = true;
    const postdate = {
      'api_token': this.tokenId,
      'lead_id': lead.id
    };
    this.dataService.create(postdate, 'common/lead-step-data')
    .subscribe(async(data) => {
        this.pageBuffer = false;
        if (data.response === 200) {
         await this.stepModel(lead, data.task_classify, data.next_task_list, data.next_task, data.selected_properties);
        } else if (data.response === 400) {
          this.stepModel(lead, [], [], '', []);
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  stepModel(lead, task_classify, next_task_list, next_task, selected_properties) {
    const dialogRef = this.dialog.open( StepTodolist, {
      width: '800px',
      data: {
        branch_id:this.changeBranch,
        select_property_list: selected_properties,
        task_type_list: this.task_type_list,
        task_classify: task_classify,
        next_task_list: next_task_list,
        next_task_list_count: next_task_list.length,
        lead: lead,
        lead_id: lead.id,
        lead_status: lead.status,
        amount: '',
        cheque_no: '',
        no_opportunity: '',
        team_id: lead.tasks.team_id,
        team_manager_id: lead.tasks.manager_id,
        allocated_to: lead.tasks.allocated_to,
        task_type: lead.current_task ? lead.current_task.id : 0,
        sub_type: lead.tasks.task_sub_type,
        location: lead.tasks.location,
        complete_date: lead.tasks.allocated_date,
        comments_old: lead.tasks.comments,
        previous_step: lead.tasks.previous_step,
        step_action: 0,
        new_assign_date: lead.tasks.allocated_date,
        comments: '',
        next_task: next_task,
        deal_close: '1',
        deal_close_type:'',
        classification: '',
        api_token: this.tokenId,
        operation: 'Submit'
      }
    });
    dialogRef.afterClosed().subscribe( result => {
      this.showList();
      this.lead_process_list();
    });
  }




  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }


  onClickTaskStep(sort) {
    this.taskStep = sort;
    this.showList();
  }

  select_date(date, date_type) {
    this.selected_date = date;
    this.selected_date_type = date_type;
    this.showList();
  }

  classification(classification_id) {
    this.classification_id = classification_id;
    this.showList();
  }

  onChangeDateRange(result: Date[]) {
    if (result.length > 0) {
      this.date_to_date = formatDate(result[0], 'Y-MM-d', 'en-US') +','+ formatDate(result[1], 'Y-MM-d', 'en-US');
    } else {
      this.date_to_date = '';
    }
    this.showList();
  }

  showList() {
    let orderBy: string;
    if (this.dataOrderBy === true) {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }
       const curl = "?"
         + "search=" + this.searchValues
         + "&per_page=" +  this.itemPerPage
         + "&sort_by=" + orderBy
         + "&sort_column=" +  this.sortColumn
         + "&page=" + this.pageNumber
         + "&api_token=" +  this.tokenId
         + "&date=" +  this.selected_date
         + "&date_type=" +  this.selected_date_type
         + "&step=" +  this.taskStep
         + "&date_to_date=" +  this.date_to_date
         + "&branch_id=" +  this.changeBranch
         + "&team_id=" +  this.team_id
         + "&member_id=" +  this.member_id;
         + "&classification_id=" +  this.classification_id;
       this.get_list(curl);
  }

  pageEvent(event){
    this.pageNumber = event.pageIndex + 1;
    this.itemPerPage = event.pageSize;
    this.showList();
  }

  sort(column: string) {
    if (this.sortColumn === column) {
      this.dataOrderBy = !this.dataOrderBy;
    } else {
      this.sortColumn = column;
    }
    this.showList();
  }

  filter(value: string) {
    this.searchValues = value;
    this.pageNumber = 1;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 1;
    this.showList();
  }

  get_list(curl) {
    this.pageBuffer = true;
    this.dataService.getAll('get-task-list/' + curl)
    .subscribe(async(data) => {
        this.pageBuffer = false;
        if (data.response === 200) {
          this.collection = await data.list.data;
          this.totalrow = await data.list.total;
          this.day_wise_counting = await data.task_data;
          // this.dataNotFound = '';
        } else if (data.response === 400) {
          this.collection = [];
          this.totalrow = await data.list.total;
          this.day_wise_counting = await data.task_data;
          // this.dataNotFound = data.message;
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

  reScheduleModel(list) {
    const dialogRef = this.dialog.open( RescheduleReassign, {
      width: '500px',
      data: {
        branch_id:this.changeBranch,
        lead_id: list.id,
        task_row_id : list.tasks.id,
        reallocated_team: this.reallocated_team,
        user_type: this.user_type,
        task_type: list.tasks.task_type,
        sub_type: list.tasks.task_sub_type,
        lead_status: list.status,
        team_id: list.tasks.team_id,
        team_manager: list.tasks.team_manager,
        team_manager_id: list.tasks.manager_id,
        allocated_to: list.tasks.allocated_to,
        allocated_date: list.tasks.allocated_date,
        previous_step: list.tasks ? list.tasks.id : 0,
        reschedule_comments: '',
        api_token: this.tokenId,
        operation: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
              this.showList();
        this.lead_process_list();
    });
  }

  leadNoGenerate(lead: number) {
    return String(lead).padStart(6, '0');
  }

  clickAllChecked(event){
    this.collection.forEach(elements => {
      elements.check =  event;
    });
  }

  singleChecked(event, leads_id) {
    this.collection.forEach(elements => {
      if (elements.id == leads_id) {
        elements.check =  event;
      }
    });
  }

  getIconSrc(classificationId: number | undefined): string {
    if (classificationId === 1) {
      return './assets/img/brand/fire.png';
    } else if (classificationId === 2) {
      return './assets/img/brand/Hot.png';
    } else if (classificationId === 3) {
      return './assets/img/brand/Moderate.png';
    } else if (classificationId === 4) {
      return './assets/img/brand/Cold.png';
    }
    return ''; // Return an empty string if no classificationId or no matching icon
  }


  detailsModel(lead) {
    this.pageBuffer = true;
    const postdate = {
      'api_token': this.tokenId,
      'lead_id': lead.id
    };
    this.dataService.create(postdate, 'common/lead-details')
    .subscribe(
      async(data) => {
        if (data.response === 200) {
          await this.common.leadDetailsModel(lead, data.details, data.process, data.process_start);
          this.pageBuffer = false;
        } else if (data.response === 400) {
        }
      },
      (error: AppError) => {
        this.common.openTost('error', 'ERROR', 'Please try again later');
      if (error instanceof BadInput) {
        } else { throw error; }
      });
  }

}


@Component({
  selector: 'step-todolist-model',
  templateUrl: './step-todolist-model.html',
  styleUrls: ['./todolist.component.scss']
})
export class StepTodolist {
  rootUrl =  this.common.rootUrl + 'public/uploads/property/';
  basicImageFile: any;
  tokenId = this.common.mycookie.bearertoken;
  sub_type = [];
  city_id = 0;
  area_list = [];
  property_list = [];
  today = new Date();
  dateValue = this.data.complete_date;
  assignDateValue = this.data.new_assign_date;
  showDealClose = false;
  pageBuffer = false;
  showNextAction = 0;
  // tslint:disable-next-line: max-line-length
  constructor(
    public dialogRef: MatDialogRef<StepTodolist>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    public dialog: MatDialog,
    private common: CommonService) {
      if (this.data.task_type) {
        this.changeTaskType(this.data.task_type);
      }
      if (this.data.task_type == 10) {
        this.showDealClose = true;
      }

    }

    openBrowseModel(lead) {
      const dialogCreRef = this.dialog.open(browsePropertyModel, {
        width: '1000px',
        data: {
          selected_property: this.data.select_property_list,
          branch_id:this.data.branch_id,
          lead_id: lead.lead_id,
          product_type: '',
          project_type: '',
          location: '',
          city: '',
          area: '',
          beds: lead.lead_details?.beds,
          baths: lead.lead_details?.baths,
          min_price: '',
          max_price: '',
          property_id: '',
          property_name: '',
          api_token: this.tokenId,
          operation: 'Selected',
        }
      });
      dialogCreRef.afterClosed().subscribe( result => {
        if (result) {
          this.data.select_property_list = result;
        }
      });

    }

    changeTaskStatus(event) {
      if (event == 11) {
        this.showDealClose = true;
      } else {
        this.showDealClose = false;
      }
    }

    @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
    disabledEndDate = (dateValue: Date): boolean => {
      if (!dateValue || !this.today ) {
        return false;
      }
      return dateValue.getTime() <= this.today.getTime();
    };

    @ViewChild('AssignDatePicker') AssignDatePicker!: NzDatePickerComponent;
    disabledAssignDate = (assignDateValue: Date): boolean => {
      if (!assignDateValue || !this.today ) {
        return false;
      }
      return assignDateValue.getTime() <= this.today.getTime();
    };

       // tslint:disable-next-line: typedef
  Changed(fileInput) {
    this.basicImageFile = this.common.up_image_data(fileInput);
 }
 @ViewChild('fileInput') myInputVariable: ElementRef;
 // tslint:disable-next-line: typedef
 removeFile() {
   this.common.fileUpload = '';
   this.myInputVariable.nativeElement.value = '';
 }

 changeTaskType(event) {
  const postdate = {
    'api_token': this.tokenId,
    'task_type': event
  };
  this.dataService.create(postdate, 'list-task-subtype')
  .subscribe(
    async(data) => {
      if (data.response === 200) {
        this.sub_type = await data.sub_type;
      } else if (data.response === 400) {
        this.sub_type = [];
      }
    },
    (error: AppError) => {
      this.common.openTost('error', 'ERROR', 'Please try again later');
    if (error instanceof BadInput) {
      } else { throw error; }
    });
  }

  ChangedStepAction(event) {
     if (event) {
       this.showNextAction = event;
     } else {
      this.showNextAction = 0;
     }
  }

  onClick(): void {
    const data = {
      branch_id: this.data.branch_id,
      lead_id: this.data.lead_id,
      viewed_property: this.data.select_property_list,
      lead_status: this.data.lead_status,
      team_id: this.data.team_id,
      manager_id: this.data.team_manager_id,
      allocated_to: this.data.allocated_to,
      task_type: this.data.task_type,
      amount: this.data.amount,
      cheque_no: this.data.cheque_no,
      no_opportunity: this.data.no_opportunity,
      sub_type: this.data.sub_type,
      location: this.data.location,
      complete_date: this.dateValue,
      complete_comments: this.data.comments,
      step_action: this.data.step_action,
      new_assign_date: this.assignDateValue,
      next_status: this.data.next_task,
      next_task_classification: this.data.classification,
      next_task_list_count: this.data.next_task_list_count,
      deal_close: this.data.deal_close,
      deal_close_type: this.data.deal_close_type,
      previous_step: this.data.previous_step,
      attachment: this.common.fileUpload,
      api_token: this.tokenId,
      operation: this.data.operation
    };
    this.dataService.create(data, 'lead-process-update')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.AMain('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 401) {
        this.common.openTost('warning', 'WARNING', data.password);
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
}

@Component({
  selector: 'browse-property-model',
  templateUrl: './browse-property.html',
  styleUrls: ['./todolist.component.scss']
})
export class browsePropertyModel implements OnInit {
  rootUrl =  this.common.rootUrl + 'public/uploads/property/';
  tokenId = this.common.mycookie.bearertoken ;
  // tslint:disable-next-line: max-line-length
  city_list = [];
  area_list = [];
  location_list = [];
  product_type_list = [];
  project_type_list = [];
  typeWiseInput = '';

  for_sale = [];
  for_rent = [];
  for_land_sale = [];
  website_sale_property = [];
  website_rent_property = [];
  website_land_sale = [];
  selected_property = this.data.selected_property;
  pageBuffer = false;
  constructor(public dialogCreRef: MatDialogRef<browsePropertyModel>,
    @Inject(MAT_DIALOG_DATA) public data: DialogProperty,
    private dataService: DataService,
    private common: CommonService) {

  }

    ngOnInit() {
      this.getCity();
      this.getLocation();
      this.productType();
      this.projectType();
      this.clickFilter();
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
    projectType() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/project-type')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.project_type_list = data.list;
            if (this.data.project_type) {
              const p_type = data.list.find(x => x.id == this.data.project_type);
              this.typeWiseInput = p_type.options;
            }
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
  getLocation() {
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
              this.common.openTost('warning', 'WARNING', data.message);
            }
          },
          (error: AppError) => {
            this.common.openTost('error', 'ERROR', 'Please try again later');
            if (error instanceof BadInput) {
            } else { throw error; }
          });
    }
    changeCity(city_id) {
      // this.basicFormGroup.controls['area'].setValue(null);
      // this.basicFormGroup.controls['area'].setErrors(null);
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
              this.common.openTost('warning', 'WARNING', data.message);
            }
          },
          (error: AppError) => {
            this.common.openTost('error', 'ERROR', 'Please try again later');
            if (error instanceof BadInput) {
            } else { throw error; }
          });
    }

  changeProjectType(event) {
    if (event > 0 && event !== null) {
      const p_type = this.project_type_list.find(x => x.id == event);
      this.typeWiseInput = p_type.options;
      if (p_type.options == 'flat') {
        this.data.beds = '';
        this.data.baths = '';
      } else {
        this.data.beds = '';
        this.data.baths = '';
      }
    } else {
      this.typeWiseInput = '';
      this.data.beds = '';
      this.data.baths = '';
    }
  }

  clickFilter() {
    this.pageBuffer = true;
    this.dataService.create(this.data, 'common/browse-property')
      .subscribe(
        async(data) => {
          if (data.code === 200) {
             this.for_sale = data.list.for_sale;
             this.for_rent = data.list.for_rent;
             this.for_land_sale = data.list.for_land_sale;
             this.website_sale_property = data.list.website_sale_property;
             this.website_rent_property = data.list.website_rent_property;
             this.website_land_sale = data.list.website_land_sale;
          } else {
            this.for_sale = [];
            this.for_rent = [];
            this.for_land_sale = [];
            this.website_sale_property = [];
            this.website_rent_property = [];
            this.website_land_sale = [];
          }
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {} else { throw error; }
        });
  }

  clearFilter() {
      this.data.product_type = null;
      this.data.project_type = null;
      this.data.location = null;
      this.data.city = null;
      this.data.area = null;
      this.data.beds = '';
      this.data.baths = '';
      this.data.min_price = null;
      this.data.max_price = null;
      this.data.property_id = '';
      this.data.property_name = '';
      this.for_sale = [];
      this.for_rent = [];
      this.for_land_sale = [];
      this.website_sale_property = [];
      this.website_rent_property = [];
      this.website_land_sale = [];
      this.clickFilter();
  }

  clickToSelectProperty(prop, type) {
    let valExist = '';
    if (prop.listing_id) {
       valExist = this.selected_property.some(x => x.listing_id === prop.listing_id && x.property_id === prop.property_id);
    } else {
       valExist = this.selected_property.some(x => x.listing_id === prop.listing_id && x.property_id === prop.property_id);
    }
    if (valExist) {
      console.log('Property Already Selected...');
    } else {
      const property = prop;
      property.save_type = type;
      this.selected_property.push(property);
    }
  }

  removeSelectProperty(remove_id: any) {
    this.selected_property.forEach((value, index) => {
      if (value === remove_id) {
        this.selected_property.splice(index, 1);
      }
    });
  }

  onClick(): void {
    this.dialogCreRef.close(this.selected_property);
  }

  closeModel() {
    this.for_sale = [];
    this.for_rent = [];
    this.for_land_sale = [];
    this.website_sale_property = [];
    this.website_rent_property = [];
    this.website_land_sale = [];
    this.selected_property = [];
  }
}


@Component({
  selector: 'reschedule-reassign-model',
  templateUrl: './reschedule-reassign-model.html',
  styleUrls: ['./todolist.component.scss']
})
export class RescheduleReassign {
  today = new Date();
  dateValue = this.data.allocated_date;
  tokenId = this.common.mycookie.bearertoken ;
  team_input = false;
  team_member_list = [];

  @ViewChild('endDatePicker') endDatePicker!: NzDatePickerComponent;
  disabledEndDate = (dateValue: Date): boolean => {
    if (!dateValue || !this.today ) {
      return false;
    }
    return dateValue.getTime() <= this.today.getTime();
  };

  // tslint:disable-next-line: max-line-length
  constructor(public dialogRef: MatDialogRef<RescheduleReassign>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private dataService: DataService,
    private common: CommonService) {
      if(this.data.team_id){
        this.changeTeam(this.data.team_id);
      }
  }

  changeTeam(event) {
    if (event) {
      this.team_input = true;
      const postdate = {
        'api_token': this.tokenId,
        'team_id': event
      };
      this.dataService.create(postdate, 'common/team-member')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.team_member_list = data.team_member;
            this.data.team_manager = data.team_manager.name;
            this.data.team_manager_id = data.team_manager.id;
          } else if (data.response === 400) {
            this.team_member_list = [];
            this.data.team_manager = '';
            this.data.team_manager_id = 0;
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
        if (error instanceof BadInput) {
          } else { throw error; }
        });
    } else {
      this.team_input = false;
    }

  }

  onClick(): void {
    const dataList = {
        branch_id: this.data.branch_id,
        lead_id: this.data.lead_id,
        task_row_id: this.data.task_row_id,
        user_type: this.data.user_type,
        task_type: this.data.task_type,
        sub_type: this.data.sub_type,
        status: this.data.lead_status,
        reschedule_comments: this.data.reschedule_comments,
        team_id: this.data.team_id,
        manager_id: this.data.team_manager_id,
        allocated_to: this.data.allocated_to,
        previous_step: this.data.previous_step,
        allocated_date: this.dateValue,
        api_token: this.tokenId,
        operation: this.data.operation,
    };
    this.dataService.create(dataList, 'common/reschedule-reassign')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.AMain('Component A is clicked!!');
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
}


