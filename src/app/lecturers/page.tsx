import { subtitle, title } from "@/components/Primitives";
import LeccturersSearch from "@/components/SearchBox/LecturersSearch";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tra cứu thông tin giảng viên",
  description: "Tra cứu thông tin giảng viên trường Đại học Vinh",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL(siteConfig?.url ?? "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "Tra cứu thông tin giảng viên",
    description: "Tra cứu thông tin giảng viên trường Đại học Vinh",
    siteName: siteConfig.name,
    images: [siteConfig.publicLogoUrl],
  },
};

export default function LecturerPage() {
  return (
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
        <div className="text-center text-xs text-danger-500">
          <Link href="https://vinhuni.edu.vn" target="_blank">
          <p>* Nguồn dữ liệu từ cổng thông tin Trường Đại học Vinh</p>
          </Link>
        </div>
        <div className="mt-4">
         <LeccturersSearch />
        </div>
      </div>
  );
}
