import { Injectable, Input, Output, EventEmitter } from '@angular/core';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { AuthService } from './auth.service';
import { DataService } from './data.service';
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppError } from "../core_classes/app-error";
import { BadInput } from "../core_classes/bad-input";

export interface DialogDetails {
    lead_id: number;
    task_name: string;
    created_date: string;
    phone_no: string;
    phone_code: any;
    client_details: any;
    lead_process: any;
    opportunity: any;
    lead_details: any;
    process: any;
    process_start: any;
    related_lead: any;
    property_sync: any;
    property_negotiation_sync: any;
    property_token_received_sync: any;
}

@Injectable({
    providedIn: 'root'
})

export class CommonService {
    aClickedEvent: EventEmitter<any> = new EventEmitter<string>();
    aClickedEventRole: EventEmitter<any> = new EventEmitter<string>();
    aClickedEventUser: EventEmitter<any> = new EventEmitter<string>();
    aClickedAssignEvent: EventEmitter<any> = new EventEmitter<string>();
    aClickedBranchEvent: EventEmitter<any> = new EventEmitter<string>();

    onClickSystemRoleEvent: EventEmitter<any> = new EventEmitter<string>();
    aClickedSystemUserEvent: EventEmitter<any> = new EventEmitter<string>();
    onAssignUserRoleEvent: EventEmitter<any> = new EventEmitter();
    aClickedTeamManageEvent: EventEmitter<any> = new EventEmitter();

    aClickedAreaEvent: EventEmitter<any> = new EventEmitter();
    aClickedCityEvent: EventEmitter<any> = new EventEmitter();
    aClickedClassificationEvent: EventEmitter<any> = new EventEmitter();
    aClickedClientRatingEvent: EventEmitter<any> = new EventEmitter();
    aClickedClientTypeEvent: EventEmitter<any> = new EventEmitter();
    aClickedConstructionStatusEvent: EventEmitter<any> = new EventEmitter();
    aClickedDepartmentEvent: EventEmitter<any> = new EventEmitter();
    aClickedLeadStatusEvent: EventEmitter<any> = new EventEmitter();
    aClickedLocationEvent: EventEmitter<any> = new EventEmitter();
    aClickedOccupationEvent: EventEmitter<any> = new EventEmitter();
    aClickedPreferredTenantsEvent: EventEmitter<any> = new EventEmitter();
    aClickedBuyingIntentEvent: EventEmitter<any> = new EventEmitter();
    aClickedProjectEvent: EventEmitter<any> = new EventEmitter();
    aClickedProjectTypeEvent: EventEmitter<any> = new EventEmitter();
    aClickedSelectSourceEvent: EventEmitter<any> = new EventEmitter();
    aClickedClassifyEvent: EventEmitter<any> = new EventEmitter();
    aClickedTaskSubTypeEvent: EventEmitter<any> = new EventEmitter();

    onMainEvent: EventEmitter<any> = new EventEmitter();
    onPartnerEvent: EventEmitter<any> = new EventEmitter();
    onLoneCalculateEvent: EventEmitter<any> = new EventEmitter();
    aClickedInterior: EventEmitter<any> = new EventEmitter();
    aClickIntorioInfo: EventEmitter<any> = new EventEmitter();
    aClickWhatWeProvide: EventEmitter<any> = new EventEmitter();
    aClicKInteriorGallery: EventEmitter<any> = new EventEmitter();
    aClickInteriorFaq: EventEmitter<any> = new EventEmitter();
    onJustACallAway: EventEmitter<any> = new EventEmitter();
    onAssignLeadEvent: EventEmitter<any> = new EventEmitter();
    aProductClickedEvent: EventEmitter<any> = new EventEmitter();
    aClickedEventNotific: EventEmitter<any> = new EventEmitter();
    rootUrl = 'http://localhost/property-index-back-end-main/';
    // rootUrl = 'http://139.99.66.54/property-index-back-end/';
    // rootUrl = 'http://103.231.238.45/property-index-back-end/';
    // rootUrl = 'https://propertyindexbd.com/property-index-back-end/';
    mycookie;
    rolelist = [];

    //   snackbarInstant
    constructor (
        private auth: AuthService,
        private router: Router,
        public dialog: MatDialog,
        private notification: NzNotificationService
    ) {
        const cook = this.auth.getCookie('Xm0oZsKtAaCfViSz');
        if (cook) {
            this.mycookie = JSON.parse(cook);
            this.auth.get_role_data(this.mycookie.bearertoken).subscribe(
                res => {
                    console.log(res, 'role data');

                    if (!res) {
                        this.router.navigate(['login']);
                    } else {
                        if (res.response === 200) {
                            const roles = res.role_list;
                            if (roles) {
                                this.rolelist = roles;
                                if (sessionStorage.getItem('pageurl')) {
                                    this.router.navigate([sessionStorage.getItem('pageurl')]);
                                }
                            } else {
                                this.router.navigate(['login']);
                            }
                            this.AClicked('Component A is clicked!!');
                        }
                    }
                });
        } else {
            this.mycookie = '';
            this.router.navigate(['login']);
        }
    }

    checkCookie() {
        const cookie = this.getCookie('Xm0oZsKtAaCfViSz')
        if (cookie) {
            const copkiedata = JSON.parse(cookie);
            this.updateCookie('Xm0oZsKtAaCfViSz', cookie, 1)
        } else {
            this.router.navigate(['login']);
        }
    }

    getCookie(cname) {
        const name = cname + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    updateCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 30 * 60 * 1000));
        const expires = 'expires=' + d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    }

    AClicked(msg: string) {
        this.aClickedEvent.emit(msg);
    }
    AMain(msg: string) {
        this.onMainEvent.emit(msg);
    }

    openTost(type: string, status: string, message: string): void {
        this.notification.create(
            type,
            status,
            message
        );
    }



    permission(page, type) {
        if (this.rolelist.length > 0) {
            const datas = this.rolelist.find(x => x.slug === page);
            if (datas !== undefined) {
                if (type == 'read') {
                    if (Number(datas.action) == Number(4)) {
                        return true;
                    } else if (Number(datas.action) == Number(3)) {
                        return true;
                    } else if (Number(datas.action) == Number(2)) {
                        return true;
                    } else if (Number(datas.action) == Number(1)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == 'create') {
                    if (Number(datas.action) == Number(4)) {
                        return true;
                    } else if (Number(datas.action) == Number(3)) {
                        return true;
                    } else if (Number(datas.action) == Number(2)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == 'update') {
                    if (Number(datas.action) == Number(4)) {
                        return true;
                    } else if (Number(datas.action) == Number(3)) {
                        return true;
                    } else {
                        return false;
                    }
                } else if (type == 'delete') {
                    if (Number(datas.action) == Number(4)) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }

        } else {
            return false;
        }

    }

    //image function
    basicImageFile: File;
    fileUpload;
    up_image_data(fileInput) {
        const pre = this;
        if (fileInput.target.files && fileInput.target.files[0]) {
            const reader = new FileReader();
            reader.onload = function (e: any) {
                pre.basicImageFile = e.target.result;
                let img_data = {
                    extension: fileInput.target.files[0].name.split('.').pop(),
                    base64: pre.basicImageFile
                }
                pre.fileUpload = img_data;
            }
            reader.readAsDataURL(fileInput.target.files[0]);
        }
    }

    leadDetailsModel(lead, details, process, process_start) {
        const dialogRef = this.dialog.open(LeadsDetails, {
            width: '100%',
            data: {
                lead_id: String(lead.id).padStart(6, '0'),
                task_name: details.task_name ? details.task_name.step : '',
                created_date: details.created_at,
                phone_code: details.phone_code,
                phone_no: details.phone_no,
                client_details: details.client_information,
                lead_process: process,
                opportunity: details.lead_opportunity,
                lead_details: details.leads_details,
                process_start: process_start,
                related_lead: details.related_lead,
                property_sync: details.property_sync,
                property_negotiation_sync: details.property_negotiation_sync,
                property_token_received_sync: details.property_token_received_sync
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getProductStepName(step) {
        if (step == 1) {
            return "First Call";
        } else if (step == 2) {
            return "Follow up Call";
        } else if (step == 3) {
            return "MOU";
        } else if (step == 4) {
            return "Viewing";
        } else if (step == 5) {
            return "Token Received";
        } else if (step == 6) {
            return "Registration Appeared";
        } else if (step == 7) {
            return "Registration Complete";
        } else if (step == 8) {
            return "Deal Close";
        }
    }

}

@Component({
    selector: 'leads-details-model',
    templateUrl: './template/leads-details-model.html',
})
export class LeadsDetails {
    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/leads/';
    pageBuffer = false;
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<LeadsDetails>,
        @Inject(MAT_DIALOG_DATA) public data: DialogDetails,
        private common: CommonService,
        private dataService: DataService,) {
    }

    setData = '';
    getData(event) {
        this.setData = event;
    }

    leadNoGenerate(lead: number) {
        return String(lead).padStart(6, '0');
    }

    leadDetails(lead) {
        this.pageBuffer = true;
        const postdate = {
            'api_token': this.tokenId,
            'lead_id': lead.id
        };
        this.dataService.create(postdate, 'common/lead-details')
            .subscribe(
                async (data) => {
                    this.dialogRef.close();
                    if (data.response === 200) {
                        await this.common.leadDetailsModel(lead, data.details, data.process, data.process_start);
                        this.pageBuffer = false;
                    } else if (data.response === 400) {
                    }
                })
    }

}
