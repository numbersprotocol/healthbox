import { Component, OnInit, OnDestroy } from '@angular/core';
import { PopoverController, LoadingController } from '@ionic/angular';
import { Symptoms } from '../../classes/symptoms';
import { SnapshotService } from '../../services/snapshot.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, from, defer, forkJoin, Subject, concat, pipe, timer, zip, of } from 'rxjs';
import { switchMap, takeUntil, tap, delay, concatMap } from 'rxjs/operators';
import { GeolocationService } from '../../services/geolocation.service';
import { RecordFinishPage } from '../../components/record-finish/record-finish.page';
import { Location } from '@angular/common';
import { HealthCondition } from '../../classes/health-condition';
import { DataField } from '../../classes/data-field';

@Component({
  selector: 'app-add-record',
  templateUrl: './add-record.page.html',
  styleUrls: ['./add-record.page.scss'],
})
export class AddRecordPage implements OnInit, OnDestroy {
  text = {
    recorded: '',
    ok: '',
  };
  recorded$: Observable<string>;
  ok$: Observable<string>;
  destroy$ = new Subject();
  healthCondition = new HealthCondition();

  constructor(
    private loadingCtrl: LoadingController,
    private location: Location,
    private geolocationService: GeolocationService,
    private snapshotService: SnapshotService,
    private translate: TranslateService,
    public popoverController: PopoverController,

  ) {
    this.resetPage();
    this.recorded$ = this.translate.get('DAILY_RECORD.recorded');
    this.recorded$.subscribe((t: string) => this.text.recorded = t);
    this.ok$ = this.translate.get('DAILY_RECORD.ok');
    this.ok$.subscribe((t: string) => this.text.ok = t);
  }

  ngOnInit() {
    // Trigger location cache update
    this.geolocationService.getPosition().subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  showRecordFinish() {
    return defer(() => this.popoverController.create({
      component: RecordFinishPage,
      translucent: true,
    }))
      .pipe(
        switchMap(popover => forkJoin([
          this.displayPopoverForDuration(popover, 0.5),
          this.onPopoverDismissNavigateBack(popover),
        ])),
      );
  }

  private displayPopoverForDuration(popover: HTMLIonPopoverElement, seconds: number) {
    return from(popover.present())
      .pipe(
        delay(seconds * 1000),
        switchMap(() => popover.dismiss()),
      );
  }

  private onPopoverDismissNavigateBack(popover: HTMLIonPopoverElement) {
    return from(popover.onDidDismiss())
      .pipe(tap(() => this.location.back()));
  }

  presentLoading() {
    return this.translate.get('DAILY_RECORD.saving')
      .pipe(
        switchMap(msg => {
          return defer(() => this.loadingCtrl.create({
            message: msg,
            duration: 10000,
          }));
        }),
        switchMap(loading => forkJoin([of(loading), loading.present()])),
      );
  }

  onClearClick() {
    this.resetPage();
  }

  onSubmitClick() {
    this.submitRecord().subscribe(() => {});
  }

  submitRecord(): Observable<any> {
    // FIXME: It's a dirty hack to add/remove expand value for symptoms view
    const loading$ = this.presentLoading();
    const snapRecord$ = this.snapshotService.snapRecord(this.healthCondition);
    return forkJoin([loading$, snapRecord$])
      .pipe(
        switchMap(([[loadingElement, _1], _]) => loadingElement.dismiss()),
        switchMap(() => this.showRecordFinish()),
        takeUntil(this.destroy$),
      );
  }

  resetPage() {
    this.healthCondition.setDefault();
  }

}
