import { getLecturerInfoAsync } from "@/servers/lecturers";
import LecturerInfoCard from "@/components/Lecturers/LecturerInfo";
import { subtitle, title } from "@/components/Primitives";
import { siteConfig } from "@/config/site";
import { timeConstants } from "@/constants";
import { LecturerInfo } from "@/types";
import memoize from 'memoizee';
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Fragment } from "react";

const getLecturerResult = memoize(getLecturerInfoAsync, {
    maxAge: timeConstants.DEFAULT_MEMOIZE_CACHE_TIME, // clear cache after 1 minute or whatever works for you
    promise: true, // this is important (set to 'true' if your fn returns a promise)
    primitive: true, // this is important (set to 'true' if your fn returns a primitive)
    normalizer: function (args) {
        // args is arguments object as accessible in memoized function
        return JSON.stringify(args[0])
    }
})

export async function generateMetadata(
    { params }: { params: { lecturerId: string } }
): Promise<Metadata> {

    const { lecturerId } = params
    // fetch data
    const res = await getLecturerResult(lecturerId)

    const lecturer = res?.data as LecturerInfo

    return {
        title: lecturer ? `${lecturer.name}` : 'Không tìm thấy thông tin giảng viên',
        description: lecturer && `${lecturer.department}`,
        openGraph: {
            title: lecturer ? `${lecturer.name}` : 'Không tìm thấy thông tin giảng viên',
            description: lecturer && `${lecturer.department}`,
            images: [lecturer?.image ?? siteConfig.publicLogoUrl,
            siteConfig.publicLogoUrl
            ],
        },
    }
}

const LecturerDetailPage = async ({ params }: { params: { lecturerId: string } }) => {

    const { lecturerId } = params
    // fetch data
    const res = await getLecturerResult(lecturerId)

    if (!res || !res?.success) {
        redirect('/lecturers')
    }

    const lecturerData = res?.data as LecturerInfo
    return (
        <Fragment>
            <div className="inline-block max-w-xl text-center justify-center">
                <span className={title({
                    size: "lg",
                })}>Tra cứu&nbsp;</span>
                <span className={title({ size: "lg" })}>thông tin&nbsp;</span>
                <br />
                <span className={title({
                    size: "lg", color: "yellow"
                })}>Giảng viên</span>
                <span className={title({ size: "md" })}> & </span>
                <span className={title({
                    size: "lg", color: "cyan"
                })}>Cán bộ</span>
                <div className={subtitle({ class: "mt-4" })}>
                    Thuộc trường Đại học Vinh dành cho sinh viên và phụ huynh
                </div>
            </div>
            <div className="max-w-2xl w-full text-center justify-center">
                <LecturerInfoCard lecturerData={lecturerData} />
            </div>
        </Fragment>
    )
}

export default LecturerDetailPage