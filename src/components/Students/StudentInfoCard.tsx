"use client";

import { getMajorInfoAsync, getStudentInfoAsync } from "@/servers/common";
import { MajorInfo, StudentInfo } from "@/types";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Divider,
    Link,
    Skeleton,
    type CardProps
} from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

interface StudentInfoCardProps {
    studentCode: string;
    props?: CardProps;
}
export default function StudentInfoCard({ studentCode, ...props }: StudentInfoCardProps) {

    const { data: studentInfo, isLoading: isStudentLoading } = useQuery({
        queryKey: ['student', studentCode],
        queryFn: async () => await getStudentInfoAsync(studentCode),
        select: (data) => data?.data as StudentInfo,
        enabled: !!studentCode,
    });

    const { data: majorInfo, isFetched: isMajorFetched } = useQuery({
        queryKey: ['major', studentInfo?.majorCode],
        queryFn: async () => await getMajorInfoAsync(studentInfo?.majorCode),
        select: (data) => data?.data as MajorInfo,
        enabled: !!studentInfo?.majorCode,
    });

    return (
        <Card
            className="overflow-none relative border-small border-foreground/10 bg-right-bottom"
            {...props}
        >
            <CardHeader className="justify-center">
                <div className="flex items-center justify-center gap-3">
                    <p className="text-large text-center font-medium">Thông tin sinh viên</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="px-3">
                <div className="flex flex-col gap-2 px-2">
                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                        <span>Mã sinh viên: </span>
                        <Skeleton className="rounded-lg w-auto" isLoaded={!isStudentLoading}>
                            <span className="text-orange-400">{`${studentInfo?.code}`}</span>
                        </Skeleton>
                    </div>
                    <div className="flex gap-2 items-center justify-start text-medium font-bold">
                        <span>Họ tên: </span>
                        <Skeleton className="rounded-lg w-auto" isLoaded={!isStudentLoading}>
                            <span className="text-violet-500">{`${studentInfo?.firstName} ${studentInfo?.lastName}`}</span>
                        </Skeleton>
                    </div>
                    <div className="flex gap-2 items-center justify-start text-medium font-bold">
                        <span>Khóa đào tạo: </span>
                        <Skeleton className="rounded-lg w-auto" isLoaded={!isStudentLoading}>
                            <span className="text-blue-500">{`${studentInfo?.courseCode}`}</span>
                        </Skeleton>
                    </div>
                    <div className="flex gap-2 items-center justify-start text-medium font-bold">
                        <span>Ngành học: </span>
                        <Skeleton className="rounded-lg w-auto" isLoaded={isMajorFetched}>
                            <span className="text-blue-500">{`${majorInfo?.name}`}</span>
                        </Skeleton>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="justify-end gap-2">
                <Button
                    as={Link}
                    target="_blank"
                    href="https://congsv.vinhuni.edu.vn/sv/main/cong-thong-tin-nguoi-hoc/xem-cap-nhat-ho-so"
                    fullWidth
                    className="border-none text-blue-500 bg-transparent">
                    Mở cổng sinh viên
                </Button>
            </CardFooter>
        </Card>
    );
}
