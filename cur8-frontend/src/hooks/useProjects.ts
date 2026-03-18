import { useState, useEffect, useMemo, useRef } from 'react';
import { api } from '@/lib/api';
import { ProjectSummary } from '@/lib/types';
import { PROJECT_STATUSES } from "@/lib/constants";

interface UseProjectsProps {
    filters: { status: string; tech: string };
    sortOrder: "asc" | "desc" | null;
}

export function useProjects({ filters, sortOrder }: UseProjectsProps) {
    const [projects, setProjects] = useState<ProjectSummary[]>([]);
    const [allProjects, setAllProjects] = useState<ProjectSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const allProjectsPopulated = useRef(false);

    useEffect(() => {

        const fetchProjects = async () => {
            setLoading(true);
            setError(null);
            try {
                const params: Record<string, string | number> = {};
                if (filters.status !== "all") params.status = filters.status;
                if (filters.tech !== "all") params.technology = filters.tech;
                if (sortOrder) params.sortOrder = sortOrder;

                const response = await api.getProjects(params);
                setProjects(response.data);

                if (!allProjectsPopulated.current && response.data.length > 0) {
                    allProjectsPopulated.current = true;
                    setAllProjects(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch projects:", err);
                setError(err instanceof Error ? err : new Error("Failed to fetch projects"));
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();

    }, [filters.status, filters.tech, sortOrder]);

    const technologies = useMemo(() => {
        const source = allProjects.length > 0 ? allProjects : projects;
        const techSet = new Set(source.map((p) => p.technology));
        return Array.from(techSet).sort();
    }, [allProjects, projects]);

    const statuses = PROJECT_STATUSES;

    return {
        projects,
        loading,
        error,
        technologies,
        statuses,
        allProjectsCount: allProjects.length || projects.length,
    };
}
