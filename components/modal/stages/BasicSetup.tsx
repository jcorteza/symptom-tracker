'use client';

import RadioCard from '@/components/modal/RadioCard'
import FormGroup from '@/components/modal/FormGroup';
import TextNumberField from '@/components/modal/TextNumberField';
import { SymptomType } from '@/types/symptoms';

type Props = { 
    newSymptomType: SymptomType;
    setNewSymptomType:(type: SymptomType) => void;
    newSymptomName: string;
    setNewSymptomName: (name:string) => void;
    resetCustom: () => void;
    nameFieldMessage: string;
};
export default function BasicSetup({ newSymptomType, setNewSymptomType, newSymptomName, setNewSymptomName, resetCustom: resetCustomOptIn, nameFieldMessage }: Props ) {
    return (<>
        <FormGroup legendText='What type of symptom do you want to track?'>
            <RadioCard 
                value={SymptomType.BOOLEAN} 
                title='did I have a headache?'
                name='Symptom Type'
                labelText='Presence/Absence'
                isChecked={newSymptomType === SymptomType.BOOLEAN}
                handleChange={() => {
                    resetCustomOptIn();
                    setNewSymptomType(SymptomType.BOOLEAN);
                }} />
            <RadioCard
                value={SymptomType.COUNT}
                title='how many times did I have a headache?'
                name='Symptom Type'
                labelText='Count'
                isChecked={newSymptomType === SymptomType.COUNT}
                handleChange={() => {
                    resetCustomOptIn();
                    setNewSymptomType(SymptomType.COUNT);
                }} />
            <RadioCard
                value={SymptomType.DURATION}
                title='how long did my headache last?'
                name='Symptom Type'
                labelText='Duration'
                isChecked={newSymptomType === SymptomType.DURATION}
                handleChange={() => {
                    resetCustomOptIn();
                    setNewSymptomType(SymptomType.DURATION);
                }} />
            <RadioCard
                value={SymptomType.SEVERITY}
                title='how strong was my headache? mild? moderate? severe?'
                name='Symptom Type'
                labelText='Severity'
                isChecked={newSymptomType === SymptomType.SEVERITY}
                handleChange={() => {
                    resetCustomOptIn();
                    setNewSymptomType(SymptomType.SEVERITY);
                }} />
        </FormGroup>
        <TextNumberField 
            labelText='What do you want to call your symptom?'
            placeholder='Headache Duration'
            name='Symptom Name'
            value={newSymptomName}
            infoMessage={nameFieldMessage}
            handleChange={(e) => { setNewSymptomName(e.target.value); }} />
    </>);
}