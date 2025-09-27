import { getMajorInfoAsync, getResultAsync, getSchoolSessionsAsync, getSchoolYearsAsync, getStudentInfoAsync } from "@/servers/common";
import { getContestSchedulesAsync } from "@/servers/contest-schedule";
import ContestSchedules from "@/components/ContestSchedules/ContestSchedule";
import { siteConfig } from "@/config/site";
import { timeConstants } from "@/constants";
import { SchoolSession, SchoolYear, StudentInfo } from "@/types";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import memoize from 'memoizee';
import { Metadata } from "next";
import { redirect } from "next/navigation";

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
        title: student ? `Kết quả tra cứu lịch thi: ${student?.code}` : 'Không tìm thấy kết quả tra cứu',
        description: student && `Thông tin sinh viên: ${student.firstName} ${student.lastName}`,
        openGraph: {
            title: student ? `Kết quả tra cứu lịch thi: ${student?.code}` : 'Không tìm thấy kết quả tra cứu',
            description: student && `Thông tin sinh viên: ${student.firstName} ${student.lastName}`,
            images: [siteConfig.publicLogoUrl],
    }
}
}

const ContestScheduleDetailPage = async ({ params }: { params: { requestId: string } }) => {

    const queryClient = new QueryClient()

    // fetch data
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

    if (currentSession) {
        await queryClient.prefetchQuery({
            queryKey: ['studentContestSchedules', studentData?.code, currentSession?.id],
            queryFn: async () => await getContestSchedulesAsync(studentData?.code, String(currentSession?.id)),
        })
    }
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <ContestSchedules
                studentCode={studentData?.code}
                currentSessionId={currentSession?.id}
                currentYearCode={currentYear?.code}
                schoolSessions={schoolSessionsData}
                schoolYears={schoolYearsData}
            />
        </HydrationBoundary>
    )
}

export default ContestScheduleDetailPage
