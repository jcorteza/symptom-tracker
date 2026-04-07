'use client';

import { useEffect, useState } from 'react';

type Props = {
    value: string;
    max: number;
    step?: string;
    handleValueChange: (value: number) => void;
}
export default function ActionInputWidget({ value, step, max, handleValueChange }: Props) {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        setDisplayValue(value);
    }, [value]);

    const isValueWholeNum = (num: string) => {
        const updatedValueFloat = parseFloat(num);
        const updatedValueInt = parseInt(num);
        return updatedValueFloat == updatedValueInt;
    };

    return (
        <div className='w-max'>
            <input
                type='number'
                value={displayValue}
                inputMode={step ? 'decimal' : 'none'}
                step={step}
                className='text-right inline box-border outline-none no-spinners'
                style={{ width: `${displayValue.length + 1}ch` }}
                onChange={({ target }) => {
                    if (step) {
                        setDisplayValue(isValueWholeNum(target.value) ? `${parseInt(target.value)}` : `${parseInt(target.value)}`);
                    } else {
                        setDisplayValue(target.value);
                    }
                }}
                onBlur={() => {
                    let updatedValue: number;
                    if (displayValue === 'NaN') {
                        updatedValue = 0;
                    } else if (step) {
                        updatedValue = parseFloat(displayValue);
                    } else {
                        updatedValue = parseInt(displayValue);
                        if (updatedValue === parseInt(value)) {
                            setDisplayValue(value);
                            return;
                        }
                    }
                    handleValueChange(updatedValue);
                }}
                onKeyUp={event => {
                    if (event.code === 'Enter') {
                        handleValueChange(displayValue === 'NaN' ? 0 : step ? parseFloat(displayValue) : parseInt(displayValue));
                    } else if (event.code === 'Escape') {
                        setDisplayValue(value);
                    }
                }} />/{max}
        </div>
    );
}