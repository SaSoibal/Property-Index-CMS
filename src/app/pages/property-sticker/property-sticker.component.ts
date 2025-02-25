import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppError } from 'src/app/core_classes/app-error';
import { BadInput } from 'src/app/core_classes/bad-input';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
    id: string;
    type: string;
    color: string;
    bgcolor: string;
    image: string | File;
    status: string;
    operation: string
}

@Component({
    selector: 'app-property-sticker',
    templateUrl: './property-sticker.component.html',
    styleUrls: ['./property-sticker.component.scss']
})
export class PropertyStickerComponent implements OnInit {

    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/';
    album_list = [];
    erroeMsg = '';
    totalrow = 0;
    itemPerPage = 10;
    pagereqest = 0;
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
        this.common.aClickedEvent
            .subscribe((data: string) => {
                console.log('Event message from Component A: ' + data);
                this.showList();
            });

    }

    permission(type) {
        return this.common.permission('about-us/gallery', type);
    }

    createModel() {
        const dialogRef = this.dialog.open(CreatePropertyStickerDialog, {
            width: '500px',
            data: {
                type: '',
                color: '#000000',
                bgcolor: '#000000',
                status: false,
                image: '',
                operation: 'create',
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
        });
    }

    openEditModel(item) {
        console.log(item);
        const dialogRef = this.dialog.open(CreatePropertyStickerDialog, {
            width: '500px',
            data: {
                id: item?.id,
                type: item?.type,
                color: item?.color || '#000000',
                bgcolor: item?.bgcolor || '#000000',
                image: item?.thumbnail,
                status: item.status == 1 ? true : false,
                operation: 'update',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    getSL(i) {
        return (Number(this.itemPerPage) * Number(this.pagereqest)) + i;
    }

    showList() {
        let orderBy: string;
        if (this.dataOrderBy === true) {
            orderBy = 'DESC';
        } else {
            orderBy = 'ASC';
        }
        const postdatet = {
            'api_token': this.tokenId,
            'rowperpage': this.itemPerPage,
            'page': this.pagereqest,
            'order': orderBy,
            'columns': this.sortColumn,
            'search': this.searchValues
        }
        this.get_list(postdatet);
    }

    pageEvent(event) {
        this.pagereqest = event.pageIndex;
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
        this.pagereqest = 0;
        this.showList();
    }

    clearFilter() {
        this.searchValues = '';
        this.pagereqest = 0;
        this.showList();
    }

    get_list(postdate) {
        this.dataService.create(postdate, 'sticker/list')
            .subscribe(
                response => {
                    if (response.code === 200) {
                        this.collection = response.data.list.data;
                        this.totalrow = response.data.list.total;
                        this.dataNotFound = '';
                    } else {
                        this.collection = [];
                        this.dataNotFound = response.data.message;
                    }
                },
                (error: AppError) => {
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }

    deleteModel(ctg) {
        const dialogRef = this.dialog.open(DeletePropertyStickerDialog, {
            data: {
                id: ctg.id,
                type: ctg.type,
                operation: 'delete',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }



}

@Component({
    selector: 'create-about-us-gallery-model',
    templateUrl: './create-property-sticker-model.html',
    styleUrls: ['./property-sticker.component.scss']
})
export class CreatePropertyStickerDialog {
    showData = 'EN';
    rootUrl = this.common.rootUrl + 'public/uploads/';
    defaultImage = './assets/img/theme/default.jpg';
    SelectedFile: File;
    ImageFile = this.defaultImage;
    ChangeImg = false;
    selectImg = true;
    tokenId = this.common.mycookie.bearertoken;

    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<CreatePropertyStickerDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
        if (this.data.operation == 'update') {
            this.ImageFile = this.rootUrl + this.data.image
        }
    }

    changeLanguage(event) {
        if (event == true) {
            this.showData = 'BN';
        } else {
            this.showData = 'EN';
        }
    }

    // tslint:disable-next-line: typedef
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
        const postData = {
            ...this.data,
            image: this.SelectedFile,
            api_token: this.tokenId
        }

        this.dataService.create(postData, `sticker/${this.data.operation}`)
            .subscribe(data => {
                if (data.code === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', data.message);
                    this.common.AClicked('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else if (data.code === 400) {
                    this.common.openTost('warning', 'WARNING', data.message);
                } else {
                    this.common.openTost('warning', 'WARNING', data.password);
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

@Component({
    selector: 'delete-about-us-gallery-modal',
    templateUrl: './delete-property-sticker-model.html',
    styleUrls: ['./property-sticker.component.scss']
})
export class DeletePropertyStickerDialog {
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<DeletePropertyStickerDialog>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }

    onClick(): void {
        this.dataService.create(this.data, 'about-us-gallery-deletee')
            .subscribe(data => {
                if (data.response === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', data.message);
                    this.common.AClicked('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else if (data.response === 400) {
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
