import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
    id: number | null;
    title: string;
    description: string;
    sendType: number;
    sendToTeam: number | null;
    sendToUser: number[];
    actionType: string;
}

@Component({
    selector: 'app-notice',
    templateUrl: './notice.component.html',
    styleUrls: ['./notice.component.scss']
})
export class NoticeComponent implements OnInit {

    userType: number = 1;
    totalRow = 0;
    perPage = 10;
    pageNumber = 0;
    pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
    dataOrderBy = true;
    sortColumn = 'id';
    searchValues: String = '';
    pageBuffer = false;
    tokenId = this.common.mycookie.bearertoken;
    noticeCollection: any[] = [];
    private noticeCollection$: Subscription = new Subscription();

    constructor (
        private _dialog: MatDialog,
        private dataService: DataService,
        private common: CommonService
    ) { }

    ngOnInit(): void {
        this.getNotices();
    }

    permission(type) {
        return this.common.permission('notice', type);
    }

    pageEvent(event) {
        this.pageNumber = event.pageIndex;
        this.perPage = event.pageSize;
        this.getNotices();
    }

    sort(column: string) {
        if (this.sortColumn === column) {
            this.dataOrderBy = !this.dataOrderBy;
        } else {
            this.sortColumn = column;
        }
        this.getNotices();
    }

    filter(value: string) {
        this.searchValues = value;
        this.pageNumber = 0;
        this.getNotices();
    }

    clearFilter() {
        this.searchValues = '';
        this.pageNumber = 0;
        this.getNotices();
    }

    getNotices() {
        this.pageBuffer = true;
        let orderBy = 'DESC';
        const queryString = "?"
            + "api_token=" + this.tokenId
            + "&search=" + this.searchValues
            + "&sort_column=" + this.sortColumn
            + "&sort_by=" + orderBy
            + "&per_page=" + this.perPage
            + "&page=" + this.pageNumber + "";
        this.noticeCollection$ = this.dataService.getAll(`notice/list${queryString}`).subscribe({
            next: (response) => {
                if (response?.code == 200) {
                    this.noticeCollection = response?.data?.list?.data;
                    this.totalRow = response?.data?.list?.total;
                    this.userType = response?.data?.user_type;
                } else {
                    this.noticeCollection = [];
                    this.totalRow = 0;
                    this.userType = 1;
                }
            },
            error: (e) => console.log(e),
            complete: () => {
                this.pageBuffer = false;
            }
        });
    }

    /*------------- modal section start -------------*/
    createNotice(): void {
        console.log('createNotice');

        const dialogRef = this._dialog.open(CreateUpdateNotice, {
            width: '800px',
            data: {
                id: null,
                title: '',
                description: '',
                sendType: 0,
                sendToTeam: null,
                sendToUser: [],
                actionType: 'create'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == 'success') {
                this.getNotices();
            }
        });
    }

    updateNotice(data: any): void {
        const noticeUsers = data.notice_users?.map(user => user.member_id);

        const dialogRef = this._dialog.open(CreateUpdateNotice, {
            width: '800px',
            data: {
                id: data?.id,
                title: data?.title,
                description: data?.description,
                sendType: data?.send_type,
                sendToTeam: data?.team_id,
                sendToUser: noticeUsers || [],
                actionType: 'update'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result == 'success') {
                this.getNotices();
            }
        });
    }

    viewNotice(data: any): void {
        const dialogRef = this._dialog.open(NoticeDetails, {
            width: '1200px',
            data: {
                title: data?.title,
                description: data?.description,
                sendType: data?.send_type,
                sendTo: data?.send_to,
                actionType: 'view'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.seenNotice(data.id);
        });
    }
    /*------------- modal section end -------------*/

    seenNotice(id: number) {
        const postData = {
            api_token: this.tokenId,
            notice_id: id,
        }
        this.dataService.create(postData, 'notice/seen').subscribe({
            next: (response) => {
                if (response?.code == 200) {
                    //
                }
            },
            error: (e) => console.log(e),
            complete: () => {
                //
            }
        })
    }

    ngOnDestroy() {
        this.noticeCollection$.unsubscribe();
    }

}


@Component({
    selector: 'create-update-notice',
    templateUrl: './create-update-notice.html',
    styleUrls: ['./notice.component.scss']
})
export class CreateUpdateNotice implements OnInit {
    tokenId = this.common.mycookie.bearertoken;
    teamCollection: any[] = [];
    userCollection: any[] = [];
    private teamCollection$: Subscription = new Subscription();
    private userCollection$: Subscription = new Subscription();

    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<CreateUpdateNotice>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }
    ngOnInit(): void {
        this.getTeams();
        this.getUsers();
    }

    getTeams() {
        const postData = {
            'api_token': this.tokenId,
        }
        this.teamCollection$ = this.dataService.create(postData, 'common/all-team-list').subscribe({
            next: (response) => {
                if (response?.code == 200) {
                    this.teamCollection = response?.list;
                }
            },
            error: (e) => console.log(e),
            complete: () => {

            }
        });
    }
    getUsers() {
        const postData = {
            'api_token': this.tokenId,
        }
        this.userCollection$ = this.dataService.create(postData, 'common/member-list').subscribe({
            next: (response) => {
                if (response?.code == 200) {
                    this.userCollection = response?.data?.members;
                }
            },
            error: (e) => console.log(e),
            complete: () => {

            }
        });
    }

    clearSendTo() {
        console.log('sdjfhskdf');

        // this.data.sendTo = 0;
    }

    submitForm() {
        const formData = this.data;
        const valid = this.validateFormData(formData);
        if (valid) {
            const postData = {
                'api_token': this.tokenId,
                'title': formData.title,
                'description': formData.description,
                'send_type': formData.sendType,
                'team_id': formData.sendType === 1 ? formData.sendToTeam : null,
                'member_ids': formData.sendType === 2 ? formData.sendToUser : null,
                'action': formData.actionType,
                'id': formData.actionType === 'update' ? formData.id : null,
            }

            this.dataService.create(postData, 'notice/store').subscribe({
                next: (response) => {
                    if (response?.code == 200) {
                        this.dialogRef.close('success');
                        this.common.openTost('success', 'SUCCESS', 'Notice has been saved successfully');
                    }
                },
                error: (e) => console.log(e),
                complete: () => {

                }
            });
        }
    }

    validateFormData(formData: any) {
        if (formData.sendType === 1 && formData.sendToTeam == null) {
            this.common.openTost('error', 'ERROR', 'Please select a team');
            return false;
        }

        if (formData.sendType === 2 && formData.sendToUser?.length == 0) {
            this.common.openTost('error', 'ERROR', 'Please select a user');
            return false;
        }

        return true;
    }

    ngOnDestroy() {
        this.teamCollection$.unsubscribe();
        this.userCollection$.unsubscribe();
    }
}

@Component({
    selector: 'notice-details',
    templateUrl: './notice-details.html',
    styleUrls: ['./notice.component.scss']
})
export class NoticeDetails {
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<NoticeDetails>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }
}
