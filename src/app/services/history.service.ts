import { Injectable } from '@angular/core';
import { ConversionForStorage, STORAGE_KEY } from '../models/currency.models';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private storage_key = STORAGE_KEY;
  allStoredConversions: ConversionForStorage[] = [];

  getConversionsFromStorage(): ConversionForStorage[] {
    if (typeof localStorage !== 'undefined') {
      const history = localStorage.getItem(this.storage_key);
      if (history) {
        this.allStoredConversions = JSON.parse(history);
      } else {
        console.error("Local Storage is not supported");
      }
    }
    return this.allStoredConversions;
  }

  saveConversionToStorage(newConversion: ConversionForStorage) {
    const history = this.getConversionsFromStorage();
    const allConversions = [newConversion, ...history];
    localStorage.setItem(this.storage_key, JSON.stringify(allConversions))
  }
}
