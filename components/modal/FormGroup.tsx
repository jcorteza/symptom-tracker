'use client';

import { ReactNode } from 'react';

export default function FormGroup(props: { children: ReactNode, legendText: string }) {
    return (
        <fieldset className='flex flex-col gap-2'>
            <legend className={'text-st-slate font-semibold mb-3'}>{props.legendText}</legend>
            {props.children}
        </fieldset>
    );
}