import { LastButNotLeast } from "@/components/Instructions/Instruction";
import { subtitle, title } from "@/components/Primitives";
import ContestScheduleSearch from "@/components/SearchBox/ContestSchedule";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu lịch thi",
  description: "Tra cứu lịch thi sinh viên trường Đại học Vinh hệ chính quy",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(siteConfig?.url ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "Tra cứu lịch thi | VinhUNI Campus",
    description: "Tra cứu lịch thi sinh viên trường Đại học Vinh hệ chính quy",
    siteName: siteConfig.name,
    images: ["https://vinhuni.edu.vn/pages/assets/images/vu-logo.png"],
  },
};

export default function ContestSchedulePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({
          size: "lg",
        })}>Tra cứu&nbsp;</span>
        <span className={title({ color: "violet", size: "lg" })}>Lịch thi&nbsp;</span>
        <br />
        <span className={title({
          size: "lg",
        })}>sinh viên</span>
        <div className={subtitle({ class: "mt-4" })}>
          Áp dụng cho sinh viên trường Đại học Vinh hệ chính quy
        </div>
        <div className="text-center text-xs text-danger-500">
            <p>* Dữ liệu lịch thi không bao gồm các bài kiểm tra do giảng viên tự tổ chức</p>
        </div>
        <div className="mt-4">
          <ContestScheduleSearch />
        </div>
      </div>
      <LastButNotLeast />
    </section>
  );
}
