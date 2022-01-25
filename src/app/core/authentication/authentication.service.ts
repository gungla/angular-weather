import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../../shared/models/user';
import { DataAccessService } from '../http/data-access.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private currentUserDataSubject: BehaviorSubject<User> = new BehaviorSubject(null)
  public currentUserData: Observable<User> = this.currentUserDataSubject.asObservable();

  constructor(
    private router: Router,
    private dataAccessService: DataAccessService
  ) { }


  public get getCurrentUsername(): string {
    return localStorage.getItem('currentUsername');
  }

  
  getCurrentUserData(): Observable<User> {
    return this.currentUserDataSubject
  }


  resetCurrentUserDataSubject(userData: User) {
    this.currentUserDataSubject.next(userData)
  }


  settingsAfterLogin(message: string, userData: User): void {
    localStorage.setItem('currentUsername', userData['username']);
    this.currentUserDataSubject.next(userData)
    this.router.navigate(['/']);
  }


  updateCurrentUsersCities(order: Object): void {
    let { username, password, cities } = this.currentUserDataSubject['value']
    if (order['add']) {
      cities.push(order['add'])
    } else {
      cities.splice(cities.indexOf(order['remove']), 1)
    }
    this.dataAccessService.updateUsersCities(username, password, cities).then(() => { })
      .catch((error: Error) => alert('Algo salió mal! Por favor, inténtelo de nuevo más tarde. ' + error))
  }


  login(username: string, password: string): void {
    this.dataAccessService.getUserDataFromDB(username).then((userData: User) => {
      if (userData) {
        if (userData['password'] === password) {
          this.settingsAfterLogin('Bienvenido ', userData);
        } else {
          alert('Nombre de usuario o contraseña incorrectos');
        }
      } else {
        this.dataAccessService.addNewUser(username, password)
          .then((newUserData: User) => this.settingsAfterLogin('Registrado exitosamente! Bienvenido ', newUserData))
          .catch((error: Error) => alert('Algo salió mal! Por favor, inténtelo de nuevo más tarde. ' + error))
      }
    })
      .catch((error: Error) => alert('Algo salió mal! Por favor, inténtelo de nuevo más tarde. ' + error))
  }


  logout(): void {
    localStorage.removeItem('currentUsername');
    this.router.navigate(['/login']);
  }


}

