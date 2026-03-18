"use client";

import { Filter, ChevronDown, X } from "lucide-react";

interface FilterState {
    status: string;
    tech: string;
}

interface FilterBarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
    statuses: string[];
    technologies: string[];
    filteredCount: number;
    totalCount: number;
}

export function FilterBar({
    filters,
    setFilters,
    statuses,
    technologies,
    filteredCount,
    totalCount,
}: FilterBarProps) {
    const clearFilters = () => {
        setFilters({ status: "all", tech: "all" });
    };

    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 px-2">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 mr-2">
                    <Filter size={18} />
                    <span className="text-sm font-semibold uppercase tracking-wider">Filters</span>
                </div>

                {/* Status Filter */}
                <div className="relative group">
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700"
                    >
                        <option value="all">All Statuses</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s.replace("_", " ").charAt(0).toUpperCase() + s.replace("_", " ").slice(1)}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                </div>

                {/* Tech Filter */}
                <div className="relative group">
                    <select
                        value={filters.tech}
                        onChange={(e) => setFilters({ ...filters, tech: e.target.value })}
                        className="appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer hover:border-zinc-300 dark:hover:border-zinc-700"
                    >
                        <option value="all">All Technologies</option>
                        {technologies.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400" />
                </div>

                {(filters.status !== "all" || filters.tech !== "all") && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors uppercase tracking-widest px-2"
                    >
                        <X size={14} /> Clear
                    </button>
                )}
            </div>

            <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
                Showing {filteredCount} of {totalCount} Projects
            </div>
        </div>
    );
}
