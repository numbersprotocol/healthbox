import { Component, OnInit, Input } from '@angular/core';
import { DataStoreService } from 'src/app/core/services/data-store.service';

@Component({
  selector: 'app-daily-detail-upper',
  templateUrl: './daily-detail-upper.component.html',
  styleUrls: ['./daily-detail-upper.component.scss'],
})
export class DailyDetailUpperComponent implements OnInit {
  @Input() date: string;

  constructor(
    public dataStore: DataStoreService,
  ) { }

  ngOnInit() {
  }

}
