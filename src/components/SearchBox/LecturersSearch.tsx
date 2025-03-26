"use client";
import { getLecturersAsync } from "@/app/servers/lecturers";
import { BaseLecturerInfo } from "@/types";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast, Avatar, Card, CardBody, CardHeader, Divider, Listbox, ListboxItem } from "@heroui/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowForwardIcon } from "../Icons";

const LeccturersSearch = () => {
    const [errors, setErrors] = useState({});
    const [value, setValue] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [lecturers, setLecturers] = useState<BaseLecturerInfo[] | null>(null);

    const onSubmit = async (e: any) => {
        e.preventDefault();   
        setIsSearching(true);
        const res = await getLecturersAsync(value);
        if (!res?.success || !res?.data) {
            addToast({
                timeout: 5000,
                title: "Không tìm thấy thông tin",
                description: "Không có giảng viên nào khớp với từ khóa bạn đã nhập",
                variant: "flat",
                color: "danger",
            });
            setErrors({ lecturerName: "Không tìm thấy thông tin giảng viên" });
            setIsSearching(false);
            return;
        }
        setLecturers(res?.data);
        setIsSearching(false);
    };
    return (
        <>
            <Form onSubmit={onSubmit}
                validationBehavior="native"
                validationErrors={errors}
                aria-labelledby="search-lecturer-form"
            >
                <div className="flex flex-col md:flex-row justify-center w-full gap-4">
                    <Input
                        placeholder="Nhập tên giảng viên"
                        size="lg"
                        aria-labelledby="search-lecturer"
                        name="lecturerName"
                        isRequired
                        errorMessage={({ validationDetails, validationErrors }) => {
                            if (validationDetails.valueMissing) {
                                return "Vui lòng nhập tên giảng viên";
                            }
                            return validationErrors;
                        }}
                        value={value}
                        onChange={(e) => {
                            lecturers && setLecturers(null);
                            errors && setErrors({});
                            setValue(e.target.value)
                        }
                        }
                    />
                    <Button
                        color="primary"
                        size="lg"
                        radius="lg"
                        type="submit"
                        aria-labelledby="search-lecturer-button"
                        isDisabled={isSearching}
                        isLoading={isSearching}
                    >
                        Tra cứu
                    </Button>
                </div>
            </Form>
            {
                lecturers && (
                    <div className="mt-8 w-full">
                        <Card
                            isBlurred
                            className="overflow-auto border-small border-foreground/10 bg-transparent"
                        >
                            <CardHeader className="justify-center">
                                <div className="flex items-center justify-center gap-3">
                                    <p className="text-large text-center text-default-500 font-medium">Kết quả tra cứu</p>
                                </div>
                            </CardHeader>
                            <Divider />
                            <CardBody
                                className="p-2 w-full"
                            >
                                {
                                    lecturers && lecturers?.length > 0 ? (
                                        <Listbox>
                                            {
                                                lecturers.map((lecturer) => (
                                                    <ListboxItem key={lecturer.id} as={Link} href={`/lecturers/${lecturer.id}`}>
                                                        <div key={lecturer.id} className="flex items-center justify-between" aria-labelledby="lecturer-info">
                                                            <div className="flex gap-2 items-center">
                                                                <Avatar
                                                                    showFallback
                                                                    alt={lecturer.name}
                                                                    className="flex-shrink-0"
                                                                    size="sm"
                                                                    aria-labelledby="lecturer-avatar"
                                                                    src={lecturer?.image} />
                                                                <div className="flex flex-col">
                                                                    <span className="text-small" aria-labelledby={lecturer.name}>{lecturer.name}</span>
                                                                    <span className="text-tiny text-default-400" aria-labelledby={lecturer.position}>Chức vụ: {lecturer.position}</span>
                                                                    <span className="text-tiny text-default-400" aria-labelledby={lecturer.department}>{lecturer.department}</span>
                                                                </div>
                                                            </div>
                                                            <Button isIconOnly aria-label="view" radius="full" color="secondary" variant="light">
                                                                <ArrowForwardIcon />
                                                            </Button>
                                                        </div>
                                                    </ListboxItem>
                                                ))
                                            }
                                        </Listbox>
                                    ) : (
                                        <div className="flex items-center justify-center">
                                            <div className="m-auto flex flex-col gap-2 items-center justify-center">
                                                <span>Không có dữ liệu để hiển thị</span>
                                                <Image src="/empty.webp" width={100} height={100} alt="empty" />
                                            </div>
                                        </div>
                                    )
                                }
                            </CardBody>
                        </Card>
                    </div>
                )
            }
        </>
    );
};

export default LeccturersSearch;
