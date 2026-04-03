'use client';

import { SymptomType, TimeUnit, SeverityThresholds, DEFAULT_MAX_THRESHOLDS } from "@/types/symptoms";
import FormGroup from '@/components/modal/FormGroup';
import RadioCard from '@/components/modal/RadioCard';
import TextNumberField from "../TextNumberField";

type Props = {
    newSymptomType: SymptomType;
    newSymptomTimeUnit?: TimeUnit;
    newSymptomThresholds?: Partial<SeverityThresholds>;
    newSymptomMaxValue?: number;
    setNewSymptomTimeUnit: (timeUnit: TimeUnit) => void;
    setNewSymptomMaxValue: (value: number) => void;
    setNewSymptomThresholds: (thresholds: SeverityThresholds) => void;
}
export default function CustomizationSetup({ newSymptomType, newSymptomTimeUnit, newSymptomThresholds, newSymptomMaxValue, setNewSymptomTimeUnit, setNewSymptomMaxValue, setNewSymptomThresholds }: Props) {
    let explanation = '';
    switch(newSymptomType) {
        case SymptomType.COUNT:
            explanation = `The default max for "count" symptoms is ${DEFAULT_MAX_THRESHOLDS[SymptomType.COUNT]}.`
            break;
        case SymptomType.DURATION:
            explanation = `The default max for "duration" symptoms is ${DEFAULT_MAX_THRESHOLDS[SymptomType.DURATION][newSymptomTimeUnit as TimeUnit]} ${newSymptomTimeUnit as TimeUnit}.`
            break;
        case SymptomType.SEVERITY:
            const { mild, moderate, strong, extreme } = DEFAULT_MAX_THRESHOLDS[SymptomType.SEVERITY];
            explanation = `Default values for severity: mild–${mild}, moderate–${moderate}, strong–${strong}, extreme–${extreme}.`
            break;
    }

    return (
        <>
            <p className='text-sm text-st-slate'>{explanation}</p>
            {newSymptomType === SymptomType.COUNT &&
                <TextNumberField
                    labelText={`What is the maximum count you want to track?`}
                    placeholder='Number greater than zero.'
                    name='Max Count Value'
                    type='number'
                    min={1}
                    value={newSymptomMaxValue}
                    handleChange={(e) => { setNewSymptomMaxValue(Number(e.target.value)); }} />}
            {newSymptomType === SymptomType.DURATION &&
                <FormGroup legendText='What time unit do you want to use?'>
                    <RadioCard
                        value={TimeUnit.HOURS}
                        isChecked={newSymptomTimeUnit === TimeUnit.HOURS}
                        labelText={TimeUnit.HOURS}
                        name='Time Unit'
                        handleChange={() => { setNewSymptomTimeUnit(TimeUnit.HOURS); }} />
                    <RadioCard
                        value={TimeUnit.MINUTES}
                        isChecked={newSymptomTimeUnit === TimeUnit.MINUTES}
                        labelText={TimeUnit.MINUTES}
                        name='Time Unit'
                        handleChange={() => { setNewSymptomTimeUnit(TimeUnit.MINUTES); }} />
                </FormGroup>}
            {newSymptomType === SymptomType.DURATION &&
                <TextNumberField
                    labelText={`What is the max ${newSymptomTimeUnit} you want to track?`}
                    placeholder='Number greater than zero.'
                    name='Max Duration Value'
                    type='number'
                    min={1}
                    value={newSymptomMaxValue}
                    handleChange={(e) => { setNewSymptomMaxValue(Number(e.target.value)); }} />}
            {newSymptomType === SymptomType.SEVERITY &&
                <FormGroup legendText={`What values do you want to track?`}>
                    <div className='flex flex-col gap-2'>
                        <TextNumberField
                            labelText='Mild'
                            type='number'
                            name='Mild Severity Threshold'
                            placeholder='3'
                            isPartial
                            handleChange={(e) => { setNewSymptomThresholds({ ...newSymptomThresholds, mild: Number(e.target.value) } as SeverityThresholds); }}/>
                        <TextNumberField
                            labelText='Moderate'
                            type='number'
                            name='Moderate Severity Threshold'
                            placeholder='6'
                            isPartial
                            handleChange={(e) => { setNewSymptomThresholds({ ...newSymptomThresholds, moderate: Number(e.target.value) } as SeverityThresholds); }}/>
                        <TextNumberField
                            labelText='Strong'
                            type='number'
                            name='Strong Severity Threshold'
                            placeholder='9'
                            isPartial
                            handleChange={(e) => { setNewSymptomThresholds({ ...newSymptomThresholds, strong: Number(e.target.value) } as SeverityThresholds); }}/>
                        <TextNumberField
                            labelText='Extreme'
                            type='number'
                            name='Extreme Severity Threshold'
                            placeholder='10'
                            isPartial
                            handleChange={(e) => { setNewSymptomThresholds({ ...newSymptomThresholds, extreme: Number(e.target.value) } as SeverityThresholds); }}/>
                    </div>
                </FormGroup>}
        </>
    );  
}