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
  constructor(public _AuthService: AuthService) { }
ngOnInit() {

  this._AuthService.eventEmit.subscribe((user) => {
    if (user !== null) {
      this.isSignOut = true;
     } else {
       this.isSignOut = false;
     }
  });
  this._AuthService.ChecKAuthentication();
}

signOut() {
this._AuthService.signOut();
}
navExpand() {
  this.isShow = !this.isShow;
}
}
