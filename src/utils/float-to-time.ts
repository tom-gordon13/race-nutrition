export const floatToHoursAndMinutes = (hoursFloat: number): string => {
    const hours = Math.floor(hoursFloat);

    const minutes = Math.round((hoursFloat - hours) * 60);

    return `${hours}h ${minutes}m`;
}

