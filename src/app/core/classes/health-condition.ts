import { DataField, DataFieldType } from './data-field';

const HEALTH_CONDITIONS = [
    { name: 'SBP', unit: 'mmHg' },
    { name: 'DBP', unit: 'mmHg' },
    { name: 'heartbeat', unit: 'bpm' },
    { name: 'bloodSugar', unit: 'mg/dL' },
    { name: 'weight', unit: 'kg' },
    { name: 'height', unit: 'cm' },
    { name: 'urineVolume', unit: 'mL' },
];

export class HealthCondition {
    list: DataField[] = [];

    constructor() {
        HEALTH_CONDITIONS.forEach(condition => {
            this.list.push(new DataField(condition.name, DataFieldType.Number, null, condition.unit));
        });
    }

    setDefault() {
        this.list = this.list.map(dataField => {
            dataField.value = null;
            return dataField;
        });
    }
}
