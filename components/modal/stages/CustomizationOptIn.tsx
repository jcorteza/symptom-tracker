'use client';

import { SymptomType, TimeUnit, DEFAULT_MAX_THRESHOLDS } from '@/types/symptoms';
import RadioCard from '@/components/modal/RadioCard';
import FormGroup from '@/components/modal/FormGroup';

type Props = {
    newSymptomType: SymptomType;
    showCustomization: boolean;
    setShowCustomization: (set: boolean) => void;
    setNewSymptomTimeUnit: (timeUnit?: TimeUnit) => void;
};

export default function CustomizationOptIn({ newSymptomType, showCustomization, setShowCustomization, setNewSymptomTimeUnit }: Props) {
    let unit = '';
    switch (newSymptomType) {
        case SymptomType.COUNT:
            unit = 'the maximum count';
            break;
        case SymptomType.DURATION:
            unit = 'the max duration';
            break;
        case SymptomType.SEVERITY:
            unit = 'the default values';
            break;
    }
    const { mild, moderate, strong, extreme } = DEFAULT_MAX_THRESHOLDS[SymptomType.SEVERITY];
    const explanationStyle = 'text-sm text-st-slate';
    return (<>
        {newSymptomType === SymptomType.COUNT &&
            <p className={explanationStyle}>We default to tracking up to {DEFAULT_MAX_THRESHOLDS[SymptomType.COUNT]} instances of {newSymptomType} symptoms.</p>}
        {newSymptomType === SymptomType.DURATION &&
            <p className={explanationStyle}>We default to tracking up to {DEFAULT_MAX_THRESHOLDS[SymptomType.DURATION][TimeUnit.HOURS]} {TimeUnit.HOURS} of {newSymptomType} symptoms.</p>}
        {newSymptomType === SymptomType.SEVERITY &&
            <p className={explanationStyle}>We track {newSymptomType} symptoms with the values: mild–{mild}, moderate–{moderate}, strong–{strong}, extreme–{extreme}.</p>}
        <FormGroup legendText={`Do you want to customize ${unit}?`}>
            <RadioCard 
                name='customize'
                value='declineCustomize'
                handleChange={() => {
                    if (newSymptomType === SymptomType.DURATION) {
                        setNewSymptomTimeUnit(undefined);
                    }
                    setShowCustomization(false);
                }}
                isChecked={!showCustomization} 
                labelText={`No, I am fine with ${unit}`}/>
            <RadioCard 
                name='customize'
                value='affirmCustomize'
                handleChange={() => {
                    if (newSymptomType === SymptomType.DURATION) {
                        setNewSymptomTimeUnit(TimeUnit.HOURS);
                    }
                    setShowCustomization(true);
                }}
                isChecked={showCustomization} 
                labelText={`Yes, I want to customize ${unit}`}/>
        </FormGroup>
    </>);
}