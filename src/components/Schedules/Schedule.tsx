"use client";

import { getSchoolSessionsAsync } from "@/app/servers/common";
import { getStudentSchedulesAsync } from "@/app/servers/schedule";
import { sectionText, title } from "@/components/Primitives";
import StudentInfoCard from "@/components/Students/StudentInfoCard";
import { DayOfWeek, SchoolSession, SchoolWeek, SchoolYear } from "@/types";
import { Schedule } from "@/types/schedule";
import { getSchoolWeeks, splitDayOfWeek } from "@/utils";
import { Card, CardBody, CardHeader, Chip, Divider, Switch } from "@heroui/react";
import { Select, SelectItem } from "@heroui/select";
import { Spacer } from "@heroui/spacer";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import Image from "next/image";
import { useState } from "react";
import { SnowIcon } from "../Icons/SnowIcon";
import { SunIcon } from "../Icons/SunIcon";
import ScheduleDayCard from "../Students/ScheduleDayCard";

interface ScheduleProps {
    studentCode: string;
    schoolYears?: Array<SchoolYear>;
    currentYearCode?: string;
    schoolSessions?: Array<SchoolSession>;
    schoolWeeks?: Array<SchoolWeek>;
    currentWeek?: SchoolWeek;
    currentSessionId?: number;
    isDefaultWinterTime?: boolean;
}


dayjs.extend(customParseFormat);
export default function Schedules({ studentCode, currentYearCode, schoolYears, schoolSessions, schoolWeeks, currentWeek, currentSessionId, isDefaultWinterTime }: ScheduleProps) {

    const [selectedYear, setSelectedYear] = useState<string | undefined>(currentYearCode);
    const [selectedSession, setSelectedSession] = useState<string | undefined>(String(currentSessionId));
    const [selectedWeekId, setSelectedWeekId] = useState<string | undefined>(currentWeek?.weekId);
    const [selectedWeek, setSelectedWeek] = useState<SchoolWeek | undefined>(currentWeek);
    const [daysOfWeek, setDaysOfWeek] = useState<Array<DayOfWeek> | undefined>(() => {
        return splitDayOfWeek(currentWeek?.startDate, currentWeek?.endDate);
    });
    const [isWinterTime, setIsWinterTime] = useState<boolean>(isDefaultWinterTime ?? false);

    const { data: schoolSessionsData, isLoading: isSchoolSessionsLoading } = useQuery({
        queryKey: ['schoolSessions', selectedYear],
        queryFn: async () => await getSchoolSessionsAsync(selectedYear!),
        placeholderData: schoolSessions,
        select: (data) => data?.data as Array<SchoolSession>,
        enabled: !!selectedYear,
    })

    const { data: schoolWeeksData, isLoading: isSchoolWeeksLoading } = useQuery({
        queryKey: ['schoolWeeks', selectedSession],
        queryFn: () => {
            const session = schoolSessionsData?.find((item) => item.id === Number(selectedSession))
            return getSchoolWeeks(session?.startDate, session?.endDate)
        },
        placeholderData: schoolWeeks,
        select: (data) => data as Array<SchoolWeek>,
        enabled: !!selectedSession,
    })

    const { data: schedulesGroupped, isFetching: isSchedulesFetching } = useQuery({
        queryKey: ['student-chedules', studentCode, selectedSession, selectedWeek?.startDate.getTime(), selectedWeek?.endDate.getTime()],
        queryFn: async () => await getStudentSchedulesAsync(studentCode, selectedSession!, selectedWeek?.startDate, selectedWeek?.endDate),
        enabled: !!selectedSession && !!studentCode && !!selectedWeek,
        select: (data) => data?.data as any,
    })

    const { data: todaySchedules } = useQuery({
        queryKey: ['student-today-chedules', studentCode, selectedSession, selectedWeek?.startDate.getTime(), selectedWeek?.endDate.getTime()],
        queryFn: () => {
            const todayIndex = daysOfWeek?.findIndex((day) => day.isToday);
            return todayIndex !== undefined && todayIndex >= 0 ? schedulesGroupped?.[todayIndex] : null;
        },
        enabled: !!schedulesGroupped && !!daysOfWeek,
        select: (data) => data as Schedule[],
    })
    return (
        <>
            <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title()}>Tra cứu thời khóa biểu</span>
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
                            setSelectedWeekId(undefined)
                            setSelectedWeek(undefined)
                            setDaysOfWeek(undefined)
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
                        onChange={(e) => {
                            setSelectedSession(e.target.value)
                            setSelectedWeekId(undefined)
                            setSelectedWeek(undefined)
                            setDaysOfWeek(undefined)
                        }}
                    >
                        {(schoolSessionsData ?? []).map((session) => (
                            <SelectItem key={session.id} textValue={session.name}>{session.name}</SelectItem>
                        ))}
                    </Select>
                    <Select
                        label="Tuần học"
                        variant="bordered"
                        placeholder="Chọn tuần học"
                        isLoading={isSchoolWeeksLoading}
                        selectionMode='single'
                        disallowEmptySelection
                        selectedKeys={selectedWeekId ? [selectedWeekId] : []}
                        onChange={(e) => {
                            setSelectedWeekId(e.target.value)
                            const week = schoolWeeksData?.find((item) => item.weekId === e.target.value)
                            setSelectedWeek(week)
                            if (week) {
                                const days = splitDayOfWeek(week.startDate, week.endDate)
                                setDaysOfWeek(days)
                            }
                        }}
                    >
                        {(schoolWeeksData ?? []).map((week, index) => (
                            <SelectItem key={week.weekId} textValue={`Tuần ${index + 1}`}>
                                <div className="flex flex-col">
                                    <span className="text-small">{`Tuần ${index + 1}`}</span>
                                    <span className="text-xs text-default-400">{`${dayjs(week.startDate).format("DD/MM/YYYY")} - ${dayjs(week.endDate).format("DD/MM/YYYY")}`}</span>
                                </div>
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-sm text-default-500">Giờ mùa hè</span>
                    <Switch
                        isSelected={isWinterTime}
                        color="secondary"
                        size="lg"
                        onValueChange={setIsWinterTime}
                        thumbIcon={({ isSelected, className }) =>
                            isSelected ? <SnowIcon className={className} /> : <SunIcon className={className} />
                        }
                    />
                    <span className="text-sm text-default-500">Giờ mùa đông</span>
                </div>
                {
                    daysOfWeek && daysOfWeek.length > 0 ? (
                        <div className="max-w-2xl w-full text-center flex flex-col items-center justify-center gap-2">
                            {
                                schedulesGroupped && todaySchedules && (
                                    <Card
                                        className="overflow-auto border-small w-full border-foreground/10 bg-right-bottom"
                                    >
                                        <CardHeader className="justify-center">
                                            <div className="flex items-center justify-center gap-3">
                                                <p className="text-large text-center font-medium">Lịch học hôm nay</p>
                                            </div>
                                        </CardHeader>
                                        <Divider />
                                        <CardBody
                                            className="flex flex-col gap-4"
                                        >
                                            <ScheduleDayCard
                                                scheduleData={todaySchedules}
                                                isWinterTime={isWinterTime}
                                                isLoading={isSchedulesFetching}
                                            ></ScheduleDayCard>
                                        </CardBody>
                                    </Card>
                                )
                            }
                            <Card
                                radius="sm"
                                className="overflow-auto text-center w-full border-small border-foreground/10 bg-right-bottom"
                            >
                                <CardBody>
                                    <p className="text-small text-center">Thời khóa biểu tuần {selectedWeekId}</p>
                                </CardBody>
                            </Card>
                            {daysOfWeek?.map((day, index) => (
                                <Card
                                    key={index}
                                    className="overflow-auto w-full border-small border-foreground/10 bg-right-bottom"
                                >
                                    <CardHeader className="justify-center w-full">
                                        <div className="flex items-center justify-between gap-3 w-full">
                                            <Chip size="md" variant="flat" color={day.isToday ? "success" : day.isSunday ? "danger" : "secondary"}>
                                                {day.label}
                                            </Chip>
                                            <span className={sectionText({ color: "violet" })}>{dayjs(day.date).format('DD/MM/YYYY')}</span>
                                        </div>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody
                                        className="flex flex-col gap-4"
                                    >
                                        <ScheduleDayCard
                                            scheduleData={schedulesGroupped?.[index] as Schedule[]}
                                            isWinterTime={isWinterTime}
                                            isLoading={isSchedulesFetching}
                                        ></ScheduleDayCard>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="max-w-2xl w-full text-center justify-center">
                            <Card
                                className="overflow-auto border-small border-foreground/10 bg-right-bottom"
                            >
                                <CardHeader className="justify-center">
                                    <div className="flex items-center justify-center gap-3">
                                        <p className="text-large text-center font-medium">Thời khóa biểu</p>
                                    </div>
                                </CardHeader>
                                <Divider />
                                <CardBody
                                    className="flex flex-col gap-4"
                                >
                                    <div className="flex items-center justify-center">
                                        <div className="m-auto flex flex-col gap-2 items-center justify-center">
                                            <span>Không có dữ liệu để hiển thị</span>
                                            <Image src="/empty.webp" width={100} height={100} alt="empty" />
                                        </div>
                                    </div>
                                </CardBody>`
                            </Card>
                        </div>
                    )
                }

            </section>
        </>
    );
}
