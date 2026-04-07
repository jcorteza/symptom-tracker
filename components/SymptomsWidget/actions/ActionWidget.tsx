import { ReactNode } from 'react';
import clsx from 'clsx';
import { SymptomType } from '@/types/symptoms';

export default function ActionWidget({ children, color, type }: { children: ReactNode, color: string, type?: SymptomType }) {
    return (
        <div
            style={{ backgroundColor: `color-mix(in srgb, ${color} 20%, transparent)` }}
            className={
                clsx(
                    'max-w-max min-w-[125px] min-h-[48px] text-sm font-semibold flex items-center rounded-xl p-2 gap-1',
                    {
                        'justify-between': type === SymptomType.COUNT,
                        'justify-center': type !== SymptomType.COUNT
                    })}>
            {children}
        </div>
    );
}