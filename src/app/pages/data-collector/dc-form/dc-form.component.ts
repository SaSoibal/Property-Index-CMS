import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import {ActivatedRoute} from '@angular/router';
import {Location} from '@angular/common';

@Component({
  selector: 'app-dc-form',
  templateUrl: './dc-form.component.html',
  styleUrls: ['./dc-form.component.scss']
})
export class DcFormComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  createDcForm!: FormGroup;
  location_list = [];
  city_list = [];
  area_list = [];
  product_type_list = [];
  const_status = [];
  edit_id = '';
  pageBuffer = false;
  submitButton = false;
  submitTitle = 'Create';
  show_type_of_product = 1;
  
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private _location: Location
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.getCity();
    this.constructionStatus();
    this.route.params.subscribe(params => {
      this.edit_id = params['id'];
      if (this.edit_id) {
        this.submitTitle = 'Update';
        this.getEditData();
      }
    });
    this.common.aClickedEvent
    .subscribe((data: string) => {
      this.getCity();
      this.constructionStatus();
    });

    this.createDcForm = this.fb.group({
      seller_name: [null, [Validators.required]],
      seller_number: [null, [Validators.required]],
      purpose: [null],
      type_of_Product: [1, [Validators.required]],
      product: [null],
      property_location: [null],
      city: [null, [Validators.required]],
      area: [null, [Validators.required]],
      block: [null],
      sector: [null],
      road: [null],
      house_no: [null],
      square_feet: [null, [Validators.required]],
      bedroom: [null, [Validators.required]],
      bathroom: [null, [Validators.required]],
      balcony: [null, [Validators.required]],
      servant_room: [null],
      available_floor: [null],
      facing: [null],
      unit_per_floor: [null],
      total_unit: [null],
      construction_status: [null],
      developer_name: [null],
      description: [null],
      property_address: [null, [Validators.required]]
    });
  }

  changeProductName(event){
    this.show_type_of_product = event; 
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
            this.common.openTost('warning','WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }
  changeCity(city_id) {
    this.createDcForm.controls['area'].setValue(null);
    this.createDcForm.controls['area'].setErrors(null);
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
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

  changeArea(area_id) {
    this.createDcForm.controls['property_location'].setValue(null);
    this.createDcForm.controls['property_location'].setErrors(null);
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
    return this.common.permission('data-collector/dc-form', type);
  }
  qcPermission(type) {
    return this.common.permission('data-collector/qc-property-list', type);
  }


  submitDcForm(): void {
    if (this.createDcForm.valid) {
      this.submitButton = true;
      const inputData = {
        'api_token': this.tokenId,
        'edit_id': this.edit_id,
        'operation': this.edit_id ? 'update' : 'create',
        'seller_name': this.createDcForm.value.seller_name,
        'seller_number': this.createDcForm.value.seller_number,
        'purpose': this.createDcForm.value.purpose,
        'type_of_Product': this.createDcForm.value.type_of_Product,
        'product': this.createDcForm.value.product,
        'property_location': this.createDcForm.value.property_location,
        'city': this.createDcForm.value.city,
        'area': this.createDcForm.value.area,
        'block': this.createDcForm.value.block,
        'sector': this.createDcForm.value.sector,
        'road': this.createDcForm.value.road,
        'house_no': this.createDcForm.value.house_no,
        'square_feet': this.createDcForm.value.square_feet,
        'bedroom': this.createDcForm.value.bedroom,
        'bathroom': this.createDcForm.value.bathroom,
        'balcony': this.createDcForm.value.balcony,
        'servant_room': this.createDcForm.value.servant_room,
        'available_floor': this.createDcForm.value.available_floor,
        'facing': this.createDcForm.value.facing,
        'unit_per_floor': this.createDcForm.value.unit_per_floor,
        'total_unit': this.createDcForm.value.total_unit,
        'construction_status': this.createDcForm.value.construction_status,
        'developer_name': this.createDcForm.value.developer_name,
        'description': this.createDcForm.value.description,
        'property_address': this.createDcForm.value.property_address
      };
      this.dataService.create(inputData, 'data-collector/post')
      .subscribe(data => {
        this.submitButton = false;
        if (data.code === 200) {
          if (this.edit_id) { 
            this._location.back();
          } else {
            this.createDcForm.reset();
          }
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
    } else {
      Object.values(this.createDcForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  getEditData() {
    const inputData = {
      'api_token': this.tokenId,
      'edit_id': this.edit_id,
    };
    this.dataService.create(inputData, 'data-collector/edit')
      .subscribe(data => {
          this.submitButton = false;
          if (data.code === 200) {
            this.showForm(data.list);
          } else if (data.code === 400) {
            this.common.openTost('warning','WARNING', data.message);
          } else if (data.code === 404) {
            this.common.openTost('warning','WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error','ERROR','Please try again later');
          if (error instanceof BadInput) {
          } else { throw error };
        });
  }

  showForm(data) {
    this.createDcForm.patchValue({
      seller_name: data.seller_name,
      seller_number: data.seller_number,
      purpose: data.purpose,
      type_of_Product: data.type_of_Product,
      product: data.product,
      city: data.city,
      area: data.area,
      property_location: data.property_location,
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
      unit_per_floor: data.unit_per_floor,
      total_unit: data.total_unit,
      construction_status: data.construction_status,
      developer_name: data.developer_name,
      description: data.description,
      property_address: data.property_address,
    });
  }

}
