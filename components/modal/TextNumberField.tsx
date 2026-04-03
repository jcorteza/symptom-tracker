'use client';

import { ChangeEventHandler } from "react";
import clsx from 'clsx';

type Props = {
    labelText: string;
    value?: string | number;
    placeholder: string;
    name: string;
    min?: number;
    type?: string;
    isPartial?: boolean;
    handleChange: ChangeEventHandler<HTMLInputElement, HTMLInputElement>
}

export default function TextNumberField({ labelText, placeholder, name, value, handleChange, type, isPartial }: Props) {
    return (
        <label className='block'><span className={clsx({ 'mb-3': !isPartial, 'text-sm': isPartial }, 'text-st-slate font-semibold block')}>{labelText}</span>
            <input
                type={(!!type)? type : 'text'}
                placeholder={placeholder}
                onChange={handleChange}
                value={value}
                name={name}
                required
                aria-required
                className='w-full py-2 px-3 bg-st-input-bg border border-st-border rounded-lg placeholder:text-st-fog text-st-ink'/>
        </label>
    );
}