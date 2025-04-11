export type SubscriptionSubject = {
    id: number;
    teacherName: string;
    roomName?: string;
}

export type BaseSchedule = {
    id: number
    scheduleDate: Date
    weekDay: number
    startTime: string
    endTime: string
    lessionIndex: number
    lessionCount: number
    className: string
    classCode: string
    classId: number
    teacherCode: string
    roomCode: string
}

export type Schedule = BaseSchedule & {
    teacherName?: string
    roomName?: string
    townName?: string
    townFloor?: string
    classLocation?: string
}