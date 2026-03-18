"use client";

import { useEffect } from "react";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

interface ErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
            <div className="w-full max-w-md text-center">
                <div className="mb-6 flex justify-center">
                    <div className="rounded-full bg-red-100 p-4 dark:bg-red-900/30">
                        <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-500" />
                    </div>
                </div>

                <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                    Something went wrong
                </h1>

                <p className="mb-10 text-lg text-zinc-600 dark:text-zinc-400">
                    We encountered an unexpected error while loading the page. Please try again or return to the dashboard.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
                    <button
                        onClick={() => reset()}
                        className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <RefreshCcw size={18} />
                        Try Again
                    </button>

                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 rounded-xl bg-white border border-zinc-200 px-6 py-3 font-semibold text-zinc-900 transition-all hover:bg-zinc-50 active:scale-95 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800"
                    >
                        <Home size={18} />
                        Back to Dashboard
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-8 text-xs text-zinc-400 dark:text-zinc-600 tabular-nums">
                        Error ID: {error.digest}
                    </p>
                )}
            </div>
        </div>
    );
}
