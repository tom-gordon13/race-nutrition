export const floatToHoursAndMinutes = (hoursFloat: number): string => {
    const hours = Math.floor(hoursFloat);

    const minutes = Math.round((hoursFloat - hours) * 60);

    return `${hours}h ${minutes}m`;
}

export const floatToHours = (hoursFloat: number): number => {
    const hours = Math.floor(hoursFloat);

    return hours
}


export const getOneMinuteStepSize = (containerWidth: number, eventDuration: number): number => {
    const eventMinutes = eventDuration * 60

    return containerWidth / eventMinutes
}


