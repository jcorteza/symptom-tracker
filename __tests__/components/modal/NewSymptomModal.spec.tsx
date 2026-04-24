import { beforeAll, describe, expect, test, beforeEach, vi, afterEach } from 'vitest';
import { render, fireEvent, screen, cleanup } from '@testing-library/react';
import NewSymptomModal from '@/components/modal/NewSymptomModal';
import { TimeUnit } from '@/types/symptoms';

describe('NewSymptomModal', () => {
    const mockSetIsOpen = vi.fn();
    const mockAddSymptom = vi.fn();
    const testButtonsDisabled = (isPrevDisabled: boolean, isNextDisabled: boolean) => {
        expect((screen.getByText('Previous') as HTMLButtonElement).disabled).toBe(isPrevDisabled);
        expect((screen.getByText('Next') as HTMLButtonElement).disabled).toBe(isNextDisabled);
    };
    const testReviewStage = async () => {
        // test user is on the review stage of modal
        expect(await screen.findByText('Great! Save to add your new symptom or go back to edit.')).toBeDefined();
        testButtonsDisabled(false, true);

        // test user clicks to save new symptom
        expect(mockAddSymptom).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText('Save'));
        expect(mockAddSymptom).toHaveBeenCalled();
        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    }

    beforeAll(() => {
        HTMLDialogElement.prototype.showModal = vi.fn();
        HTMLDialogElement.prototype.close = vi.fn();
    });

    beforeEach(() => {
        render(<NewSymptomModal isOpen={true} setIsOpen={mockSetIsOpen} addSymptom={mockAddSymptom} />);
    });

    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    test('set up correctly with \'Next\' button disabled', () => {
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeTruthy();
        expect((screen.getByLabelText('Count') as HTMLInputElement).checked).toBeFalsy();
        expect((screen.getByLabelText('Duration') as HTMLInputElement).checked).toBeFalsy();
        expect((screen.getByLabelText('Severity') as HTMLInputElement).checked).toBeFalsy();
        
        const input = screen.getByLabelText('What do you want to call your symptom?');
        expect(input).toHaveProperty('value', '');
        testButtonsDisabled(true, true);
    });

    test('handles adding boolean symptom', async () => {
        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test going back
        expect(await screen.findByText('Great! Save to add your new symptom or go back to edit.')).toBeDefined();
        expect(screen.queryByText('What type of symptom do you want to track?')).toBeNull();
        fireEvent.click(screen.getByText('Previous'));
        expect(await screen.findByText('What type of symptom do you want to track?')).toBeDefined();
        expect(screen.queryByText('Great! Save to add your new symptom or go back to edit.')).toBeNull();
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('handles adding count symptom without customization', async () => {
        // test user selects count symptom type
        const countRadio = screen.getByLabelText('Count') as HTMLInputElement;
        fireEvent.click(countRadio);
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeFalsy();
        expect(countRadio.checked).toBeTruthy();
        testButtonsDisabled(true, true);

        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test user is on the customization opt-in stage of modal
        expect(await screen.findByText('Do you want to customize the maximum count?')).toBeDefined();
        expect((screen.getByLabelText('No, I am fine with the maximum count') as HTMLInputElement).checked).toBeTruthy();
        expect((screen.getByLabelText('Yes, I want to customize the maximum count') as HTMLInputElement).checked).toBeFalsy();
        testButtonsDisabled(false,  false);
        
        // test going back
        fireEvent.click(screen.getByText('Previous'));
        expect(await screen.findByText('What type of symptom do you want to track?')).toBeDefined();
        expect(screen.queryByText('Do you want to customize the maximum count?')).toBeNull();
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));
        expect(await screen.findByText('Do you want to customize the maximum count?')).toBeDefined();
        expect(screen.queryByText('What type of symptom do you want to track?')).toBeNull();
        testButtonsDisabled(false, false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('handles adding count symptom with customization', async () => {
        // test user select count symptom type
        const countRadio = screen.getByLabelText('Count') as HTMLInputElement;
        fireEvent.click(countRadio);
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeFalsy();
        expect(countRadio.checked).toBeTruthy();
        testButtonsDisabled(true, true);

        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test user is on the customization opt-in stage of modal
        expect(await screen.findByText('Do you want to customize the maximum count?')).toBeDefined();
        const optOutRadio = screen.getByLabelText('No, I am fine with the maximum count') as HTMLInputElement;
        const optInRadio = screen.getByLabelText('Yes, I want to customize the maximum count') as HTMLInputElement;
        expect(optOutRadio.checked).toBeTruthy();
        expect(optInRadio.checked).toBeFalsy();
        testButtonsDisabled(false,  false);

        // test user opts in for customization
        fireEvent.click(optInRadio);
        expect(optOutRadio.checked).toBeFalsy();
        expect(optInRadio.checked).toBeTruthy()
        fireEvent.click(screen.getByText('Next'));

        // test user on customization stage
        const countInput = (await screen.findByLabelText('What is the maximum count you want to track?')) as HTMLInputElement;
        expect(countInput.value).toBe('');
        testButtonsDisabled(false, true);

        // test user customizes sympotm
        fireEvent.change(countInput, { target: { value: '20' }});
        expect(countInput.value).toBe('20');
        testButtonsDisabled(false, false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('handles adding duration symptom without customization', async () => {
        // test user select duration symptom type
        const durationRadio = screen.getByLabelText('Duration') as HTMLInputElement;
        fireEvent.click(durationRadio);
        expect(durationRadio.checked).toBeTruthy();
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeFalsy();
        testButtonsDisabled(true, true);

        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test user is on the customization opt-in stage of modal
        expect(await screen.findByText('Do you want to customize the max duration?')).toBeDefined();
        expect((screen.getByLabelText('No, I am fine with the max duration') as HTMLInputElement).checked).toBeTruthy();
        expect((screen.getByLabelText('Yes, I want to customize the max duration') as HTMLInputElement).checked).toBeFalsy();
        testButtonsDisabled(false,  false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('handles adding duration symptom with customization', async () => {
        // test user select duration symptom type
        const durationRadio = screen.getByLabelText('Duration') as HTMLInputElement;
        fireEvent.click(durationRadio);
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeFalsy();
        expect(durationRadio.checked).toBeTruthy();
        testButtonsDisabled(true, true);

        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test user is on the customization opt-in stage of modal
        expect(await screen.findByText('Do you want to customize the max duration?')).toBeDefined();
        const optOutRadio = screen.getByLabelText('No, I am fine with the max duration') as HTMLInputElement;
        const optInRadio = screen.getByLabelText('Yes, I want to customize the max duration') as HTMLInputElement;
        expect(optOutRadio.checked).toBeTruthy();
        expect(optInRadio.checked).toBeFalsy();
        testButtonsDisabled(false,  false);

        // test user opts in for customization
        fireEvent.click(optInRadio);
        expect(optOutRadio.checked).toBeFalsy();
        expect(optInRadio.checked).toBeTruthy();
        fireEvent.click(screen.getByText('Next'));

        // test user on customization stage
        expect(await screen.findByText('The default max for "duration" symptoms is 12 hours.')).toBeDefined();
        const hoursRadio = screen.getByLabelText(TimeUnit.HOURS) as HTMLInputElement;
        const minutesRadio = screen.getByLabelText(TimeUnit.MINUTES) as HTMLInputElement;
        expect(hoursRadio.checked).toBeTruthy();
        expect(minutesRadio.checked).toBeFalsy()
        expect((screen.getByLabelText('What is the max hours you want to track?') as HTMLInputElement).value).toBe('');
        expect(screen.queryByLabelText('What is the max minutes you want to track?')).toBeNull();
        testButtonsDisabled(false, true);
        fireEvent.click(minutesRadio);

        // test user customizes sympotm
        const durationInput = await screen.findByLabelText('What is the max minutes you want to track?');
        expect(hoursRadio.checked).toBeFalsy();
        expect(minutesRadio.checked).toBeTruthy();
        expect(screen.queryByLabelText('What is the max hours you want to track?')).toBeNull();
        expect((durationInput as HTMLInputElement).value).toBe('');
        fireEvent.change(durationInput, { target: { value: '20' }});
        expect((durationInput as HTMLInputElement).value).toBe('20');
        testButtonsDisabled(false, false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('handles adding severity symptom without customization', async () => {
        // test user select severity symptom type
        const severityRadio = screen.getByLabelText('Severity') as HTMLInputElement;
        fireEvent.click(severityRadio);
        expect(severityRadio.checked).toBeTruthy();
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeFalsy();
        testButtonsDisabled(true, true);

        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test user is on the customization opt-in stage of modal
        expect(await screen.findByText('Do you want to customize the default values?')).toBeDefined();
        expect((screen.getByLabelText('No, I am fine with the default values') as HTMLInputElement).checked).toBeTruthy();
        expect((screen.getByLabelText('Yes, I want to customize the default values') as HTMLInputElement).checked).toBeFalsy();
        testButtonsDisabled(false,  false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('handles adding severity symptom with customization', async () => {
        // test user select severity symptom type
        const severityRadio = screen.getByLabelText('Severity') as HTMLInputElement;
        fireEvent.click(severityRadio);
        expect((screen.getByLabelText('Presence/Absence') as HTMLInputElement).checked).toBeFalsy();
        expect(severityRadio.checked).toBeTruthy();
        testButtonsDisabled(true, true);

        // User changes value of stymptom name
        fireEvent.change(
            screen.getByLabelText('What do you want to call your symptom?'),
            { target: { value: 'My Symptom' }});
        testButtonsDisabled(true, false);
        fireEvent.click(screen.getByText('Next'));

        // test user is on the customization opt-in stage of modal
        expect(await screen.findByText('Do you want to customize the default values?')).toBeDefined();
        const optOutRadio = screen.getByLabelText('No, I am fine with the default values') as HTMLInputElement;
        const optInRadio = screen.getByLabelText('Yes, I want to customize the default values') as HTMLInputElement;
        expect(optOutRadio.checked).toBeTruthy();
        expect(optInRadio.checked).toBeFalsy();
        testButtonsDisabled(false,  false);

        // test user opts in for customization
        fireEvent.click(optInRadio);
        expect(optOutRadio.checked).toBeFalsy();
        expect(optInRadio.checked).toBeTruthy()
        fireEvent.click(screen.getByText('Next'));

        // test user on customization stage
        expect(await screen.findByText('Preview')).toBeDefined();
        const moderateInput = screen.getByLabelText('Moderate') as HTMLInputElement;
        const strongInput = screen.getByLabelText('Strong') as HTMLInputElement;
        expect(moderateInput.value).toBe('');
        expect(strongInput.value).toBe('');
        testButtonsDisabled(false, true);

        // test user customizes symptom
        fireEvent.change(moderateInput, { target: { value: '2' }});
        expect(moderateInput.value).toBe('2');
        testButtonsDisabled(false, true);

        fireEvent.change(strongInput, { target: { value: '4' }});
        expect(strongInput.value).toBe('4');
        testButtonsDisabled(false, false);
        fireEvent.click(screen.getByText('Next'));

        await testReviewStage();
    });

    test('close button works', () => {
        expect(mockSetIsOpen).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText('Close'));
        expect(mockSetIsOpen).toHaveBeenCalled();
    });
});
