import { describe, test, expect } from 'vitest';
import {
    getSeverityMessages,
    getNameValidityMessage,
    getMaxValueValidityMessage,
    outOfRangeMessage,
    undefinedValueMessage,
    mildMessage,
    moderateMessage,
    strongMessage,
    nameMessage,
    maxValueMessage
} from "@/lib/modalValidation";

describe('modalValidation', () => {
    test('getNameValidityMessage', () => {
        expect(getNameValidityMessage('')).toEqual(nameMessage);
        expect(getNameValidityMessage(' ')).toEqual(nameMessage);
        expect(getNameValidityMessage('s')).toEqual('');
        expect(getNameValidityMessage('Symptom')).toEqual('');
    });

    test('getMaxValueValidityMessage', () => {
        expect(getMaxValueValidityMessage(undefined)).toEqual(maxValueMessage);
        expect(getMaxValueValidityMessage(0)).toEqual(maxValueMessage);
        expect(getMaxValueValidityMessage(-100)).toEqual(maxValueMessage);
        expect(getMaxValueValidityMessage(1)).toEqual('');
        expect(getMaxValueValidityMessage(100)).toEqual('');
    });

    describe('getSeverityMessages', () => {
        const mildOnlyThresholds = {
            mild: 3
        };
        const moderateOnlyThresholds = {
            moderate: 6
        };
        const strongOnlyThresholds = {
            strong: 9
        };
        const fieldMessages = {
            name: '',
            mild: '',
            moderate: '',
            strong: '',
            maxValue: ''
        };
    
        test('returns no changes in field Messages when no change in thresholds has occurred', () => {
            expect(getSeverityMessages({}, {}, fieldMessages)).toEqual(fieldMessages);
            expect(getSeverityMessages(mildOnlyThresholds, mildOnlyThresholds, fieldMessages)).toEqual(fieldMessages);
            expect(getSeverityMessages(moderateOnlyThresholds, moderateOnlyThresholds, fieldMessages)).toEqual(fieldMessages);
            expect(getSeverityMessages(strongOnlyThresholds, strongOnlyThresholds, fieldMessages)).toEqual(fieldMessages);
        });
    
        test('returns outOfRangeMessage for mild when mild is out of range', () => {
            const expectedMessages = {
                name: '',
                mild: outOfRangeMessage,
                moderate: '',
                strong: '',
                maxValue: ''
            };
            // test out of range
            expect(getSeverityMessages({ mild: 0 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ mild: -10 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ mild: 10 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ mild: 100 }, {}, fieldMessages)).toEqual(expectedMessages);
            // test within range
            expect(getSeverityMessages({ mild: 9 }, {}, fieldMessages)).toEqual(fieldMessages);
            expect(getSeverityMessages({ mild: 1 }, {}, fieldMessages)).toEqual(fieldMessages);
        });
    
        test('returns outOfRangeMessage for moderate when moderate is out of range', () => {
            const expectedMessages = {
                name: '',
                mild: '',
                moderate: outOfRangeMessage,
                strong: '',
                maxValue: ''
            };
            // test out of range
            expect(getSeverityMessages({ moderate: 0 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ moderate: -10 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ moderate: 10 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ moderate: 100 }, {}, fieldMessages)).toEqual(expectedMessages);
            // test within range
            expect(getSeverityMessages({ moderate: 9 }, {}, fieldMessages)).toEqual(fieldMessages);
            expect(getSeverityMessages({ moderate: 1 }, {}, fieldMessages)).toEqual(fieldMessages);
        });
    
        test('returns outOfRangeMessage for strong when strong is out of range', () => {
            const expectedMessages = {
                name: '',
                mild: '',
                moderate: '',
                strong: outOfRangeMessage,
                maxValue: ''
            };
            // test out of range
            expect(getSeverityMessages({ strong: 0 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ strong: -10 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ strong: 10 }, {}, fieldMessages)).toEqual(expectedMessages);
            expect(getSeverityMessages({ strong: 100 }, {}, fieldMessages)).toEqual(expectedMessages);
            // test within range
            expect(getSeverityMessages({ strong: 9 }, {}, fieldMessages)).toEqual(fieldMessages);
            expect(getSeverityMessages({ strong: 1 }, {}, fieldMessages)).toEqual(fieldMessages);
        });
    
        test('returns undefinedValueMessage when the new value is undefined', () => {
            expect(getSeverityMessages({}, mildOnlyThresholds, fieldMessages)).toEqual({ ...fieldMessages, mild: undefinedValueMessage });
            expect(getSeverityMessages({}, moderateOnlyThresholds, fieldMessages)).toEqual({ ...fieldMessages, moderate: undefinedValueMessage });
            expect(getSeverityMessages({}, strongOnlyThresholds, fieldMessages)).toEqual({ ...fieldMessages, strong: undefinedValueMessage });
        });
    
        test('reset message when the new value is within range', () => {
            expect(getSeverityMessages(mildOnlyThresholds, { mild: 10 }, { ...fieldMessages, mild: outOfRangeMessage })).toEqual(fieldMessages);
            expect(getSeverityMessages(moderateOnlyThresholds, { moderate: 10 }, { ...fieldMessages, moderate: outOfRangeMessage })).toEqual(fieldMessages);
            expect(getSeverityMessages(strongOnlyThresholds, { strong: 10 }, { ...fieldMessages, strong: outOfRangeMessage })).toEqual(fieldMessages);
        });
    
        test('returns message for mild when mild is not less than both moderate and strong', () => {
            const thresholds = {
                moderate:6,
                strong: 9
            };
            expect(getSeverityMessages({ ...thresholds, mild: 9 }, thresholds, fieldMessages)).toEqual({ ...fieldMessages, mild: mildMessage });
            expect(getSeverityMessages({ ...thresholds, mild: 6 }, thresholds, fieldMessages)).toEqual({ ...fieldMessages, mild: mildMessage });
            expect(getSeverityMessages({ mild: 7, moderate: 6 }, { moderate: 6 }, fieldMessages)).toEqual({ ...fieldMessages, mild: mildMessage });
            expect(getSeverityMessages({ mild: 9, strong: 8 }, { strong: 8 }, fieldMessages)).toEqual({ ...fieldMessages, mild: mildMessage });
            expect(getSeverityMessages({ ...thresholds, mild: 3 }, thresholds, fieldMessages)).toEqual(fieldMessages);
        });
    
        test('returns message for moderate when moderate is not greater than mild and less than strong', () => {
            const thresholds = {
                mild: 3,
                strong: 9
            };
            expect(getSeverityMessages({ ...thresholds, moderate: 3 }, thresholds, fieldMessages)).toEqual({ ...fieldMessages, moderate: moderateMessage });
            expect(getSeverityMessages({ ...thresholds, moderate: 9 }, thresholds, fieldMessages)).toEqual({ ...fieldMessages, moderate: moderateMessage });
            expect(getSeverityMessages({ moderate: 2, mild: 3 }, { mild: 3 }, fieldMessages)).toEqual({ ...fieldMessages, moderate: moderateMessage });
            expect(getSeverityMessages({ moderate: 9, strong: 8 }, { strong: 8 }, fieldMessages)).toEqual({ ...fieldMessages, moderate: moderateMessage });
            expect(getSeverityMessages({ ...thresholds, moderate: 6 }, thresholds, fieldMessages)).toEqual(fieldMessages);
        });
    
        test('returns message for strong when strong is not greater than both mild and moderate', () => {
            const thresholds = {
                mild: 3,
                moderate: 6
            };
            expect(getSeverityMessages({ ...thresholds, strong: 3 }, thresholds, fieldMessages)).toEqual({ ...fieldMessages, strong: strongMessage });
            expect(getSeverityMessages({ ...thresholds, strong: 6 }, thresholds, fieldMessages)).toEqual({ ...fieldMessages, strong: strongMessage });
            expect(getSeverityMessages({ strong: 2, mild: 3 }, { mild: 3 }, fieldMessages)).toEqual({ ...fieldMessages, strong: strongMessage });
            expect(getSeverityMessages({ strong: 5, moderate: 6 }, { moderate: 6 }, fieldMessages)).toEqual({ ...fieldMessages, strong: strongMessage });
            expect(getSeverityMessages({ ...thresholds, strong: 9 }, thresholds, fieldMessages)).toEqual(fieldMessages);
        });
    });
});
