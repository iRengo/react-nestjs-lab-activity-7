import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from '../auth/auth.module';
import {User} from '../users/entities/user.entity';
import {Project} from './entities/project.entity';
import {ProjectsController} from './projects.controller';
import {ProjectsService} from './projects.service';

@Module({
	imports: [TypeOrmModule.forFeature([Project, User]), AuthModule],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [ProjectsService],
})
export class ProjectsModule {}
