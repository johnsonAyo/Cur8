import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ProjectDetailed } from "@/lib/types";

export function useProjectDetail(id: string) {
    const [project, setProject] = useState<ProjectDetailed | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!id) return;

            setLoading(true);
            try {
                const data = await api.getProjectById(id);
                setProject(data);
                setError(null);
            } catch (err) {
                const errorObj = err as { name?: string };
                if (errorObj.name === 'AbortError') return;
                const finalError = errorObj as { response?: { data?: { message?: string } }, message?: string };
                setError(finalError.response?.data?.message || finalError.message || "Failed to load project details");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [id]);

    return { project, loading, error };
}
