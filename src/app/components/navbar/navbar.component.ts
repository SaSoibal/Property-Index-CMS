import { Component, OnInit, ElementRef } from '@angular/core';
import { ROUTES } from '../sidebar/sidebar.component';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonService } from './../../services/common.service';
import { DataService } from './../../services/data.service';
import { BadInput } from './../../core_classes/bad-input';
import { AppError } from './../../core_classes/app-error';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  tokenId = this.common.mycookie.bearertoken ;
  public focus;
  public listTitles: any[];
  public location: Location;
  name = this.common.mycookie.name;
  email = this.common.mycookie.username;
  notification_list = []
  constructor(
      location: Location,  
      private element: ElementRef, 
      private router: Router,
      public auth: AuthService,
      public common: CommonService,
      public dataService: DataService,
    ) {
      this.location = location;
    }

  ngOnInit() {
    this.listTitles = ROUTES.filter(listTitle => listTitle);
    this.notification();
  }
  getTitle(){
    var titlee = this.location.prepareExternalUrl(this.location.path());
    if(titlee.charAt(0) === '#'){
        titlee = titlee.slice( 1 );
    }

    for(var item = 0; item < this.listTitles.length; item++){
        if(this.listTitles[item].path === titlee){
            return this.listTitles[item].title;
        }
    }
    return 'Dashboard';
  }

  logout(){
    const token = this.common.mycookie.bearertoken
    this.auth.logOut(token);
  }

  notification() {
    const queryString = "?"
      + "api_token=" + this.tokenId;
    this.dataService.getAll('notification-pending-list' + queryString)
      .subscribe(async(res) => {
          if (res.code === 200) {
              this.notification_list = res.list  
          } else if (res.code === 404) {
         
          }
        },
        (error: AppError) => {
          this.common.openTost('error', 'ERROR', 'Please try again later');
          if (error instanceof BadInput) {
          } else { throw error; }
        });

  }



}
