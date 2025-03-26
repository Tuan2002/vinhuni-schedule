import { LastButNotLeast } from "@/components/Instructions/Instruction";
import { subtitle, title } from "@/components/Primitives";
import { Button } from "@heroui/button";
import Link from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({
          size: "lg",
        })}>Tra cứu&nbsp;</span>
        <span className={title({ color: "violet", size: "lg" })}>Lịch thi&nbsp;</span>
        <span className={title({ size: "lg" })}>&</span>
        <br />
        <span className={title({ color: "yellow", size: "lg" })}>Giảng viên&nbsp;</span>
        <span className={title({ size: "lg" })}>&</span>
        <br />
        <span className={title({ color: "blue", size: "lg" })}>Thời khóa biểu&nbsp;</span>
        <span className={title({ size: "lg" })}>&</span>
        <span className={title({
          size: "lg",
        })}> Nhanh, Đơn giản</span>
        <div className={subtitle({ class: "mt-4" })}>
          Dành cho phụ huynh và sinh viên trường Đại học Vinh
        </div>
        <div className="mt-4 flex flex-col sm:flex-row justify-center items-center gap-2">
          <Button as={Link} href="/contest-schedule" fullWidth className={"shadow-sm bg-gradient-to-tr text-white from-[#b95ab6] to-[#b249f8]"} variant="flat">Tra cứu lịch thi</Button>
          <Button as={Link} href="/lecturers" fullWidth className={"shadow-sm bg-gradient-to-tr text-white from-[#FF705B] to-[#FFB457]"} variant="flat">Tra cứu giảng viên</Button>
          {/* <Button as={Link} href="/schedule" fullWidth className={"shadow-sm bg-gradient-to-tr text-white from-[#5EA2EF] to-[#0072F5]"} variant="flat">Tra cứu TKB</Button> */}
          <Button fullWidth color="primary" className={"shadow-sm text-white"} isDisabled variant="solid">
            <div>
              <span className="text-sm">Tra cứu TKB</span>
              <div className="text-xs">(Đang cập nhật)</div>
            </div>
          </Button>
        </div>
        {/* <div className="mt-4">
          <ContestScheduleSearch />
        </div> */}
      </div>
      <LastButNotLeast />
    </section>
  );
}
