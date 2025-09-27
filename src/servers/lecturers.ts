"use server";
import { QueryConfigs } from "@/constants/queryConfig";
import { StatisticTypes } from "@/constants/statisticTypes";
import { prisma } from "@/libs/prisma";
import { BaseLecturerInfo, LecturerInfo } from "@/types";
import { Base64 } from "js-base64";
const getLecturersAsync = async (search: string) => {
    try {
        const lecturers = await prisma.lecturers.findMany({
            where: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
            select: {
                id: true,
                name: true,
                department: true,
                position: true,
                image: true,
            },
            take: QueryConfigs.LimitSearchResult
        });
        const requestTimestamp = new Date();
        const requestHash = Base64.encode(`${search}&${requestTimestamp.toISOString()}`);
        await prisma.statistics.create({
            data: {
                code: StatisticTypes.LecturerSearch,
                hash: requestHash,
                timestamp: requestTimestamp,
            }
        });

        if (!lecturers || lecturers?.length === 0) {
            return { success: false, data: null };
        }
        return { success: true, data: lecturers as BaseLecturerInfo[] };

    } catch (error) {
        console.log(error);
        return null;
    }

}

const getLecturerInfoAsync = async (lecturerId: string) => {
    try {
        const lecturer = await prisma.lecturers.findUniqueOrThrow({
            where: {
                id: lecturerId,
            },
        });
        
        const requestTimestamp = new Date();
        const requestHash = Base64.encode(`${lecturerId}&${lecturer?.name}&${requestTimestamp.toISOString()}`);
        await prisma.statistics.create({
            data: {
                code: StatisticTypes.LecturerView,
                hash: requestHash,
                timestamp: requestTimestamp,
            }
        });

        if (!lecturer) {
            return { success: false, data: null };
        }
        return { success: true, data: lecturer as LecturerInfo };
        
    } catch (error) {
        console.log(error);
        return null;
    }
}
export { getLecturerInfoAsync, getLecturersAsync };

