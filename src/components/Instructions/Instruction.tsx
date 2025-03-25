/* eslint-disable react/display-name */

import { FeaturesGrid } from "@/components/Marketing/features-grid";
import { sectionWrapper, subtitle, title, titleWrapper } from "@/components/Primitives";
import landingContent from "@/contents/landing/index";

export const LastButNotLeast = () => {
    return (
        <section className={sectionWrapper({ class: "mt-12 lg:mt-44" })}>
            <div className="flex flex-col gap-0 md:gap-8">
                <div>
                    <div className={titleWrapper({ class: "items-center" })}>
                        <div>
                            <h1 className={title({ size: "lg" })}>{new Date().getFullYear() - 1960} năm </h1>
                            <h1 className={title({ color: "yellow", size: "lg" })}>Kiến tạo </h1>
                        </div>
                        <div>
                            <h1 className={title({ size: "lg" })}>kết nối </h1>
                            <h1 className={title({ size: "lg", color: "pink" })}>Tương lai</h1>
                        </div>
                    </div>
                    <p
                        className={subtitle({
                            class: "mt-4 md:w-full text-center flex justify-center items-center",
                        })}
                    >
                        Phấn đấu trở thành Đại học thông minh thuộc TOP 500 châu Á vào năm 2030
                    </p>
                </div>
                <FeaturesGrid features={landingContent.topFeatures} />
            </div>
        </section>
    );
};
