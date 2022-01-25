import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

import { NgxIndexedDB  } from 'ngx-indexed-db';
import { environment } from '../guards/environment';
import { User } from '../../shared/models/user';

@Injectable({
  providedIn: 'root'
})
export class DataAccessService {
  
  private database: NgxIndexedDB;
  private env: Object =  environment.APIKey;

  constructor(private http: HttpClient) { 
    this.database = new NgxIndexedDB('weatherApp', 1);
    this.createDatabaseStore();
  }


  createDatabaseStore(): void {
    this.database.openDatabase(1, evt => {
      const objectStore = evt.currentTarget.result.createObjectStore('users', { keyPath: 'username' });
      objectStore.createIndex('username', 'username', { unique: true });
      objectStore.createIndex('password', 'password', { unique: false });
      objectStore.createIndex('cities', 'cities', { unique: false });
    });
  }


  async getUserDataFromDB(username:string): Promise<User> {
    return this.database.getByIndex('users', 'username', username)
    .then(response => response)
    .catch(error => {throw new Error(error)})
  }


  async addNewUser(newUsername: string, newPassword: string, cityOfLocation?:number[]): Promise<User> {
    return this.database.add('users', { username: newUsername, password: newPassword, cities: cityOfLocation||[] })
    .then(() => this.database.getByIndex('users', 'username', newUsername))
    .catch(error => {throw new Error(error)})
  }


  async updateUsersCities(username:string, password:string, cities:number[]): Promise<any> {
    return this.database.update('users', { username: username, password: password, cities: cities } )
    .then(response => response)
    .catch(error => {throw new Error(error)})
  }

  getCityByName(cityName:string): Observable<Object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${this.env}`)
  }


  getCityByLocation(coordinates:number[]): Observable<Object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${coordinates[0]}&lon=${coordinates[1]}&appid=${this.env}`)
  }


  getWeatherDataForSeveralCities(cities:number[]): Observable<Object> {
    return this.http.get(`http://api.openweathermap.org/data/2.5/group?id=${cities}&appid=${this.env}&units=metric`)
  }

  
  getForecastForAllCities(cityIDs:number[]): Observable<any> {
    const listOfLinks = cityIDs.map(id => {
      return this.http.get(`http://api.openweathermap.org/data/2.5/forecast?id=${id}&appid=${this.env}&units=metric`)
    })
    return forkJoin(listOfLinks)
  }

}

