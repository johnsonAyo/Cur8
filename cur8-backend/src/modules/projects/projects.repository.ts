import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import {
  Project,
  ScientificMetrics,
  Supplier,
} from '@/common/interfaces/project.interface';

@Injectable()
export class ProjectsRepository {
  private readonly logger = new Logger(ProjectsRepository.name);

  // Abstracting out data access
  private projects: Project[] = [];
  private metrics: ScientificMetrics[] = [];
  private suppliers: Supplier[] = [];

  constructor() {
    this.loadData();
  }

  private loadData() {
    const dataDir = path.join(process.cwd(), 'data');
    try {
      this.projects = JSON.parse(
        fs.readFileSync(path.join(dataDir, 'projects.json'), 'utf8'),
      );
      this.metrics = JSON.parse(
        fs.readFileSync(path.join(dataDir, 'scientific_metrics.json'), 'utf8'),
      );
      this.suppliers = JSON.parse(
        fs.readFileSync(path.join(dataDir, 'suppliers.json'), 'utf8'),
      );
    } catch (error) {
      this.logger.error({
        stack: error instanceof Error ? error.stack : undefined,
        message: 'loadDataFailed',
        details: { dataDir },
        error,
      });
    }
  }

  getAllProjects(): Project[] {
    return this.projects;
  }

  getAllMetrics(): ScientificMetrics[] {
    return this.metrics;
  }

  getAllSuppliers(): Supplier[] {
    return this.suppliers;
  }

  getProjectById(projectId: string): Project {
    const project = this.projects.find((project: Project) => project.id === projectId);
    if (!project) {
      const error = new NotFoundException('Project', projectId);
      this.logger.error({
        stack: error.stack,
        message: 'projectNotFound',
        details: { projectId },
        error,
      });
      throw error;
    }
    return project;
  }

  getMetricsByProjectId(projectId: string): ScientificMetrics {
    const metrics = this.metrics.find((metric: ScientificMetrics) => metric.project_id === projectId);
    if (!metrics) {
      const error = new NotFoundException('Metric', projectId);
      this.logger.error({
        stack: error.stack,
        message: 'metricNotFound',
        details: { projectId },
        error,
      });
      throw error;
    }
    return metrics;
  }

  getSupplierById(supplierId: string): Supplier {
    const supplier = this.suppliers.find((supplier: Supplier) => supplier.id === supplierId);
    if (!supplier) {
      const error = new NotFoundException('Supplier', supplierId);
      this.logger.error({
        stack: error.stack,
        message: 'supplierNotFound',
        details: { supplierId },
        error,
      });
      throw error;
    }
    return supplier;
  }
}
