export function convertHourStringToMinutes(hourString: string){
    const [hour, min] = hourString.split(':').map(Number)

    const minutesAmount = (hour * 60) + min

    return minutesAmount
}