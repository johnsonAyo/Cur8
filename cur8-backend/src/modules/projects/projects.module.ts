import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { ProjectsRepository } from './projects.repository';

@Module({
  providers: [ProjectsService, ProjectsRepository],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
