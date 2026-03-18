"use client";

interface ScoreBadgeProps {
    score: number;
    className?: string;
    showOutOfTen?: boolean;
}

export function ScoreBadge({ score, className = "", showOutOfTen = false }: ScoreBadgeProps) {
    const getScoreColor = (score: number) => {
        if (score >= 8) return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50";
        if (score >= 5) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50";
        return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50";
    };

    return (
        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getScoreColor(score)} ${className}`}>
            {score}
            {showOutOfTen && <span className="text-zinc-400 font-normal ml-1">/ 10</span>}
        </span>
    );
}
