import ActionWidget from "./ActionWidget";
import ActionInputWidget from './ActionInputWidget';
import { SymptomType } from "@/types/symptoms";

type Props = {
    value: number;
    max: number;
    color: string;
    type: SymptomType;
    increaseValue: () => void;
    decreaseValue: () => void;
    updateValue: (updatedValue: number) => void;
}
export default function CountActionWidget({ value, max, color, type, increaseValue, decreaseValue, updateValue }: Props) {
    return (
        <ActionWidget color={color} type={type}>
            <button type='button'
                onClick={decreaseValue}
                className='rounded-xl outline-none text-white h-[25px] w-[25px] cursor-pointer hover:scale-110 active:scale-95 shadow-sm active:shadow-none'
                style={{ backgroundColor: color }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='size-4 m-auto'>
                    <path d='M3.75 7.25a.75.75 0 0 0 0 1.5h8.5a.75.75 0 0 0 0-1.5h-8.5Z' />
                </svg>
            </button>
            <ActionInputWidget value={`${value}`} max={max} handleValueChange={updateValue} />
            <button type='button'
                onClick={increaseValue}
                className='rounded-xl outline-none text-white h-[25px] w-[25px] cursor-pointer hover:scale-110 active:scale-95 shadow-sm active:shadow-none'
                style={{ backgroundColor: color }}>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='currentColor' className='size-4 m-auto'>
                    <path d='M8.75 3.75a.75.75 0 0 0-1.5 0v3.5h-3.5a.75.75 0 0 0 0 1.5h3.5v3.5a.75.75 0 0 0 1.5 0v-3.5h3.5a.75.75 0 0 0 0-1.5h-3.5v-3.5Z' />
                </svg>
            </button>
        </ActionWidget>
    );
}