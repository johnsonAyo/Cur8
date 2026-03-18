"use client";

import { Tooltip } from "./ui/tooltip";

interface StatusBadgeProps {
    status: string;
    className?: string;
    variant?: "default" | "pill" | "corner";
    showTooltip?: boolean;
}

export function StatusBadge({
    status,
    className = "",
    variant = "default",
    showTooltip = true
}: StatusBadgeProps) {
    const s = status.toLowerCase();

    const getStatusColors = () => {
        if (s === 'operational') return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50';
        if (s === 'in_design' || s === 'pending') return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50';
        if (s === 'discontinued') return 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-400 dark:border-rose-800/50';
        return 'bg-zinc-100 text-zinc-800 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-300 dark:border-zinc-700';
    };

    const getStatusDescription = () => {
        if (s === 'operational') return "Active and removing carbon (10/10 points).";
        if (s === 'in_design' || s === 'pending') return "In Design (5/10 points).";
        if (s === 'discontinued') return "Operations have stopped (1/10 points).";
        return "The current status of this project.";
    };

    const getVariantStyles = () => {
        switch (variant) {
            case "pill":
                return "px-4 py-1.5 rounded-full text-sm font-bold shadow-sm whitespace-nowrap";
            case "corner":
                return "font-bold uppercase text-xs tracking-wider border rounded-full px-3 py-1 shadow-sm backdrop-blur-sm";
            default:
                return "px-3 py-1 rounded-md text-xs font-medium border";
        }
    };

    const badge = (
        <span className={`inline-flex items-center justify-center capitalize ${getStatusColors()} ${getVariantStyles()} ${className} ${showTooltip ? 'cursor-help' : ''}`}>
            {status.replace("_", " ")}
        </span>
    );

    if (!showTooltip) return badge;

    return (
        <Tooltip content={
            <div className="p-1">
                <p className="font-bold border-b border-zinc-700 pb-1 mb-1 capitalize">{status.replace("_", " ")}</p>
                <p className="text-zinc-300">{getStatusDescription()}</p>
            </div>
        }>
            {badge}
        </Tooltip>
    );
}
