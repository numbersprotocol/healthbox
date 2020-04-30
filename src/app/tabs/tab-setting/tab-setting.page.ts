import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { getNameList, getNames } from 'country-list';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { SnapshotService } from 'src/app/core/services/snapshot.service';
import { switchMap, take, takeUntil, map, tap } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';

export interface Setting {
  name: string;
  type: FormSettingType;
  selectOptions?: string[];
  inputType?: string;
  validator?: ValidatorFn;
}

export interface SelectOption {
  name: string;
}

export enum FormSettingType {
  select,
  input,
  datetime,
}

@Component({
  selector: 'app-tab-setting',
  templateUrl: './tab-setting.page.html',
  styleUrls: ['./tab-setting.page.scss'],
})
export class TabSettingPage implements OnInit, OnDestroy {
  destroy$ = new Subject();
  public formSettingType = FormSettingType;
  settingsForm: FormGroup;
  settingsFormControlsConfig = {};
  settings: Setting[] = [
    {
      name: 'language',
      type: FormSettingType.select,
      validator: Validators.compose([Validators.maxLength(30)]),
      selectOptions: [
        'zh', 'en', 'fr', 'jp',
      ],
    },
    { name: 'firstName', type: FormSettingType.input },
    { name: 'lastName', type: FormSettingType.input },
    { name: 'email', type: FormSettingType.input },
    { name: 'birthday', type: FormSettingType.datetime },
    {
      name: 'gender',
      type: FormSettingType.select,
      selectOptions: [
        'female', 'male', 'nonBinary',
      ]
    },
    {
      name: 'nationality',
      type: FormSettingType.select,
      // WORKAROUND: Use Taiwan. Find another country list package later
      selectOptions: getNames().map(name => (name.includes('Taiwan') ? 'Taiwan' : name))
    },
    { name: 'city', type: FormSettingType.input },
  ];
  constructor(
    private dataStore: DataStoreService,
    private formBuilder: FormBuilder,
    private snapshotService: SnapshotService,
  ) {}

  ngOnInit() {
    this.settings.forEach(setting => {
      this.settingsFormControlsConfig[setting.name] = ['', setting.validator];
    });
    this.settingsForm = this.formBuilder.group(this.settingsFormControlsConfig);
    this.dataStore.userData$
      .pipe(
        tap(userData => {
          this.settingsForm.get('language').setValue(userData.language);
          this.settingsForm.get('firstName').setValue(userData.firstName);
          this.settingsForm.get('lastName').setValue(userData.lastName);
          this.settingsForm.get('email').setValue(userData.email);
          this.settingsForm.get('birthday').setValue(userData.birthday);
          this.settingsForm.get('gender').setValue(userData.gender);
          this.settingsForm.get('nationality').setValue(userData.nationality);
          this.settingsForm.get('city').setValue(userData.city);
        }),
        takeUntil(this.destroy$),
      ).subscribe(() => {}, err => console.log(err));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onClickChangeProfilePicture() {
    forkJoin([
      this.dataStore.userData$.pipe(take(1)),
      this.snapshotService.profileCapture(),
    ])
      .pipe(
        switchMap(([userData, photo]) => {
          userData.profilePicture = photo;
          return this.dataStore.updateUserData(userData);
        }),
        takeUntil(this.destroy$),
      ).subscribe(() => {}, err => console.log(err));
  }

  onSubmit() {
    console.warn(this.settingsForm.value);
    this.dataStore.userData$
      .pipe(
        take(1),
        switchMap(userData => {
          Object.assign(userData, this.settingsForm.value);
          return this.dataStore.updateUserData(userData);
        }),
        takeUntil(this.destroy$),
      ).subscribe(() => {}, err => console.log(err));
  }

}
