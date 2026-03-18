"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FilterBar } from "@/components/FilterBar";
import { StatusBadge } from "@/components/StatusBadge";
import { ScoreBadge } from "@/components/ScoreBadge";
import { TABLE_HEADERS, Labels } from "@/lib/constants";



export default function Dashboard() {

  const router = useRouter();
  // Filter and Sort state
  const [filters, setFilters] = useState({ status: "all", tech: "all" });
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Fetch projects using custom hook
  const { projects, loading, error, technologies, statuses, allProjectsCount } = useProjects({
    filters,
    sortOrder,
  });

  if (error) {
    throw error; // This will trigger the Next.js error boundary (error.tsx)
  }

  const toggleSortOrder = () => {
    if (sortOrder === "desc") {
      setSortOrder("asc");
    } else if (sortOrder === "asc") {
      setSortOrder(null);
    } else {
      setSortOrder("desc");
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-zinc-500 font-medium animate-pulse">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              {Labels.ProjectHeader}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 font-medium">
              {Labels.ProjectSubHeader}
            </p>
          </div>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          statuses={statuses}
          technologies={technologies}
          filteredCount={projects.length}
          totalCount={allProjectsCount}
        />

        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
          <Table className="text-base">
            <TableHeader className="bg-zinc-50 dark:bg-zinc-800/40 border-b border-zinc-200 dark:border-zinc-800">
              <TableRow className="h-14 hover:bg-transparent">
                {TABLE_HEADERS.map((header) => (
                  <TableHead
                    key={header.label}
                    className={`text-xs font-semibold text-zinc-500 uppercase tracking-wider dark:text-zinc-400 px-6 transition-colors ${header.align === "right" ? "text-right" : "text-left"} ${header.sortable ? "cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800" : ""}`}
                    onClick={header.sortable ? toggleSortOrder : undefined}
                  >
                    <div className={`flex items-center ${header.align === "right" ? "justify-end" : ""}`}>
                      {header.label}
                      {header.sortable && (
                        <div className="ml-2 flex items-center gap-0.5">
                          <ArrowUp
                            size={14}
                            className={`transition-colors ${sortOrder === "asc" ? "text-blue-500" : "text-zinc-300 dark:text-zinc-600"}`}
                          />
                          <ArrowDown
                            size={14}
                            className={`transition-colors ${sortOrder === "desc" ? "text-blue-500" : "text-zinc-300 dark:text-zinc-600"}`}
                          />
                        </div>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow
                  key={project.id}
                  className="transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/60 h-20 group cursor-pointer"
                  onClick={() => router.push(`/project/${project.id}`)}
                >
                  <TableCell className="px-6">
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {project.name}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 text-base text-zinc-600 dark:text-zinc-400">
                    {project.technology}
                  </TableCell>
                  <TableCell className="px-6 text-base text-zinc-600 dark:text-zinc-400">
                    {project.supplierName}
                  </TableCell>
                  <TableCell className="px-6 text-start">
                    <StatusBadge status={project.status} variant="pill" showTooltip={false} />
                  </TableCell>
                  <TableCell className="px-6 text-center">
                    <ScoreBadge score={project.overallScore} />
                  </TableCell>
                </TableRow>
              ))}
              {projects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-lg text-center text-zinc-500 font-medium">
                    {Labels.NoProjectsMatch}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
