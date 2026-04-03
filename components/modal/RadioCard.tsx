'use client';

import clsx from 'clsx';

type Props = {
    value: string;
    name: string;
    labelText: string;
    isChecked: boolean;
    handleChange: () => void;
    title?: string;
};

export default function RadioCard({ value, name, labelText, isChecked, handleChange: handleClick, title }: Props) {
    const divStyleDiff = {
        'bg-st-pool-tint border-st-mist': isChecked,
        'bg-white border-st-border': !isChecked
    };
    const inputStyleDiff = {
        'accent-st-ocean before:st-ocean': isChecked,
        'before:border-st-mist': !isChecked
    };

    return (
        <label
            title={title}
            className={clsx('flex flex-row gap-2 py-2 px-3 border rounded-lg cursor-pointer text-st-ink', divStyleDiff)}>
            <input
                type="radio"
                name={name}
                value={value}
                checked={isChecked}
                onChange={handleClick}
                className={clsx(inputStyleDiff)} />
            <span>{labelText}</span>
        </label>
    );
}