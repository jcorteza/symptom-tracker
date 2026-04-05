import { SeverityThresholds } from "@/types/symptoms";

export type FieldMessages = {
    name: string;
    maxValue: string;
    mild: string;
    moderate: string;
    strong: string;
}

export const nameMessage = 'Please enter a name for your symptom.';
export const getNameValidityMessage = (newName?: string) => {
    if (!newName?.trim()) {
        return nameMessage;
    } else {
        return '';
    }
};

export const maxValueMessage = 'Please enter a value greater than 0.';
export const getMaxValueValidityMessage = (newMax?: number) => {
    if (newMax === undefined || (newMax as number) <= 0) {
        return maxValueMessage;
    } else {
        return '';
    }
};

export const isValueRangeInvalid = (newValue: number) => newValue >= 10 || newValue <= 0;

export const isSeverityThresholdInvalid = (thresholdLevel: keyof SeverityThresholds, newValue: number, thresholds: Partial<SeverityThresholds>) => {
    const { mild, moderate, strong } = thresholds;
    switch (thresholdLevel) {
        case 'mild':
            return moderate !== undefined && newValue >= (moderate as number)  || strong !== undefined && newValue >= (strong as number);
        case 'moderate':
            return mild !== undefined && newValue <= (mild as number)  || strong !== undefined && newValue >= (strong as number);
        case 'strong':
            return mild !== undefined && newValue <= (mild as number)  || moderate !== undefined && newValue <= (moderate as number);
        default:
            return false;
    }
};

export const outOfRangeMessage = 'Value should be a number greater than 0 and less than 10.';
export const undefinedValueMessage = 'Please set a value.';
export const mildMessage = 'Mild should be a number less than moderate and strong.';
export const moderateMessage = 'Moderate should be a number greater than mild and less than strong.';
export const strongMessage = 'Strong should be a number greater than mild and moderate.';

export const getSeverityMessages = (newThresholds: Partial<SeverityThresholds>, thresholds: Partial<SeverityThresholds>, fieldMessages: FieldMessages) => {
    const valueDiff = (thresholdLevel: keyof SeverityThresholds) => thresholds[thresholdLevel] !== newThresholds[thresholdLevel];
    const newFieldMessages = { ...fieldMessages };
    if (valueDiff('mild')) {
        if (newThresholds.mild === undefined) {
            newFieldMessages.mild = undefinedValueMessage;
        } else if (isValueRangeInvalid(newThresholds.mild as number)) {
            newFieldMessages.mild = outOfRangeMessage;
        } else if (isSeverityThresholdInvalid('mild', newThresholds.mild as number, thresholds)) {
            newFieldMessages.mild = mildMessage;
        } else {
            newFieldMessages.mild = '';
        }
    } else if (valueDiff('moderate')) {
        if (newThresholds.moderate === undefined) {
            newFieldMessages.moderate = undefinedValueMessage;
        } else if (isValueRangeInvalid(newThresholds.moderate as number)) {
            newFieldMessages.moderate = outOfRangeMessage;
        } else if (isSeverityThresholdInvalid('moderate', newThresholds.moderate as number, thresholds)) {
            newFieldMessages.moderate = moderateMessage;
        } else {
            newFieldMessages.moderate = '';
        }
    } else if (valueDiff('strong')) {
        if (newThresholds.strong === undefined) {
            newFieldMessages.strong = undefinedValueMessage;
        } else if (isValueRangeInvalid(newThresholds.strong as number)) {
            newFieldMessages.strong = outOfRangeMessage;
        } else if (isSeverityThresholdInvalid('strong', newThresholds.strong as number, thresholds)) {
            newFieldMessages.strong = strongMessage;
        } else {
            newFieldMessages.strong = '';
        }
    }
    return newFieldMessages;
};