import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {

  constructor() {}
    
  setLocalData(key, value): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = localStorage.setItem(key, value);
      resolve(data)
    });
  }

  getLocalData(key): Promise<any> {
    return new Promise((resolve, reject) => {
      let data = localStorage.getItem(key)
      resolve(data)
    });
  }

  deleteAll(): Promise<any> {
    return new Promise((resolve, reject) => {
      localStorage.clear();
      resolve(true)
    });
  }

  delete(key): Promise<any> {
    return new Promise((resolve, reject) => {
      for (const keys of key) {
        localStorage.removeItem(keys);
      }
      resolve(key)
    });
  }
}
