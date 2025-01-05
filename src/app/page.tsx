import { LastButNotLeast } from "@/components/Instructions/Instruction";
import { subtitle, title } from "@/components/Primitives";
import SearchInput from "@/components/SearchInput/SearchInput";

export default function Home() {
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
        })}> Bằng cách đơn giản nhất</span>
        <div className={subtitle({ class: "mt-4" })}>
          Dành cho sinh viên trường Đại học Vinh hệ chính quy
        </div>
        <div className="mt-4">
          <SearchInput />
        </div>
      </div>
      <LastButNotLeast />
    </section>
  );
}
