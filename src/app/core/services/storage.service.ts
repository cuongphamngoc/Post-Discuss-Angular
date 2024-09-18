import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  getFromStorage(key: string): string|null {
    return localStorage.getItem(key);
  }
  setToStorage(key: string, value: string): void {
    localStorage.setItem(key, value);
  }
  removeFromStorage(key: string): void {
    localStorage.removeItem(key);
  }
}
