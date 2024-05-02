import { Component, OnInit, Inject } from '@angular/core';
import {FormGroup, FormBuilder, FormControl, ValidatorFn, AbstractControl} from '@angular/forms';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { NzTabPosition } from 'ng-zorro-antd/tabs';

@Component({
  selector: 'app-lead-settings',
  templateUrl: './system-settings.component.html',
  styleUrls: ['./system-settings.component.scss']
})
export class SystemSettingsComponent implements OnInit {
  position: NzTabPosition = 'left';
  setMenu = 1;
  tokenId = this.common.mycookie.bearertoken ;
  rootUrl =  this.common.rootUrl + 'public/uploads/';
  constructor(private fb: FormBuilder,
              private common: CommonService,
              private dataService: DataService
  ) { }

  ngOnInit() {
    this.common.checkCookie();
    this.common.aClickedEvent
      .subscribe((data: string) => {
        console.log('Event message from Component A: ' + data);
      });

  }

  permission(type) {
    return this.common.permission('system-settings/additional-setting',type);
  }
  onClickMenu(event){
    this.setMenu = event
  }


}

