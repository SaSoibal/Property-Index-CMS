import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppError } from 'src/app/core_classes/app-error';
import { BadInput } from 'src/app/core_classes/bad-input';
import { CommonService } from 'src/app/services/common.service';
import { DataService } from 'src/app/services/data.service';

export interface DialogData {
    id: number;
    title_en: string;
    title_bn: string;
    address_en: string,
    address_bn: string,
    description_en: string;
    description_bn: string;
    project_type: number;
    product_type: number | any;
    city: number | any;
    video_url: string;
    old_image: string;
    status: string;
    api_token: string;
    operation: string;
}

@Component({
    selector: 'app-demo-project',
    templateUrl: './demo-project.component.html',
    styleUrls: ['./demo-project.component.scss']
})
export class DemoProjectComponent implements OnInit {

    tokenId = this.common.mycookie.bearertoken;
    rootUrl = this.common.rootUrl + 'public/uploads/';
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
        return this.common.permission('ap/banner-manage', type);
    }

    createModel() {
        const dialogRef = this.dialog.open(CreateDemoProject, {
            width: '900px',
            data: {
                title_en: '',
                title_bn: '',
                address_en: '',
                address_bn: '',
                description_en: '',
                description_bn: '',
                project_type: 1,
                product_type: null,
                city: null,
                video_url: '',
                api_token: this.tokenId,
                operation: 'create',
                status: false,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
        });
    }

    openRedModel(data) {
        const dialogRef = this.dialog.open(ReadDemoProject, {
            width: '900px',
            data: {
                id: data.id,
                title_en: data.title_en,
                title_bn: data.title_bn,
                address_en: data.address_en,
                address_bn: data.address_bn,
                description_en: data.description_en,
                description_bn: data.description_bn,
                project_type: data?.project_type,
                product_type: data?.product_type_info,
                city: data?.city,
                video_url: data.video_url,
                old_image: data.image,
                api_token: this.tokenId,
                operation: 'Read',
                status: data.status == 1 ? true : false,
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }

    openEditModel(data) {
        console.log(data);

        const dialogRef = this.dialog.open(CreateDemoProject, {
            width: '900px',
            data: {
                id: data.id,
                title_en: data.title_en,
                title_bn: data.title_bn,
                address_en: data.address_en,
                address_bn: data.address_bn,
                description_en: data.description_en,
                description_bn: data.description_bn,
                project_type: data?.project_type,
                product_type: data?.product_type,
                city: data?.city_id,
                video_url: data.video_url,
                old_image: data.image,
                api_token: this.tokenId,
                operation: 'update',
                status: data.status == 1 ? true : false,
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
            'per_page': this.itemPerPage,
            'page': this.pagereqest,
            'sort_by': orderBy,
            'sort_column': this.sortColumn,
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
        this.dataService.create(postdate, 'demo-project/list')
            .subscribe(
                response => {
                    if (response.code === 200) {
                        this.collection = response?.data?.data || [];
                        this.totalrow = response?.data?.total || 0;
                        this.dataNotFound = '';
                    } else {
                        this.collection = [];
                        this.totalrow = 0;
                    }
                },
                (error: AppError) => {
                    this.common.openTost('error', 'ERROR', 'Please try again later');
                    if (error instanceof BadInput) {
                    } else { throw error };
                });
    }

    deleteModel(data) {
        const dialogRef = this.dialog.open(DeleteDemoProject, {
            data: {
                id: data.id,
                title_en: data.title_en,
                old_image: data.image,
                api_token: this.tokenId,
                operation: 'delete',
            }
        });
        dialogRef.afterClosed().subscribe(result => {
        });
    }



}

@Component({
    selector: 'create-demo-project-model',
    templateUrl: './create-demo-project-model.html',
    styleUrls: ['./demo-project.component.scss']
})
export class CreateDemoProject {
    cityCollection: any[] = [];
    productTypeCollection: any[] = [];
    rootUrl = this.common.rootUrl + 'public/uploads/';
    defaultImage = './assets/img/theme/default.jpg';
    SelectedFile: File;
    fileType: string = 'image';
    ImageFile = this.defaultImage;
    ChangeImg = false;
    selectImg = true;
    // tslint:disable-next-line: max-line-length
    constructor (
        public dialogRef: MatDialogRef<CreateDemoProject>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {

        if (this.data.operation == 'update') {
            this.ImageFile = this.rootUrl + this.data.old_image;
            if (this.ImageFile.length > 0 && (this.ImageFile?.endsWith('.jpg') || this.ImageFile?.endsWith('.jpeg') || this.ImageFile?.endsWith('.png'))) {
                this.fileType = 'image';
            } else {
                this.fileType = 'video';
            }
        }

        this.getCitis();
        this.getProductTypes();
    }

    getCitis() {
        const postData = {
            'api_token': this.data.api_token,
        }
        this.dataService.create(postData, 'common/city-list').subscribe({
            next: (response) => {
                if (response?.response == 200) {
                    this.cityCollection = response.list || [];
                } else {
                    this.cityCollection = [];
                }
            },
            error: (e) => console.log(e),
            complete: () => {

            }
        })
    }

    getProductTypes() {
        const postData = {
            'api_token': this.data.api_token,
        }
        this.dataService.create(postData, 'common/product-type').subscribe({
            next: (response) => {
                if (response?.response == 200) {
                    this.productTypeCollection = response.list || [];
                } else {
                    this.productTypeCollection = [];
                }
            },
            error: (e) => console.log(e),
            complete: () => {

            }
        })
    }

    // tslint:disable-next-line: typedef
    Changed(fileInput) {
        const pre = this;
        if (fileInput.target.files && fileInput.target.files[0]) {
            const file = fileInput.target.files[0];
            const reader = new FileReader();

            // Detect file type (image or video)
            if (file.type.startsWith('image')) {
                this.fileType = 'image';
            } else if (file.type.startsWith('video')) {
                this.fileType = 'video';
            }

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
        this.data['image'] = this.SelectedFile;
        const postData = {
            ...this.data,
            city_id: this.data.city
        }
        this.dataService.create(postData, 'demo-project/' + this.data.operation)
            .subscribe(response => {
                if (response.code === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', response.message);
                    this.common.AClicked('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else if (response.code === 401) {
                    this.common.openTost('warning', 'WARNING', response.password);
                } else {
                    this.common.openTost('warning', 'WARNING', response.message);
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
    selector: 'read-demo-project-model',
    templateUrl: './read-demo-project-model.html',
    styleUrls: ['./demo-project.component.scss']
})
export class ReadDemoProject {
    rootUrl = this.common.rootUrl + 'public/uploads/';
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<ReadDemoProject>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }
}

@Component({
    selector: 'delete-demo-project-modal',
    templateUrl: './delete-demo-project-model.html',
    styleUrls: ['./demo-project.component.scss']
})
export class DeleteDemoProject {
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<DeleteDemoProject>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }

    onClick(): void {
        this.dataService.create(this.data, 'ap-banner-delete')
            .subscribe(response => {
                if (response.code === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', response.message);
                    this.common.AClicked('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else {
                    this.common.openTost('warning', 'WARNING', response.message);
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


