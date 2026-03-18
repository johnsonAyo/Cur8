import axios from 'axios';
import { ProjectDetailed, ProjectSummary, PaginatedResponse } from './types';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    headers: {
        'Content-Type': 'application/json',
    },
});

export const api = {
    getProjects: async (params?: Record<string, string | number>): Promise<PaginatedResponse<ProjectSummary>> => {
        const response = await apiClient.get<PaginatedResponse<ProjectSummary>>('/projects', { params });
        return response.data;
    },

    getProjectById: async (id: string): Promise<ProjectDetailed> => {
        const response = await apiClient.get<ProjectDetailed>(`/projects/${id}`);
        return response.data;
    },
};
