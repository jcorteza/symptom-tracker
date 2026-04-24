'use client';

import { SymptomType, TimeUnit, DEFAULTS } from '@/types/symptoms';
import RadioCard from '@/components/modal/RadioCard';
import FormGroup from '@/components/modal/FormGroup';

type Props = {
    newSymptomType: SymptomType;
    showCustomization: boolean;
    handleCustomizationOptIn: (optIn: boolean) => void;
};

export default function CustomizationOptIn({ newSymptomType, showCustomization, handleCustomizationOptIn }: Props) {
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
    const { mild, moderate, strong, extreme } = DEFAULTS[SymptomType.SEVERITY];
    const explanationStyle = 'text-sm text-st-slate';
    return (<>
        {newSymptomType === SymptomType.COUNT &&
            <p className={explanationStyle}>We default to tracking up to {DEFAULTS[newSymptomType]} instances of {newSymptomType} symptoms.</p>}
        {newSymptomType === SymptomType.DURATION &&
            <p className={explanationStyle}>We default to tracking up to {DEFAULTS[newSymptomType].value} {DEFAULTS[newSymptomType].timeUnit.toLowerCase()} of {newSymptomType} symptoms.</p>}
        {newSymptomType === SymptomType.SEVERITY &&
            <p className={explanationStyle}>We track {newSymptomType} symptoms with the values: mild–{mild}, moderate–{moderate}, strong–{strong}, extreme–{extreme}.</p>}
        <FormGroup legendText={`Do you want to customize ${unit}?`}>
            <RadioCard 
                name='customize'
                value='declineCustomize'
                handleChange={() => handleCustomizationOptIn(false)}
                isChecked={!showCustomization} 
                labelText={`No, I am fine with ${unit}`}/>
            <RadioCard 
                name='customize'
                value='affirmCustomize'
                handleChange={() => handleCustomizationOptIn(true)}
                isChecked={showCustomization} 
                labelText={`Yes, I want to customize ${unit}`}/>
        </FormGroup>
    </>);
}