import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Plugins } from "@capacitor/core";
import { IonDatetime, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { defer, Subject } from 'rxjs';
import { first, map, switchMap, takeUntil } from 'rxjs/operators';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { TranslateConfigService } from 'src/app/translate-config.service';
import { EmailPopoverPage } from './email-popover/email-popover.page';
import { NamePopoverPage } from "./name-popover/name-popover.page";

const { Browser } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  @ViewChild('dateOfBirthPicker', { static: false }) dateOfBirthPicker: IonDatetime;
  languages = this.translateConfigService.langs;
  private destroy$ = new Subject();
  private notSet: string = this.translateService.instant('SETTINGS.notSet');

  name$ = this.dataStoreService.userData$.pipe(
    map(userData => {
      if (!userData.firstName && !userData.lastName) {
        return this.notSet;
      }
      return `${userData.firstName} ${userData.lastName}`;
    })
  );
  email$ = this.dataStoreService.userData$.pipe(
    map(userData => {
      if (!userData.email) {
        return this.notSet;
      }
      return userData.email;
    })
  );
  dateOfBirth$ = this.dataStoreService.userData$.pipe(
    map(userData => {
      if (!userData.dateOfBirth) {
        return '';
      }
      return userData.dateOfBirth;
    })
  );
  currentLanguage$ = this.dataStoreService.userData$.pipe(
    map(userData => {
      if (!userData.language) {
        return this.translateService.defaultLang;
      }
      return userData.language;
    })
  );

  constructor(
    private translateService: TranslateService,
    private popoverController: PopoverController,
    private translateConfigService: TranslateConfigService,
    private dataStoreService: DataStoreService
  ) { }

  ngOnInit() {
    this.initNotSetTranslation();
  }

  private initNotSetTranslation() {
    this.translateService.onLangChange.subscribe((_: any) => {
      this.notSet = this.translateService.instant('SETTINGS.notSet');
    });
  }

  onClickNameItem() {
    this.showPopover(NamePopoverPage);
  }

  onClickEmailItem() {
    this.showPopover(EmailPopoverPage);
  }

  onChangeDateOfBirthPicker() {
    this.dataStoreService.userData$.pipe(
      first(),
      map(userData => {
        userData.dateOfBirth = this.dateOfBirthPicker.value;
        return userData;
      }),
      switchMap(userData => this.dataStoreService.updateUserData(userData)),
    ).subscribe();
  }

  onChangeLanguage(event: CustomEvent) {
    const newLang = event.detail.value;
    this.translateConfigService.setLanguage(newLang).subscribe();
  }

  onClickAboutItem() {
    Browser.open({ url: 'https://mydata.org.tw/' });
  }

  private showPopover(component) {
    defer(() => this.popoverController.create({
      component,
      animated: false
    })).pipe(
      switchMap(popover => popover.present()),
      takeUntil(this.destroy$)
    ).subscribe(() => { }, e => console.log(e));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}