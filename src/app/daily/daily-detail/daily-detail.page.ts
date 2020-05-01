import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-daily-detail',
  templateUrl: './daily-detail.page.html',
  styleUrls: ['./daily-detail.page.scss'],
})
export class DailyDetailPage implements OnInit {
  date$: Observable<string>;
  selectedSegment = true;
  constructor(
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.date$ = this.activatedRoute.paramMap.pipe(
      map(params => params.get('date')),
    );
  }

  onSegmentChanged(data) {
    this.selectedSegment = data;
  }

}
