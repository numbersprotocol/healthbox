import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabSettingPageRoutingModule } from './tab-setting-routing.module';

import { TabSettingPage } from './tab-setting.page';
import { MainHeaderModule } from 'src/app/core/components/main-header/main-header.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from 'src/app/core/core.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabSettingPageRoutingModule,
    ReactiveFormsModule,
    MainHeaderModule,
    TranslateModule,
    CoreModule,
  ],
  declarations: [TabSettingPage]
})
export class TabSettingPageModule {}
