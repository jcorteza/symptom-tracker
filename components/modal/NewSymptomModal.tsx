'use client';

import { useRef, useEffect, useState } from 'react';
import { SymptomType } from '@/types/symptoms';
import { TimeUnit, SeverityThresholds } from '@/types/symptoms';
import Button from '@/components/shared/Button';
import BasicSetup from '@/components/modal/stages/BasicSetup';
import CustomizationOptIn from '@/components/modal/stages/CustomizationOptIn';
import CustomizationSetup from '@/components/modal/stages/CustomizationSetup';
import Review from '@/components/modal/stages/Review';

type Props = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addSymptom: (name: string, type: SymptomType, maxValues?: number, timeUnit?: string, thresholds?: SeverityThresholds) => void;
}

export default function NewSymptomModal(props: Props) {
    const { isOpen, setIsOpen, addSymptom } = props;
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [showCustomization, setShowCustomization] = useState(false);
    const [newSymptomName, setNewSymptomName] = useState('');
    const [newSymptomType, setNewSymptomType] = useState<SymptomType>(SymptomType.BOOLEAN);
    const [newSymptomMaxValue, setNewSymptomMaxValue] = useState<number | undefined>();
    const [newSymptomTimeUnit, setNewSymptomTimeUnit] = useState<TimeUnit | undefined>();
    const [newSymptomThresholds, setNewSymptomThresholds] = useState<Partial<SeverityThresholds>>({});

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
            setShowCustomization(false);
            setNewSymptomName('')
            setNewSymptomType(SymptomType.BOOLEAN);
            setNewSymptomMaxValue(undefined);
            setNewSymptomTimeUnit(undefined);
            setNewSymptomThresholds({});
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

    enum ModalStage {
        BASIC_SETUP = 0,
        CUSTOMIZATION_OPT_IN = 1,
        CUSTOMIZATION_SETUP = 2,
        REVIEW = 3
    }
    const [modalStage, setModalStage] = useState(ModalStage.BASIC_SETUP);

    const validateStages = () => {
        const invalidFields: string[] = [];
        switch (modalStage) {
            case ModalStage.BASIC_SETUP:
                if (!newSymptomName || !newSymptomName.trim()) {
                    invalidFields.push('Symptom Name');
                }

                if (!newSymptomType) {
                    invalidFields.push('Symptom Type');
                }
                return invalidFields;
            case ModalStage.CUSTOMIZATION_SETUP:
                switch(newSymptomType) {
                    case SymptomType.SEVERITY:
                        if (newSymptomThresholds.mild === undefined) {
                            invalidFields.push('Mild');
                        }

                        if (newSymptomThresholds.moderate === undefined) {
                            invalidFields.push('Moderate');
                        }

                        if (newSymptomThresholds.moderate === undefined) {
                            invalidFields.push('Severe');
                        }

                        if (newSymptomThresholds.extreme === undefined) {
                            invalidFields.push('Extreme');
                        }
                        return invalidFields;
                    case SymptomType.DURATION:
                        if (!newSymptomTimeUnit) {
                            invalidFields.push('Time Unit');
                        }

                        if (newSymptomMaxValue === undefined) {
                            invalidFields.push('Max Value');
                        }
                        return invalidFields;
                    case SymptomType.COUNT:
                        if (newSymptomMaxValue === undefined) {
                            invalidFields.push('Max Value');
                        }
                        return invalidFields;
                    default:
                        return invalidFields;
                }
            default:
                return invalidFields;
        }
    }

    const setPrevModalStage = () => {
        switch (modalStage) {
            case ModalStage.REVIEW:
                if (newSymptomType === SymptomType.BOOLEAN) {
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
                if (newSymptomType === SymptomType.BOOLEAN) {
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

    const invalidFields = validateStages();

    return (
        <dialog
            ref={dialogRef}
            className="m-auto outline-none w-md h-max rounded-xl border border-st-border backdrop:bg-st-ink/65">
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
                        newSymptomName={newSymptomName}
                        newSymptomType={newSymptomType}
                        setNewSymptomName={setNewSymptomName}
                        setNewSymptomType={setNewSymptomType}
                        resetCustom={() => {
                            setShowCustomization(false);
                            setNewSymptomMaxValue(undefined);
                            setNewSymptomThresholds({});
                            setNewSymptomTimeUnit(undefined);
                        }}/>}
                {modalStage === ModalStage.CUSTOMIZATION_OPT_IN && 
                    <CustomizationOptIn
                        newSymptomType={newSymptomType}
                        showCustomization={showCustomization}
                        setShowCustomization={setShowCustomization}
                        setNewSymptomTimeUnit={setNewSymptomTimeUnit} />}
                {modalStage === ModalStage.CUSTOMIZATION_SETUP && 
                    <CustomizationSetup 
                        newSymptomType={newSymptomType}
                        newSymptomThresholds={newSymptomThresholds}
                        newSymptomTimeUnit={newSymptomTimeUnit}
                        newSymptomMaxValue={newSymptomMaxValue}
                        setNewSymptomMaxValue={setNewSymptomMaxValue}
                        setNewSymptomThresholds={setNewSymptomThresholds}
                        setNewSymptomTimeUnit={setNewSymptomTimeUnit} />}
                {modalStage === ModalStage.REVIEW &&
                    <Review
                        showCustomization={showCustomization}
                        newSymptomName={newSymptomName}
                        newSymptomType={newSymptomType}
                        newSymptomMaxValue={newSymptomMaxValue}
                        newSymptomThresholds={newSymptomThresholds as SeverityThresholds}
                        newSymptomTimeUnit={newSymptomTimeUnit}
                        handleSave={() => {
                            addSymptom(newSymptomName, newSymptomType, newSymptomMaxValue, newSymptomTimeUnit, newSymptomThresholds as SeverityThresholds);
                            setIsOpen(false);
                        }}/>}
            </div>
            <footer
                className='flex flex-row justify-between pt-2 pb-5 px-5 border-t border-t-st-rule'>
                <Button text='Previous' handleClick={setPrevModalStage} isDisabled={modalStage === ModalStage.BASIC_SETUP} isSecondaryAction />
                <Button text='Next' handleClick={setNextModalStage} isDisabled={modalStage === ModalStage.REVIEW || invalidFields.length > 0} />
            </footer>
        </dialog>
    );
}