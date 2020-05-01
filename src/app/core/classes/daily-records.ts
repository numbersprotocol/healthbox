import { DailyRecord } from './daily-record';
import { Record } from '../interfaces/record';
import { formatDate } from '@angular/common';

export class DailyRecords {
    list: DailyRecord[];
    startDate: string;
    endDate: string;
    isInitiated: boolean;

    constructor(records?: Record[]) {
        this.list = this.createEmptyDailyRecords();
        if (records) {
            this.pushRecords(records);
        }
    }

    fillDates(records: Record[]): void {
        const dayOne = this.getRecordDayOne(records);
        if (!dayOne) {
            return;
        }
        this.list.forEach((dailyRecord, idx) => {
            dailyRecord.date = this.dateDelta(dayOne, idx);
            this.list[idx] = dailyRecord;
        });
        this.startDate = this.list[0].date;
        this.endDate = this.list[this.list.length - 1].date;
    }

    pushRecords(records: Record[]): void {
        records.forEach(record => {
            const recordOnDate = this.list.find(dailyRecord => dailyRecord.date === this.toDateString(record.timestamp));
            if (recordOnDate) {
                this.list[this.list.indexOf(recordOnDate)].records.push(record);
            } else {
                const newDailyRecord = new DailyRecord();
                newDailyRecord.date = this.toDateString(record.timestamp);
                newDailyRecord.records.push(record);
                this.list.push(newDailyRecord);
                this.list = this.list.sort((a, b) => (new Date(a.date)).getTime() - (new Date(b.date)).getTime() );
            }
        });
        this.list.forEach(dailyRecord => {
            dailyRecord.records = dailyRecord.records.sort((a, b) => +a.timestamp - +b.timestamp);
        });
    }

    private createEmptyDailyRecords(): DailyRecord[] {
        const dailyRecords: DailyRecord[] = [];
        return dailyRecords;
    }

    private dateDelta(time: string | number | Date, delta: number) {
        const date = new Date(time);
        const epochTime = date.setDate(date.getDate() + delta);
        return this.toDateString(epochTime);
    }

    private toDateString(time: number) {
        return formatDate(time, 'yyyy-MM-dd', 'en-us'); // Convert from epoch time to JS timestamp
    }

    private getRecordDayOne(records: Record[]): string {
        if (records.length < 1) {
            return null;
        }
        const ascendingRecords = records.sort((a, b) => +a.timestamp - +b.timestamp);
        return this.toDateString(ascendingRecords[0].timestamp);
    }
}
