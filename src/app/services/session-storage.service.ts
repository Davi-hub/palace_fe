import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionStorageService {

  constructor() { }

  saveData(key: string, data: any): void {
    sessionStorage.setItem(key, JSON.stringify(data));
  }

  getData(key: string): any {
    const data = sessionStorage.getItem(key);
    if (data) {
      return JSON.parse(data);
    }
    return null;
  }

  removeData(key: string): void {
    sessionStorage.removeItem(key);
  }
}
