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
    subtitle_en: string;
    subtitle_bn: string;
    start_date: Date;
    end_date: Date;
    ads_type: number;
    product_type: number;
    products: any[];
    old_thumbnail: string;
    api_token: string;
    status: string;
    operation: string;
}

@Component({
    selector: 'app-property-ads',
    templateUrl: './property-ads.component.html',
    styleUrls: ['./property-ads.component.scss']
})
export class PropertyAdsComponent implements OnInit {

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
        return this.common.permission('property-ads', type);
    }

    createModel() {
        const dialogRef = this.dialog.open(CreatePropertyAds, {
            width: '500px',
            data: {
                id: null,
                title_en: '',
                title_bn: '',
                subtitle_en: '',
                subtitle_bn: '',
                start_date: null,
                end_date: null,
                ads_type: 1,
                product_type: 1,
                products: [],
                api_token: this.tokenId,
                operation: 'create',
                status: true
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
        });
    }

    openRedModel(data) {
        const dialogRef = this.dialog.open(ViewPropertyAds, {
            width: '800px',
            data: {
                id: data.id,
                title_en: data.title_en,
                title_bn: data.title_bn,
                subtitle_en: data.subtitle_en,
                subtitle_bn: data.subtitle_bn,
                start_date: data.start_date,
                end_date: data.end_date,
                ads_type: data.ads_type,
                product_type: data.product_type,
                products: data.products,
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
        const products = data.products.map(product => {
            return data?.product_type == 1 ? product?.sale_product_id : product?.rent_product_id
        })
        console.log(products, 'productsssss');

        const dialogRef = this.dialog.open(CreatePropertyAds, {
            width: '500px',
            data: {
                id: data.id,
                title_en: data.title_en,
                title_bn: data.title_bn,
                subtitle_en: data.subtitle_en,
                subtitle_bn: data.subtitle_bn,
                start_date: data.start_date,
                end_date: data.end_date,
                ads_type: data.ads_type,
                product_type: data.product_type,
                products: products,
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
        this.dataService.getAll('property-ads/list' + postdate)
            .subscribe(async (res) => {
                if (res.code === 200) {
                    this.collection = await res.data?.list?.data || [];
                    this.totalrow = await res.data?.list.total;
                } else {
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
        const dialogRef = this.dialog.open(DeletePropertyAds, {
            data: {
                loan_benefit_id: data.id,
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
    selector: 'create-property-ads',
    templateUrl: './create-property-ads.html',
    styleUrls: ['./property-ads.component.scss']
})
export class CreatePropertyAds {
    showData = 'EN';
    rootUrl = this.common.rootUrl + 'public/uploads/';
    defaultImage = './assets/img/theme/default.jpg';
    saleProductCollection: any[] = [];
    rentProductCollection: any[] = [];
    SelectedFile: File;
    ImageFile = this.defaultImage;
    ChangeImg = false;
    selectImg = true;

    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<CreatePropertyAds>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
        if (this.data.operation == 'update') {
            this.ImageFile = this.rootUrl + this.data.old_thumbnail;
        }

        this.getProducts();

    }

    getProducts() {
        const params = {
            api_token: this.data.api_token
        }
        this.dataService.getAll('common/product-list?api_token=' + params.api_token).subscribe(response => {
            if (response.code == 200) {
                this.saleProductCollection = response.data.sale_products || [];
                this.rentProductCollection = response.data.rent_products || [];;
            }
        });
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



    onClick(): boolean {
        const postData = {
            ...this.data,
            start_date: new Date(this.data.start_date).toLocaleDateString(),
            end_date: new Date(this.data.end_date).toLocaleDateString(),
            thumbnail: this.SelectedFile
        }

        if (!postData.thumbnail && this.data.operation == 'create') {
            this.common.openTost('warning', 'WARNING', 'Please select a thumbnail');
            return false;
        }

        this.dataService.create(postData, `property-ads/${this.data.operation}`)
            .subscribe(response => {
                if (response.code === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', response.message);
                    this.common.aClickedInterior.emit('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
                } else {
                    this.common.openTost('warning', 'WARNING', response.message);
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
    selector: 'view-property-ads',
    templateUrl: './view-property-ads.html',
    styleUrls: ['./property-ads.component.scss']
})
export class ViewPropertyAds {
    rootUrl = this.common.rootUrl + 'public/uploads/';
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<ViewPropertyAds>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }
}

@Component({
    selector: 'delete-property-ads',
    templateUrl: './delete-property-ads.html',
    styleUrls: ['./property-ads.component.scss']
})
export class DeletePropertyAds {
    // tslint:disable-next-line: max-line-length
    constructor (public dialogRef: MatDialogRef<DeletePropertyAds>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData,
        private dataService: DataService,
        private common: CommonService) {
    }

    onClick(): void {
        this.dataService.create(this.data, 'loan-benefit-delete')
            .subscribe(data => {
                if (data.response === 200) {
                    this.dialogRef.close();
                    this.common.openTost('success', 'SUCCESS', data.message);
                    this.common.aClickedInterior.emit('Component A is clicked!!');
                    // tslint:disable-next-line: max-line-length
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
