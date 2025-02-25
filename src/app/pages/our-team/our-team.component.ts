import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppError } from 'src/app/core_classes/app-error';
import { BadInput } from 'src/app/core_classes/bad-input';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
    id: number;
    name_en: string;
    name_bn: string;
    designation_en: string;
    designation_bn: string;
    sort_order: number;
    old_thumbnail: string;
    api_token: string;
    status: string;
    operation: string;
}

@Component({
    selector: 'app-our-team',
    templateUrl: './our-team.component.html',
    styleUrls: ['./our-team.component.scss']
})
export class OurTeamComponent implements OnInit {

    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/';
    category_list = [];
    erroeMsg = '';
    totalrow = 0;
    itemPerPage = 10;
    pageNumber = 0;
    pageSizeOptions: number[] = [10, 25, 100, 200, 300, 500];
    dataOrderBy = true;
    sortColumn = 'id';
    searchValues: String = '';
    collection = [];
    dataNotFound = '';


    constructor (private fb: FormBuilder,
        private common: CommonService,
        private dataService: DataService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.common.checkCookie();
        this.showList();
        this.common.aClickedInterior
            .subscribe((data: string) => {
                this.showList();
            });

    }

    permission(type) {
        return this.common.permission('loan/benefits', type);
    }

    createModel() {
        const dialogRef = this.dialog.open(CreateTeamMember, {
            width: '600px',
            data: {
                id: null,
                name_en: '',
                name_bn: '',
                designation_en: '',
                designation_bn: '',
                sort_order: null,
                api_token: this.tokenId,
                operation: 'create',
                status: true,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    openRedModel(data) {
        const dialogRef = this.dialog.open(ViewTeamMember, {
            width: '800px',
            data: {
                id: data.id,
                name_en: data.name_en,
                name_bn: data.name_bn,
                designation_en: data.designation_en,
                designation_bn: data.designation_bn,
                sort_order: data.sort_order,
                old_thumbnail: data.thumbnail,
                api_token: this.tokenId,
                operation: 'Read',
                status: data.status == 1 ? true : false,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openEditModel(data) {
        const dialogRef = this.dialog.open(CreateTeamMember, {
            width: '800px',
            data: {
                id: data.id,
                name_en: data.name_en,
                name_bn: data.name_bn,
                designation_en: data.designation_en,
                designation_bn: data.designation_bn,
                sort_order: data.sort_order,
                old_thumbnail: data.thumbnail,
                api_token: this.tokenId,
                operation: 'update',
                status: data.status == 1 ? true : false,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getSL(i) {
        return (Number(this.itemPerPage) * Number(this.pageNumber)) + i;
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
            + "&search=" + this.searchValues
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
        this.dataService.getAll('our-team/list' + postdate)
            .subscribe(async (res) => {
                if (res.response === 200) {
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
                    } else { throw error; }
                });
    }

    deleteModel(data) {
        const dialogRef = this.dialog.open(DeleteTeamMember, {
            data: {
                id: data.id,
                title_en: data.title_en,
                old_thumbnail: data.thumbnail,
                api_token: this.tokenId,
                operation: 'delete',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

}


@Component({
    selector: 'create-team-member',
    templateUrl: './create-team-member.html',
    styleUrls: ['./our-team.component.scss']
})
export class CreateTeamMember {
    showData = 'EN';
    rootUrl = this.common.rootUrl + 'public/uploads/';
    defaultImage = './assets/img/theme/default.jpg';

    SelectedFile: File;
    ImageFile = this.defaultImage;
    ChangeImg = false;
    selectImg = true;

    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<CreateTeamMember>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
        if (this.data.operation == 'update') {
            this.ImageFile = this.rootUrl + this.data.old_thumbnail;
        }
    }

    // tslint:disable-next-line: typedef thumb
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
    RemoveImage() {
        this.SelectedFile = null;
        this.ChangeImg = false;
        this.ImageFile = this.defaultImage;
    }

    onClick(): void {
        this.data['thumbnail'] = this.SelectedFile;
        this.dataService.create(this.data, 'our-team/create-update')
            .subscribe(data => {
                if (data.response === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', data.message);
                    this.common.aClickedInterior.emit('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else if (data.response === 401) {
                    this.common.openTost('warning', 'WARNING', data.password);
                } else if (data.response === 400) {
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

@Component({
    selector: 'view-team-member',
    templateUrl: './view-team-member.html',
    styleUrls: ['./our-team.component.scss']
})
export class ViewTeamMember {
    rootUrl = this.common.rootUrl + 'public/uploads/';
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<ViewTeamMember>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }
}

@Component({
    selector: 'delete-team-member',
    templateUrl: './delete-team-member.html',
    styleUrls: ['./our-team.component.scss']
})
export class DeleteTeamMember {
    constructor (public dialogRef: MatDialogRef<DeleteTeamMember>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }

    onClick(): void {
        this.dataService.create(this.data, 'our-team/delete')
            .subscribe(data => {
                if (data.response === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', data.message);
                    this.common.aClickedInterior.emit('Component A is clicked!!');
                } else if (data.response === 400) {
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