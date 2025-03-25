"use client";
import { getRequestStatisticAsync } from "@/app/servers/statistic";
import { QueryConfigs } from "@/constants/queryConfig";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import AnimatedNumber from "../AnimateNumber";
import { sectionText } from "../Primitives";

const RequestStatistic = () => {
    const { data: requestStatistic } = useQuery({
        queryKey: ['total-request'],
        queryFn: async () => await getRequestStatisticAsync(),
        placeholderData: keepPreviousData,
        select: (data) => data?.data,
        refetchOnWindowFocus: true,
        refetchInterval: QueryConfigs.QueryInterval
    })

    return (
        <div className="w-full flex items-center justify-center gap-2">
                <span className={sectionText({})}>
                    Tổng TC: <span className={sectionText({
                        color: "pink",
                    })}><AnimatedNumber value={requestStatistic?.totalRequest ?? 0} /> </span>
                </span>
            <span className={sectionText({})}> | </span>
            <span className={sectionText({})}>
                Hôm nay: <span className={sectionText({
                    color: "green",
                })}><AnimatedNumber value={requestStatistic?.todayRequest ?? 0} /> </span>
            </span>
        </div>
    )
}

export default RequestStatistic;
