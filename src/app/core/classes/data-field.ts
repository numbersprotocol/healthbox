export class DataField {
    name: string;
    type: DataFieldType;
    value: string | number | boolean;
    constructor(name: string, type: DataFieldType, defaultValue?: string | number | boolean) {
        this.name = name;
        this.type = type;
        this.value = (defaultValue) ? defaultValue : null;
    }

    getValue() {
        return this.value;
    }

    setValue(value: string | number | boolean) {
        this.value = value;
    }
}

export enum DataFieldType {
    String,
    Number,
    Boolean,
}
