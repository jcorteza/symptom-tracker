'use client';

import { SymptomType, TimeUnit, SeverityThresholds } from '@/types/symptoms';
import Button from '@/components/shared/Button';

type Props = {
    showCustomization: boolean;
    newSymptomName:  string;
    newSymptomType: SymptomType;
    newSymptomTimeUnit?: TimeUnit;
    newSymptomMaxValue?: number;
    newSymptomThresholds?: SeverityThresholds
    handleSave: () => void;
}
export default function Revieiw({ showCustomization, newSymptomName, newSymptomType, newSymptomTimeUnit, newSymptomMaxValue, newSymptomThresholds, handleSave }: Props) {
    const getTypeText = () => {
        switch(newSymptomType) {
            case SymptomType.BOOLEAN:
                return 'Presence/Absence';
            case SymptomType.COUNT:
                return 'Count';
            case SymptomType.DURATION:
                return 'Duration';
            case SymptomType.SEVERITY:
                return 'Severity';
        }
    }

    return (
        <>
            <p className='text-st-ink text-sm font-semibold'>Great! Save to add your new symptom or go back to edit.</p>
            <div className='flex flex-row content-stretch bg-st-canvas border border-st-border border-l-0 rounded-lg'>
                <div className='w-[7px] bg-st-ocean inline-block rounded-lg'/>
                <div className='p-3 w-full flex flex-col gap-3'>
                    <div>
                        <p className='text-st-ink text-lg font-semibold'>{newSymptomName}</p>
                        <p className='text-st-slate text-sm font-semibold'>{getTypeText()} Symptom</p>
                    </div>
                    <div className='border-t border-st-border pt-2'>
                        {showCustomization && (newSymptomType === SymptomType.COUNT || newSymptomType === SymptomType.DURATION) &&
                            <p className='text-st-ink text-sm'>Max Value: <span className='font-medium'>{newSymptomMaxValue} {newSymptomType === SymptomType.DURATION ? `${ newSymptomTimeUnit}` : ''}</span></p>}
                        {showCustomization && newSymptomType === SymptomType.SEVERITY &&
                            <ul>
                                <li className='text-st-ink text-sm font-medium'>Mild: <span className='font-medium'>{newSymptomThresholds?.mild}</span></li>
                                <li className='text-st-ink text-sm font-normal'>Moderate: <span className='font-medium'>{newSymptomThresholds?.moderate}</span></li>
                                <li className='text-st-ink text-sm font-medium'>Strong: <span className='font-medium'>{newSymptomThresholds?.strong}</span></li>
                                <li className='text-st-ink text-sm'>Extreme: <span className='font-medium'>{newSymptomThresholds?.extreme}</span></li>
                            </ul>}
                        {!showCustomization &&
                            <p className='text-st-ink text-sm'>Customization: <span className='font-medium'>None</span></p>}
                    </div>
                </div>
            </div>
            <Button text='Save' handleClick={handleSave}/>
        </>
    );
}