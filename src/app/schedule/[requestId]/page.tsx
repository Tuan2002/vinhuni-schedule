import { getMajorInfoAsync, getResultAsync, getSchoolSessionsAsync, getSchoolYearsAsync, getStudentInfoAsync, getTimeMode } from "@/app/servers/common";
import { getStudentSchedulesAsync } from "@/app/servers/schedule";
import Schedules from "@/components/Schedules/Schedule";
import { siteConfig } from "@/config/site";
import { timeConstants } from "@/constants";
import { SchoolSession, SchoolWeek, SchoolYear, StudentInfo } from "@/types";
import { getSchoolWeeks } from "@/utils";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import isBetween from 'dayjs/plugin/isBetween';
import memoize from 'memoizee';
import { redirect } from "next/navigation";
import { Metadata } from "next/types";

dayjs.extend(isBetween);
const getResult = memoize(getResultAsync, {
    maxAge: timeConstants.DEFAULT_MEMOIZE_CACHE_TIME, // clear cache after 1 minute or whatever works for you
    promise: true, // this is important (set to 'true' if your fn returns a promise)
    primitive: true, // this is important (set to 'true' if your fn returns a primitive)
    normalizer: function (args) {
        // args is arguments object as accessible in memoized function
        return JSON.stringify(args[0])
    }
})

export async function generateMetadata(
    { params }: { params: { requestId: string } }
): Promise<Metadata> {

    const { requestId } = params
    // fetch data
    const res = await getResult(requestId)
    const student = res?.data as StudentInfo

    return {
        title: student ? `Kết quả tra cứu lịch học: ${student?.code}` : 'Không tìm thấy kết quả tra cứu',
        description: student && `Thông tin thời khóa biểu`,
        openGraph: {
            title: student ? `Kết quả tra cứu lịch học: ${student?.code}` : 'Không tìm thấy kết quả tra cứu',
            description: student && `Thông tin thời khóa biểu`,
            images: [siteConfig.publicLogoUrl],
        }
    }
}

const ScheduleDetailPage = async ({ params }: { params: { requestId: string } }) => {

    const queryClient = new QueryClient()

    const res = await getResult(params?.requestId)
    const studentRequest = res?.data as StudentInfo

    if (!studentRequest) {
        redirect('/')
    }

    await queryClient.prefetchQuery({
        queryKey: ['student', studentRequest?.code],
        queryFn: async () => await getStudentInfoAsync(studentRequest?.code),
    })

    const studentQuery: any = queryClient.getQueryData(['student', studentRequest?.code])

    if (!studentQuery || !studentQuery?.success) {
        redirect('/')
    }

    const studentData = studentQuery?.data as StudentInfo
    if (studentData?.majorCode) {
        await queryClient.prefetchQuery({
            queryKey: ['major', studentData?.majorCode],
            queryFn: async () => await getMajorInfoAsync(studentData.majorCode),
        })
    }

    await queryClient.prefetchQuery({
        queryKey: ['schoolYears'],
        queryFn: async () => await getSchoolYearsAsync(),
    })

    const schoolYearsQuery: any = queryClient.getQueryData(['schoolYears'])
    const schoolYearsData = schoolYearsQuery?.data as Array<SchoolYear>

    const currentYear = schoolYearsData?.reverse()?.find((item: SchoolYear) => {
        const today = new Date()
        const startDate = new Date(item?.startDate)
        const endDate = new Date(item?.endDate)
        return today >= startDate && today <= endDate && item.year
    })
    if (currentYear) {
        await queryClient.prefetchQuery({
            queryKey: ['schoolSessions', currentYear?.code],
            queryFn: async () => await getSchoolSessionsAsync(currentYear?.code),
        })
    }

    const schoolSessionsQuery: any = queryClient.getQueryData(['schoolSessions', currentYear?.code])
    const schoolSessionsData = schoolSessionsQuery?.data as Array<SchoolSession>
    const currentSession = schoolSessionsData?.find((item: SchoolSession) => {
        const today = new Date()
        const startDate = new Date(item?.startDate)
        const endDate = new Date(item?.endDate)
        return today >= startDate && today <= endDate
    })
    // const studentData = studentQuery?.data as StudentInfo
    if (currentSession) {
        await queryClient.prefetchQuery({
            queryKey: ['schoolWeeks', currentSession?.id],
            queryFn: () => getSchoolWeeks(currentSession?.startDate, currentSession?.endDate),
        })
    }
    const schoolWeeksData: SchoolWeek[] | undefined = queryClient.getQueryData(['schoolWeeks', currentSession?.id])
    const currentWeek = schoolWeeksData?.find((item) => {
        const today = dayjs().startOf('day'); // Set today to the start of the day
        const startDate = dayjs(item?.startDate).startOf('day'); // Set start date to the start of the day
        const endDate = dayjs(item?.endDate).endOf('day'); // Set end date to the end of the day

        return today.isBetween(startDate, endDate, null, '[]'); 
    })

    console.log('currentWeek', currentWeek)

    if (currentSession && currentWeek) {
        await queryClient.prefetchQuery({
            queryKey: ['student-schedules', studentData?.code, currentSession?.id, currentWeek?.startDate.getTime(), currentWeek?.endDate.getTime()],
            queryFn: async () => await getStudentSchedulesAsync(studentData?.code, String(currentSession?.id), currentWeek?.startDate, currentWeek?.endDate),
        })
    }
    const isWinterTime = getTimeMode()
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Schedules
                studentCode={studentData?.code}
                currentSessionId={currentSession?.id}
                currentYearCode={currentYear?.code}
                schoolSessions={schoolSessionsData}
                currentWeek={currentWeek}
                schoolWeeks={schoolWeeksData}
                schoolYears={schoolYearsData}
                isDefaultWinterTime={isWinterTime}
            />
        </HydrationBoundary>
    )
}

export default ScheduleDetailPage
