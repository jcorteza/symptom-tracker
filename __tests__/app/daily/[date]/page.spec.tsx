import { describe, test, expect, vi, beforeAll } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import DateStepper, { PREV_LABEL, NEXT_LABEL} from "@/components/DateStepper";
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

const TODAY = "2026-03-17"; // Set a fixed date for testing
const PREV_DAY = "2026-03-16";
const NEXT_DAY = "2026-03-18";

vi.mock('next/navigation', () => ({
    redirect: vi.fn(),
}));

describe('DateStepper Component', () => {
    let rerender: (ui: ReactNode) => void;

    beforeAll(() => {
        vi.setSystemTime(new Date(`${TODAY}T00:00:00`)); // Set the system time to March 17, 2026
        const result = render(<DateStepper date={TODAY} />);
        rerender = result.rerender; // Get the rerender function for later use
    });

    test('Previous Day Button redirect to previous day', async() => {
        expect(await screen.findByRole('heading', { name: 'Today' })).toBeDefined();

        fireEvent.click(await screen.findByText(PREV_LABEL));
        expect(redirect).toHaveBeenCalledWith(`/daily/${PREV_DAY}`);
    
        // simulate re-render with the new date
        rerender(<DateStepper date={PREV_DAY} />);
        expect(screen.findByRole('heading', { name: 'Mar 16, 2026' })).toBeDefined();
        expect((await screen.findAllByRole('heading')).find((h) => h.textContent === 'Today')).toBeUndefined();

        // Reset to original date for next test
        rerender(<DateStepper date={TODAY} />);
    });
    
    test('Next Day Button redirect to next day', async () => {
        expect(screen.findByRole('heading', { name: 'Today' })).toBeDefined();

        fireEvent.click(await screen.findByText(NEXT_LABEL));
        expect(redirect).toHaveBeenCalledWith(`/daily/${NEXT_DAY}`);

        // simulate re-render with the new date
        rerender(<DateStepper date={NEXT_DAY} />);
        expect(screen.findByRole('heading', { name: 'Mar 18, 2026' })).toBeDefined();
        expect((await screen.findAllByRole('heading')).find((h) => h.textContent === 'Today')).toBeUndefined();
        
        // Reset to original date for next test
        rerender(<DateStepper date={TODAY} />);
    });
});