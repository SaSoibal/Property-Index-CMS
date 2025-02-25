import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { AppError } from '../../core_classes/app-error';
import { BadInput } from '../../core_classes/bad-input';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/';
    createLoneForm!: FormGroup;
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

    SelectedOurStoryFile: File;
    OurStoryImageFile = this.defaultImage;
    ChangeOurStoryImg = false;
    selectOurStoryImg = true;

    SelectedOurMissionFile: File;
    OurMissionImageFile = this.defaultImage;
    ChangeOurMissionImg = false;
    selectOurMissionImg = true;

    SelectedOurVisionFile: File;
    OurVisionImageFile = this.defaultImage;
    ChangeOurVisionImg = false;
    selectOurVisionImg = true;

    SelectedMasterMindFile: File;
    MasterMindImageFile = this.defaultImage;
    ChangeMasterMindImg = false;
    selectMasterMindImg = true;

    SelectedSecondMasterMindFile: File;
    secondMasterMindImageFile = this.defaultImage;
    ChangeSecondMasterMindImg = false;
    selectSecondMasterMindImg = true;


    constructor (private fb: FormBuilder,
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
        this.createLoneForm = this.fb.group({
            operation: ['create', ''],
            page_title_en: ['', ''],
            page_title_bn: ['', ''],
            page_banner_image: ['', ''],
            our_story_en: ['', ''],
            our_story_image: ['', ''],
            our_story_bn: ['', ''],

            mission_en: ['', ''],
            mission_bn: ['', ''],
            mission_image: ['', ''],

            vision_en: ['', ''],
            vision_bn: ['', ''],
            vision_image: ['', ''],

            data1_en: ['', ''],
            data1_bn: ['', ''],
            data_title1_en: ['', ''],
            data_title1_bn: ['', ''],
            data2_en: ['', ''],
            data2_bn: ['', ''],
            data_title2_en: ['', ''],
            data_title2_bn: ['', ''],
            data3_en: ['', ''],
            data3_bn: ['', ''],
            data_title3_en: ['', ''],
            data_title3_bn: ['', ''],
            data4_en: ['', ''],
            data4_bn: ['', ''],
            data_title4_en: ['', ''],
            data_title4_bn: ['', ''],
            video_link: ['', ''],

            master_mind_text_en: ['', ''],
            master_mind_text_bn: ['', ''],
            master_mind_image: ['', ''],
            master_mind_name_en: ['', ''],
            master_mind_name_bn: ['', ''],
            master_mind_designation_en: ['', ''],
            master_mind_designation_bn: ['', ''],

            second_master_mind_text_en: ['', ''],
            second_master_mind_text_bn: ['', ''],
            second_master_mind_image: ['', ''],
            second_master_mind_name_en: ['', ''],
            second_master_mind_name_bn: ['', ''],
            second_master_mind_designation_en: ['', ''],
            second_master_mind_designation_bn: ['', '']
        });

    }

    permission(type) {
        return this.common.permission('lone/instruction', type);
    }

    getData() {
        const inputData = {
            'api_token': this.tokenId,
        };

        this.dataService.create(inputData, 'get-about-us')
            .subscribe(async (data) => {
                if (data.response === 200) {
                    const aboutData = data.data;

                    this.BannerImageFile = this.rootUrl + aboutData.page_banner_image ? this.rootUrl + aboutData.page_banner_image : '';
                    this.OurStoryImageFile = this.rootUrl + aboutData.our_story_image ? this.rootUrl + aboutData.our_story_image : '';
                    this.OurMissionImageFile = this.rootUrl + aboutData.mission_image ? this.rootUrl + aboutData.mission_image : '';
                    this.OurVisionImageFile = this.rootUrl + aboutData.vision_image ? this.rootUrl + aboutData.vision_image : '';
                    this.MasterMindImageFile = this.rootUrl + aboutData.master_mind_image ? this.rootUrl + aboutData.master_mind_image : '';
                    this.secondMasterMindImageFile = this.rootUrl + aboutData.second_master_mind_image ? this.rootUrl + aboutData.second_master_mind_image : '';

                    // console.log(this.OurMissionImageFile);

                    this.createLoneForm.patchValue({
                        id: aboutData.id ? aboutData.id : '0',
                        operation: aboutData.id ? 'update' : 'create',
                        page_title_en: aboutData.page_title_en,
                        page_title_bn: aboutData.page_title_bn,
                        page_banner_image: aboutData.page_banner_image,
                        our_story_en: aboutData.our_story_en,
                        our_story_bn: aboutData.our_story_bn,
                        our_story_image: aboutData.our_story_image,

                        mission_en: aboutData.mission_en,
                        mission_bn: aboutData.mission_bn,
                        mission_image: aboutData.mission_image,

                        vision_en: aboutData.vision_en,
                        vision_bn: aboutData.vision_bn,
                        vision_image: aboutData.vision_image,

                        data1_en: aboutData.data1_en,
                        data1_bn: aboutData.data1_bn,
                        data_title1_en: aboutData.data_title1_en,
                        data_title1_bn: aboutData.data_title1_bn,
                        data2_en: aboutData.data2_en,
                        data2_bn: aboutData.data2_bn,
                        data_title2_en: aboutData.data_title2_en,
                        data_title2_bn: aboutData.data_title2_bn,
                        data3_en: aboutData.data3_en,
                        data3_bn: aboutData.data3_bn,
                        data_title3_en: aboutData.data_title3_en,
                        data_title3_bn: aboutData.data_title3_bn,
                        data4_en: aboutData.data4_en,
                        data4_bn: aboutData.data4_bn,
                        data_title4_en: aboutData.data_title4_en,
                        data_title4_bn: aboutData.data_title4_bn,
                        video_link: aboutData.video_link,

                        master_mind_title_bn: aboutData.master_mind_title_bn,
                        master_mind_text_en: aboutData.master_mind_text_en,
                        master_mind_text_bn: aboutData.master_mind_text_bn,
                        master_mind_image: aboutData.master_mind_image,
                        master_mind_name_en: aboutData.master_mind_name_en,
                        master_mind_name_bn: aboutData.master_mind_name_bn,
                        master_mind_designation_en: aboutData.master_mind_designation_en,
                        master_mind_designation_bn: aboutData.master_mind_designation_bn,

                        second_master_mind_title_bn: aboutData.second_master_mind_title_bn,
                        second_master_mind_text_en: aboutData.second_master_mind_text_en,
                        second_master_mind_text_bn: aboutData.second_master_mind_text_bn,
                        second_master_mind_image: aboutData.second_master_mind_image,
                        second_master_mind_name_en: aboutData.second_master_mind_name_en,
                        second_master_mind_name_bn: aboutData.second_master_mind_name_bn,
                        second_master_mind_designation_en: aboutData.second_master_mind_designation_en,
                        second_master_mind_designation_bn: aboutData.second_master_mind_designation_bn
                    });


                    console.log(this.createLoneForm);

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


    BannerChanged(fileInput) {
        const pre = this;
        if (fileInput.target.files && fileInput.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.BannerImageFile = e.target.result;
                pre.SelectedBannerFile = e.target.result;
                pre.ChangeBannerImg = true;
                pre.selectBannerImg = false;
            },
                reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    OurStoryChanged(fileInputOurStory) {
        const pre = this;
        if (fileInputOurStory.target.files && fileInputOurStory.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.OurStoryImageFile = e.target.result;
                pre.SelectedOurStoryFile = e.target.result;
                pre.ChangeOurStoryImg = true;
                pre.selectOurStoryImg = false;
            },
                reader.readAsDataURL(fileInputOurStory.target.files[0]);
        }
    }

    OurMissionChanged(fileInputOurMission) {
        const pre = this;
        if (fileInputOurMission.target.files && fileInputOurMission.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.OurMissionImageFile = e.target.result;
                pre.SelectedOurMissionFile = e.target.result;
                pre.ChangeOurMissionImg = true;
                pre.selectOurMissionImg = false;
            },
                reader.readAsDataURL(fileInputOurMission.target.files[0]);
        }
    }

    OurVisionChanged(fileInputOurVision) {
        const pre = this;
        if (fileInputOurVision.target.files && fileInputOurVision.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.OurVisionImageFile = e.target.result;
                pre.SelectedOurVisionFile = e.target.result;
                pre.ChangeOurVisionImg = true;
                pre.selectOurVisionImg = false;
            },
                reader.readAsDataURL(fileInputOurVision.target.files[0]);
        }
    }

    MasterMindChanged(fileInputMasterMind) {
        const pre = this;
        if (fileInputMasterMind.target.files && fileInputMasterMind.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.MasterMindImageFile = e.target.result;
                pre.SelectedMasterMindFile = e.target.result;
                pre.ChangeMasterMindImg = true;
                pre.selectMasterMindImg = false;
            },
                reader.readAsDataURL(fileInputMasterMind.target.files[0]);
        }
    }

    secondMasterMindChanged(fileInputSecondMasterMind) {
        const pre = this;
        if (fileInputSecondMasterMind.target.files && fileInputSecondMasterMind.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.secondMasterMindImageFile = e.target.result;
                pre.SelectedSecondMasterMindFile = e.target.result;
                pre.ChangeSecondMasterMindImg = true;
                pre.selectSecondMasterMindImg = false;
            },
                reader.readAsDataURL(fileInputSecondMasterMind.target.files[0]);
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

    // tslint:disable-next-line: typedef
    RemoveBannerImage() {
        this.SelectedBannerFile = null;
        this.ChangeBannerImg = false;
        this.BannerImageFile = this.defaultImage;
    }

    RemoveOurStoryImage() {
        this.SelectedOurStoryFile = null;
        this.ChangeOurStoryImg = false;
        this.OurStoryImageFile = this.defaultImage;
    }

    RemoveOurMissionImage() {
        this.SelectedOurMissionFile = null;
        this.ChangeOurMissionImg = false;
        this.OurMissionImageFile = this.defaultImage;
    }

    RemoveMasterMindImage() {
        this.SelectedMasterMindFile = null;
        this.ChangeMasterMindImg = false;
        this.MasterMindImageFile = this.defaultImage;
    }

    // tslint:disable-next-line: typedef
    RemoveImage() {
        this.SelectedFile = null;
        this.ChangeImg = false;
        this.ImageFile = this.defaultImage;
    }

    onClick(): void {
        this.createLoneForm['image'] = this.SelectedFile;
        this.dataService.create(this.createLoneForm, 'blog-create-update')
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

    submitLoneForm(): void {
        if (this.createLoneForm.valid) {
            // this.disabledSubmitBtn = true;
            const inputData = {
                'id': this.createLoneForm.value.id,
                'operation': this.createLoneForm.value.operation,
                'api_token': this.tokenId,
                'page_title_en': this.createLoneForm.value.page_title_en,
                'page_title_bn': this.createLoneForm.value.page_title_bn,
                'page_banner_image': this.SelectedBannerFile,
                'old_banner_image': this.createLoneForm.value.page_banner_image,
                'our_story_title_en': this.createLoneForm.value.our_story_title_en,
                'our_story_title_bn': this.createLoneForm.value.our_story_title_bn,
                'our_story_en': this.createLoneForm.value.our_story_en,
                'our_story_image': this.SelectedOurStoryFile,
                'old_our_story_image': this.createLoneForm.value.our_story_image,
                'our_story_bn': this.createLoneForm.value.our_story_bn,

                'mission_title_en': this.createLoneForm.value.mission_title_en,
                'mission_title_bn': this.createLoneForm.value.mission_title_bn,
                'mission_en': this.createLoneForm.value.mission_en,
                'mission_image': this.SelectedOurMissionFile,
                'old_mission_image': this.createLoneForm.value.mission_image,
                'mission_bn': this.createLoneForm.value.mission_bn,

                'vision_title_en': this.createLoneForm.value.vision_title_en,
                'vision_title_bn': this.createLoneForm.value.vision_title_bn,
                'vision_en': this.createLoneForm.value.vision_en,
                'vision_image': this.SelectedOurVisionFile,
                'old_vision_image': this.createLoneForm.value.vision_image,
                'vision_bn': this.createLoneForm.value.vision_bn,

                'why_us_title_en': this.createLoneForm.value.why_us_title_en,
                'why_us_title_bn': this.createLoneForm.value.why_us_title_bn,
                'gallery_title_en': this.createLoneForm.value.gallery_title_en,
                'gallery_title_bn': this.createLoneForm.value.gallery_title_bn,
                'data1_en': this.createLoneForm.value.data1_en,
                'data1_bn': this.createLoneForm.value.data1_bn,
                'data_title1_en': this.createLoneForm.value.data_title1_en,
                'data_title1_bn': this.createLoneForm.value.data_title1_bn,
                'data2_en': this.createLoneForm.value.data2_en,
                'data2_bn': this.createLoneForm.value.data2_bn,
                'data_title2_en': this.createLoneForm.value.data_title2_en,
                'data_title2_bn': this.createLoneForm.value.data_title2_bn,
                'data3_en': this.createLoneForm.value.data3_en,
                'data3_bn': this.createLoneForm.value.data3_bn,
                'data_title3_en': this.createLoneForm.value.data_title3_en,
                'data_title3_bn': this.createLoneForm.value.data_title3_bn,
                'data4_en': this.createLoneForm.value.data4_en,
                'data4_bn': this.createLoneForm.value.data4_bn,
                'data_title4_en': this.createLoneForm.value.data_title4_en,
                'data_title4_bn': this.createLoneForm.value.data_title4_bn,
                'video_link': this.createLoneForm.value.video_link,

                'master_mind_title_en': this.createLoneForm.value.master_mind_title_en,
                'master_mind_title_bn': this.createLoneForm.value.master_mind_title_bn,
                'master_mind_text_en': this.createLoneForm.value.master_mind_text_en,
                'master_mind_text_bn': this.createLoneForm.value.master_mind_text_bn,
                'master_mind_image': this.SelectedMasterMindFile,
                'old_master_mind_image': this.createLoneForm.value.master_mind_image,
                'master_mind_name_en': this.createLoneForm.value.master_mind_name_en,
                'master_mind_name_bn': this.createLoneForm.value.master_mind_name_bn,
                'master_mind_designation_en': this.createLoneForm.value.master_mind_designation_en,
                'master_mind_designation_bn': this.createLoneForm.value.master_mind_designation_bn,

                'second_master_mind_title_en': this.createLoneForm.value.second_master_mind_title_en,
                'second_master_mind_title_bn': this.createLoneForm.value.second_master_mind_title_bn,
                'second_master_mind_text_en': this.createLoneForm.value.second_master_mind_text_en,
                'second_master_mind_text_bn': this.createLoneForm.value.second_master_mind_text_bn,
                'second_master_mind_image': this.SelectedSecondMasterMindFile,
                'old_second_master_mind_image': this.createLoneForm.value.second_master_mind_image,
                'second_master_mind_name_en': this.createLoneForm.value.second_master_mind_name_en,
                'second_master_mind_name_bn': this.createLoneForm.value.second_master_mind_name_bn,
                'second_master_mind_designation_en': this.createLoneForm.value.second_master_mind_designation_en,
                'second_master_mind_designation_bn': this.createLoneForm.value.second_master_mind_designation_bn
            };

            console.log(inputData, 'inputData');

            this.dataService.create(inputData, 'submit-about-us')
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
            Object.values(this.createLoneForm.controls).forEach(control => {
                if (control.invalid) {
                    control.markAsDirty();
                    control.updateValueAndValidity({ onlySelf: true });
                }
            });
        }
    }

}
