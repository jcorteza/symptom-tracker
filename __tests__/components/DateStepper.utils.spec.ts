import { expect, test } from 'vitest'
import { calculatePrevDay, calculateNextDay } from '@/components/DateStepper.utils';


test('calculatePrevDay: handles first day of month by reuturning last day of previous month', () => {
    expect(calculatePrevDay('2024-03-01')).toBe('2024-02-29'); // leap year february
    expect(calculatePrevDay('2026-03-01')).toBe('2026-02-28'); // non-leap year february
    expect(calculatePrevDay('2026-01-01')).toBe('2025-12-31'); // last day of year—31 days
    expect(calculatePrevDay('2025-12-01')).toBe('2025-11-30'); // last day of month—30 days
});

test('calculateNextDay: handles last day of month by returning first day of next month', () => {
    expect(calculateNextDay('2024-02-29')).toBe('2024-03-01'); // leap year february
    expect(calculateNextDay('2026-02-28')).toBe('2026-03-01'); // non-leap year february
    expect(calculateNextDay('2025-12-31')).toBe('2026-01-01'); // last day of year—31 days
    expect(calculateNextDay('2025-11-30')).toBe('2025-12-01'); // last day of month—30 days
});