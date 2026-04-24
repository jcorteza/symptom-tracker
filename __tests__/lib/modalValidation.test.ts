import { describe, test, expect } from 'vitest';
import {
    getNameValidityMessage,
    getMaxValueValidityMessage,
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
});
