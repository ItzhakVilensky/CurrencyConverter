import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { ConverterService } from '../../services/converter.service';
import { HistoryService } from '../../services/history.service';
import { ConverterResponse, Currencies } from '../../models/currency.models';
import { convertStringToDate } from '../../utils/date-formatter';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatChipsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    CanvasJSAngularChartsModule,
  ],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
})
export class ConverterComponent implements OnInit {
  amount: number = 1;
  fromCurrency: string = 'USD';
  toCurrency: string = 'ILS';
  result: number | null = null;
  currencies: Currencies = {};
  currDisplay: { key: string; value: string }[] = [];
  chart: any;
  chartXandYValues: { x: Date; y: number }[] = [];
  chartOptions: any;
  resultToCurr: string = 'ILS';
  resultFromCurr: string = 'USD';
  resultAmount: number = 1;

  constructor(
    private converterService: ConverterService,
    private historyService: HistoryService
  ) { }

  ngOnInit() {
    this.getAllCurrencies();
  }

  getAllCurrencies() {
    this.converterService.getAllCurrencies().subscribe({
      next: (currencies) => {
        this.currencies = { ...currencies };
        this.currDisplay = Object.entries(currencies).map(([key, value]) => ({
          key,
          value,
        }));
      },
      error: (err) => alert('Error while fetching currency List'),
    });
  }

  convert() {
    if (this.amount <= 0) return;

    this.converterService /** @todo: Subscribe and release */
      .getConvertCurrency(this.fromCurrency, this.toCurrency, this.amount)
      .subscribe({
        next: (res: ConverterResponse) => {
          this.result = res.rates[this.toCurrency];
          this.historyService.saveConversionToStorage({
            amount: this.amount,
            from: this.fromCurrency,
            to: this.toCurrency,
            result: this.result,
            date: new Date(),
          });
          this.resultToCurr = this.toCurrency;
          this.resultFromCurr = this.fromCurrency;
          this.resultAmount = this.amount;
          this.updateChart();
        },
        error: (err) => alert('Error while fetching currency conversion'),
      });

    return;
  }

  updateChart() {
    this.converterService
      .getHistoricalRates(this.fromCurrency, this.toCurrency)
      .subscribe({/** @todo: Subscribe and release */
        next: (data) => {
          const dates = Object.keys(data.rates);
          this.chartXandYValues = dates.map((date) => ({
            x: convertStringToDate(date),
            y: data.rates[date][this.toCurrency],
          }));

          if (!this.chartOptions) {
            this.chartOptions = {
              theme: 'light2',
              animationEnabled: true,
              zoomEnabled: true,
              title: {
                text: `Exchange Rate`,
              },
              axisY: {
                labelFormatter: (e: any) => {
                  const suffixes = ['', 'K', 'M', 'B', 'T'];
                  let order = Math.max(
                    Math.floor(Math.log(e.value) / Math.log(1000)),
                    0
                  );
                  order = Math.min(order, suffixes.length - 1);
                  const suffix = suffixes[order];
                  return e.value / Math.pow(1000, order) + suffix;
                },
              },
              data: [
                {
                  type: 'line',
                  xValueFormatString: 'YYYY-MM-DD',
                  yValueFormatString: '#,###.##',
                  dataPoints: [...this.chartXandYValues],
                },
              ],
            };
          } else {
            this.chartOptions.data[0].dataPoints = [...this.chartXandYValues];
          }

          if (this.chart) {
            this.chart.render();
          }
        },
        error: (err) => console.error('Error fetching historical rates:', err),
      });
  }
}
