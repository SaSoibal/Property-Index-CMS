import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CommonService} from '../../services/common.service';
import {DataService} from '../../services/data.service';
import {AppError} from '../../core_classes/app-error';
import {BadInput} from '../../core_classes/bad-input';

@Component({
  selector: 'app-career',
  templateUrl: './career.component.html',
  styleUrls: ['./career.component.scss']
})
export class CareerComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken;
  rootUrl = this.common.rootUrl + 'public/uploads/';
  createForm!: FormGroup;
  disabledSubmitBtn = false;
  showData = 'EN';
  defaultImage = './assets/img/theme/default.jpg';
  SelectedFile: File;
  ImageFile = this.defaultImage;
  ChangeImg = false;
  selectImg = true;

  SelectedBannerFile: File;
  BannerImageFile = this.defaultImage;
  ChangeBannerImg = false;
  selectBannerImg = true;

  SelectedCoreValueFile: File;
  CoreValueImageFile = this.defaultImage;
  ChangeCoreValueImg = false;
  selectCoreValueImg = true;


  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.common.checkCookie();
    this.getData();
    this.common.onLoneCalculateEvent
      .subscribe((data: string) => {
        this.getData();
      });
    this.createForm = this.fb.group({
      operation: ['create', ''],
      banner_en: ['', ''],
      banner_image: ['', ''],
      banner_bn: ['', ''],
      core_value_en: ['', ''],
      core_value_image: ['', ''],
      core_value_bn: ['', '']
    });

  }

  permission(type) {
    return this.common.permission('lone/instruction', type);
  }

  getData() {
    const inputData = {
      'api_token': this.tokenId,
    };

    this.dataService.create(inputData, 'get-career-page')
      .subscribe(async (data) => {
          if (data.response === 200) {
            const aboutData = data.data;

            this.BannerImageFile = this.rootUrl + aboutData.banner_image ? this.rootUrl + aboutData.banner_image : '';
            this.CoreValueImageFile = this.rootUrl + aboutData.core_value_image ? this.rootUrl + aboutData.core_value_image : '';

            console.log(data);

            this.createForm.patchValue({
              id: aboutData.id ? aboutData.id : '0',
              operation: aboutData.id ? 'update' : 'create',
              page_banner_image: aboutData.page_banner_image,
              banner_en: aboutData.banner_en,
              banner_bn: aboutData.banner_bn,
              banner_image: aboutData.banner_image,
              core_value_en: aboutData.core_value_en,
              core_value_bn: aboutData.core_value_bn,
              core_value_image: aboutData.core_value_image,
            });


            console.log(this.createForm);

          } else if (data.response === 404) {
            this.common.openTost('warning', 'WARNING', data.message);
          }
        },
        (error: AppError) => {
          this.common.onMainEvent.emit(false);
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else {
            throw error;
          }
        });
  }

  BannerChanged(fileInputBanner) {
    const pre = this;
    if (fileInputBanner.target.files && fileInputBanner.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        pre.BannerImageFile = e.target.result;
        pre.SelectedBannerFile = e.target.result;
        pre.ChangeBannerImg = true;
        pre.selectBannerImg = false;
      },
        reader.readAsDataURL(fileInputBanner.target.files[0]);
    }
  }

  CoreValueChanged(fileInputCoreValue) {
    const pre = this;
    if (fileInputCoreValue.target.files && fileInputCoreValue.target.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e: any) {
        pre.CoreValueImageFile = e.target.result;
        pre.SelectedCoreValueFile = e.target.result;
        pre.ChangeCoreValueImg = true;
        pre.selectCoreValueImg = false;
      },
        reader.readAsDataURL(fileInputCoreValue.target.files[0]);
    }
  }

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

  RemoveBannerImage() {
    this.SelectedBannerFile = null;
    this.ChangeBannerImg = false;
    this.BannerImageFile = this.defaultImage;
  }

  RemoveCoreValueImage() {
    this.SelectedCoreValueFile = null;
    this.ChangeCoreValueImg = false;
    this.CoreValueImageFile = this.defaultImage;
  }

  // tslint:disable-next-line: typedef
  RemoveImage() {
    this.SelectedFile = null;
    this.ChangeImg = false;
    this.ImageFile = this.defaultImage;
  }

  onClick(): void {
    this.createForm['image'] = this.SelectedFile;
    this.dataService.create(this.createForm, 'blog-create-update')
      .subscribe(data => {
          if (data.response === 200) {
            this.common.openTost('success', 'SUCCESS', data.message);
            this.common.AClicked('Component A is clicked!!');
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
          } else {
            throw error;
          }
          ;
        });
  }

  submitForm(): void {
    if (this.createForm.valid) {
      // this.disabledSubmitBtn = true;
      const inputData = {
        'id': this.createForm.value.id,
        'operation': this.createForm.value.operation,
        'api_token': this.tokenId,
        'banner_en': this.createForm.value.banner_en,
        'banner_image': this.SelectedBannerFile,
        'old_banner_image': this.createForm.value.banner_image,
        'banner_bn': this.createForm.value.banner_bn,
        'core_value_en': this.createForm.value.core_value_en,
        'core_value_image': this.SelectedCoreValueFile,
        'old_core_value_image': this.createForm.value.core_value_image,
        'core_value_bn': this.createForm.value.core_value_bn
      };

      console.log(inputData, 'inputData');

      this.dataService.create(inputData, 'submit-career-page')
        .subscribe(data => {
            if (data.response === 200) {
              this.common.openTost('success', 'SUCCESS', data.message);
              this.common.onLoneCalculateEvent.emit('Component A is clicked!!');
            } else if (data.response === 400) {
              this.common.openTost('warning', 'WARNING', data.message);
            }
          },
          (error: AppError) => {
            this.common.openTost('error', 'ERROR', 'Please try again later');
            if (error instanceof BadInput) {
            } else {
              throw error;
            }
          });
    } else {
      Object.values(this.createForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
    }
  }

}
