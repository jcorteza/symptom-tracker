'use client';

import { CountSymptom, SymptomEntry, SymptomType, DEFAULT_MAX_THRESHOLDS, TimeUnit } from '@/types/symptoms';

type Props = {
    symptom: SymptomEntry;
    updateSymptom: (id: string, value: boolean | number) => void;
}

export default function SymptomWidget({ symptom, updateSymptom }: Props) {
    const { type } = symptom
    const customMax: number | undefined = (symptom as CountSymptom).customMax
    const value = Number(symptom.value);

    let defaultMax: number;
    switch (type) {
        case SymptomType.BOOLEAN:
        case SymptomType.COUNT:
            defaultMax = DEFAULT_MAX_THRESHOLDS[type];
            break;
        case SymptomType.DURATION:
            defaultMax = DEFAULT_MAX_THRESHOLDS[type][TimeUnit.HOURS];
            break;
        case SymptomType.SEVERITY:
            defaultMax = DEFAULT_MAX_THRESHOLDS[type]['extreme'];
            break;
    }
    return (
        <div className='flex flex-row bg-white border-2 border-st-border rounded-lg border-l-0'>
            <div className='w-[5px] bg-st-ocean rounded-lg'/>
            <div className='p-3 flex flex-row justify-between grow gap-5'>
                <div className='grow flex flex-col gap-2'>
                    <h3 className='text-st-ink font-bold'>{symptom.name}</h3>
                    <div className='h-[5px] bg-st-canvas rounded-lg'>
                        <div
                            className='h-[5px] bg-st-ocean rounded-lg'
                            style={{ width: `${(value / (!!customMax ? customMax : defaultMax)) * 100}%` }}></div>
                    </div>
                </div>
                <div className='w-[50px] bg-st-ocean/25 rounded-xl px-4 py-2 text-sm font-semibold'>
                {value}/{(customMax ? customMax : defaultMax)}
                </div>
            </div>
        </div>
    );
}