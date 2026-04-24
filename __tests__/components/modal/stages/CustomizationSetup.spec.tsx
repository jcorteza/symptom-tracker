import { test, describe, afterEach, vi, beforeAll, expect } from 'vitest';
import { render, RenderResult, screen, fireEvent } from '@testing-library/react';
import CustomizationSetup, { setValueMessage } from '@/components/modal/stages/CustomizationSetup';
import { SeverityThresholds, SymptomType } from '@/types/symptoms';
import { severityExtremes } from '@/components/modal/NewSymptomModal';

describe('CustomizationSetup handles Severity symptom validation', () => {
    let result: RenderResult;
    let workingThresholds: Partial<SeverityThresholds> = { ...severityExtremes };
    const updateThresholds = (updatedThresholds: Partial<SeverityThresholds>) => {
        workingThresholds = {...updatedThresholds};
        result.rerender(
            <CustomizationSetup
                type={SymptomType.SEVERITY}
                thresholds={workingThresholds}
                maxValueValidityMessage={''}
                setTimeUnit={vi.fn()}
                setMaxValue={vi.fn()}
                handleSeverityChange={vi.fn(updateThresholds)} />
        );
    }

    beforeAll(() => {
        result = render(
            <CustomizationSetup
                type={SymptomType.SEVERITY}
                thresholds={workingThresholds}
                maxValueValidityMessage={''}
                setTimeUnit={vi.fn()}
                setMaxValue={vi.fn()}
                handleSeverityChange={vi.fn(updateThresholds)} />
        );
    });

    afterEach(() => {
        workingThresholds = { ...severityExtremes };
        result.rerender(
            <CustomizationSetup
                type={SymptomType.SEVERITY}
                thresholds={workingThresholds}
                maxValueValidityMessage={''}
                setTimeUnit={vi.fn()}
                setMaxValue={vi.fn()}
                handleSeverityChange={vi.fn(updateThresholds)} />
        );
    });

    test('shows setValueMessage for moderate and strong when user clears input', async () => {
        // moderate test setup
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '4' }});
        expect(workingThresholds.moderate).toBe(4);
        fireEvent.change(screen.getByLabelText('Moderate'), { target: { value: '' } });

        expect(workingThresholds.moderate).toBeUndefined();
        expect((await screen.findAllByText(setValueMessage)).length).toBe(1);

        // strong test setup
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '7' }});
        expect(workingThresholds.strong).toBe(7);
        fireEvent.change(screen.getByLabelText('Strong'), { target: { value: '' } });

        expect(workingThresholds.strong).toBeUndefined();
        expect((await screen.findAllByText(setValueMessage)).length).toBe(2);

        // test info messageg clears once value is set once again        
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '4' }});
        expect((await screen.findAllByText(setValueMessage)).length).toBe(1);
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '7' }});
        expect((screen.queryAllByText(setValueMessage)).length).toBe(0);
    });

    test('shows info message when value entered for moderate is invalid', async () => {
        const moderateMinValueMessage = 'The minimum possible value for moderate is ';
        const moderateMaxMessage = 'The maximum possible value for moderate is ';
        const moderateGreaterThanStrongMessage = 'Please make sure the value of moderate is less than the value of strong-';

        // value less than or equal to mild—1
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '1' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('2'); // value auto floors to 2
        expect(screen.getByText(moderateMinValueMessage, { exact: false })).toBeDefined();

        // value greater than max moderate-8
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '' }}); // reset value
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('');
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '9' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('8'); // value auto caps at 8
        expect(screen.getByText(moderateMaxMessage, { exact: false })).toBeDefined();

        // value greater than or equal to strong
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('');
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('');
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '7' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('7');
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '8' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('');
        expect(screen.getByText(moderateGreaterThanStrongMessage, { exact: false })).toBeDefined();
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '7' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('');
        expect(screen.getByText(moderateGreaterThanStrongMessage, { exact: false })).toBeDefined();

        // no info message when value of moderate is valid
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '6' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('6');
        expect(screen.queryByText(moderateMinValueMessage, { exact: false })).toBeNull();
        expect(screen.queryByText(moderateMaxMessage, { exact: false })).toBeNull();
        expect(screen.queryByText(moderateGreaterThanStrongMessage, { exact: false })).toBeNull();
        expect(screen.queryByText(setValueMessage)).toBeNull();
    });

    test('shows info message when value entered for strong is invalid', async () => {
        const strongMinValueMessage = 'The minimum possible value for strong is ';
        const strongMaxValueMessage = 'The maximum possible value for strong is ';
        const strongLessthanModerate = 'Please make sure the value of strong is greater than the value of moderate-';

        // value less than or equal to min value for moderate-2
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '2' }});
        expect(workingThresholds.strong).toBe(3); // auto floors at 3
        expect(await screen.findByText(strongMinValueMessage, { exact: false })).toBeDefined();

        // value greater than or equal to value of extreme-10
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('');
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '10' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('9'); // value auto caps at 9
        expect(screen.getByText(strongMaxValueMessage, { exact: false })).toBeDefined();

        // value less than or equal to moderate
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('');
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('');
        fireEvent.change(screen.getByLabelText('Moderate'),  { target: { value: '7' }});
        expect((await screen.findByLabelText('Moderate') as HTMLInputElement).value).toEqual('7');
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '6' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('');
        expect(screen.getByText(strongLessthanModerate, { exact: false })).toBeDefined();
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '7' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('');
        expect(screen.getByText(strongLessthanModerate, { exact: false })).toBeDefined();

        // no info message when value of strong is valid
        fireEvent.change(screen.getByLabelText('Strong'),  { target: { value: '8' }});
        expect((await screen.findByLabelText('Strong') as HTMLInputElement).value).toEqual('8');
        expect(screen.queryByText(strongMinValueMessage, { exact: false })).toBeNull();
        expect(screen.queryByText(strongMaxValueMessage, { exact: false })).toBeNull();
        expect(screen.queryByText(strongLessthanModerate, { exact: false })).toBeNull();
        expect(screen.queryByText(setValueMessage)).toBeNull();
    });
});