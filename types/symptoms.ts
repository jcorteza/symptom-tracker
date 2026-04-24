
export enum SymptomType {
    BOOLEAN = 'boolean',
    COUNT = 'count',
    DURATION = 'duration',
    SEVERITY = 'severity'
}

type Symptom = {
    id: string;
    name: string;
}

export type BooleanSymptom = Symptom & {
    type: SymptomType.BOOLEAN;
    value: boolean;
}

export type CountSymptom = Symptom & {
    type: SymptomType.COUNT;
    value: number;
    customMax?: number;
}

export enum TimeUnit {
    MINUTES = 'Minutes',
    HOURS = 'Hours'
}

export type DurationSymptom = Symptom & {
    type: SymptomType.DURATION;
    value: number; // in minutes
    timeUnit?: TimeUnit;
    customMax?: number;
}

export type SeverityThresholds = {
    none: number;
    mild: number;
    moderate: number;
    strong: number;
    extreme: number;
};

export type SeveritySymptom = Symptom & {
    type: SymptomType.SEVERITY;
    value: number;
    customThresholds?: SeverityThresholds;
}

export type SymptomEntry = BooleanSymptom | CountSymptom | DurationSymptom | SeveritySymptom;

export type SymptomsData = {
    symptoms: SymptomEntry[];
    notes: {
        text: string;
        tags: string[];
    }
}

type Defaults = {
    [SymptomType.COUNT]: number;
    [SymptomType.DURATION]: {
        timeUnit: TimeUnit.HOURS;
        value: number;
    };
    [SymptomType.SEVERITY]: {
        none: number;
        mild: number;
        moderate: number
        strong: number;
        extreme: number;
    };
    [SymptomType.BOOLEAN]: number;
}

export const DEFAULTS: Defaults = {
    [SymptomType.COUNT]: 10,
    [SymptomType.DURATION]: {
        timeUnit: TimeUnit.HOURS,
        value: 12
    },
    [SymptomType.SEVERITY]: {
        none: 0,
        mild: 1,
        moderate: 4,
        strong: 7,
        extreme: 10
    },
    [SymptomType.BOOLEAN]: 1
}