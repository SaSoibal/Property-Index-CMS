import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataService } from '../../services/data.service';
import { BadInput } from '../../core_classes/bad-input';
import { AppError } from '../../core_classes/app-error';

export interface DialogData {
    id: number,
    details: any,
    property_id: number,
    property_type: number,
    lead_id: number,
    is_checked: number,
    api_token: string,
    operation: string,
}

@Component({
    selector: 'app-notifications',
    templateUrl: './notifications.component.html',
    styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/';
    erroeMsg = '';
    totalrow = 0;
    itemPerPage = 10;
    pageNumber = 0;
    pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
    dataOrderBy = true;
    sortColumn = 'id';
    collection = [];
    dataNotFound = '';
    constructor (private fb: FormBuilder,
        private common: CommonService,
        private dataService: DataService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
        this.common.checkCookie();
        this.showList();
        this.common.aClickedEventNotific
            .subscribe((data: string) => {
                console.log('Event message from Component A: ' + data);
                this.showList();
            });

    }

    permission(type) {
        return this.common.permission('notifications', type);
    }

    getSL(i) {
        return (Number(this.itemPerPage) * Number(this.pageNumber)) + i;
    }

    showList() {
        let orderBy = 'DESC';
        const queryString = "?"
            + "api_token=" + this.tokenId
            + "&sort_column=" + this.sortColumn
            + "&sort_by=" + orderBy
            + "&per_page=" + this.itemPerPage
            + "&page=" + this.pageNumber + "";
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


    get_list(postdate) {
        this.dataService.getAll('notification-list' + postdate)
            .subscribe(async (res) => {
                if (res.code === 200) {
                    this.collection = await res.list.data;
                    this.totalrow = await res.list.total;
                } else if (res.response === 404) {
                    this.collection = [];
                    this.totalrow = 0;
                    this.common.openTost('error', 'ERROR', res.message);
                }
            },
                (error: AppError) => {
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }

    openModel(not) {
        const dialogRef = this.dialog.open(notificationModel, {
            width: '500px',
            data: {
                id: not.id,
                details: not,
                property_id: not.property_id,
                property_type: not.property_type,
                lead_id: not.lead_id,
                is_checked: not.is_checked,
                api_token: this.tokenId,
                operation: 'Approve',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }


}


@Component({
    selector: 'app-notify-model',
    templateUrl: './notify-model.html',
    styleUrls: ['./notifications.component.scss']
})
export class notificationModel {
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<notificationModel>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }

    onClick(): void {
        this.dataService.create(this.data, 'notification-approve')
            .subscribe(data => {
                if (data.code === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', data.message);
                    this.common.aClickedEventNotific.emit('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else if (data.code === 400) {
                    this.common.openTost('warning', 'WARNING', data.message);
                }
            },
                (error: AppError) => {
                    this.common.onMainEvent.emit(false);
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }
}



