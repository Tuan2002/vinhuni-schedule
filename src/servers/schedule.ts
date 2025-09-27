'use server';
import { timeConstants } from "@/constants";
import { locationInstructions } from "@/constants/locationInstructions";
import { StatisticTypes } from "@/constants/statisticTypes";
import { prisma } from "@/libs/prisma";
import redis from "@/libs/redis";
import { BaseSchedule, Schedule, SubscriptionSubject } from "@/types/schedule";
import dayjs from "dayjs";
import { Base64 } from "js-base64";
import _ from "lodash";
import { getAccessToken } from "./auth";
import { getRoomInfoByCodeAsync, getTownInfoAsync } from "./common";

const getSubscriptionSubjectsAsync = async (sessionId?: string, studentCode?: string) => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }

        if (!studentCode || !sessionId) {
            throw new Error('Invalid student code or session id');
        }
        const requestBody = {
            pageInfo: {
                page: 1,
                pageSize: 999
            },
            sorts: [],
            filters: [
                {
                    filters: [],
                    field: "hocKy",
                    operator: "eq",
                    value: sessionId
                },
                {
                    filters: [],
                    field: "idNguoiHoc",
                    operator: "eq",
                    value: studentCode
                },
                {
                    filters: [],
                    field: "trangThai",
                    operator: "eq",
                    value: 1
                }
            ],
            fields: "idLopHp,giangVien,phong",
        };
        const response = await fetch(`${process.env.API_URL}/gwsg/dbdaotao_chinhquysv/DangKyHoc/getPaged/GetKetQuaDangKy`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success || data?.data?.length < 1) {
            return null;
        }
        const subscribedSubjects: Array<SubscriptionSubject> = data?.data?.map((item: any) => ({
            id: item.idLopHp,
            teacherName: item?.giangVien,
            roomName: item?.phong
        }))
        return subscribedSubjects;
    }
    catch (error) {
        console.error("Error fetching subscribed subjects:", error);
        return null;
    }
}

const getStudentSchedulesAsync = async(studentCode?: string, sessionId?: string, startTime?: Date, endTime?: Date) => {
    try {
        const requestTimestamp = new Date();
        const requestHash = Base64.encode(`${studentCode}&${sessionId}&${requestTimestamp.toISOString()}`);

        const cachedSchedules = await redis.get(`SCHEDULE:${studentCode}/${sessionId}`);
        if (cachedSchedules) {
            await prisma.statistics.create({
                data: {
                    code: StatisticTypes.ScheduleCheck,
                    hash: requestHash,
                    timestamp: requestTimestamp,
                }
            });
            return { success: true, data: JSON.parse(cachedSchedules) };
        }
        if (!studentCode || !sessionId) {
            throw new Error('Invalid student code or session id');
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const subscribedSubjects = await getSubscriptionSubjectsAsync(sessionId, studentCode);
        if (!subscribedSubjects || subscribedSubjects.length < 1) {
            throw new Error('No subscribed subjects found');
        }
        const subjectIds = subscribedSubjects.map(item => item.id).join(',');

        const requestBody = {
            filters: [
                {
                    field: "idHocKy",
                    operator: "eq",
                    value: sessionId
                },
                {
                    logic: "or",
                    filters: [
                        {
                            field: "classId",
                            operator: "in",
                            value: subjectIds
                        }
                    ]
                },
                {
                    logic: "or",
                    filters: [
                        {
                            logic: "and",
                            filters: [
                                {
                                    field: "date",
                                    operator: "gte",
                                    value: dayjs(startTime).format("DD/MM/YYYY")
                                },
                                {
                                    field: "date",
                                    operator: "lte",
                                    value: dayjs(endTime).format("DD/MM/YYYY")
                                }
                            ]
                        }
                    ]
                }
            ],
            sorts: [
                {
                    field: "day"
                },
                {
                    field: "lessionIndex"
                }
            ],
            pageInfo: {
                page: 1,
                pageSize: 999
            },
            fields: "id,date,day,lessionIndex,lessionCount,className,classCode,classId,teacherCode,timeStart,timeEnd,roomCode",
            ignoreBCache: false
        };
        const response = await fetch(`${process.env.API_URL}/gwsg/dbdaotao_chinhquy/ScheduleDetail/getPaged`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success || data?.data?.length < 1) {
            return null;
        }
        const baseSchedules: Array<BaseSchedule> = data?.data?.map((item: any) => ({
            id: item.id,
            scheduleDate: item?.date,
            weekDay: item?.day,
            startTime: item?.timeStart,
            endTime: item?.timeEnd,
            lessionIndex: item?.lessionIndex,
            lessionCount: item?.lessionCount,
            className: item?.className,
            classCode: item?.classCode,
            classId: item?.classId,
            teacherCode: item?.teacherCode,
            roomCode: item?.roomCode
        }))

        if (!baseSchedules || baseSchedules.length < 1) {
            return null;
        }

        const schedules: Array<Schedule> = await Promise.all(baseSchedules.map(async (baseSchedule: BaseSchedule) => {
            try {
                const teacherName = subscribedSubjects.find(item => item.id === baseSchedule.classId)?.teacherName;
                const roomInfo = await getRoomInfoByCodeAsync(baseSchedule?.roomCode);
                const townInfo = await getTownInfoAsync(roomInfo?.townId);
                const schedule: Schedule = {
                    ...baseSchedule,
                    teacherName: teacherName,
                    roomName: roomInfo?.name,
                    townName: townInfo?.name,
                    classLocation: `${townInfo?.name} - ${locationInstructions[roomInfo?.instructionId as keyof typeof locationInstructions]}`,
                    townFloor: roomInfo?.floor,
                }
                return schedule;
            }
            catch (error) {
                console.log(error);
                return { ...baseSchedule };
            }
        }))
        const schedulesGroupedByWeekDay = _.groupBy(schedules, (item: Schedule) => item.weekDay);
        await redis.setex(`SCHEDULE:${studentCode}/${sessionId}`, timeConstants.REDIS_CACHE_SCHEDULE, JSON.stringify(schedulesGroupedByWeekDay));
        await prisma.statistics.create({
            data: {
                code: StatisticTypes.ScheduleCheck,
                hash: requestHash,
                timestamp: requestTimestamp,
            }
        });
        return { success: true, data: schedulesGroupedByWeekDay };
    }
    catch (error) {
        console.error("Error fetching subscribed subjects:", error);
        return null;
    }
}

export { getStudentSchedulesAsync, getSubscriptionSubjectsAsync };

