"use client";

import type { ThemeProviderProps } from "next-themes";

import { TanStackProvider } from "@/components/Providers/TanstackProvider";
import { ToastProvider } from "@heroui/react";
import { HeroUIProvider } from "@heroui/system";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  return (
    <TanStackProvider>
      <ReactQueryDevtools initialIsOpen={false} />
      <HeroUIProvider navigate={router.push}>
        <ToastProvider placement="bottom-center" />
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </TanStackProvider>
  );
}
