import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _AuthService: AuthService, private router: Router) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if ( this._AuthService.ChecKAuthentication() !== null) {
        return true;
      } else {
         this.router.navigate(['login']);
      }
  }
}
