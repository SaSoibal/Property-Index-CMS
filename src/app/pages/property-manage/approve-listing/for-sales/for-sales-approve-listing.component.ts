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
  product_manage: any;
  price_contact: any;
  other: any;
  view_type: number;
  api_token: string;
  operation: string;
}
@Component({
  selector: 'app-dc-form',
  templateUrl: './for-sales-approve-listing.component.html',
  styleUrls: ['./for-sales-approve-listing.component.scss']
})
export class FSApproveListingComponent implements OnInit {
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
  user_list = [];
  const_status = [];
  showFilterOption = false;
  filterOptionButton = true;
  searchName = '';
  searchContactNo = '';
  lead_type = '';
  product_type = 0;
  product = '';
  searchCity = '';
  searchLocation = '';
  searchPropertyType = '';
  searchConstructionStatus = '';
  searchProjectID = '';
  searchPricemin = '';
  searchPricemax = '';
  searchAreamin = '';
  searchAreamax = '';
  searchBeds = '';
  searchBaths = '';
  searchFormApproveDate = '';
  searchToApproveDate = '';
  searchFormAddedDate = '';
  searchToAddedDate = '';
  searchAddedBy = '';
  searchApproveBy = '';
  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService,
              public dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.showList();
    this.getCity();
    this.getLocation();
    this.userList();
    this.constructionStatus();
    this.common.aClickedEvent
      .subscribe((data: string) => {
        this.showList();
        this.getCity();
        this.getLocation();
        this.userList();
        this.constructionStatus();
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
  permission(type) {
    return this.common.permission('property-management/approved-listing', type);
  }
  salePermission(type) {
    return this.common.permission('property-management/for-sales', type);
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
  filterConstructionStatus(event) {
    this.searchConstructionStatus = event;
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
  filterAreamin(event) {
    this.searchAreamin = event;
  }
  filterAreamax(event) {
    this.searchAreamax = event;
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
        + "&leadType=" + this.lead_type
        + "&searchProductType=" + this.product_type
        + "&product=" + this.product
        + "&searchPropertyType=" + this.searchPropertyType
        + "&searchConstructionStatus=" + this.searchConstructionStatus
        + "&searchProjectID=" + this.searchProjectID
        + "&searchPricemin=" + this.searchPricemin
        + "&searchPricemax=" + this.searchPricemax
        + "&searchAreamin=" + this.searchAreamin
        + "&searchAreamax=" + this.searchAreamax
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
    this.searchConstructionStatus = '';
    this.searchProjectID = '';
    this.searchPricemin = '';
    this.searchPricemax = '';
    this.searchAreamin = '';
    this.searchAreamax = '';
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
    this.dataService.getAll('approved-list/for-sales' + postdate)
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
  getConstructionStatus(event: number){
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
    this.dataService.getAll('approved-list/sales-details' + queryString)
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
    const dialogRef = this.dialog.open( ApprovedDetailsModel, {
      width: '900px',
      data: {
        property_id: property.id,
        details : property,
        feature : details.feature,
        price_contact : details.price_contact,
        other : details.other,
        history : details.history,
        product_manage : details.product_manage,
        api_token: this.tokenId,
        operation: 'Action',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

  openListingModel(property){
    const dialogRef = this.dialog.open( SaleListingModel, {
      width: '400px',
      data: {
        property_id: property.id,
        view_type : property.view_type,
        api_token: this.tokenId,
        operation: 'Listing',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}

@Component({
  selector: 'app-approved-details-modal',
  templateUrl: './approved-details-modal.html',
  styleUrls: ['./for-sales-approve-listing.component.scss']
})
export class ApprovedDetailsModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<ApprovedDetailsModel>,
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
    }else if (img_vdo === 'png') {
      return 'image';
    }  else if (img_vdo === 'mov') {
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
  selector: 'app-sales-listing-modal',
  templateUrl: './sales-listing-modal.html',
  styleUrls: ['./for-sales-approve-listing.component.scss']
})
export class SaleListingModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<SaleListingModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService, public sanitizer: DomSanitizer,
              private common: CommonService) {
  }

  onClick(){
    this.dataService.create(this.data, 'approved-list/for-sales-view')
      .subscribe(
        data => {
          if (data.code === 200) {
            this.common.openTost('success', 'SUCCESS', data.message);
            this.common.aClickedEvent.emit('Component A is clicked!!');
            this.dialogRef.close();
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


}
