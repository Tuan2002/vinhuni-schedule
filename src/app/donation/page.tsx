import { Metadata } from "next";
import { Donation } from "@/components/Donation/Donation";

export const metadata: Metadata = {
  title: "Ủng hộ - VinhUni Schedule",
  description: "Ủng hộ trang web để duy trì và phát triển các tính năng mới",
};

export default function DonationPage() {
  return <Donation />;
}