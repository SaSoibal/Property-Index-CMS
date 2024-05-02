import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl,Validators, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../../services/common.service';
import { DataService } from '../../../services/data.service';
import { BadInput } from '../../../core_classes/bad-input';
import { AppError } from '../../../core_classes/app-error';
import { NzTabPosition } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.scss']
})
export class ProjectSettingsComponent implements OnInit {
  position: NzTabPosition = 'left';

  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(private fb: FormBuilder, 
    private common: CommonService, 
    private dataService: DataService
    ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.common.aClickedEvent
    .subscribe((data:string) => {
      console.log('Event message from Component A: ' + data);
    });
   
  }
  
  permission(type) {
    return this.common.permission('settings/project-settings',type);
  }



}

