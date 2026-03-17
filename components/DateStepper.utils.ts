// date as YYYY-MM-DD
export const calculatePrevDay = (date: string): string => {
    const [year, month, day] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day) - 1).toISOString().split('T')[0];
}

// date as YYYY-MM-DD
export const calculateNextDay = (date: string): string => {
    const [year, month, day] = date.split('-');
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day) + 1).toISOString().split('T')[0];
}
