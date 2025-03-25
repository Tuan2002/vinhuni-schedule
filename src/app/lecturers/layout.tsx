import { LastButNotLeast } from "@/components/Instructions/Instruction";
import { Fragment } from "react";

export default function LecturerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
            <Fragment>
                {children}
            </Fragment>
            <LastButNotLeast />
        </section>
    );
}