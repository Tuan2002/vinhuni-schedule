import { LastButNotLeast } from "@/components/Instructions/Instruction";
import { subtitle, title } from "@/components/Primitives";
import ScheduleSearch from "@/components/SearchBox/Schedule";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tra cứu thời khóa biểu",
  description: "Tra cứu thời khóa biểu sinh viên trường Đại học Vinh hệ chính quy",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(siteConfig?.url ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "Tra cứu thời khóa biểu | VinhUNI Campus",
    description: "Tra cứu thời khóa biểu sinh viên trường Đại học Vinh hệ chính quy",
    siteName: siteConfig.name,
    images: [siteConfig.publicLogoUrl],
  },
};

export default function SchedulePage() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title({
          size: "lg",
        })}>Tra cứu&nbsp;</span>
        <br />
        <span className={title({ color: "cyan", size: "lg" })}>Thời khóa biểu&nbsp;</span>
        <span className={title({
          size: "lg",
        })}>sinh viên</span>
        <div className={subtitle({ class: "mt-4" })}>
          Áp dụng cho sinh viên trường Đại học Vinh hệ chính quy
        </div>
        <div className="mt-4">
          <ScheduleSearch />
        </div>
      </div>
      <LastButNotLeast />
    </section>
  );
}
