import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const currentUser = this.authenticationService.getCurrentUsername;
    if(state.url === '/login'){
      if(currentUser) {
        this.router.navigate(['/']);
        return false;
      }else{
        return true;
      }
    }else{
      if(currentUser) {
        return true;
      }else{
        this.router.navigate(['/login']);
        return false;
      }
    }

  }
}

