export enum ProjectStatus {
    OPERATIONAL = 'operational',
    IN_DESIGN = 'in_design',
    DISCONTINUED = 'discontinued'
}

export enum VerificationStatus {
    VERIFIED = 'verified',
    PENDING = 'pending',
}

export interface ScoreBreakdown {
    permanence_score: number;
    supplier_trust_score: number;
    financial_risk_score: number;
    leakage_risk_score: number;
    overall_score: number;
}

export interface ScientificMetrics {
    project_id: string;
    durability: number;
    leakage: number;
    volume: number;
}

export interface Supplier {
    id: string;
    name: string;
    verification_status: VerificationStatus;
}

export interface Project {
    id: string;
    name: string;
    technology: string;
    supplier_id: string;
    status: ProjectStatus;
}

export interface ProjectDetailed extends Project {
    metrics: ScientificMetrics;
    supplier: Supplier;
    scores: ScoreBreakdown;
}

export interface ProjectSummary {
    id: string;
    name: string;
    technology: string;
    status: ProjectStatus;
    supplierName: string;
    overallScore: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        lastPage: number;
    };
}
