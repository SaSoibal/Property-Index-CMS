import { Component, OnInit, Inject } from '@angular/core';
import {
	FormGroup, FormBuilder, FormControl,
	Validators, ValidatorFn, AbstractControl
} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { ActivatedRoute } from '@angular/router';
import {NzTabPosition} from 'ng-zorro-antd/tabs';
@Component({
  selector: 'app-guide-details',
  templateUrl: './interior-details.component.html',
  styleUrls: ['./interior-details.component.scss']
})
export class InteriorDetailsComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  slug = this.activatedRoute.snapshot.params.slug;
  pageTitle = this.slug.replaceAll('-', ' ');
  position: NzTabPosition = 'left';
  constructor(private fb: FormBuilder,
    private common: CommonService,
    private dataService: DataService,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.common.aClickedEvent
    .subscribe((data: string) => {
    });

  }

  permission(type) {
    return this.common.permission('interior/interior-list', type);
  }

}

