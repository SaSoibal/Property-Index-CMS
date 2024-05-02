import { Component, ElementRef, OnInit, Inject, ViewChild } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl,
} from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { DataService } from '../../../../services/data.service';
import { BadInput } from '../../../../core_classes/bad-input';
import { AppError } from '../../../../core_classes/app-error';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { NzDatePickerComponent } from 'ng-zorro-antd/date-picker';

export interface DialogData {
  pid: number;
  property_id: number;
  details: any;
  thumbnail: any;
  floorplan: any;
  imagevideo: any;
  feature: any;
  price_contact: any;
  other: any;
  history : any;
  product_manage : any;
  product_id: number;
  step: number;
  current_step: number;
  note: string;
  assign_date: string;
  api_token: string;
  operation: string;
}

@Component({
  selector: 'app-land-sale-product',
  templateUrl: './land-sale-product.component.html',
  styleUrls: ['./land-sale-product.component.scss'],
})
export class LandSaleProductComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  pageBuffer = false;
  activeStep = 0;
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection = [];
  property_count:any;

  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private http: HttpClient,
    private _router: Router,
    public dialog: MatDialog) {}
  ngOnInit(): void {
    this.common.checkCookie();
    this.showList();
    this.get_property_count();
    this.common.aProductClickedEvent
    .subscribe((data: string) => {
      this.showList();
      this.get_property_count();
    });
  }

  get_property_count() {
    this.pageBuffer = true;
    const getData = "?"
      + "api_token=" + this.tokenId;
    this.dataService.getAll('property-manage/land-sale-product-count' + getData)
      .subscribe(async(res) => {
          if (res.code === 200) {
            this.property_count =  await res.list;
          } else if (res.code === 404) {
            this.common.openTost('error', 'ERROR', res.message);
          }
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  permission(type) {
    return this.common.permission('property-management/product', type);
  }

  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }
  setStep(step){
    this.activeStep = step;
    this.showList();
  }
  showList() {
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&search=" + this.searchValues
      + "&per_page=" + this.itemPerPage
      + "&page=" + this.pageNumber 
      + "&step=" + this.activeStep + "";
    this.get_list(queryString);
  }

  pageEvent(event) {
    this.pageNumber = event.pageIndex;
    this.itemPerPage = event.pageSize;
    this.showList();
  }

  filter(value: string) {
    this.searchValues = value;
    this.pageNumber = 0;
    this.showList();
  }

  clearFilter() {
    this.searchValues = '';
    this.pageNumber = 0;
    this.showList();
  }

  get_list(postdate) {
    this.pageBuffer = true;
    this.dataService.getAll('property-manage/land-sale-product-list' + postdate)
      .subscribe(async(res) => {
          this.pageBuffer = false;
          if (res.code === 200) {
            this.collection =  await res.list.data;
            this.totalrow =  await res.list.total;
          } else if (res.code === 400) {
            this.collection = [];
            this.totalrow = 0;
          } else if (res.code === 404) {
            this.collection = [];
            this.totalrow = 0;
            this.common.openTost('error', 'ERROR', res.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  openRedModel(property) {
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&pid=" + property.property_id;
    this.pageBuffer = true;
    this.dataService.getAll('approved-list/land-sale-details' + queryString)
      .subscribe(async(res) => {
          this.pageBuffer = false;
          if (res.code === 200) {
            this.detailsModel(property, res.details);
          } else if (res.code === 404) {
            this.common.openTost('error', 'ERROR', res.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });

  }

  detailsModel(property, details) {
    console.log(property,'property')
    if (details?.price_contact?.agreement_upload) {
      details.price_contact.agreement_upload = JSON.parse(details.price_contact.agreement_upload);
    }
    const dialogRef = this.dialog.open( LandSaleProductDetailsModel, {
      width: '900px',
      data: {
        property_id: property.property_id,
        details : property?.land_sale_property,
        thumbnail : property?.land_sale_thumbnail,
        floorplan : property?.land_sale_floorplan,
        imagevideo : property?.land_sale_imagevideo,
        feature : details.feature,
        history : details.history,
        product_manage : details.product_manage,
        price_contact : details.price_contact,
        other : details.other,
        api_token: this.tokenId,
        operation: 'Action',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openStepModel(product) {
    const dialogRef = this.dialog.open( LandSaleProductStepModel, {
      width: '600px',
      data: {
        product_id: product.id,
        current_step: product.step,
        step: '',
        deal_close: '',
        note: '',
        assign_date: new Date(),
        api_token: this.tokenId,
        operation: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }
  
  getPropertyRegistration(event: number) {
    if (event === 1) {
      return 'Registered';
    } else if (event === 2) {
      return 'Unregistered';
    } else if (event === 3) {
      return 'Mutation';
    } else if (event === 4) {
      return 'Rajuk Approval';
    }
  }
}

@Component({
  selector: 'app-land-sale-product-details-modal',
  templateUrl: './land-sale-product-details-modal.html',
  styleUrls: ['./land-sale-product.component.scss'],
})
export class LandSaleProductDetailsModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<LandSaleProductDetailsModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }

  constructionStatusName(status_id) {
    if (status_id === 1) {
      return 'Ready';
    } else if (status_id === 2) {
      return 'On-going';
    } else if (status_id === 3) {
      return 'Upcoming';
    } else {
      return '';
    }
  }
  propertyCurrentStatus(status) {
    if (status === 1) {
      return 'Vacant';
    } else if (status === 2) {
      return 'Occupied';
    }  else {
      return '';
    }
  }
  propertyRegistration(status) {
    if (status === 1) {
      return 'Registered';
    } else if (status === 2) {
      return 'Unregistered';
    } else if (status === 3) {
      return 'Mutation';
    } else if (status === 4) {
      return 'Rajuk Approval';
    } else {
      return '';
    }
  }
  paperStatus(status) {
    if (status === 1) {
      return 'Full Payment';
    } else if (status === 2) {
      return 'Lease dead Complete';
    } else if (status === 3) {
      return 'Lease dead and Mutation Complete';
    } else if (status === 4) {
      return 'Full Paper Complete';
    } else {
      return '';
    }
  }
  getFileType(imgVdo) {
    const img_vdo = imgVdo.url.split('.').pop();
    if (img_vdo === 'jpeg') {
      return 'image';
    } else if (img_vdo === 'jpg') {
      return 'image';
    } else if (img_vdo === 'png') {
      return 'image';
    } else if (img_vdo === 'mov') {
      return 'video';
    } else if (img_vdo === 'mp4') {
      return 'video';
    } else if (img_vdo === '3gp') {
      return 'video';
    } else if (img_vdo === 'ogg') {
      return 'video';
    } else {
      return '';
    }
  }

}


@Component({
  selector: 'app-land-sale-product-step-modal',
  templateUrl: './land-sale-product-step-modal.html',
  styleUrls: ['./land-sale-product.component.scss'],
})
export class LandSaleProductStepModel {
  submitButton = false;
  basicImageFile: any;
  today = new Date();
  tokenId = this.common.mycookie.bearertoken;
  assignDateValue = this.data.assign_date;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<LandSaleProductStepModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              public common: CommonService) {
  }

  // tslint:disable-next-line: typedef
  Changed(fileInput) {
    this.basicImageFile = this.common.up_image_data(fileInput);
  }
  @ViewChild('fileInput') myInputVariable: ElementRef;
  // tslint:disable-next-line: typedef

  @ViewChild('AssignDatePicker') AssignDatePicker!: NzDatePickerComponent;
  disabledAssignDate = (assignDateValue: Date): boolean => {
    if (!assignDateValue || !this.today ) {
      return false;
    }
    return assignDateValue.getTime() <= this.today.getTime();
  };

  removeFile() {
    this.common.fileUpload = '';
    this.myInputVariable.nativeElement.value = '';
  }

  onClick(){
    this.data['attachment'] = this.common.fileUpload,
    this.dataService.create(this.data, 'property-manage/product-step-update')
    .subscribe(data => {
      if (data.response === 200) {
        this.dialogRef.close();
        this.common.openTost('success', 'SUCCESS', data.message);
        this.common.aProductClickedEvent.emit('Component A is clicked!!');
      // tslint:disable-next-line: max-line-length
      } else if (data.response === 400) {
        this.common.openTost('warning', 'WARNING', data.message);
      } else if (data.response === 40) {
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

