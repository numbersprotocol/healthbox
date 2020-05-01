import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { DataStoreService } from 'src/app/core/services/data-store.service';
import { map } from 'rxjs/operators';
import { Record } from 'src/app/core/interfaces/record';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-daily-detail-symptoms',
  templateUrl: './daily-detail-symptoms.component.html',
  styleUrls: ['./daily-detail-symptoms.component.scss'],
})
export class DailyDetailSymptomsComponent implements OnInit {
  @Input() date: string;
  recordViews$: Observable<RecordView[]>;
  isShow = true;

  constructor(
    private dataStore: DataStoreService,
  ) { }

  ngOnInit() {
    this.recordViews$ = this.dataStore.dailyRecords$
      .pipe(
        map(dailyRecords => {
          return dailyRecords.list.find(dailyRecord => dailyRecord.date === this.date).records;
        }),
        map(records => records
          .map(record => this.createRecordView(record))
        ),
      );
  }

  createRecordView(record: Record) {
    const recordView: RecordView = record;
    recordView.expand = false;
    recordView.time = formatDate(record.timestamp, 'HH:mm', 'en-us');
    recordView.healthCondition.list = recordView.healthCondition.list.filter(dataField => (dataField.value));
    return recordView;
  }

}

export interface RecordView extends Record {
  expand?: boolean;
  bt?: string;
  time?: string;
}
