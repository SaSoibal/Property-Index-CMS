import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {formatDate} from '@angular/common';
import {DomSanitizer} from '@angular/platform-browser';

export interface DialogData {
  pid: number;
  property_id: number;
  details: any;
  feature: any;
  price_contact: any;
  other: any;
  api_token: string;
  operation: string;
}
@Component({
  selector: 'app-for-rent-qc-property-list',
  templateUrl: './website-rent-property-list.component.html',
  styleUrls: ['./website-rent-property-list.component.scss']
})
export class WebsiteRentPropertyListComponent implements OnInit {
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
  searchCity = '';
  searchLocation = '';
  searchProductType = '';
  searchConstructionStatus = '';
  searchProjectID = '';
  searchPricemin = '';
  searchPricemax = '';
  searchAreamin = '';
  searchAreamax = '';
  searchBeds = '';
  searchBaths = '';
  searchFormAddedDate = '';
  searchToAddedDate = '';
  searchAddedBy = '';
  parpose = 2;
  isVisible = false;
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
    this.productType();
    this.userList();
    this.common.aClickedEvent
      .subscribe((data: string) => {
        this.showList();
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
    this.dataService.create(postdatet, 'common/location-list')
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
    return this.common.permission('website-listing/website-property-listing', type);
  }
  permissionAdd(type) {
    return this.common.permission('/website-listing/add-to-website', type);
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

  filterCity(event) {
    this.searchCity = event;
  }
  filterLocation(event) {
    this.searchLocation = event;
  }
  filterProductType(event) {
    this.searchProductType = event;
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
      + "&searchCity=" + this.searchCity
      + "&searchLocation=" + this.searchLocation
      + "&searchProductType=" + this.searchProductType
      + "&searchConstructionStatus=" + this.searchConstructionStatus
      + "&searchProjectID=" + this.searchProjectID
      + "&searchPricemin=" + this.searchPricemin
      + "&searchPricemax=" + this.searchPricemax
      + "&searchAreamin=" + this.searchAreamin
      + "&searchAreamax=" + this.searchAreamax
      + "&searchBeds=" + this.searchBeds
      + "&searchBaths=" + this.searchBaths
      + "&searchFormAddedDate=" + this.searchFormAddedDate
      + "&searchToAddedDate=" + this.searchToAddedDate
      + "&searchAddedBy=" + this.searchAddedBy
      + "&parpose=" + this.parpose;
    this.get_list(queryString);
  }
  clearFilter() {
    this.searchName = '';
    this.searchCity = '';
    this.searchLocation = '';
    this.searchProductType = '';
    this.searchConstructionStatus = '';
    this.searchProjectID = '';
    this.searchPricemin = '';
    this.searchPricemax = '';
    this.searchAreamin = '';
    this.searchAreamax = '';
    this.searchBeds = '';
    this.searchBaths = '';
    this.searchFormAddedDate = '';
    this.searchToAddedDate = '';
    this.searchAddedBy = '';
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
      + "&page=" + this.pageNumber
      + "&parpose=" + this.parpose;
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
    this.dataService.getAll('website-property-list/for-sales' + postdate)
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
  openRedModel(property) {
    const queryString = "?"
      + "api_token=" + this.tokenId
      + "&pid=" + property.id;
    this.pageBuffer = true;
    this.dataService.getAll('website-property-list/sales-details' + queryString)
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
    const dialogRef = this.dialog.open( WBSrentDetailsModel, {
      width: '800px',
      data: {
        property_id: property.id,
        details : property,
        feature : details.feature,
        other : details.other,
        api_token: this.tokenId,
        operation: 'Action',
      }
    });
    dialogRef.afterClosed().subscribe( result => {
    });
  }

}

@Component({
  selector: 'app-rent-details-modal',
  templateUrl: './rent-details-modal.html',
  styleUrls: ['./website-rent-property-list.component.scss']
})
export class WBSrentDetailsModel {
  submitButton = false;
  tokenId = this.common.mycookie.bearertoken;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(public dialogRef: MatDialogRef<WBSrentDetailsModel>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private dataService: DataService,
              private common: CommonService,
              public sanitizer: DomSanitizer) {
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


