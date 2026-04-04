'use client';

import { SymptomType, TimeUnit, SeverityThresholds, DEFAULT_MAX_THRESHOLDS } from "@/types/symptoms";
import FormGroup from '@/components/modal/FormGroup';
import RadioCard from '@/components/modal/RadioCard';
import TextNumberField from "../TextNumberField";
import clsx from 'clsx';

type Props = {
    type: SymptomType;
    timeUnit?: TimeUnit;
    maxValue?: number;
    thresholds: Partial<SeverityThresholds>;
    fieldMessages: { mild: string; moderate: string; strong: string; maxValue: string; }
    setTimeUnit: (timeUnit: TimeUnit) => void;
    setMaxValue: (value: number) => void;
    setThresholds: (thresholds: SeverityThresholds) => void;
}
export default function CustomizationSetup({
    type,
    timeUnit,
    maxValue,
    thresholds,
    fieldMessages,
    setTimeUnit,
    setMaxValue,
    setThresholds
}: Props) {
    let explanation = '';
    switch(type) {
        case SymptomType.COUNT:
            explanation = `The default max for "count" symptoms is ${DEFAULT_MAX_THRESHOLDS[SymptomType.COUNT]}.`
            break;
        case SymptomType.DURATION:
            explanation = `The default max for "duration" symptoms is ${DEFAULT_MAX_THRESHOLDS[SymptomType.DURATION][timeUnit as TimeUnit]} ${timeUnit as TimeUnit}.`
            break;
        case SymptomType.SEVERITY:
            const { mild, moderate, strong } = DEFAULT_MAX_THRESHOLDS[SymptomType.SEVERITY];
            explanation = `Severity is scored on a scale of 0 (none) to 10 (extreme). Set the values where mild, moderate, and strong begin for you. For example, the defaults are mild–${mild}, moderate–${moderate}, strong–${strong}.`
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
                    labelText={`What is the max ${timeUnit} you want to track?`}
                    placeholder='Number greater than zero.'
                    name='Max Duration Value'
                    type='number'
                    value={maxValue}
                    infoMessage={fieldMessages.maxValue}
                    handleChange={(e) => { setMaxValue(Number(e.target.value)); }} />}
            {type === SymptomType.COUNT &&
                <TextNumberField
                    labelText={`What is the maximum count you want to track?`}
                    placeholder='Number greater than zero.'
                    name='Max Count Value'
                    type='number'
                    value={maxValue}
                    infoMessage={fieldMessages.maxValue}
                    handleChange={(e) => { setMaxValue(Number(e.target.value)); }} />}
            {type === SymptomType.SEVERITY &&
                <FormGroup legendText={`What values do you want to track?`}>
                    <div className='flex flex-col gap-2'>
                        <div>
                            <TextNumberField
                                labelText='Mild'
                                type='number'
                                name='Mild Severity Threshold'
                                placeholder='3'
                                infoMessage={fieldMessages.mild}
                                isPartial
                                handleChange={({ target: { value }}) => {
                                    setThresholds({
                                        ...thresholds,
                                        mild: (!value ? undefined : parseInt(value)) } as SeverityThresholds);
                                }}/>
                        </div>
                        <div>
                            <TextNumberField
                                labelText='Moderate'
                                type='number'
                                name='Moderate Severity Threshold'
                                placeholder='6'
                                infoMessage={fieldMessages.moderate}
                                isPartial
                                handleChange={({ target: { value }}) => {
                                    setThresholds({
                                        ...thresholds,
                                        moderate: (!value ? undefined : parseInt(value)) } as SeverityThresholds);
                                }}/>
                        </div>
                        <div>
                            <TextNumberField
                                labelText='Strong'
                                type='number'
                                name='Strong Severity Threshold'
                                placeholder='9'
                                infoMessage={fieldMessages.strong}
                                isPartial
                                handleChange={({ target: { value }}) => {
                                    setThresholds({
                                        ...thresholds,
                                        strong: (!value ? undefined : parseInt(value)) } as SeverityThresholds);
                                }}/>
                        </div>
                    </div>
                </FormGroup>}
        </>
    );  
}