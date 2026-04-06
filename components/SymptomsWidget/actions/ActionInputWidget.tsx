'use client';

type Props = {
    value: number;
    max: number;
    updateValue: (value: number) => void;
}
export default function ActionInputWidget({ value, max, updateValue }: Props) {
    return (
        <div className='w-max text-sm font-semibold'>
            <input
                type='number'
                value={value}
                className='text-right inline box-border outline-none no-spinners'
                style={{ width: `${String(value).length}ch` }}
                onChange={({ target: { value } }) => updateValue(parseInt(value))} />/{max}
        </div>
    );
}