"use server";
import { timeConstants } from "@/constants";
import redis from "@/libs/redis";
import { MajorInfo, RoomInfo, SchoolSession, SchoolYear, StudentInfo, SubjectInfo, TeacherInfo, TownInfo } from "@/types";
import { v4 as uuidv4 } from 'uuid';
import { getAccessToken } from "./auth";

const getTimeMode = () => {
    const isWinterTime = process.env.WINTER_TIME_MODE === 'true';
    return isWinterTime
}
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

const getStudentInfoAsync = async (studentCode: string) => {
    try {
        const cachedStudentInfo = await redis.get(`STUDENT:${studentCode}`);
        if (cachedStudentInfo) {
            return { success: true, data: JSON.parse(cachedStudentInfo) };
        }
        const accessToken = await getAccessToken();

        if (!accessToken) {
            throw new Error('Failed to get access token');
        }

        const response = await fetch(`${process.env.API_URL}/gwsg/dbnguoihoc/tbl_NguoiHoc_HoSo/GetByCode/${studentCode}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success || !data?.data) {
            return data;
        }
        const studentInfo: StudentInfo = {
            code: data?.data?.code,
            firstName: data?.data?.ho,
            lastName: data?.data?.ten,
            gender: data?.data?.gioiTinh,
            dob: data?.data?.ngaySinh,
            majorCode: data?.data?.idNganh,
            courseCode: data?.data?.idKhoaHoc,
            classId: data?.data?.idLopHanhChinh,
        }
        await redis.setex(`STUDENT:${studentCode}`, timeConstants.REDIS_CACHE_TIME, JSON.stringify(studentInfo));
        return { ...data, data: studentInfo };
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getTeacherInfoAsync = async (teacherCode: string) => {
    try {
        const cachedStudentInfo = await redis.get(`TEACHER:${teacherCode}`);
        if (cachedStudentInfo) {
            return { success: true, data: JSON.parse(cachedStudentInfo) };
        }
        const accessToken = await getAccessToken();

        if (!accessToken) {
            throw new Error('Failed to get access token');
        }

        const response = await fetch(`${process.env.API_URL}/gwsg/dbcanbo/tbl_CANBO_HoSo/GetByCode/${teacherCode}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success) {
            return data;
        }
        const teacherInfo: TeacherInfo = {
            code: data?.data?.code,
            firstName: data?.data?.hS_Ho,
            lastName: data?.data?.hS_Ten,
            dob: data?.data?.ngaySinh,
        }
        await redis.setex(`TEACHER:${teacherCode}`, timeConstants.REDIS_TEACHER_CACHE_TIME, JSON.stringify(teacherInfo));
        return { ...data, data: teacherInfo };
    } catch (error) {
        console.log(error);
        return null;
    }
}

const setNewResultAsync = async (studentCode: string) => {
    const cachedStudentInfo = await redis.get(`STUDENT:${studentCode}`);
    if (!cachedStudentInfo) {
        return { success: false, message: 'Không tìm thấy thông tin sinh viên' };
    }
    const requestId = uuidv4();
    await redis.setex(`RESULT:${requestId}`, timeConstants.REDIS_CACHE_SCHEDULE, cachedStudentInfo);
    return { success: true, requestId: requestId };
}

const getResultAsync = async (requestId: string) => {
    const cachedResult = await redis.get(`RESULT:${requestId}`);
    if (!cachedResult) {
        return { success: false, message: 'Không tìm thấy kết quả' };
    }
    return { success: true, data: JSON.parse(cachedResult) };
}

const getRoomInfoByCodeAsync = async (roomCode?: string) => {
    try {
        const cachedRoomInfo = await redis.get(`ROOM_INFO_CODE:${roomCode}`);
        if (cachedRoomInfo) {
            return JSON.parse(cachedRoomInfo);
        }
        if (!roomCode) {
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
                    field: "code",
                    operator: "eq",
                    value: roomCode
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
            await redis.setex(`ROOM_INFO_CODE:${roomCode}`, timeConstants.REDIS_ROOM_CACHE_TIME, JSON.stringify(roomInfo));
        }
        return roomInfo;
    } catch (error) {
        console.log(error);
        return null;
    }
}
const getMajorInfoAsync = async (majorCode?: string) => {
    try {
        const cachedMajorInfo = await redis.get(`MAJOR:${majorCode}`);
        if (cachedMajorInfo) {
            return { success: true, data: JSON.parse(cachedMajorInfo) };
        }

        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/dbdaotao_chinhquy/tbl_ChuongTrinhDaoTao/GetByCode/${majorCode}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        }
        );
        if (!response.ok) throw new Error(response.statusText);
        const data = await response.json();
        if (!data || !data?.success) {
            return data;
        }
        const majorInfo: MajorInfo = {
            code: data?.data?.code,
            name: data?.data?.ten
        }
        await redis.setex(`MAJOR:${majorCode}`, timeConstants.REDIS_CACHE_TIME, JSON.stringify(majorInfo));
        return { ...data, data: majorInfo };
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getSubjectInfoAsync = async (subjectId: string) => {
    try {
        const cachedSubjectInfo = await redis.get(`SUBJECT:${subjectId}`);
        if (cachedSubjectInfo) {
            return JSON.parse(cachedSubjectInfo);
        }
        if (!subjectId) {
            throw new Error('Invalid subject id');
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/dbdaotao_chinhquy/tbl_HocPhan/${subjectId}`, {
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
        const subjectInfo: SubjectInfo = {
            id: data?.data?.id,
            name: data?.data?.ten,
            credit: data?.data?.soTinChi,
        }
        if (subjectInfo) {
            await redis.setex(`SUBJECT:${subjectId}`, timeConstants.REDIS_CACHE_TIME, JSON.stringify(subjectInfo));
        }
        return subjectInfo
    } catch (error) {
        console.log(error);
        return null;
    }
}

const getTownInfoAsync = async (townId?: number) => {
    try {
        const cachedTownInfo = await redis.get(`TOWN_INFO:${townId}`);
        if (cachedTownInfo) {
            return JSON.parse(cachedTownInfo);
        }
        if (!townId) {
            throw new Error('Invalid town id');
        }
        const accessToken = await getAccessToken();
        if (!accessToken) {
            throw new Error('Failed to get access token');
        }
        const response = await fetch(`${process.env.API_URL}/gwsg/dbtainguyen/tbl_DM_ToaNha/${townId}`, {
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
        const townInfo: TownInfo = {
            id: data?.data?.id,
            name: data?.data?.ten,
        }
        if (townInfo) {
            await redis.setex(`TOWN_INFO:${townId}`, timeConstants.REDIS_ROOM_CACHE_TIME, JSON.stringify(townInfo));
        }
        return townInfo;
    } catch (error) {
        console.log(error);
        return null;
    }
}
export {
    getMajorInfoAsync, getResultAsync, getRoomInfoByCodeAsync, getSchoolSessionsAsync, getSchoolYearsAsync,
    getStudentInfoAsync, getSubjectInfoAsync, getTeacherInfoAsync, getTimeMode, getTownInfoAsync, setNewResultAsync
};

