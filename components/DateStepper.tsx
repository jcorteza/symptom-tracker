'use client'

import { redirect } from 'next/navigation';
import { calculatePrevDay, calculateNextDay } from './DateStepper.utils';

export const PREV_LABEL = 'Previous Day';
export const NEXT_LABEL = 'Next Day';

export default function DateStepper(props: { date: string }) {
    const { date } = props;
    const today = new Date().toLocaleDateString('en-CA') // Get today's date in YYYY-MM-DD format
    const dateArray = new Date(`${date}T00:00:00`).toDateString().split(' ');
    const formattedDate = (today === date)? 'Today' : `${dateArray[1]} ${dateArray[2]}, ${dateArray[3]}`; // Format the date as 'MMM DD, YYYY'

    const navigatePrev = () => {
        redirect(`/daily/${calculatePrevDay(props.date)}`);
    }

    const navigateNext = () => {
        redirect(`/daily/${calculateNextDay(props.date)}`);
    }
    return (
        <div className='flex items-stretch justify-between max-w-3xl w-full h-11 py-2 px-5 bg-white rounded-xl border-2 border-st-border'>
            <button 
                className='text-st-ocean cursor-pointer'
                type='button'
                onClick={navigatePrev}>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={4} stroke='currentColor' className='size-4'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                </svg>
                <span className='sr-only'>{PREV_LABEL}</span>
            </button>
            <h2 className='font-sans font-bold text-base'>{formattedDate}</h2>
            <button 
                className='text-st-ocean cursor-pointer' 
                type='button'
                onClick={navigateNext}>
                <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth={4} stroke='currentColor' className='size-4'>
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                </svg>
                <span className='sr-only'>{NEXT_LABEL}</span>
            </button>
        </div>
    );
}