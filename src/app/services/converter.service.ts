import { Injectable } from '@angular/core';
import { lastWeekDay } from '../utils/date-formatter';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  BASE_API,
  ConverterResponse,
  Currencies,
  HistoricalRates,
} from '../models/currency.models';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  private baseUrl = BASE_API;

  constructor(private http: HttpClient) { }

  getAllCurrencies(): Observable<Currencies> {
    return this.http.get<Currencies>(`${this.baseUrl}/currencies`);
  }

  getConvertCurrency(from: string, to: string, amount: number): Observable<ConverterResponse> {
    return this.http.get<ConverterResponse>(
      `${this.baseUrl}/latest?amount=${amount}&base=${from}&symbols=${to}`
    );
  }

  getHistoricalRates(fromCurr: string, toCurr: string): Observable<HistoricalRates> {
    const dateFrom = lastWeekDay();
    return this.http.get<HistoricalRates>(
      `${this.baseUrl}/${dateFrom}..?base=${fromCurr}&symbols=${toCurr}`
    );
  }
}
