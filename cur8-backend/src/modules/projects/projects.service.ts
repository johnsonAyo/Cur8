import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import {
  Project,
  ProjectDetailed,
  ProjectSummary,
  PaginatedResponse,
} from '@/common/interfaces/project.interface';
import { ProjectsRepository } from './projects.repository';
import { ScoringEngine } from '../scoring/scoring.engine';
import { ProjectQueryDto, SortOrder } from './dto/project-query.dto';
@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);
  constructor(private readonly projectsRepository: ProjectsRepository) { }

  findAll(query: ProjectQueryDto): PaginatedResponse<ProjectSummary> {
    try {

      let projects = this.projectsRepository.getAllProjects();

      // 1. Filter raw projects
      projects = this.filterProjects(projects, query);

      // 2. Enrich and map to Summary
      const summaries: ProjectSummary[] = projects.map((project) => {
        const enriched = this.enrichProject(project);
        return {
          id: enriched.id,
          name: enriched.name,
          technology: enriched.technology,
          status: enriched.status,
          supplierName: enriched.supplier.name,
          overallScore: enriched.scores.overall_score,
        };
      });

      // 3. Sort summaries by overall score if sortOrder is provided
      const sortedSummaries = query.sortOrder
        ? this.sortProjects(summaries, query.sortOrder)
        : summaries;

      // 4. Paginate
      return this.paginateResults(sortedSummaries, query.page, query.limit);
    } catch (error) {
      this.logger.error({
        stack: error instanceof Error ? error.stack : undefined,
        message: 'findAllProjectsFailed',
        details: { query },
        error,
      });
      throw error;
    }
  }

  findOne(projectId: string): ProjectDetailed {
    try {
      const project = this.projectsRepository.getProjectById(projectId);
      if (!project) {
        throw new NotFoundException('Project', projectId);
      }
      return this.enrichProject(project);
    } catch (error) {
      this.logger.error({
        stack: error instanceof Error ? error.stack : undefined,
        message: 'findOneProjectFailed',
        details: { projectId },
        error,
      });
      throw error;
    }
  }

  private enrichProject(project: Project): ProjectDetailed {
    try {
      const metric = this.projectsRepository.getMetricsByProjectId(project.id);
      const supplier = this.projectsRepository.getSupplierById(
        project.supplier_id,
      );

      const scores = ScoringEngine.calculateScores(
        metric.durability,
        metric.leakage,
        metric.volume,
        project.status,
        supplier.verification_status,
      );

      return {
        ...project,
        metrics: metric,
        supplier: supplier,
        scores: scores,
      };
    } catch (error) {
      this.logger.error({
        stack: error instanceof Error ? error.stack : undefined,
        message: 'enrichProjectFailed',
        details: { projectId: project.id },
        error,
      });
      throw error;
    }
  }

  private filterProjects(
    projects: Project[],
    query: ProjectQueryDto,
  ): Project[] {
    let filtered = projects;
    if (query.status) {
      filtered = filtered.filter((project) => project.status === query.status);
    }
    if (query.technology) {
      filtered = filtered.filter((project) => project.technology === query.technology);
    }
    return filtered;
  }

  private sortProjects(
    summaries: ProjectSummary[],
    sortOrder: SortOrder,
  ): ProjectSummary[] {
    return [...summaries].sort((a, b) => {
      return sortOrder === SortOrder.ASC
        ? a.overallScore - b.overallScore
        : b.overallScore - a.overallScore;
    });
  }

  private paginateResults(
    data: ProjectSummary[],
    pageNum?: number,
    pageLimit?: number,
  ): PaginatedResponse<ProjectSummary> {
    const page = pageNum || 1;
    const limit = pageLimit || 10;
    const total = data.length;
    const lastPage = Math.ceil(total / limit);

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    return {
      data: data.slice(startIndex, endIndex),
      meta: {
        total,
        page,
        limit,
        lastPage: lastPage === 0 ? 1 : lastPage,
      },
    };
  }
}
