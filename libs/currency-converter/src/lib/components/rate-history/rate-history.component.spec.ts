import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { ChartsModule } from 'ng2-charts';
import { CurrencyRateHistory } from '../../models/currency-rate-history';
import { CurrencyService } from '../../services/currency.service';
import { CurrencyCodes } from '../../types/currency-codes';
import { RateHistoryComponent } from './rate-history.component';

describe('RateHistoryComponent', () => {
  let component: RateHistoryComponent;
  let fixture: ComponentFixture<RateHistoryComponent>;

  let currencyServiceSpy: jasmine.SpyObj<CurrencyService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockActivatedRoute: Partial<ActivatedRoute>;

  let base: CurrencyCodes;
  let compare: CurrencyCodes;

  beforeEach(async () => {
    base = 'ZAR';
    compare = 'AUD';

    currencyServiceSpy = jasmine.createSpyObj<CurrencyService>(
      'CurrencyService',
      ['getCurrencyRateHistory']
    );

    routerSpy = jasmine.createSpyObj<Router>('Router', [
      'navigate',
      'navigateByUrl',
      'getCurrentNavigation'
    ]);

    mockActivatedRoute = new ActivatedRoute();

    const rates = {
      '2020-11-07': {
        AUD: 1
      } as any,
      '2020-11-08': {
        AUD: 1.2
      } as any
    };

    const history: CurrencyRateHistory = {
      base: 'ZAR',
      start_at: '2020-11-07',
      end_at: '2020-11-08',
      rates: Object.entries(rates)
        .map((rate) => ({
          date: rate[0],
          value: Object.values(rate[1])[0]
        }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .reduce((obj, item) => {
          obj[item.date] = item.value;
          return obj;
        }, {})
    };

    currencyServiceSpy.getCurrencyRateHistory.and.returnValue(
      Promise.resolve(history)
    );

    const navigation: Navigation = {
      extras: {
        state: {
          baseCurrency: 'ZAR',
          compareRate: 'AUD'
        }
      }
    } as any;

    routerSpy.getCurrentNavigation.and.returnValue(navigation);

    await TestBed.configureTestingModule({
      declarations: [RateHistoryComponent],
      imports: [
        FormsModule,
        MockModule(MatProgressSpinnerModule),
        MockModule(MatButtonToggleModule),
        MockModule(MatButtonModule),
        MockModule(FlexLayoutModule),
        MockModule(ChartsModule)
      ],
      providers: [
        provideMockStore(),
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RateHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(currencyServiceSpy.getCurrencyRateHistory).toHaveBeenCalledWith(
      base,
      compare,
      'week'
    );
  });

  it('should navigate back if created without route data', async () => {
    TestBed.resetTestingModule();

    const navigation: Navigation = {
      extras: {}
    } as any;

    routerSpy.getCurrentNavigation.and.returnValue(navigation);

    await TestBed.configureTestingModule({
      declarations: [RateHistoryComponent],
      imports: [
        FormsModule,
        MockModule(MatProgressSpinnerModule),
        MockModule(MatButtonToggleModule),
        MockModule(MatButtonModule),
        MockModule(FlexLayoutModule),
        MockModule(ChartsModule)
      ],
      providers: [
        provideMockStore(),
        { provide: CurrencyService, useValue: currencyServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RateHistoryComponent);

    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/currency');
  });

  describe('navigation', () => {
    it('should navigate up one level', () => {
      component.navigateBack();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['../'], {
        relativeTo: mockActivatedRoute
      });
    });
  });

  describe('period', () => {
    let getHistoricalDataSpy: jasmine.Spy;

    beforeEach(() => {
      getHistoricalDataSpy = spyOn(component, 'getHistoricalData');
    });

    it('should call getHistoricalData when changing period', () => {
      component.period = 'month';

      expect(getHistoricalDataSpy).toHaveBeenCalled();
    });

    it('should not call getHistoricalData when setting period to same value', () => {
      component.period = 'week';

      expect(getHistoricalDataSpy).not.toHaveBeenCalled();
    });
  });
});
