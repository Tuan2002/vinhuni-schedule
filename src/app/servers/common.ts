"use server";
import { timeConstants } from "@/constants";
import redis from "@/libs/redis";
import { SchoolSession, SchoolYear } from "@/types";
import { getAccessToken } from "./auth";

const getSchoolYearsAsync = async () => {
    try {
        const cachedSchoolYears = await redis.get(`SCHOOL_YEARS`);
        if (cachedSchoolYears) {
            return { success: true, data: JSON.parse(cachedSchoolYears) };
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/dbdaotao_chinhquy/tbl_HeThong_NamHoc/`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data?.success) {
            return data;
        }
        const schoolYears: Array<SchoolYear> = data?.data.map((item: any) => ({
            id: item?.id,
            code: item?.code,
            year: item?.nam,
            name: item?.ten,
            startDate: item?.tuNgay,
            endDate: item?.denNgay,
        }));
        await redis.setex(`SCHOOL_YEARS`, timeConstants.REDIS_CACHE_TIME, JSON.stringify(schoolYears));
        return { ...data, data: schoolYears };
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getSchoolSessionsAsync = async (yearCode: string) => {
    try {
        const cachedSchoolSession = await redis.get(`SCHOOL_SESSION:${yearCode}`);
        if (cachedSchoolSession) {
            return { success: true, data: JSON.parse(cachedSchoolSession) };
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/dbdaotao_chinhquy/tbl_HeThong_HocKy/GetAllByFilterByNamHoc?namHoc=${yearCode}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data?.success) {
            return data;
        }
        const schoolSessions: Array<SchoolSession> = data?.data.map((item: any) => ({
            id: item?.id,
            name: item?.ten,
            shoolYearCode: item?.namHoc,
            shortName: item?.tenRutGon,
            startDate: item?.tuNgay,
            endDate: item?.denNgay,
        }));
        await redis.setex(`SCHOOL_SESSION:${yearCode}`, timeConstants.REDIS_CACHE_TIME, JSON.stringify(schoolSessions));
        return { ...data, data: schoolSessions };
    } catch (error) {
        console.log(error);
        return null;
    }
}

export { getSchoolSessionsAsync, getSchoolYearsAsync };

