'use client';

import { saveSymptoms } from '@/lib/actions';
import NewSymptomModal from '@/components/NewSymptomModal';

export default function SymptomsForm(props: { date: string }) {
    const { date } = props;

    return (
        <form
        name="symptoms-form"
        action={saveSymptoms}
        className='max-w-3xl w-full'>
            <input type="hidden" name="date" value={date} />
            <h2 className='max-w-3xl w-full my-4 font-bold text-xs text-st-slate uppercase'>Symptoms</h2>
            <div className='max-w-3xl w-full'>
                <div className="mb-4">Symptom 1</div>
                <button
                type='button'
                className='w-full mt-4 py-3 bg-white rounded-xl border-2 border-st-ocean font-bold text-sm text-st-ocean cursor-pointer hover:bg-st-ocean hover:text-white focus:outline-none transition-colors duration-100 ease-in-out'>
                    <span aria-hidden>+ </span>Track New Symptom
                </button>
                <NewSymptomModal />
            </div>
            <h2 className='max-w-3xl w-full my-4 font-bold text-xs text-st-slate uppercase'>Notes</h2>
            <textarea
            name='symptom-notes'
            placeholder='How did today go? Use #tags to note potential trigers or factors...'
            className='max-w-3xl w-full min-h-40 px-4 py-2 bg-white border-st-border border-2 rounded-xl text-sm placeholder:text-st-fog focus:border-st-ocean focus:outline-none'/>
            <button
            type='submit'
            className='max-w-3xl w-full mt-4 py-3 bg-st-ocean rounded-xl border-2 font-bold text-sm text-white cursor-pointer'>
                Save Your Symptoms
            </button>
        </form>
    );
}