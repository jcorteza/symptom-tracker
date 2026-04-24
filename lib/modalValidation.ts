export const nameMessage = 'Please enter a name for your symptom.';
export const getNameValidityMessage = (newName?: string) => {
    if (!newName?.trim()) {
        return nameMessage;
    } else {
        return '';
    }
};

export const maxValueMessage = 'Please enter a value greater than 0.';
export const getMaxValueValidityMessage = (newMax?: number) => {
    if (newMax === undefined || newMax <= 0) {
        return maxValueMessage;
    } else {
        return '';
    }
};
