import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';
import {Project} from '../../projects/entities/project.entity';

@Entity({name: 'tasks'})
export class Task {
  @PrimaryGeneratedColumn({name: 'task_id', type: 'int'})
  taskId!: number;

  @Column({name: 'task_title', type: 'varchar', length: 255})
  taskTitle!: string;

  @Column({name: 'task_description', type: 'text', nullable: true})
  taskDescription: string | null;

  @Column({name: 'assigned_to', type: 'int', nullable: true})
  assignedTo: number | null;

  @Column({name: 'priority', type: 'varchar', length: 50, nullable: true})
  priority: string | null;

  @Column({name: 'status', type: 'varchar', length: 50, nullable: true, default: 'pending'})
  status: string | null;

  @Column({name: 'due_date', type: 'date', nullable: true})
  dueDate: string | null;

  @Column({name: 'project_id', type: 'int'})
  projectId!: number;

  @ManyToOne(() => Project, (project) => project.tasks, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
  @JoinColumn({name: 'project_id', referencedColumnName: 'projectId'})
  project!: Project;

  @CreateDateColumn({name: 'created_at', type: 'timestamp'})
  createdAt!: Date;

  @UpdateDateColumn({name: 'updated_at', type: 'timestamp'})
  updatedAt!: Date;
}
