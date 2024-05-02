import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../../services/common.service';
import { DataService } from '../../../../services/data.service';
import { BadInput } from '../../../../core_classes/bad-input';
import { AppError } from '../../../../core_classes/app-error';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {formatDate} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';
export interface DialogData {
  pid: number;
  property_id: number;
  details: any;
  feature: any;
  history: any;
  price_contact: any;
  branch_list: any;
  branch_id:number,
  team_id:number,
  team_manager:string,
  manager_id:number,
  user_id:number,
  note:string;
  other: any;
  view_type: number;
  api_token: string;
  operation: string;
}
@Component({
  selector: 'app-for-land-sale-reassign',
  templateUrl: './for-land-sale-reassign-property.component.html',
  styleUrls: ['./for-land-sale-reassign-property.component.scss']
})
export class FLSReassignPropertyComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  totalrow = 0;
  itemPerPage = 10;
  pageNumber = 0;
  pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
  dataOrderBy = true;
  sortColumn = 'id';
  searchValues: String = '';
  collection = [];
  pageBuffer = false;
  // fillter option
  city_list = [];
  location_list = [];
  product_type_list = [];
  user_list = [];
  showFilterOption = false;
  filterOptionButton = true;
  searchName = '';
  searchContactNo = '';
  searchCity = '';
  searchLocation = '';
  product_type = 0;
  product = '';
  lead_type = '';
  searchPropertyType = '';
  searchProjectID = '';
  searchPricemin = '';
  searchPricemax = '';
  searchBeds = '';
  searchBaths = '';
  searchFormApproveDate = '';
  searchToApproveDate = '';
  searchFormAddedDate = '';
  searchToAddedDate = '';
  searchAddedBy = '';
  searchApproveBy = '';

  branch_list =[];

  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService,
              public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getBranch();
    this.showList();
    this.getCity();
    this.getLocation();
    this.productType();
    this.userList();
    this.common.aClickedEvent
      .subscribe((data: string) => {
        this.showList();
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
            this.common.openTost('warning', 'WARNING', data.message);
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
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  userList() {
    const postdatet = {
      'api_token': this.tokenId,
    };
    this.dataService.create(postdatet, 'common/user-list')
      .subscribe(
        data => {
          if (data.response === 200) {
            this.user_list = data.list;
          } else {
            this.user_list = [];
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }

  permission(type) {
    return this.common.permission('property-management/reassign-property', type);
  }

  clickFilterOption() {
    this.showFilterOption = true;
    this.filterOptionButton = false;
  }
  clickFilterOptionClose() {
    this.showFilterOption = false;
    this.filterOptionButton = true;
  }
  getSL(i) {
    return ( Number(this.itemPerPage) * Number(this.pageNumber)) + i;
  }

  filterName(event) {
    this.searchName = event;
  }
  filterContactNo(event) {
    this.searchContactNo = event;
  }
  filterCity(event) {
    this.searchCity = event;
  }
  filterLocation(event) {
    this.searchLocation = event;
  }

  onChangeLeadType(event) {
    this.lead_type = event?event:0;
  }
  onChangeProductType(event) {
    this.product_type = event?event:0;
  }
  onChangeProduct(event) {
    this.product = event?event:'';
  }
  filterPropertyType(event) {
    this.searchPropertyType = event;
  }
  filterProjectID(event) {
    this.searchProjectID = event;
  }
  filterPricemin(event) {
    this.searchPricemin = event;
  }
  filterPricemax(event) {
    this.searchPricemax = event;
  }
  filterBeds(event) {
    this.searchBeds = event;
  }
  filterBaths(event) {
    this.searchBaths = event;
  }
  filterFormApproveDate(event: Date): void  {
    if (event) {
      this.searchFormApproveDate = formatDate(event, 'Y-MM-d', 'en-US');
    } else {
      this.searchFormApproveDate = '';
    }
  }
  filterToApproveDate(event: Date): void  {
    if (event) {
      this.searchToApproveDate = formatDate(event, 'Y-MM-d', 'en-US');
    } else {
      this.searchToApproveDate = '';
    }
  }
  filterFormAddedDate(event: Date): void  {
    if (event) {
      this.searchFormAddedDate = formatDate(event, 'Y-MM-d', 'en-US');
    } else {
      this.searchFormAddedDate = '';
    }
  }
  filterToAddedDate(event: Date): void  {
      if (event) {
        this.searchToAddedDate = formatDate(event, 'Y-MM-d', 'en-US');
      } else {
        this.searchToAddedDate = '';
      }
  }
  filterAddedBy(event) {
    this.searchAddedBy = event;
  }
  filterApproveBy(event) {
    this.searchApproveBy = event;
  }
  clickFilter() {
      let orderBy: string;
      if (this.dataOrderBy === true) {
        orderBy = 'DESC';
      } else {
        orderBy = 'ASC';
      }
      const queryString = "?"
        + "api_token=" + this.tokenId
        + "&sort_column=" + this.sortColumn
        + "&sort_by=" + orderBy
        + "&per_page=" + this.itemPerPage
        + "&page=" + this.pageNumber
        + "&searchName=" + this.searchName
        + "&searchContactNo=" + this.searchContactNo
        + "&searchCity=" + this.searchCity
        + "&searchLocation=" + this.searchLocation
        + "&lead_type=" + this.lead_type
        + "&searchProductType=" + this.product_type
        + "&product=" + this.product
        + "&searchPropertyType=" + this.searchPropertyType
        + "&searchProjectID=" + this.searchProjectID
        + "&searchPricemin=" + this.searchPricemin
        + "&searchPricemax=" + this.searchPricemax
        + "&searchBeds=" + this.searchBeds
        + "&searchBaths=" + this.searchBaths
        + "&searchFormApproveDate=" + this.searchFormApproveDate
        + "&searchToApproveDate=" + this.searchToApproveDate
        + "&searchFormAddedDate=" + this.searchFormAddedDate
        + "&searchToAddedDate=" + this.searchToAddedDate
        + "&searchAddedBy=" + this.searchAddedBy
        + "&searchApproveBy=" + this.searchApproveBy;
      this.get_list(queryString);
  }
  clearFilter() {
    this.searchName = '';
    this.searchContactNo = '';
    this.searchCity = '';
    this.searchLocation = '';
    this.lead_type = '';
    this.product_type = 0;
    this.product = '';
    this.searchPropertyType = '';
    this.searchProjectID = '';
    this.searchPricemin = '';
    this.searchPricemax = '';
    this.searchBeds = '';
    this.searchBaths = '';
    this.searchFormApproveDate = '';
    this.searchToApproveDate = '';
    this.searchFormAddedDate = '';
    this.searchToAddedDate = '';
    this.searchAddedBy = '';
    this.searchApproveBy = '';
    this.showList();
  }
  showList() {
    let orderBy: string;
    if (this.dataOrderBy === true) {
      orderBy = 'DESC';
    } else {
      orderBy = 'ASC';
    }
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&sort_column=" + this.sortColumn
      + "&sort_by=" + orderBy
      + "&per_page=" + this.itemPerPage
      + "&page=" + this.pageNumber;
    this.get_list(queryString);
  }

  pageEvent(event) {
    this.pageNumber = event.pageIndex;
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
    this.pageNumber = 0;
    this.showList();
  }



  get_list(postdate) {
    this.pageBuffer = true;
    this.dataService.getAll('reassign-property/for-land-sale' + postdate)
      .subscribe(async(res) => {
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
          this.pageBuffer = false;
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });
  }
  getConstructionStatus(event: number) {
    if (event === 1) {
      return 'Ready';
    } else if (event === 2) {
      return 'On-going';
    } else if (event === 3) {
      return 'Upcoming';
    }
  }

  openRedModel(property) {
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&pid=" + property.id;
    this.pageBuffer = true;
    this.dataService.getAll('reassign-property/land-sale-details' + queryString)
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
    if (details?.price_contact?.agreement_upload) {
      details.price_contact.agreement_upload = JSON.parse(details.price_contact.agreement_upload);
    }
    const dialogRef = this.dialog.open( LandSaleReassignDetailsModel, {
      width: '800px',
      data: {
        property_id: property.id,
        details : property,
        feature : details.feature,
        price_contact : details.price_contact,
        other : details.other,
        history : details.history,
        api_token: this.tokenId,
        operation: 'Action',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
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

  openListingModel(property){
    const dialogRef = this.dialog.open( LandSaleReassignModel, {
      width: '600px',
      data: {
        property_id: property.id,
        details : property,
        branch_list:this.branch_list,
        branch_id:'',
        team_id:'',
        team_manager:'',
        manager_id:'',
        user_id:'',
        note:'',
        api_token: this.tokenId,
        operation: 'Submit',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }


}

@Component({
  selector: 'app-reassign-details-modal',
  templateUrl: './reassign-details-modal.html',
  styleUrls: ['./for-land-sale-reassign-property.component.scss']
})
export class LandSaleReassignDetailsModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<LandSaleReassignDetailsModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
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
  selector: 'app-re-assign-modal',
  templateUrl: './re-assign-modal.html',
  styleUrls: ['./for-land-sale-reassign-property.component.scss']
})
export class LandSaleReassignModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  team_list = [];
  team_member = [];
  constructor(public dialogRef: MatDialogRef<LandSaleReassignModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }

  changeBranch(event){
    this.data.team_id = 0;
    this.team_list = [];
    this.data.manager_id = 0;
    this.data.team_manager = '';
    this.team_member = [];
    const postdatet = {
      'api_token': this.tokenId,
      'branch_id': event
    };
    this.dataService.create(postdatet, 'common/branch-wise-team-list')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.team_list = data.list;
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
    if(event){
      this.data.manager_id = 0;
      this.data.team_manager = '';
      this.team_member = [];
      const postdatet = {
        'api_token': this.tokenId,
        'team_id': event,
      };
      this.dataService.create(postdatet, 'common/team-member')
        .subscribe(
          data => {
            if (data.response === 200) {
              this.data.manager_id = data?.team_manager?.id;
              this.data.team_manager = data?.team_manager?.name;
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

  onClick(){
    const inputData = {
      'api_token': this.tokenId,
      'property_id': this.data.property_id,
      'branch_id': this.data.branch_id,
      'team_id': this.data.team_id,
      'manager_id': this.data.manager_id,
      'allocated_to': this.data.user_id,
      'note': this.data.note,
    };
    this.dataService.create(inputData, 'reassign-property/for-land-sale-reassign')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.dialogRef.close();
            this.common.openTost('success', 'SUCCESS', data.message);
            this.common.AClicked('Component A is clicked!!');
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

}


