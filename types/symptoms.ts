
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
    value: number;
    timeUnit: TimeUnit;
    customMax?: number;
}

export type SeverityThresholds = {
    mild: number;
    moderate: number;
    strong: number;
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

// eslint-disable-next-line
export const DEFAULT_MAX_THRESHOLDS: { [key in SymptomType]?: any } = {
    [SymptomType.COUNT]: 10,
    [SymptomType.DURATION]: {
        hours: 12,
    },
    [SymptomType.SEVERITY]: {
        none: 0,
        mild: 3,
        moderate: 6,
        strong: 9,
        extreme: 10
    },
    [SymptomType.BOOLEAN]: 1
}