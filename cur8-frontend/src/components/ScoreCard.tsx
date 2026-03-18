"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import React from "react";

interface ScoreCardProps {
    title: string;
    score: number;
    description: React.ReactNode;
    badgeValue?: string;
    badgeType?: "status" | "trust";
}

export function ScoreCard({ title, score, description, badgeValue }: ScoreCardProps) {
    const getScoreColor = (s: number) => {
        if (s >= 8) return "text-emerald-600 dark:text-emerald-400";
        if (s >= 5) return "text-amber-600 dark:text-amber-400";
        return "text-rose-600 dark:text-rose-400";
    };

    const getScoreBorder = (s: number) => {
        if (s >= 8) return "border-l-4 border-l-emerald-500 border-zinc-200 dark:border-zinc-800";
        if (s >= 5) return "border-l-4 border-l-amber-500 border-zinc-200 dark:border-zinc-800";
        return "border-l-4 border-l-rose-500 border-zinc-200 dark:border-zinc-800";
    };

    return (
        <Card className={`shadow-sm relative overflow-hidden ${getScoreBorder(score)}`}>
            {badgeValue && (
                <div className="absolute top-4 right-4 z-20">
                    <StatusBadge status={badgeValue} variant="corner" />
                </div>
            )}
            <CardHeader className="pb-2">
                <CardDescription className="text-xs font-semibold tracking-wider uppercase text-zinc-500 relative z-10">
                    {title}
                </CardDescription>
                <CardTitle className={`text-3xl font-bold relative z-10 ${getScoreColor(score)}`}>
                    {score.toFixed(2)}
                    <span className="text-lg text-zinc-400 font-normal ml-1">/ 10</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                    {description}
                </div>
            </CardContent>
        </Card>
    );
}
