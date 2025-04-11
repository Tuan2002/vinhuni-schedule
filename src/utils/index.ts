import { DAYS_OF_WEEK } from "@/constants/daysOfWeek";
import { DayOfWeek, SchoolWeek } from "@/types";
import dayjs from "dayjs";
export const getSchoolWeeks = (startDate?: Date, endDate?: Date): SchoolWeek[] => {
    const weeks: SchoolWeek[] = [];
    if (!startDate || !endDate) {
        return weeks;
    }
    let currentStartDate = new Date(startDate);
    let weekIndex = 1;

    while (currentStartDate <= new Date(endDate)) {
        // Calculate the end of the current week (7 days after currentStartDate)
        let currentEndDate = new Date(currentStartDate);
        currentEndDate.setDate(currentEndDate.getDate() + 6);
        // Ensure the currentEndDate does not exceed the overall endDate
        if (currentEndDate > endDate) {
            currentEndDate = new Date(endDate);
        }

        weeks.push({
            weekId: weekIndex.toString(),
            startDate: new Date(currentStartDate),
            endDate: new Date(currentEndDate),
        });

        // Move to the next week (7 days later)
        currentStartDate.setDate(currentStartDate.getDate() + 7);
        weekIndex++;
    }

    return weeks;
}

export const splitDayOfWeek = (startDate?: Date, endDate?: Date): DayOfWeek[] => {
    const days: DayOfWeek[] = [];
    if (!startDate || !endDate) {
        return days;
    }
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const diff = end.diff(start, 'day');
    for (let i = 0; i <= diff; i++) {
        const currentDate = start.add(i, 'day');
        const dayOfWeek = currentDate.day();
        days.push({
            label: DAYS_OF_WEEK[dayOfWeek],
            date: currentDate.toDate(),
            isToday: currentDate.isSame(dayjs(), 'day'),
            isSunday: dayOfWeek === 0,
        });
    }
    return days;
}