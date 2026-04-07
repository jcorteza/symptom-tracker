'use client';

import { CountSymptom, SymptomEntry, SymptomType, DEFAULT_MAX_THRESHOLDS, TimeUnit, DurationSymptom, SeveritySymptom, SeverityThresholds } from '@/types/symptoms';
import BooleanActionWidget from './actions/BooleanActionWidget';
import CountActionWidget from './actions/CountActionWidget';
import ActionInputWidget from './actions/ActionInputWidget';
import ActionWidget from './actions/ActionWidget';
import clsx from 'clsx';

type Props = {
    symptom: SymptomEntry;
    color: string;
    updateSymptom: (id: string, value: boolean | number) => void;
}

export default function SymptomWidget({ symptom, color, updateSymptom }: Props) {
    const { type } = symptom
    const customMax: number | undefined = (symptom as CountSymptom).customMax
    const isHoursValue = type === SymptomType.DURATION && symptom.timeUnit === TimeUnit.HOURS;
    const thresholds: SeverityThresholds = (symptom as SeveritySymptom).customThresholds || DEFAULT_MAX_THRESHOLDS[SymptomType.SEVERITY]

    let value: number;
    let defaultMax: number;
    switch (type) {
        case SymptomType.BOOLEAN:
        case SymptomType.COUNT:
            defaultMax = DEFAULT_MAX_THRESHOLDS[type];
            value = symptom.value as number;
            break;
        case SymptomType.DURATION:
            defaultMax = DEFAULT_MAX_THRESHOLDS[type][TimeUnit.HOURS];
            value = isHoursValue ? symptom.value / 60  : symptom.value;
            break;
        case SymptomType.SEVERITY:
            defaultMax = thresholds['extreme'];
            value = symptom.value as number;
            break;
    }
    const max = !!customMax ? customMax : defaultMax;

    return (
        <div className='flex flex-row bg-white border-2 border-st-border rounded-lg border-l-0'>
            <div className='w-[8px] rounded-lg' style={{ backgroundColor: color }}/>
            <div className='p-3 flex flex-row justify-between grow gap-5'>
                <div className='grow flex flex-col justify-between gap-2'>
                    <h3 className='text-st-ink font-bold'>{symptom.name}</h3>
                    <div
                        className='h-[12px] rounded-lg relative shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)]'
                        style={{ background: type === SymptomType.SEVERITY ? `linear-gradient(to right, white, ${color})` : 'var(--color-st-canvas)' }}>
                        <div
                            className={`h-full rounded-l-lg ${value >= max ? 'rounded-r-lg' : ''}`}
                            style={{
                                width: value / max >= 1 ? '100%' :`${(value / max) * 100}%`,
                                transition: type === SymptomType.BOOLEAN ? 'width 750ms ease-in-out' : type === SymptomType.COUNT ? 'width 300ms ease' : 'none',
                                backgroundColor: type === SymptomType.SEVERITY ? 'transparent' : color
                            }}>
                        </div>
                        {(type == SymptomType.DURATION || type === SymptomType.SEVERITY) &&
                            <input
                                type='range'
                                min={0}
                                max={max}
                                value={value}
                                step={isHoursValue ? '0.25' : undefined}
                                className='absolute inset-0 z-11 w-full overlay-range cursor-pointer outline-none'
                                style={{ '--thumb-color': color } as React.CSSProperties}
                                onChange={({ target }) => {
                                    updateSymptom(
                                        symptom.id,
                                        isHoursValue ? parseFloat(target.value) * 60 : parseFloat(target.value));
                                }}/>}
                        {type === SymptomType.SEVERITY &&
                            <div className='absolute inset-0 flex z-10'>
                                {Object.entries(thresholds).map(([threshold, _max]: [threshold: string, max: number], i: number) => {
                                    if (threshold === 'none' || threshold === 'extreme') {
                                        return null;
                                    }
                                    const range = threshold === 'strong' ? thresholds.extreme - thresholds.strong :
                                        threshold === 'moderate' ? thresholds.strong - thresholds.moderate : thresholds.moderate - 1;
                                    return (
                                        <p
                                            key={i}
                                            style={{ width: `calc(100% / 9 * ${range})` }}
                                            className={
                                                clsx(
                                                    'text-xs scale-75 h-full border-st-ink/70 flex items-center justify-center pointer-events-nonek',
                                                    { 'border-r' : threshold === 'mild' || threshold === 'moderate' })}>
                                            <span className='uppercase tracking-wide text-st-ink/85 align-middle leading-none'>{threshold}</span>
                                        </p>);
                                })}
                            </div>}
                    </div>
                </div>
                {type === SymptomType.BOOLEAN &&
                    <BooleanActionWidget
                        value={symptom.value as boolean}
                        color={color}
                        updateValue={(newValue: boolean) => updateSymptom(symptom.id, newValue)} />}
                {type === SymptomType.COUNT &&
                    <CountActionWidget
                        value={value}
                        max={max}
                        color={color}
                        increaseValue={() => updateSymptom(symptom.id, value + 1)}
                        decreaseValue={() => updateSymptom(symptom.id, value - 1)}
                        updateValue={(updatedValue: number) => updateSymptom(symptom.id, updatedValue)} />}
                {(type === SymptomType.DURATION || type === SymptomType.SEVERITY) &&
                    <ActionWidget color={color}>
                        <ActionInputWidget
                            value={`${value}`}
                            max={max}
                            step={type === SymptomType.DURATION ? '0.25' : undefined}
                            updateValue={(newValue: number) => {
                                updateSymptom(
                                    symptom.id,
                                    isHoursValue ? newValue * 60 : newValue);
                            }}  />
                        {type === SymptomType.DURATION && <span>{(symptom as DurationSymptom).timeUnit}</span>}
                        {type === SymptomType.SEVERITY &&
                            <span>
                                {value === thresholds.none ? 'None' :
                                    value === thresholds.extreme ? 'Extreme' :
                                        value >= thresholds.strong ? 'Strong' :
                                        value >= thresholds.moderate ? 'Moderate' : 'Mild'}
                            </span>}
                    </ActionWidget>}
            </div>
        </div>
    );
}