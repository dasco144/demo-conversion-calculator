import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChartDataSets, ChartOptions } from 'chart.js';
import * as pluginAnnotations from 'chartjs-plugin-annotation';
import { Color, Label } from 'ng2-charts';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyCodes } from '../../types/currency-codes';

type Period = 'week' | 'month' | 'year';

@Component({
  selector: 'demo-rate-history',
  templateUrl: './rate-history.component.html',
  styleUrls: ['./rate-history.component.scss']
})
export class RateHistoryComponent implements OnInit {
  loading = true;

  base: CurrencyCodes;

  compareRate: CurrencyCodes;

  _period: Period = 'week';

  public get period(): Period {
    return this._period;
  }

  public set period(value: Period) {
    if (this.period !== value) {
      this._period = value;
      this.getHistoricalData();
    }
  }

  chartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Rate'
    }
  ];

  chartLabels: Label[] = [];

  chartOptions: ChartOptions = {
    responsive: false
  };

  chartColours: Color[] = [
    {
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];

  chartPlugins = [pluginAnnotations];

  constructor(
    private currencyService: CurrencyService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    const state = this.router.getCurrentNavigation().extras.state;

    if (!state) {
      this.router.navigateByUrl('/currency');
      return;
    }

    this.base = state.baseCurrency;
    this.compareRate = state.compareRate;
  }

  ngOnInit(): void {
    this.getHistoricalData();
  }

  async getHistoricalData() {
    this.loading = true;

    const currencyRateHistory = await this.currencyService.getCurrencyRateHistory(
      this.base,
      this.compareRate,
      this.period
    );

    this.chartData[0].data = [];
    this.chartLabels = [];

    Object.entries(currencyRateHistory.rates).forEach((entry) => {
      this.chartData[0].data.push(entry[1]);
      this.chartLabels.push(entry[0]);
    });

    this.loading = false;
  }

  navigateBack(): void {
    this.router.navigate(['../'], { relativeTo: this.activatedRoute });
  }
}
