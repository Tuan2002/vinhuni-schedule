'use client'
import { Schedule } from "@/types/schedule";
import { Card, CardBody, Chip, Skeleton } from "@heroui/react";
import dayjs from "dayjs";
import Image from "next/image";
import { sectionText } from "../Primitives";

interface ScheduleDayCardProps {
    scheduleData?: Schedule[];
    isWinterTime?: boolean;
    isLoading?: boolean;
}

export default function ScheduleDayCard({ scheduleData, isWinterTime, isLoading }: ScheduleDayCardProps) {
    return (
        <>
            {
                scheduleData && scheduleData.length > 0 ? (
                    scheduleData?.map((schedule, index) => (
                        <Card
                            key={index}
                            isBlurred
                            className="border-none bg-default-100/80"
                            shadow="sm"
                        >
                            <CardBody>
                                <div className="flex flex-col gap-1">
                                    <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                        <span className={sectionText({ color: "violet" })}>{schedule.className}</span>
                                    </Skeleton>
                                    <div className="flex items-center gap-2">
                                        <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                            <span className={sectionText({ color: "yellow" })}>Tiết: {`${schedule.lessionIndex + 1} - ${schedule.lessionIndex + schedule.lessionCount}`}   {`(${isWinterTime ? dayjs(schedule.startTime, 'HH:mm:ss').add(30, 'minute').format('HH:mm') : dayjs(schedule.startTime, 'HH:mm:ss').format('HH:mm')} - ${isWinterTime ? dayjs(schedule.endTime, 'HH:mm:ss').add(30, 'minute').format('HH:mm') : dayjs(schedule.endTime, 'HH:mm:ss').format('HH:mm')})`} &nbsp;</span>
                                            <Chip size="sm" variant="flat" color={schedule.lessionIndex < 5 ? "success" : schedule.lessionIndex < 10 ? "warning" : "danger"}>
                                                {schedule.lessionIndex < 5 ? "Buổi sáng" : schedule.lessionIndex < 10 ? "Buổi chiều" : "Buổi tối"}
                                            </Chip>
                                        </Skeleton>
                                    </div>
                                    <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                        <span className={sectionText({ color: "green" })}>Phòng học: {schedule?.roomName}</span>
                                    </Skeleton>
                                    <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                        <span className={sectionText({ color: "blue" })}>Vị trí: {schedule?.classLocation}</span>
                                    </Skeleton>
                                    <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                        <span className={sectionText({ color: "pink" })}>GV: {schedule?.teacherName}</span>
                                    </Skeleton>
                                </div>
                            </CardBody>
                        </Card>
                    ))
                ) : isLoading ? (
                    <Card
                        isBlurred
                        className="border-none bg-default-100/80"
                        shadow="sm"
                    >
                        <CardBody>
                            <div className="flex flex-col gap-1">
                                <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                    <span>Đang tải...</span>
                                </Skeleton>
                                <div className="flex items-center gap-2">
                                    <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                        <span>Đang tải... &nbsp;</span>
                                    </Skeleton>
                                </div>
                                <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                    <span>Đang tải...</span>
                                </Skeleton>
                                <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                    <span>Đang tải...</span>
                                </Skeleton>
                                <Skeleton className="rounded-lg w-auto" isLoaded={!isLoading}>
                                    <span>Đang tải...</span>
                                </Skeleton>
                            </div>
                        </CardBody>
                    </Card>
                )
                    :
                    (
                        <div className="flex items-center justify-center">
                            <div className="m-auto flex flex-col gap-2 items-center justify-center">
                                <span>Không có lịch học</span>
                                <Image src="/empty.webp" width={100} height={100} alt="empty" />
                            </div>
                        </div>
                    )
            }
        </>
    )
}
