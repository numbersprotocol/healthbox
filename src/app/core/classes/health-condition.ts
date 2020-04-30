import { DataField, DataFieldType } from './data-field';

const HEALTH_CONDITION_NAMES = [
    'SBP',
    'DBP',
    'heartbeat',
    'bloodSugar',
    'weight',
    'height',
    'urineVolume',
];

export class HealthCondition {
    list: DataField[] = [];

    constructor() {
        HEALTH_CONDITION_NAMES.forEach(conditionName => this.list.push(new DataField(conditionName, DataFieldType.Number)));
    }

    setDefault() {
        this.list = this.list.map(dataField => {
            dataField.value = null;
            return dataField;
        });
    }
}
