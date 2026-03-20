'use server';

import { query } from '@/lib/db';

export const saveSymptoms = async (formData: FormData) => {
    console.log(`Saving symptoms`, formData);
    await query();
    return Promise.resolve();
}