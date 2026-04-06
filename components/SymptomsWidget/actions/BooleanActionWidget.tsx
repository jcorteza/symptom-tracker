'use client';

import ActionWidget from './ActionWidget';

type Props = {
    value: boolean;
    color: string;
    updateValue: (value: boolean) => void;
}
export default function BooleanActionWidget({value: present, color, updateValue}: Props) {
    return (
        <ActionWidget color={color}>
            <label className='flex gap-2 items-center text-xs'>
                <span>{present ? 'Present' : 'Absent'}</span>
                <input
                    type='checkbox'
                    role='switch'
                    checked={present}
                    className='outline-none'
                    style={{ backgroundColor: !!present ? color : 'var(--color-st-fog)'}}
                    onChange={() => updateValue(!present)} />
            </label>
        </ActionWidget>
    );
}