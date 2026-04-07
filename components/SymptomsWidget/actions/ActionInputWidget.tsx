'use client';

import { useEffect, useState } from 'react';

type Props = {
    value: string;
    max: number;
    step?: string;
    updateValue: (value: number) => void;
}
export default function ActionInputWidget({ value, step, max, updateValue }: Props) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    return (
        <div className='w-max text-sm font-semibold'>
            <input
                type='number'
                value={displayValue}
                inputMode='decimal'
                step={step}
                className='text-right inline box-border outline-none no-spinners'
                style={{ width: `${displayValue.length + 1}ch` }}
                onChange={({ target }) => {
                    const updatedValueFloat = parseFloat(target.value);
                    const updatedValueInt = parseInt(target.value);
                    setDisplayValue(updatedValueFloat == updatedValueInt ? `${updatedValueInt}` : `${updatedValueFloat}`);
                }}
                onBlur={() => updateValue(displayValue === 'NaN' ? 0 : parseFloat(displayValue))}
                onKeyUp={event => {
                    if (event.code === 'Enter') {
                        updateValue(displayValue === 'NaN' ? 0 : parseFloat(displayValue));
                    } else if (event.code === 'Escape') {
                        setDisplayValue(value);
                    }
                }} />/{max}
        </div>
    );
}