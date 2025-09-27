"use server";
import { prisma } from "@/libs/prisma";

const getRequestStatisticAsync = async () => {
    try {
        const totalRequest = await prisma.statistics.count();
        const todayRequest = await prisma.statistics.count({
            where: {
                timestamp: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                    lte: new Date(new Date().setHours(23, 59, 59, 999)),
                },
            },
        });
        // const todayRequest = Math.random() * 100000;
        // const totalRequest = Math.random() * 1000000;
        return {
            success: true, data: {
                totalRequest,
                todayRequest,
            }
        };
    }
    catch (error) {
        console.log(error);
        return null;
    }
}

export { getRequestStatisticAsync };
