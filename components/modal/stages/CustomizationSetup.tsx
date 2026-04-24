'use client';

import { SymptomType, TimeUnit, SeverityThresholds, DEFAULTS } from "@/types/symptoms";
import FormGroup from '@/components/modal/FormGroup';
import RadioCard from '@/components/modal/RadioCard';
import TextNumberField from "../TextNumberField";
import clsx from 'clsx';
import { useState } from 'react';

type Props = {
    type: SymptomType;
    timeUnit?: TimeUnit;
    maxValue?: number;
    thresholds: Partial<SeverityThresholds>;
    maxValueValidityMessage: string;
    setTimeUnit: (timeUnit: TimeUnit) => void;
    setMaxValue: (value: number) => void;
    handleSeverityChange: (thresholds: Partial<SeverityThresholds>) => void;
}

export const setValueMessage = 'Please set a value.';

export default function CustomizationSetup({
    type,
    timeUnit,
    maxValue,
    thresholds,
    maxValueValidityMessage,
    setTimeUnit,
    setMaxValue,
    handleSeverityChange
}: Props) {
    const [localModerateMessage, setLocalModerateMessage] = useState('');
    const [localStrongMessage, setLocalStrongMessage] = useState('');
    const defaultThresholds = DEFAULTS[SymptomType.SEVERITY];

    let explanation = '';
    switch(type) {
        case SymptomType.COUNT:
            explanation = `The default max for "count" symptoms is ${DEFAULTS[type]}.`;
            break;
        case SymptomType.DURATION:
            const { timeUnit: defaultTimeUnit, value: defaultValue } = DEFAULTS[type];
            explanation = `The default max for "duration" symptoms is ${defaultValue} ${defaultTimeUnit.toLowerCase()}.`;
            break;
        case SymptomType.SEVERITY:
            const { mild, moderate, strong } = defaultThresholds;
            explanation = `Severity is scored on a scale from 0 (none) to 10 (extreme). Where mild begins at ${mild}. Set the values where moderate and strong begin for you. The defaults are moderate–${moderate}, strong–${strong}.`;
            break;
    }

    return (
        <>
            <p className='text-sm text-st-slate'>{explanation}</p>
            {type === SymptomType.DURATION &&
                <FormGroup legendText='What time unit do you want to use?'>
                    <RadioCard
                        value={TimeUnit.HOURS}
                        isChecked={timeUnit === TimeUnit.HOURS}
                        labelText={TimeUnit.HOURS}
                        name='Time Unit'
                        handleChange={() => { setTimeUnit(TimeUnit.HOURS); }} />
                    <RadioCard
                        value={TimeUnit.MINUTES}
                        isChecked={timeUnit === TimeUnit.MINUTES}
                        labelText={TimeUnit.MINUTES}
                        name='Time Unit'
                        handleChange={() => { setTimeUnit(TimeUnit.MINUTES); }} />
                </FormGroup>}
            {type === SymptomType.DURATION &&
                <TextNumberField
                    labelText={`What is the max ${timeUnit?.toLowerCase()} you want to track?`}
                    placeholder='Number greater than zero.'
                    name='Max Duration Value'
                    type='number'
                    value={maxValue ?? ''}
                    infoMessage={maxValueValidityMessage}
                    handleChange={(e) => { setMaxValue(Number(e.target.value)); }} />}
            {type === SymptomType.COUNT &&
                <TextNumberField
                    labelText={`What is the maximum count you want to track?`}
                    placeholder='Number greater than zero.'
                    name='Max Count Value'
                    type='number'
                    value={maxValue ?? ''}
                    infoMessage={maxValueValidityMessage}
                    handleChange={(e) => { setMaxValue(Number(e.target.value)); }} />}
            {type === SymptomType.SEVERITY &&
                <div className='flex flex-col items-start gap-2 mb-2'>
                    <span className='text-st-slate text-center text-xs font-semibold'>Preview</span>
                    <div className='h-[32px] w-full inset-0 rounded-lg shadow-[inset_0_1px_2px_rgba(0,0,0,0.1)] items-baseline-last'
                        style={{ background: 'linear-gradient(to right, white, var(--color-st-amber))' }}>
                        <div className='inset-0 flex h-full'>
                            {Object.entries(defaultThresholds).map(([threshold]: [threshold: string, max: number], i: number) => {
                                if (threshold === 'none' || threshold === 'extreme') {
                                    return null;
                                }

                                let currentStrong = thresholds.strong ?? defaultThresholds.strong;
                                let currentModerate = thresholds.moderate ?? defaultThresholds.moderate;

                                if (currentStrong >= defaultThresholds.extreme) {
                                    currentStrong = defaultThresholds.extreme - 1;
                                }
                                
                                if (thresholds.moderate === undefined && currentStrong <= defaultThresholds.moderate) {
                                    currentModerate = currentStrong - 1;
                                }

                                if (currentModerate >= defaultThresholds.extreme - 2) {
                                    currentModerate = defaultThresholds.extreme - 2;
                                } else if (currentModerate <= defaultThresholds.mild) {
                                    currentModerate = defaultThresholds.mild + 1;
                                }
                                
                                if (thresholds.strong === undefined && currentModerate >= defaultThresholds.strong) {
                                    currentStrong = currentModerate + 1;
                                }

                                const range = threshold === 'strong' ? defaultThresholds.extreme - currentStrong :
                                    threshold === 'moderate' ? currentStrong - currentModerate : currentModerate - 1;
                                const isModerateOrSevereSingleValue = (threshold === 'moderate' || threshold === 'strong') && range === 1;
                                const isModerateAtMinValue = currentModerate - 1 === defaultThresholds.mild;
                                const isModerateAtMaxValue = currentModerate === currentStrong - 1;
                                const isStrongAtMaxValue = defaultThresholds.extreme - 1 === currentStrong;

                                return (
                                    <div
                                        key={i}
                                        style={{ width: `calc(100% / 9 * ${range})` }}
                                        className={
                                            clsx(
                                                'h-full border-st-ink/70 flex items-center justify-center pointer-events-nonek relative overflow-visible',
                                                { 'border-r' : threshold === 'mild' || threshold === 'moderate' })}>
                                        <p className='text-xs scale-90 w-full uppercase tracking-wide text-st-ink/85 align-middle leading-none text-center'>
                                            {isModerateOrSevereSingleValue ? `${threshold.slice(0, 4)}...` : threshold}<br />
                                            {threshold === 'mild' &&
                                                (isModerateAtMinValue ? defaultThresholds.mild : `${defaultThresholds.mild}-${currentModerate - 1}`)}
                                            {threshold === 'moderate' && 
                                                (isModerateAtMaxValue ? currentModerate : `${currentModerate}-${currentStrong - 1}`)}
                                            {threshold === 'strong' &&
                                                (isStrongAtMaxValue ? currentStrong : `${currentStrong}-${defaultThresholds.extreme - 1}`)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>}
            {type === SymptomType.SEVERITY &&
                <FormGroup>
                    <div className='flex flex-col gap-4'>
                        <div>
                            <TextNumberField
                                labelText='Moderate'
                                type='number'
                                name='Moderate Severity Threshold'
                                placeholder={`${defaultThresholds.moderate}`}
                                infoMessage={localModerateMessage}
                                isPartial
                                min={defaultThresholds.mild + 1}
                                value={thresholds.moderate ?? ''}
                                handleBlur={() => setLocalModerateMessage('')}
                                handleChange={({ target: { value }}) => {
                                    const updatedValue = parseInt(value);
                                    setLocalModerateMessage('');
                                    if (Number.isNaN(updatedValue)) {
                                        handleSeverityChange({
                                            ...thresholds,
                                            moderate: undefined });
                                        setLocalModerateMessage(setValueMessage);
                                    } else if (updatedValue <= defaultThresholds.mild) {
                                        handleSeverityChange({
                                            ...thresholds,
                                            moderate: defaultThresholds.mild + 1 });
                                        setLocalModerateMessage(`The minimum possible value for moderate is ${defaultThresholds.mild + 1}.`);
                                    } else if (thresholds.strong !== undefined && updatedValue >= thresholds.strong) {
                                        setLocalModerateMessage(`Please make sure the value of moderate is less than the value of strong-${thresholds.strong}`)
                                    } else if (updatedValue >= defaultThresholds.extreme - 2) {
                                        handleSeverityChange({
                                            ...thresholds,
                                            moderate: defaultThresholds.extreme - 2,
                                            strong: thresholds.strong === undefined ? undefined : defaultThresholds.extreme - 1 });
                                        if (updatedValue > defaultThresholds.extreme - 2) {
                                            setLocalModerateMessage(`The maximum possible value for moderate is ${defaultThresholds.extreme - 2}.`);
                                        }
                                    } else {
                                        handleSeverityChange({
                                            ...thresholds,
                                            moderate: updatedValue });
                                    }
                                }}/>
                        </div>
                        <div>
                            <TextNumberField
                                labelText='Strong'
                                type='number'
                                name='Strong Severity Threshold'
                                placeholder={`${defaultThresholds.strong}`}
                                infoMessage={localStrongMessage}
                                isPartial
                                min={thresholds.moderate !== undefined ? thresholds.moderate + 1 : defaultThresholds.mild + 2}
                                value={thresholds.strong ?? ''}
                                handleBlur={() => setLocalStrongMessage('')}
                                handleChange={({ target: { value }}) => {
                                    const updatedValue = parseInt(value);
                                    setLocalStrongMessage('');
                                    if (Number.isNaN(updatedValue)) {
                                        handleSeverityChange({
                                            ...thresholds,
                                            strong: undefined });
                                        setLocalStrongMessage(setValueMessage);
                                    } else if (thresholds.moderate !== undefined && updatedValue <= (thresholds.moderate)) {
                                        setLocalStrongMessage(`Please make sure the value of strong is greater than the value of moderate-${thresholds.moderate}.`);
                                    } else if (updatedValue >= defaultThresholds.extreme) {
                                        handleSeverityChange({
                                            ...thresholds,
                                            strong: defaultThresholds.extreme - 1 });
                                        setLocalStrongMessage(`The maximum possible value for strong is ${defaultThresholds.extreme - 1}`)
                                    } else if (updatedValue <= defaultThresholds.mild + 2) {
                                        handleSeverityChange({
                                            ...thresholds,
                                            strong: defaultThresholds.mild + 2,
                                            moderate: thresholds.moderate === undefined ? undefined : defaultThresholds.mild + 1 });
                                        if (updatedValue < defaultThresholds.mild + 2) {
                                            setLocalStrongMessage(`The minimum possible value for strong is ${defaultThresholds.mild + 2}`);
                                        }
                                    } else {
                                        handleSeverityChange({
                                            ...thresholds,
                                            strong: updatedValue });
                                    }
                                }}/>
                        </div>
                    </div>
                </FormGroup>}
        </>
    );  
}