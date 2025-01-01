import { subtitle, title } from "@/components/primitives";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Tra cứu&nbsp;</span>
        <span className={title({ color: "violet" })}>Lịch thi&nbsp;</span>
        <br />
        <span className={title()}> Bằng cách đơn giản nhất</span>
        <div className={subtitle({ class: "mt-4" })}>
          Dành cho sinh viên trường Đại học Vinh hệ chính quy
        </div>
      </div>
    </section>
  );
}
