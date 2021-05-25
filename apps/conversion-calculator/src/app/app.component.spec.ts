import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';
import { MockModule } from 'ng-mocks';
import { of } from 'rxjs';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  let breakpointObserverSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    breakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>(
      'BreakpointObserver',
      ['observe']
    );

    breakpointObserverSpy.observe.and.returnValue(of());

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [
        RouterTestingModule,
        MockModule(MatButtonModule),
        MockModule(MatSidenavModule),
        MockModule(MatToolbarModule),
        MockModule(MatIconModule),
        MockModule(MatListModule),
        MockModule(FlexLayoutModule)
      ],
      providers: [
        { provide: BreakpointObserver, useValue: breakpointObserverSpy }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('breakpointObserver', () => {
    it('should fix sidebar for non matching state', fakeAsync(() => {
      const state: BreakpointState = {
        matches: false,
        breakpoints: {}
      };

      breakpointObserverSpy.observe.and.returnValue(of(state));

      fixture.detectChanges();

      tick(100);

      expect(component.fixedSideBar).toBe(true);
      expect(component.matDrawer.mode).toEqual('side');
      expect(component.matDrawer.opened).toEqual(true);
    }));

    it('should hide sidebar for matching state', fakeAsync(() => {
      const state: BreakpointState = {
        matches: true,
        breakpoints: {}
      };

      breakpointObserverSpy.observe.and.returnValue(of(state));

      fixture.detectChanges();

      tick(100);

      expect(component.fixedSideBar).toEqual(false);
      expect(component.matDrawer.mode).toEqual('over');
      expect(component.matDrawer.opened).toEqual(false);
    }));
  });

  describe('toggleSideNav', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should toggle sidebar if sidebar is not fixed', () => {
      const toggleSpy = spyOn(component.matDrawer, 'toggle');
      component.fixedSideBar = false;

      component.toggleSidenav();

      expect(toggleSpy).toHaveBeenCalled();
    });

    it('should not toggle sidebar if sidebar is not fixed', () => {
      const toggleSpy = spyOn(component.matDrawer, 'toggle');
      component.fixedSideBar = true;

      component.toggleSidenav();

      expect(toggleSpy).not.toHaveBeenCalled();
    });

    it('should force toggle sidebar', () => {
      const toggleSpy = spyOn(component.matDrawer, 'toggle');
      component.fixedSideBar = true;

      component.toggleSidenav(true);

      expect(toggleSpy).toHaveBeenCalled();
    });
  });
});
