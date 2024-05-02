import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service'

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];
  public isCollapsed = true;
  public routes = []
  constructor(private router: Router,private common:CommonService) { }

  ngOnInit() {
  //   this.menuItems = ROUTES.filter(menuItem => menuItem);
  //   this.router.events.subscribe((event) => {
  //     this.isCollapsed = true;
  //  });
      this.resetRoute ();
      this.menuItems = this.routes.filter(menuItem => menuItem);
      this.common.aClickedEvent
      .subscribe((data:string) => {
      //  console.log('Event message from Component A: ' + data);
        this.resetRoute ();
        this.menuItems = this.routes.filter(menuItem => menuItem);
      });

  }

  resetRoute () {
    this.routes = [];
    this.common.rolelist.forEach(element => {
      if(element.parent_id == 0){
        const menu={
          title: element.module_name,
          icon: element.icon,
          id: element.module_id,
          path: element.slug,
          subMenus: this.getsubmenue(element.module_id)
        }
        this.routes.push(menu)
      }
    });

  }

  isEmpty(obj) {
    for(var prop in obj) {
        if(obj.hasOwnProperty(prop))
            return false;
    }
    return true;
  }

  getsubmenue(mainmenu_id) {
        var submenue = [];
        if (this.common.rolelist != null) {
        this.common.rolelist.find((element: any) => {
          if ( element.parent_id ===  mainmenu_id) {
            let obj = {path: '', title: '', icon: '', id: ''}
            obj.path = element.slug;
            obj.title =  element.module_name;
            obj.icon = element.icon,
            obj.id = element.module_id
            if (element.module_id) {
              submenue.push(obj)
            }
            return false
          }
        })
      }
    return submenue
  }

}
