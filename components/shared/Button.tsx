'use client';

import clsx from 'clsx';

export default function Button(props: { text: string, handleClick: () => void, isSecondaryAction?: boolean, isDisabled?: boolean, isSubmit?: boolean }) {
    const { text, handleClick, isSecondaryAction, isDisabled, isSubmit } = props;
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
            className={clsx('py-2 px-3 border rounded-xl min-w-30 box-border font-bold text-sm', styleDiff)}>
            {text}
        </button>
    );
}