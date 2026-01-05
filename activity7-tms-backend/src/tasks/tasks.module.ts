import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {Project} from '../projects/entities/project.entity';
import {Task} from './entities/task.entity';
import {TasksController} from './tasks.controller';
import {TasksService} from './tasks.service';

@Module({
  imports: [TypeOrmModule.forFeature([Task, Project]), AuthModule],
  controllers: [TasksController],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
