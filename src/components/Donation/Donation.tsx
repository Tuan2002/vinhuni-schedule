"use client";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Image,
  Link,
  Snippet
} from "@heroui/react";
import { useState, useEffect } from "react";

interface GitHubStats {
  stargazers_count: number;
  forks_count: number;
}

export function Donation() {
  const [githubStats, setGithubStats] = useState<GitHubStats | null>(null);
  const bankAccount = "19072900211017";
  const accountName = "NGUYEN NGOC ANH TUAN";
  const mezonRepoUrl = "https://github.com/mezonai/mezon";

  useEffect(() => {
    // Fetch GitHub stats for Mezon repository
    fetch("https://api.github.com/repos/mezonai/mezon")
      .then((res) => res.json())
      .then((data: GitHubStats) => {
        setGithubStats(data);
      })
      .catch(() => {
        setGithubStats({ stargazers_count: 0, forks_count: 0 });
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header with Qoobee */}
      <div className="text-center mb-8">
        <div className="flex justify-center items-center gap-4 mb-4">
          <div className="text-6xl animate-pulse delay-100">💝</div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Ủng hộ nhà phát triển
        </h1>
      </div>

      {/* Main Content */}
      <Card className="mb-8 shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
        <CardBody className="text-center py-6 px-4">
          <p className="text-md leading-relaxed text-gray-700 dark:text-gray-300 mb-4">
            Trang web này thuộc sở hữu cá nhân, miễn phí và không chứa quảng cáo.
            Nên nếu cảm thấy hữu ích, bạn có thể giúp mình ly cà phê để có
            kinh phí duy trì trang web nhé!
          </p>
          <div className="flex justify-center items-center gap-2">
            <span className="text-2xl animate-spin">🌸</span>
            <span className="text-md text-pink-600 dark:text-pink-400 font-medium">
              Cảm ơn bạn rất nhiều!
            </span>
            <span className="text-2xl animate-spin">🌸</span>
          </div>
        </CardBody>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* QR Code Donation */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-center items-center gap-2 mb-2 w-full">
              <span className="text-2xl">☕</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Mua cà phê
              </h3>
              <span className="text-2xl">☕</span>
            </div>
          </CardHeader>
          <CardBody className="text-center px-6">
            <div className="mb-6 flex justify-center">
              <Image
                src="/qr-bank.jpg"
                alt="QR Code for bank transfer"
                className="rounded-lg shadow-lg object-contain"
                width={240}
                height={240}
                classNames={{
                  wrapper: "flex justify-center",
                  img: "max-w-full h-auto"
                }}
              />
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex justify-center items-center gap-2">
                <span className="font-medium text-gray-700 dark:text-gray-300 text-center">
                  {accountName}
                </span>
              </div>

              <div className="flex justify-center">
                <Snippet
                  color="secondary"
                  variant="flat"
                  className="text-center max-w-fit"
                >
                  {bankAccount}
                </Snippet>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex justify-center items-center gap-1 mb-2 text-center">
                <span>Quét mã QR để ủng hộ mình nhé!</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* GitHub Star */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 transition-all duration-300">
          <CardHeader className="pb-2">
            <div className="flex justify-center items-center gap-2 mb-2 w-full">
              <span className="text-2xl">⭐</span>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                Ủng hộ tinh thần
              </h3>
              <span className="text-2xl">⭐</span>
            </div>
          </CardHeader>
          <CardBody className="text-center px-6">
            <div className="mb-6 flex justify-center">
              <Image
                src="/mezon-logo.webp"
                alt="Mezon Logo"
                className="rounded-lg shadow-lg object-contain"
                width={120}
                height={120}
                classNames={{
                  wrapper: "flex justify-center",
                  img: "max-w-full h-auto"
                }}
              />
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              Bạn có thể ủng hộ tinh thần cho mình bằng cách để lại một sao trên
              GitHub cho ứng dụng của chúng mình nhé, cảm ơn bạn rất nhiều!
            </p>
            {githubStats && (
              <div className="flex justify-center gap-4 mb-6">
                <div className="flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-full">
                  <span className="text-yellow-500">⭐</span>
                  <span className="font-semibold">{githubStats.stargazers_count}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">stars</span>
                </div>
              </div>
            )}

            <Button
              as={Link}
              href={mezonRepoUrl}
              target="_blank"
              rel="noopener noreferrer"
              color="primary"
              variant="shadow"
              size="lg"
              className="mb-4 font-semibold"
              startContent={<span className="text-xl">⭐</span>}
            >
              Star trên GitHub
            </Button>

            <div className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              <div className="flex justify-center items-center gap-1 mb-2 text-center">
                <span>Mezon - Ứng dụng chat dành cho công việc</span>
              </div>
              <div className="flex justify-center items-center gap-1 text-center">
                <span>Mỗi sao là một động lực lớn!</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Footer */}
      <div className="text-center mt-8">
        <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-0 backdrop-blur-sm">
          <CardBody className="py-6">
            <div className="flex justify-center items-center gap-2 mb-2">
              <span className="text-2xl">🐰</span>
              <span className="text-lg text-center font-medium text-gray-700 dark:text-gray-300">
                Cảm ơn bạn đã sử dụng VinhUni Campus!
              </span>
              <span className="text-2xl delay-100">💕</span>
            </div>
            <p className="text-sm text-center text-gray-600 dark:text-gray-400">
              Mọi đóng góp của bạn đều giúp trang web ngày càng tốt hơn
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}