import { SymptomEntry, SymptomType } from '@/types/symptoms';
export const SEED_DATA = {
    symptoms: [
        {
            id: '1',
            name: 'Headache',
            type: SymptomType.DURATION,
            value: 300,
        } as SymptomEntry,
        {
            id: '2',
            name: 'Cough',
            type: SymptomType.BOOLEAN,
            value: true
        } as SymptomEntry,
        {
            id: '3',
            name: 'Nausea',
            type: SymptomType.SEVERITY,
            value: 5,
        } as SymptomEntry,
        {
            id: '4',
            name: 'Sneezing',
            type: SymptomType.COUNT,
            value: 4,
        } as SymptomEntry
    ],
    notes: {
        text: 'Been so sick today. Ugh! Caught a #cold and everything. Been really #stressed too.',
        tags: ['cold', 'stressed']
    }
};