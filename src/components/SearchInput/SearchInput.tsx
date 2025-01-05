"use client";
import { verifyTurnstileToken } from "@/app/servers/auth";
import { getStudentInfoAsync, setNewResultAsync } from "@/app/servers/schedule";
import { Button } from "@nextui-org/button";
import { Form } from "@nextui-org/form";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Turnstile from 'react-turnstile';

const SearchInput = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [value, setValue] = useState("");
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const router = useRouter();
    const onSubmit = async (e: any) => {
        e.preventDefault();
        if (!turnstileToken) {
            setErrors({ turnstile: "Vui lòng hoàn thành bảo mật" });
            return;
        }
        setIsLoading(true);

        const turnstileResponse = await verifyTurnstileToken(turnstileToken);
        if (!turnstileResponse.success) {
            setErrors({ turnstile: "Lỗi xác thực bảo mật" });
            setIsLoading(false);
            return;
        }

        const res = await getStudentInfoAsync(value);
        if (!res || !res.success) {
            setErrors({ studentCode: "Không tìm thấy thông tin sinh viên" });
            setIsLoading(false);
            return;
        }
        const initCheckRequest = await setNewResultAsync(value);
        if (!initCheckRequest || !initCheckRequest.success) {
            setErrors({ studentCode: "Không tìm thấy kết quả tra cứu" });
            setIsLoading(false);
            return;
        }
        router.push(`/contest-schedule/${initCheckRequest?.requestId}`);
    };
    return (
        <Form onSubmit={onSubmit}
            validationBehavior="native"
            validationErrors={errors}
        >
            <div className="flex flex-col md:flex-row justify-center w-full gap-4">
                <Input
                    placeholder="Nhập mã số sinh viên"
                    size="lg"
                    name="studentCode"
                    isRequired
                    errorMessage={({ validationDetails, validationErrors }) => {
                        if (validationDetails.valueMissing) {
                            return "Vui lòng nhập mã số sinh viên";
                        }
                        return validationErrors;
                    }}
                    value={value}
                    onChange={(e) => {
                        if (errors) {
                            setErrors({});
                        }
                        setValue(e.target.value)
                    }
                    }
                />
                <Button
                    color="primary"
                    size="lg"
                    radius="lg"
                    type="submit"
                    isDisabled={!turnstileToken || isLoading}
                    isLoading={isLoading}
                >
                    Tra cứu
                </Button>
            </div>
            <div className="flex justify-center w-full mt-2">
                <Turnstile
                    sitekey={process.env.NEXT_PUBLIC_CLOUDFLARE_SITE_KEY!}
                    onVerify={(token) => {
                        setTurnstileToken(token)
                        setErrors({
                            ...errors,
                            turnstile: null
                        })
                    }}
                    onExpire={() => setTurnstileToken(null)}
                />
            </div>
        </Form>
    );
};

export default SearchInput;
