"use client";

import { useParams, useRouter } from "next/navigation";
import { useProjectDetail } from "@/hooks/useProjectDetail";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";

export default function ProjectDetail() {
    const { id } = useParams() as { id: string };
    const router = useRouter();
    const { project, loading, error } = useProjectDetail(id);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
                <p className="text-zinc-500 animate-pulse">Loading Project Details...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 gap-4">
                <div className="text-red-500 bg-red-50 dark:bg-red-950 p-4 rounded-lg font-medium">{error || "Project Not Found"}</div>
                <Button variant="outline" onClick={() => router.push("/")}>Return Home</Button>
            </div>
        );
    }

    // Helper to determine color classes based on score value
    const getScoreColor = (score: number) => {
        if (score >= 8) return "text-emerald-600 dark:text-emerald-400";
        if (score >= 5) return "text-amber-600 dark:text-amber-400";
        return "text-rose-600 dark:text-rose-400";
    };

    const getScoreBorder = (score: number) => {
        if (score >= 8) return "border-l-4 border-l-emerald-500 border-zinc-200 dark:border-zinc-800";
        if (score >= 5) return "border-l-4 border-l-amber-500 border-zinc-200 dark:border-zinc-800";
        return "border-l-4 border-l-rose-500 border-zinc-200 dark:border-zinc-800";
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <Button variant="ghost" className="mb-6 -ml-4 text-zinc-600 dark:text-zinc-400" onClick={() => router.push("/")}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{project.name}</h1>
                            <Badge variant="secondary" className="text-sm px-3 md:mt-2">
                                {project.technology}
                            </Badge>
                        </div>
                        <p className="text-lg text-zinc-600 dark:text-zinc-400">
                            Managed by <span className="font-semibold text-zinc-900 dark:text-zinc-300">{project.supplier.name}</span>
                        </p>
                    </div>
                    <div className="flex flex-col items-end">
                        <div className="text-sm font-medium text-zinc-500 tracking-wide uppercase mb-1">Overall Score</div>
                        <Tooltip align="end" content={
                            <div className="space-y-1">
                                <p className="font-bold border-b border-zinc-700 pb-1 mb-1 whitespace-nowrap">(Financial Risk + Leakage Risk + Supplier Trust) / 3</p>
                                <p className="text-zinc-300 font-medium">({project.scores.financial_risk_score.toFixed(2)} + {project.scores.leakage_risk_score.toFixed(2)} + {project.scores.supplier_trust_score.toFixed(2)}) / 3</p>
                                <p className="text-xs text-zinc-400 mt-1">Calculated as the average of stability, safety, and trustworthiness scores.</p>
                            </div>
                        }>
                            <div className={`text-5xl font-extrabold cursor-help transition-all hover:scale-105 ${getScoreColor(project.scores.overall_score)}`}>
                                {project.scores.overall_score.toFixed(2)}
                            </div>
                        </Tooltip>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className={`shadow-sm relative overflow-hidden ${getScoreBorder(project.scores.permanence_score)}`}>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-semibold tracking-wider uppercase text-zinc-500 relative z-10">Permanence Score</CardDescription>
                            <CardTitle className={`text-3xl font-bold relative z-10 ${getScoreColor(project.scores.permanence_score)}`}>
                                <Tooltip content={
                                    <div className="space-y-1">
                                        <p className="font-bold border-b border-zinc-700 pb-1 mb-1">Durability / 100</p>
                                        <p className="text-zinc-300 font-medium">{project.metrics.durability} / 100</p>
                                        <p className="text-xs text-zinc-400 mt-1">Estimates reliability based on storage lifespan (Max 10).</p>
                                    </div>
                                }>
                                    <span className="cursor-help">{project.scores.permanence_score.toFixed(2)}</span>
                                </Tooltip>
                                <span className="text-lg text-zinc-400 font-normal"> / 10</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                Based on metric durability of <span className="font-medium text-zinc-900 dark:text-zinc-200">{project.metrics.durability}</span>. Evaluates long-term carbon storage viability.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={`shadow-sm relative overflow-hidden ${getScoreBorder(project.scores.supplier_trust_score)}`}>
                        <div className="absolute top-4 right-4 z-20">
                            <Tooltip content={
                                <div className="space-y-1">
                                    <p className="font-bold border-b border-zinc-700 pb-1 mb-1 whitespace-nowrap">Supplier Verification Status</p>
                                    <ul className="text-xs text-zinc-300 list-disc ml-4 space-y-1">
                                        <li>Verified: 10/10 score</li>
                                        <li>Pending: 5/10 score</li>
                                    </ul>
                                </div>
                            }>
                                <span className={`font-bold uppercase text-xs tracking-wider border rounded-full px-3 py-1 cursor-help ${getScoreColor(project.scores.supplier_trust_score)} border-current bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm`}>
                                    {project.supplier.verification_status}
                                </span>
                            </Tooltip>
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-semibold tracking-wider uppercase text-zinc-500 relative z-10">Supplier Trust Score</CardDescription>
                            <CardTitle className={`text-3xl font-bold relative z-10 ${getScoreColor(project.scores.supplier_trust_score)}`}>
                                <Tooltip content={
                                    <div className="space-y-1">
                                        <p className="font-bold border-b border-zinc-700 pb-1 mb-1">Verification Status Points</p>
                                        <p className="text-zinc-300 font-medium">Status: {project.supplier.verification_status}</p>
                                        <ul className="text-xs text-zinc-400 list-disc ml-4">
                                            <li>Verified = 10 points</li>
                                            <li>Pending = 5 points</li>
                                        </ul>
                                    </div>
                                }>
                                    <span className="cursor-help">{project.scores.supplier_trust_score.toFixed(2)}</span>
                                </Tooltip>
                                <span className="text-lg text-zinc-400 font-normal"> / 10</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                Derived from official supplier verification protocols. Ensures the provider meets platform standards.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={`shadow-sm relative overflow-hidden ${getScoreBorder(project.scores.financial_risk_score)}`}>
                        <div className="absolute top-4 right-4 z-20 flex flex-col items-end md:flex-row gap-2">
                            <Tooltip content={
                                <div className="p-1">
                                    <p className="font-bold border-b border-zinc-700 pb-1 mb-1">Project Volume</p>
                                    <ul className="text-zinc-300 list-disc ml-4 space-y-1">
                                        <li>Over 1,000 tonnes: Full score</li>
                                        <li>Under 1,000 tonnes: -50% penalty</li>
                                    </ul>
                                </div>
                            }>
                                <span className={`font-bold text-xs tracking-wider border rounded-full px-3 py-1 shadow-sm backdrop-blur-sm cursor-help ${project.metrics.volume < 1000
                                    ? 'text-amber-600 border-amber-500 dark:text-amber-400 dark:border-amber-500/50'
                                    : 'text-emerald-600 border-emerald-500 dark:text-emerald-400 dark:border-emerald-500/50'}`}>
                                    {project.metrics.volume.toLocaleString()} tonnes
                                </span>
                            </Tooltip>
                            <Tooltip content={
                                <div className="p-1">
                                    <p className="font-bold border-b border-zinc-700 pb-1 mb-1 capitalize">Project Status</p>
                                    <ul className="text-zinc-300 list-disc ml-4 space-y-1">
                                        <li>Operational: 10/10</li>
                                        <li>In Design: 5/10</li>
                                        <li>Discontinued: 1/10</li>
                                    </ul>
                                </div>
                            }>
                                <span className={`font-bold uppercase text-xs tracking-wider border rounded-full px-3 py-1 shadow-sm cursor-help ${project.status.toLowerCase() === 'operational'
                                    ? 'text-emerald-600 border-emerald-500 dark:text-emerald-400 dark:border-emerald-500/50'
                                    : project.status.toLowerCase() === 'in_design' || project.status.toLowerCase() === 'pending'
                                        ? 'text-amber-600 border-amber-500 dark:text-amber-400 dark:border-amber-500/50'
                                        : 'text-rose-600 border-rose-500 dark:text-rose-400 dark:border-rose-500/50'
                                    } backdrop-blur-sm`}>{project.status.replace("_", " ")}</span>
                            </Tooltip>
                        </div>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-semibold tracking-wider uppercase text-zinc-500 relative z-10">Financial Risk Score</CardDescription>
                            <CardTitle className={`text-3xl font-bold relative z-10 ${getScoreColor(project.scores.financial_risk_score)}`}>
                                <Tooltip content={
                                    <div className="space-y-1">
                                        <p className="font-bold border-b border-zinc-700 pb-1 mb-1">(Status Points) × (Volume Penalty)</p>
                                        <p className="text-zinc-300 font-medium">{project.status.toLowerCase() === 'operational' ? 10 : project.status.toLowerCase() === 'discontinued' ? 1 : 5} × {project.metrics.volume < 1000 ? 0.5 : 1}</p>
                                        <ul className="text-xs text-zinc-400 list-disc ml-4">
                                            <li>Penalty (0.5x) if Volume &lt; 1,000 tonnes</li>
                                            <li>Status: Operational (10), In Design (5), Discontinued (1)</li>
                                        </ul>
                                    </div>
                                }>
                                    <span className="cursor-help">{project.scores.financial_risk_score.toFixed(2)}</span>
                                </Tooltip>
                                <span className="text-lg text-zinc-400 font-normal"> / 10</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                Evaluates structural stability and volume metrics. Penalties apply for total volumes below the 1,000 tonnes threshold.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={`shadow-sm relative overflow-hidden ${getScoreBorder(project.scores.leakage_risk_score)}`}>
                        <CardHeader className="pb-2">
                            <CardDescription className="text-xs font-semibold tracking-wider uppercase text-zinc-500 relative z-10">Leakage Risk Score</CardDescription>
                            <CardTitle className={`text-3xl font-bold relative z-10 ${getScoreColor(project.scores.leakage_risk_score)}`}>
                                <Tooltip content={
                                    <div className="space-y-1">
                                        <p className="font-bold border-b border-zinc-700 pb-1 mb-1">Permanence Score × (1 - Leakage Rate)</p>
                                        <p className="text-zinc-300 font-medium">{project.scores.permanence_score.toFixed(2)} × (1 - {project.metrics.leakage})</p>
                                        <p className="text-xs text-zinc-400 mt-1">Adjusts reliability based on unintended escape risk.</p>
                                    </div>
                                }>
                                    <span className="cursor-help">{project.scores.leakage_risk_score.toFixed(2)}</span>
                                </Tooltip>
                                <span className="text-lg text-zinc-400 font-normal"> / 10</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
                                Factor of permanence offset against a leakage probability of <span className={`font-semibold ${getScoreColor(project.scores.leakage_risk_score)}`}>{(project.metrics.leakage * 100).toFixed(1)}%</span>. Evaluates unintended emissions risks.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
