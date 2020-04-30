import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { getNameList, getNames } from 'country-list';

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
export class TabSettingPage implements OnInit {
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
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.settings.forEach(setting => {
      this.settingsFormControlsConfig[setting.name] = ['', setting.validator];
    });
    this.settingsForm = this.formBuilder.group(this.settingsFormControlsConfig);
  }

}
