import { LecturerInfo } from "@/types";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@heroui/react";
import { sectionText } from "../Primitives";

interface LecturerInfoCardProps {
    lecturerData: LecturerInfo;   
}

const LecturerInfoCard = ({lecturerData}: LecturerInfoCardProps) => {
    return (
        <Card
            className="overflow-none relative border-small border-foreground/10 bg-right-bottom"
        >
            <CardHeader className="justify-center">
                <div className="flex items-center justify-center gap-3">
                    <p className="text-large text-center font-medium">Thông tin giảng viên</p>
                </div>
            </CardHeader>
            <Divider />
            <CardBody className="px-3 flex flex-col gap-2">
                <div className="flex flex-col gap-2 p-2 justify-center items-center">
                    <Avatar showFallback className="w-20 h-20 text-large" src={lecturerData?.image} />
                    <span className={sectionText({
                        size: "md",
                    })}>{lecturerData?.name}</span>
                    <span className={sectionText({
                        color: "pink",
                    })}>{lecturerData?.position}</span>
                </div>
                <Divider />
                <div className="flex flex-col p-3 gap-2">
                    <div className="flex gap-1 flex-wrap items-center justify-start text-medium">
                        <span className={sectionText()}>Đơn vị:  </span>
                        <span className={sectionText({
                            color: "violet",
                        })}>{lecturerData?.department}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap items-center justify-start text-medium">
                        <span className={sectionText()}>Chức vụ:  </span>
                        <span className={sectionText({
                            color: "green",
                        })}>{lecturerData?.position}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap items-center justify-start text-medium">
                        <span className={sectionText()}>Email:  </span>
                        <span className={sectionText({
                            color: "yellow",
                        })}>{lecturerData?.emails.length > 0 ? lecturerData?.emails[0]: "Chưa cập nhật"}</span>
                    </div>
                    <div className="flex gap-1 flex-wrap items-center justify-start text-medium">
                        <span className={sectionText()}>SĐT:  </span>
                        <span className={sectionText({
                            color: "cyan",
                        })}>{lecturerData?.phone ? lecturerData?.phone : "Chưa cập nhật"}</span>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="justify-end gap-2">
                <Button
                    as={Link}
                    target="_blank"
                    href="https://vinhuni.edu.vn"
                    fullWidth
                    className="border-none text-blue-500 bg-transparent text-xs">
                    Nguồn dữ liệu từ trường Đại học Vinh
                </Button>
            </CardFooter>
        </Card>
    );
}

export default LecturerInfoCard;