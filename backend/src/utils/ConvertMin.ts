export function convertMinutesToHoursString(minutesAmount: number){
    const hours = Math.floor(minutesAmount / 60)
    const min = minutesAmount % 60

    return `${String(hours).padStart(2, '0')}:${String(min).padStart(2, '0')}`
}