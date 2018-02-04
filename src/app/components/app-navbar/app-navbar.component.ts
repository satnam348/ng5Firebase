import { Router, NavigationStart } from '@angular/router';
import { CATEGORY } from './../../models/category';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './app-navbar.component.html',
  styleUrls: ['./app-navbar.component.css']
})
export class AppNavbarComponent implements OnInit {
  isSignOut: Boolean = false;
  isShow: Boolean = false;
  notification:  Boolean = false;
  navItem = CATEGORY;
  msg = [] ;
  constructor(public _AuthService: AuthService, public router: Router) { }
  ngOnInit() {

  this._AuthService.eventEmit.subscribe((user) => {
    if (user !== null) {
      this.isSignOut = true;
     } else {
       this.isSignOut = false;
     }
  });
  this._AuthService.notify.subscribe((data) => {
   this.notification = true;
   if (this.msg.indexOf(data) === -1) {
    this.msg.push(data);
   }

   this.autoHide();
  });
  this._AuthService.ChecKAuthentication();
  this.router.events.subscribe(event => {
    if (event instanceof NavigationStart) {
      this.isShow = false;
    }
  });
}

signOut() {
this._AuthService.signOut();
}
navExpand() {
  this.isShow = !this.isShow;
}
autoHide() {
  setTimeout(() => {
    this.notification = false;
    this.msg = [];
  }, 5000);
}
}

