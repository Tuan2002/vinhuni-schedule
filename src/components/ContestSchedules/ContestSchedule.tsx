"use client";

import { getSchoolSessionsAsync } from "@/app/servers/common";
import { getContestSchedulesAsync } from "@/app/servers/contest-schedule";
import { title } from "@/components/Primitives";
import StudentInfoCard from "@/components/Students/StudentInfoCard";
import { ContestSchedule, SchoolSession, SchoolYear } from "@/types";
import { Card, CardBody, CardHeader, Chip, Divider, Skeleton } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { Spacer } from "@heroui/spacer";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Image from "next/image";
import { useState } from "react";

interface ContestScheduleProps {
    studentCode: string;
    schoolYears?: Array<SchoolYear>;
    currentYearCode?: string;
    schoolSessions?: Array<SchoolSession>;
    currentSessionId?: number;
}

export default function ContestSchedules({ studentCode, currentYearCode, schoolYears, schoolSessions, currentSessionId }: ContestScheduleProps) {

    const [selectedYear, setSelectedYear] = useState<string | undefined>(currentYearCode);
    const [selectedSession, setSelectedSession] = useState<string | undefined>(String(currentSessionId));

    const { data: schoolSessionsData, isLoading: isSchoolSessionsLoading } = useQuery({
        queryKey: ['schoolSessions', selectedYear],
        queryFn: async () => await getSchoolSessionsAsync(selectedYear!),
        placeholderData: schoolSessions,
        select: (data) => data?.data as Array<SchoolSession>,
        enabled: !!selectedYear,
    })

    const { data: contestSchedules, isFetching: isSchedulesFetching } = useQuery({
        queryKey: ['studentContestSchedules', studentCode, selectedSession],
        queryFn: async () => await getContestSchedulesAsync(studentCode, selectedSession!),
        enabled: !!selectedSession && !!studentCode,
        select: (data) => data?.data as Array<ContestSchedule>
    })

    return (
        <>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title()}>Tra cứu lịch thi</span>
                    <Spacer y={2} />
                    <span className={title({ color: "violet", size: "sm" })}>{studentCode}</span>
                </div>
                <div className="max-w-2xl w-full text-center justify-center">
                    <StudentInfoCard studentCode={studentCode} />
                </div>
                <div className="max-w-2xl w-full flex flex-col md:flex-row gap-2">
                    <Select
                        selectionMode='single'
                        disallowEmptySelection
                        selectedKeys={selectedYear ? [selectedYear] : []}
                        label="Năm học"
                        variant="bordered"
                        placeholder="Chọn năm học"
                        onChange={(e) => {
                            setSelectedYear(e.target.value)
                            setSelectedSession(undefined)
                        }}
                    >
                        {(schoolYears ?? []).map((year) => (
                            <SelectItem textValue={year.name} key={year.code}>{year.name}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Học kỳ"
                        variant="bordered"
                        placeholder="Chọn học kỳ"
                        isLoading={isSchoolSessionsLoading}
                        selectionMode='single'
                        disallowEmptySelection
                        selectedKeys={selectedSession ? [selectedSession] : []}
                        onChange={(e) => setSelectedSession(e.target.value)}
                    >
                        {(schoolSessionsData ?? []).map((session) => (
                            <SelectItem key={session.id} textValue={session.name}>{session.name}</SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="max-w-2xl w-full text-center justify-center">
                    <Card
                        className="overflow-auto border-small border-foreground/10 bg-right-bottom"
                    >
                        <CardHeader className="justify-center">
                            <div className="flex items-center justify-center gap-3">
                                <p className="text-large text-center font-medium">Lịch thi</p>
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody
                            className="flex flex-col gap-4"
                        >
                            {!isSchedulesFetching && (!contestSchedules || contestSchedules?.length == 0) && (
                                <div className="flex items-center justify-center">
                                    <div className="m-auto flex flex-col gap-2 items-center justify-center">
                                        <span>Không có dữ liệu để hiển thị</span>
                                        <Image src="/empty.webp" width={100} height={100} alt="empty" />
                                    </div>
                                </div>
                            )}
                            {isSchedulesFetching && (
                                <>
                                    {[...Array(2)].map((_, index) => (
                                        <Card
                                            key={index}
                                            isBlurred
                                            radius="md"
                                        >
                                            <CardBody>
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                    <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                        <Skeleton className="rounded-lg w-full h-10" />
                                                    </div>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    ))}
                                </>
                            )}
                            {!isSchedulesFetching && contestSchedules?.map((schedule) => (
                                <Card
                                    key={schedule.id}
                                    isBlurred
                                    radius="md"
                                >
                                    <CardBody>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex gap-1 flex-wrap items-center justify-start text-medium font-bold">
                                                <span>Môn thi:  </span>
                                                <span className="text-orange-400">{schedule.subjectName}</span>
                                            </div>
                                            <div className="flex gap-1 flex-wrap items-center justify-start text-medium font-bold">
                                                <span>Hình thức thi:  </span>
                                                <span className="text-pink-500">{schedule.contestMethod}</span>
                                            </div>
                                            <div className="flex gap-1 flex-wrap items-center justify-start text-medium font-bold">
                                                <span>Loại điểm:  </span>
                                                <span className="text-orange-400">{schedule.scoreType}</span>
                                            </div>
                                            <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                <span>Số báo danh:  </span>
                                                <span className="text-blue-500">{schedule?.identityNumber}</span>
                                            </div>
                                            <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                <span>Ngày thi:  </span>
                                                <span className="text-orange-400">{dayjs(schedule?.contestDate).format("DD/MM/YYYY")}</span>
                                            </div>
                                            <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                <span>Ca thi:  </span>
                                                <span className="text-violet-500">{schedule?.contestTime}</span>
                                            </div>
                                            <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                <span>Phòng thi:  </span>
                                                <span className="text-orange-400">{schedule?.contestRoom}</span>
                                            </div>
                                            <div className="flex gap-1 flex-wrap items-center justify-start text-medium font-bold">
                                                <span>Điểm thi:  </span>
                                                <span className="text-blue-500">{schedule?.contestLocation}</span>
                                            </div>
                                            <div className="flex gap-1 items-center justify-start text-medium font-bold">
                                                <span>Trạng thái:  </span>
                                                {schedule?.isPublished ? (
                                                    <Chip color="success" variant="flat">
                                                        Đã công bố
                                                    </Chip>
                                                ) : (
                                                    <Chip color="warning" variant="flat">
                                                        Dự kiến
                                                    </Chip>
                                                )}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </CardBody>
                    </Card>
                </div>
            </section>
        </>
    );
}
