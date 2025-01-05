"use client"

import { QueryClient, QueryClientProvider, isServer } from "@tanstack/react-query"

import { timeConstants } from "@/constants"
function makeQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                gcTime: timeConstants.DEFAULT_GC_TIME, // 10 minutes
                refetchOnWindowFocus: false,
                staleTime: timeConstants.DEFAULT_STALE_TIME, // 10 minutes
            },
        },
    })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
    if (isServer) {
        // Server: always make a new query client
        return makeQueryClient()
    } else {
        // Browser: make a new query client if we don't already have one
        // This is very important, so we don't re-make a new client if React
        // suspends during the initial render. This may not be needed if we
        // have a suspense boundary BELOW the creation of the query client
        if (!browserQueryClient) browserQueryClient = makeQueryClient()
        return browserQueryClient
    }
}
export const TanStackProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = getQueryClient()
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </>
    )
}
