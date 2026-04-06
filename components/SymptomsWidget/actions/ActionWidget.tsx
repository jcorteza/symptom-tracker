import { ReactNode } from 'react';

export default function ActionWidget({ children, color }: { children: ReactNode, color: string}) {
    return (
        <div
            style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
            className='max-w-max min-w-[125px] min-h-[48px] text-sm font-semibold flex justify-center items-center rounded-xl gap-2'>
            {children}
        </div>
    );
}