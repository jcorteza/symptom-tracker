'use client';

import { useRef, useEffect, useState } from 'react';
import { SymptomType } from '@/types/symptoms';
import { TimeUnit, SeverityThresholds } from '@/types/symptoms';
import Button from '@/components/shared/Button';
import BasicSetup from '@/components/modal/stages/BasicSetup';
import CustomizationOptIn from '@/components/modal/stages/CustomizationOptIn';
import CustomizationSetup from '@/components/modal/stages/CustomizationSetup';
import Review from '@/components/modal/stages/Review';
import { getSeverityMessages, getNameValidityMessage, getMaxValueValidityMessage, FieldMessages } from '@/lib/modalValidation';

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addSymptom: (name: string, type: SymptomType, maxValues?: number, timeUnit?: string, thresholds?: SeverityThresholds) => void;
}

enum ModalStage {
    BASIC_SETUP = 0,
    CUSTOMIZATION_OPT_IN = 1,
    CUSTOMIZATION_SETUP = 2,
    REVIEW = 3
}

const severityExtremes = { none: 0, extreme: 10 };

export default function NewSymptomModal(props: Props) {
    const { isOpen, setIsOpen, addSymptom } = props;
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [modalStage, setModalStage] = useState(ModalStage.BASIC_SETUP);
    const [showCustomization, setShowCustomization] = useState(false);
    const [name, setName] = useState('');
    const [type, setType] = useState<SymptomType>(SymptomType.BOOLEAN);
    const [maxValue, setMaxValue] = useState<number>();
    const [timeUnit, setTimeUnit] = useState<TimeUnit>();
    const [thresholds, setThresholds] = useState<Partial<SeverityThresholds>>(severityExtremes);
    const [fieldMessages, setFieldMessages] = useState({
        name: '',
        maxValue: '',
        mild: '',
        moderate: '',
        strong: ''
    });

    useEffect(() => {
        const dialog = dialogRef.current;

        if(isOpen && !dialog?.open) {
            dialog?.showModal();
        } else {
            dialog?.close();
        }

        return () => {
            dialog?.close();
        }
    }, [isOpen]);
    
    useEffect(() => {
        const dialog = dialogRef.current;

        const handleClose = (event: Event | KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();
            setIsOpen(false);
        };

        const dismissHandler = (event: Event) => {
            const { target } = event;
            if (target instanceof Element  && target.nodeName === 'DIALOG') {
                handleClose(event);
            }
        };

        const closeOnEscape = (event: KeyboardEvent) => {
            if (event.code === 'Escape') {
                handleClose(event);
            }
        };

        dialog?.addEventListener('click', dismissHandler);
        dialog?.addEventListener('keydown', closeOnEscape);

        return () => {
            dialog?.removeEventListener('click', dismissHandler);
            dialog?.removeEventListener('keydown', closeOnEscape);
        }
    }, [setIsOpen]);

    const handleSeverityChange = (thresholds: Partial<SeverityThresholds>, fieldMessages: FieldMessages) => (newThresholds: Partial<SeverityThresholds>) => {
        setFieldMessages(getSeverityMessages(newThresholds, thresholds, fieldMessages));
        setThresholds(newThresholds);
    };

    const hasInvalidValues = () => {
        switch (modalStage) {
            case ModalStage.BASIC_SETUP:
                return !name || !!fieldMessages.name;
            case ModalStage.CUSTOMIZATION_SETUP:
                switch(type) {
                    case SymptomType.SEVERITY:
                        const { mild, moderate, strong} = thresholds;
                        return !mild || !moderate || !strong || !!fieldMessages.mild || !!fieldMessages.moderate || !!fieldMessages.strong;
                    case SymptomType.DURATION:
                    case SymptomType.COUNT:
                        return !maxValue || !!fieldMessages.maxValue;
                    default:
                        return false;
                }
            default:
                return false;
        }
    };

    const setPrevModalStage = () => {
        switch (modalStage) {
            case ModalStage.REVIEW:
                if (type === SymptomType.BOOLEAN) {
                    setModalStage(ModalStage.BASIC_SETUP);
                } else if (showCustomization) {
                    setModalStage(ModalStage.CUSTOMIZATION_SETUP);
                } else {
                    setModalStage(ModalStage.CUSTOMIZATION_OPT_IN);
                }
                break;
            case ModalStage.CUSTOMIZATION_SETUP:
                setModalStage(ModalStage.CUSTOMIZATION_OPT_IN);
                break;
            case ModalStage.CUSTOMIZATION_OPT_IN:
                setModalStage(ModalStage.BASIC_SETUP);
                break;
        }
    };

    const setNextModalStage = () => {
        switch (modalStage) {
            case ModalStage.BASIC_SETUP:
                if (type === SymptomType.BOOLEAN) {
                    setModalStage(ModalStage.REVIEW);
                } else {
                    setModalStage(ModalStage.CUSTOMIZATION_OPT_IN);
                }
                break;
            case ModalStage.CUSTOMIZATION_OPT_IN:
                if (showCustomization) {
                    setModalStage(ModalStage.CUSTOMIZATION_SETUP);
                } else {
                    setModalStage(ModalStage.REVIEW);
                }
                break;
            case ModalStage.CUSTOMIZATION_SETUP:
                setModalStage(ModalStage.REVIEW);
                break;
        }
    };

    return (
        <dialog
            ref={dialogRef}
            className="m-auto outline-none w-lg h-max rounded-xl border border-st-border backdrop:bg-st-ink/65">
            <header
                className='flex flex-row justify-between pt-5 pb-3 px-5 mb-3 bg-st-canvas text-st-ink border-b-st-border'>
                <h2 className='text-lg font-semibold'>Add a Symptom to Track</h2> 
                <button
                    title='Close'
                    className='w-[28px] h-[28px] cursor-pointer rounded-lg hover:bg-st-rule hover:border hover:border-st-border outline-none'
                    type="button"
                    onClick={() => setIsOpen(false)}>
                    <svg className='m-auto size-5 text-st-ink' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                    <span className='sr-only'>Close</span>
                </button>
            </header>
            <div className='px-5 min-h-96 flex flex-col gap-3'>
                {modalStage === ModalStage.BASIC_SETUP &&
                    <BasicSetup
                        newSymptomName={name}
                        newSymptomType={type}
                        nameFieldMessage={fieldMessages.name}
                        setNewSymptomName={(newName: string) => {
                            setFieldMessages({
                                ...fieldMessages,
                                name: getNameValidityMessage(newName)
                            });
                            setName(newName);
                        }}
                        setNewSymptomType={setType}
                        resetCustom={() => {
                            setShowCustomization(false);
                            setMaxValue(undefined);
                            setThresholds({});
                            setTimeUnit(undefined);
                        }}/>}
                {modalStage === ModalStage.CUSTOMIZATION_OPT_IN && 
                    <CustomizationOptIn
                        newSymptomType={type}
                        showCustomization={showCustomization}
                        setShowCustomization={setShowCustomization}
                        setNewSymptomTimeUnit={setTimeUnit} />}
                {modalStage === ModalStage.CUSTOMIZATION_SETUP && 
                    <CustomizationSetup 
                        type={type}
                        timeUnit={timeUnit}
                        maxValue={maxValue}
                        thresholds={thresholds}
                        fieldMessages={fieldMessages}
                        setMaxValue={(newMax?: number) => {
                            setFieldMessages({
                                ...fieldMessages,
                                maxValue: getMaxValueValidityMessage(newMax)
                            });
                            setMaxValue(newMax);
                        }}
                        handleSeverityChange={handleSeverityChange(thresholds, fieldMessages)}
                        setTimeUnit={setTimeUnit} />}
                {modalStage === ModalStage.REVIEW &&
                    <Review
                        showCustomization={showCustomization}
                        newSymptomName={name}
                        newSymptomType={type}
                        newSymptomMaxValue={maxValue}
                        newSymptomThresholds={thresholds as SeverityThresholds}
                        newSymptomTimeUnit={timeUnit}
                        handleSave={() => {
                            addSymptom(name, type, maxValue, timeUnit, thresholds as SeverityThresholds);
                            setModalStage(ModalStage.BASIC_SETUP);
                            setShowCustomization(false);
                            setName('');
                            setType(SymptomType.BOOLEAN);
                            setMaxValue(undefined);
                            setTimeUnit(undefined);
                            setThresholds(severityExtremes);
                            setFieldMessages({
                                name: '',
                                mild: '',
                                moderate: '',
                                strong: '',
                                maxValue: ''
                            });
                            setIsOpen(false);
                        }}/>}
            </div>
            <footer
                className='flex flex-row justify-between pt-2 pb-5 px-5 border-t border-t-st-rule'>
                <Button text='Previous' handleClick={setPrevModalStage} isDisabled={modalStage === ModalStage.BASIC_SETUP} isSecondaryAction />
                <Button text='Next' handleClick={setNextModalStage} isDisabled={modalStage === ModalStage.REVIEW || hasInvalidValues()} />
            </footer>
        </dialog>
    );
}