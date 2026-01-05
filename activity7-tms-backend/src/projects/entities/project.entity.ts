import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, UpdateDateColumn} from 'typeorm';
import {Task} from '../../tasks/entities/task.entity';
import {User} from '../../users/entities/user.entity';

export enum ProjectStatus {
  PENDING = 'pending',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
}

@Entity({name: 'projects'})
export class Project {
  @PrimaryGeneratedColumn({name: 'project_id', type: 'int'})
  projectId!: number;

  @Column({name: 'project_name', type: 'varchar', length: 255})
  projectName!: string;

  @Column({name: 'project_description', type: 'text', nullable: true})
  projectDescription: string | null;

  @Column({name: 'start_date', type: 'date', nullable: true})
  startDate: string | null;

  @Column({name: 'end_date', type: 'date', nullable: true})
  endDate: string | null;

  @Column({name: 'status', type: 'enum', enum: ProjectStatus, default: ProjectStatus.PENDING})
  status!: ProjectStatus;

  @ManyToOne(() => User, {nullable: true})
  @JoinColumn({name: 'created_by', referencedColumnName: 'userId'})
  createdByUser: User | null;

  @RelationId((project: Project) => project.createdByUser)
  createdBy: number | null;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt!: Date;

  @OneToMany(() => Task, (task) => task.project)
  tasks!: Task[];
}
