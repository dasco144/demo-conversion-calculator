import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'demo-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  @ViewChild(MatDrawer) matDrawer: MatDrawer;

  fixedSideBar = true;

  destroy$ = new Subject<boolean>();

  constructor(
    private breakpointObserver: BreakpointObserver,
    private cdRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.breakpointObserver
      .observe(['(max-width: 600px)'])
      .pipe(
        tap((state: BreakpointState) => {
          if (state.matches) {
            this.fixedSideBar = false;
            this.matDrawer.mode = 'over';
            this.matDrawer.opened = false;
          } else {
            this.fixedSideBar = true;
            this.matDrawer.mode = 'side';
            this.matDrawer.opened = true;
          }

          this.cdRef.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  toggleSidenav(force = false): void {
    if (this.fixedSideBar && !force) {
      return;
    }

    this.matDrawer.toggle();
  }
}
