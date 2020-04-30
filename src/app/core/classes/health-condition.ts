import { DataField, DataFieldType } from './data-field';

const HEALTH_CONDITIONS = [
    { icon:'pulse',name: 'SBP', unit: 'mmHg' },
    { icon:'pulse',name: 'DBP', unit: 'mmHg' },
    { icon:'heart',name: 'heartbeat', unit: 'bpm' },
    { icon:'medkit',name: 'bloodSugar', unit: 'mg/dL' },
    { icon:'body',name: 'weight', unit: 'kg' },
    { icon:'man',name: 'height', unit: 'cm' },
    { icon:'water',name: 'urineVolume', unit: 'mL' },
];


export class HealthCondition {
    list: DataField[] = [];

    constructor() {
        HEALTH_CONDITIONS.forEach(condition => {
            this.list.push(new DataField(condition.icon,condition.name, DataFieldType.Number, null, condition.unit,));
        });
    }

    setDefault() {
        this.list = this.list.map(dataField => {
            dataField.value = null;
            return dataField;
        });
    }
}
