import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabSettingPage } from './tab-setting.page';

const routes: Routes = [
  {
    path: '',
    component: TabSettingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabSettingPageRoutingModule {}
