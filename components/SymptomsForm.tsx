'use client';

import { useState } from 'react';
import { saveSymptoms } from '@/lib/actions';
import { SeverityThresholds, SymptomsData, SymptomType, CountSymptom, DurationSymptom, SeveritySymptom, TimeUnit, SymptomEntry } from '@/types/symptoms';
import NewSymptomModal from '@/components/modal/NewSymptomModal';
import SymptomWidget from '@/components/SymptomsWidget/SymptomWidget';

export default function SymptomsForm(props: { date: string, symptomsData?: SymptomsData }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [symptomsData, setSymptomsData] = useState<SymptomsData>(props.symptomsData || { symptoms: [], notes: { text: '', tags: [] } });

    const updateSymptom = (id: string, value: boolean | number) => {
        const { symptoms: prevSymptoms, notes} = symptomsData;
        const symptomIndex = prevSymptoms.findIndex((symptom) => symptom.id === id);
        const updatedSymptoms = [...symptomsData.symptoms];
        updatedSymptoms[symptomIndex].value = value;
        setSymptomsData({
            notes,
            symptoms: updatedSymptoms
        })
    };
    
    const addSymptom = (name: string, type: SymptomType, maxValues?: number, timeUnit?: string, thresholds?: SeverityThresholds) => {
        const newSymptom = {
            id: crypto.randomUUID(),
            name,
            type
        };
        if (type === SymptomType.COUNT) {
            (newSymptom as CountSymptom)['customMax'] = maxValues;
        } else if (type === SymptomType.DURATION) {
            (newSymptom as DurationSymptom)['customMax'] = maxValues;
            (newSymptom as DurationSymptom)['timeUnit'] = timeUnit as TimeUnit;
        } else if (type === SymptomType.SEVERITY) {
            (newSymptom as SeveritySymptom)['customThresholds'] = thresholds;
        }
        const updatedSymptoms = [...symptomsData.symptoms, newSymptom as SymptomEntry];
        setSymptomsData({
            notes: symptomsData.notes,
            symptoms: updatedSymptoms
        });
    }

    return (
        <form
        name="symptoms-form"
        action={saveSymptoms}
        className='max-w-3xl w-full'>
            <input type="hidden" name="date" value={props.date} />
            <h2 className='max-w-3xl w-full my-4 font-bold text-xs text-st-slate uppercase'>Symptoms</h2>
            <div className='max-w-3xl w-full flex flex-col gap-3'>
                {symptomsData?.symptoms.map((symptom) => (
                    <SymptomWidget key={symptom.id} symptom={symptom} updateSymptom={updateSymptom} />
                ))}
            </div>
            <button
                type='button'
                className='w-full mt-4 py-3 bg-white rounded-xl border-2 border-st-ocean font-bold text-sm text-st-ocean cursor-pointer hover:bg-st-ocean hover:text-white focus:outline-none transition-colors duration-100 ease-in-out'
                onClick={() => setModalIsOpen(true)}>
                <span aria-hidden>+ </span>Track New Symptom
            </button>
            <NewSymptomModal isOpen={modalIsOpen} setIsOpen={setModalIsOpen} addSymptom={addSymptom} />
            <h2 className='max-w-3xl w-full my-4 font-bold text-xs text-st-slate uppercase'>Notes</h2>
            <textarea
                name='symptom-notes'
                placeholder='How did today go? Use #tags to note potential trigers or factors...'
                value={symptomsData?.notes.text || ''}
                className='max-w-3xl w-full min-h-40 px-4 py-2 bg-white border-st-border border-2 rounded-xl text-sm placeholder:text-st-fog focus:border-st-ocean focus:outline-none'
                onChange={({ target }: React.ChangeEvent<HTMLTextAreaElement>) => {
                    const { symptoms } = symptomsData;
                    setSymptomsData({
                        symptoms,
                        notes: {
                            text: target.value,
                            tags: target.value.match(/#\w+/g) || []
                        }
                    })
                }}/>
            <button
                type='submit'
                className='max-w-3xl w-full mt-4 py-3 bg-st-ocean rounded-xl border-2 font-bold text-sm text-white cursor-pointer'>
                Save Your Symptoms
            </button>
        </form>
    );
}