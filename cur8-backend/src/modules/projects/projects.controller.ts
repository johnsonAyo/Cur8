import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ProjectQueryDto } from './dto/project-query.dto';
import {
    type ProjectDetailed,
    type ProjectSummary,
    type PaginatedResponse,
} from '@/common/interfaces/project.interface';

@ApiTags('projects')
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all projects with scores' })
    @ApiResponse({
        status: 200,
        description: 'List of all fully enriched projects.',
    })
    findAll(@Query() query: ProjectQueryDto): PaginatedResponse<ProjectSummary> {
        return this.projectsService.findAll(query);

    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a single project by ID' })
    @ApiResponse({ status: 200, description: 'The project details.' })
    @ApiResponse({ status: 404, description: 'Project not found.' })
    findOne(@Param('id') id: string): ProjectDetailed {
        return this.projectsService.findOne(id);
    }
}
