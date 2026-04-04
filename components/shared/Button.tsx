'use client';

import clsx from 'clsx';

type Props = {
    text: string;
    handleClick: () => void;
    isSecondaryAction?: boolean;
    isDisabled?: boolean;
    isSubmit?: boolean;
    title?: string;
}
export default function Button({ text, handleClick, isSecondaryAction, isDisabled, isSubmit, title }: Props) {
    const styleDiff = {
        'bg-white border-2': isSecondaryAction,
        'text-st-btn-disabled border-st-btn-disabled': isSecondaryAction && isDisabled, // disabled secondary action
        'text-st-ocean border-st-ocean cursor-pointer': isSecondaryAction && !isDisabled, // secondary action
        'bg-st-ocean text-white cursor-pointer': !isSecondaryAction && !isDisabled, // primary action
        'bg-st-btn-disabled text-white': !isSecondaryAction && isDisabled, // disabled primary
    };

    return (
        <button type={(isSubmit) ? 'submit' : 'button'}
            onClick={handleClick}
            disabled={isDisabled}
            title={title}
            className={clsx('py-2 px-3 border rounded-xl min-w-30 box-border font-bold text-sm outline-none', styleDiff)}>
            {text}
        </button>
    );
}