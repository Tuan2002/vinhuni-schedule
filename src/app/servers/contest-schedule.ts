"use server";
import { timeConstants } from "@/constants";
import { ContestMethods } from "@/constants/contestMethods";
import { locationInstructions } from "@/constants/locationInstructions";
import { scoreTypes } from "@/constants/scoreTypes";
import { StatisticTypes } from "@/constants/statisticTypes";
import { prisma } from "@/libs/prisma";
import redis from "@/libs/redis";
import { BaseContestSchedule, ContestListInfo, ContestSchedule, ContestTimeInfo, RoomInfo } from "@/types";
import { Base64 } from "js-base64";
import { getAccessToken } from "./auth";
import { getSubjectInfoAsync, getTownInfoAsync } from "./common";

const getContestTimeInfoAsync = async (contestTimeId?: number) => {
    try {
        const cachedContestTimeInfo = await redis.get(`CONTEST_TIME_INFO:${contestTimeId}`);
        if (cachedContestTimeInfo) {
            return JSON.parse(cachedContestTimeInfo);
        }
        if (!contestTimeId) {
            throw new Error('Invalid contest time id');
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/thi/tbl_Thi_CaThi/${contestTimeId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success) {
            return null;
        }
        const contestTimeInfo: ContestTimeInfo = {
            id: data?.data?.id,
            contestMethodId: data?.data?.idHinhThucThi,
            name: data?.data?.ten,
            startTime: data?.data?.thoiGianBatDau,
            endTime: data?.data?.thoiGianKetThuc
        }
        if (contestTimeInfo) {
            await redis.setex(`CONTEST_TIME_INFO:${contestTimeId}`, timeConstants.REDIS_CACHE_SORT_TIME, JSON.stringify(contestTimeInfo));
        }
        return contestTimeInfo;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getRoomInfoAsync = async (roomId?: string) => {
    try {
        const cachedRoomInfo = await redis.get(`ROOM_INFO:${roomId}`);
        if (cachedRoomInfo) {
            return JSON.parse(cachedRoomInfo);
        }
        if (!roomId) {
            throw new Error('Invalid room id');
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }

        const requestBody = {
            pageInfo: {
                page: 1,
                pageSize: 999999
            },
            sorts: [],
            filters: [
                {
                    filters: [],
                    field: "instanceId",
                    operator: "eq",
                    value: roomId
                }
            ]
        };
        const response = await fetch(`${process.env.API_URL}/gwsg/dbtainguyen/tbl_DM_PhongHoc/getPaged`, {
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
        const roomInfo: RoomInfo = {
            id: data?.data?.[0]?.id,
            name: data?.data?.[0]?.ten,
            floor: data?.data?.[0]?.idDM_Tang,
            townId: data?.data?.[0]?.idDM_ToaNha,
            instructionId: data?.data?.[0]?.idDM_CoSoDaoTao
        }
        if (roomInfo) {
            await redis.setex(`ROOM_INFO:${roomId}`, timeConstants.REDIS_ROOM_CACHE_TIME, JSON.stringify(roomInfo));
        }
        return roomInfo;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getContestListInfoAsync = async (contestListId?: number) => {
    try {
        const cachedContestListInfo = await redis.get(`CONTEST_LIST_INFO:${contestListId}`);
        if (cachedContestListInfo) {
            return JSON.parse(cachedContestListInfo);
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/thi/tbl_Thi_DanhSachThi/${contestListId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success) {
            return null;
        }
        const contestListInfo: ContestListInfo = {
            id: data?.data?.id,
            contestDate: data?.data?.ngayThi,
            contestTimeId: data?.data?.idCaThi,
            roomId: data?.data?.instanceIdPhong,
        }
        if (contestListInfo) {
            await redis.setex(`CONTEST_LIST:${contestListId}`, timeConstants.REDIS_CACHE_SORT_TIME, JSON.stringify(contestListInfo));
        }
        return contestListInfo;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getContestSchedulesAsync = async (studentCode: string, sessionId: string) => {
    try {
        const requestTimestamp = new Date();
        const requestHash = Base64.encode(`${studentCode}&${sessionId}&${requestTimestamp.toISOString()}`);

        const cachedContestSchedules = await redis.get(`CONTEST_SCHEDULE:${studentCode}/${sessionId}`);
        if (cachedContestSchedules) {
            await prisma.statistics.create({
                data: {
                    code: StatisticTypes.ContestSchedule,
                    hash: requestHash,
                    timestamp: requestTimestamp,
                }
            });
            return { success: true, data: JSON.parse(cachedContestSchedules) };
        }
        if (!studentCode || !sessionId) {
            throw new Error('Invalid student code or session id');
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const requestBody = {
            pageInfo: {
                page: 1,
                pageSize: 999999
            },
            sorts: [],
            filters: [
                {
                    filters: [],
                    field: "idNguoiHoc",
                    operator: "eq",
                    value: studentCode
                },
                {
                    filters: [],
                    field: "idHocKy",
                    operator: "eq",
                    value: Number(sessionId)
                }
            ]
        };
        const response = await fetch(`${process.env.API_URL}/gwsg/thi/tbl_thi_sinhvien/getPaged/custom`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(requestBody)
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success) {
            return data;
        }
        const baseContestSchedules: Array<BaseContestSchedule> = data?.data.map((item: any) => ({
            id: item?.id,
            contestId: item?.idDotThi,
            contestReviewId: item?.idToChucThi,
            contestScheduleId: item?.idXepLich,
            subjectId: item?.idHocPhan,
            contestListId: item?.idDanhSachThi,
            studentCode: item?.idNguoiHoc,
            identityNumber: item?.soBaoDanh,
            isPublished: item?.published,
            scoreTypeId: item?.idLoaiDiem,
        }));

        const contestSchedules: Array<ContestSchedule> = await Promise.all(baseContestSchedules.map(async (baseContest: BaseContestSchedule) => {
            try {
                const contestListInfo = await getContestListInfoAsync(baseContest?.contestListId);
                const subjectInfo = await getSubjectInfoAsync(baseContest?.subjectId);
                const contestTimeInfo = await getContestTimeInfoAsync(contestListInfo?.contestTimeId);
                const roomInfo = await getRoomInfoAsync(contestListInfo?.roomId);
                const townInfo = await getTownInfoAsync(roomInfo?.townId);
                const contestSchedule: ContestSchedule = {
                    ...baseContest,
                    contestDate: contestListInfo?.contestDate,
                    subjectName: subjectInfo?.name,
                    credit: subjectInfo?.credit,
                    contestMethodId: contestTimeInfo?.contestMethodId,
                    scoreType: scoreTypes[baseContest?.scoreTypeId as keyof typeof scoreTypes],
                    contestMethod: ContestMethods[contestTimeInfo?.contestMethodId as keyof typeof ContestMethods],
                    contestTime: `Ca ${contestTimeInfo?.name} (${contestTimeInfo?.startTime?.slice(0, -3)} - ${contestTimeInfo?.endTime?.slice(0, -3)})`,
                    townName: townInfo?.name,
                    contestLocation: `${townInfo?.name} - ${locationInstructions[roomInfo?.instructionId as keyof typeof locationInstructions]}`,
                    townFloor: roomInfo?.floor,
                    contestRoom: roomInfo?.name,
                }
                return contestSchedule;
            }
            catch (error) {
                console.log(error);
                return { ...baseContest };
            }
        }));
        if (contestSchedules.length > 0) {
            contestSchedules.sort((a: ContestSchedule, b: ContestSchedule) => {
                return (a?.contestDate ?? 0) < (b?.contestDate ?? 0) ? 1 : -1;
            });
            await redis.setex(`CONTEST_SCHEDULE:${studentCode}/${sessionId}`, timeConstants.REDIS_CACHE_SCHEDULE, JSON.stringify(contestSchedules));
        }

        await prisma.statistics.create({
            data: {
                code: StatisticTypes.ContestSchedule,
                hash: requestHash,
                timestamp: requestTimestamp,
            }
        });
        return { success: true, data: contestSchedules };
    } catch (error) {
        console.log(error);
        return null;
    }
}

export {
    getContestSchedulesAsync
};

