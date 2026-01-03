import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn} from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn({ name: 'user_id' })
	userId: number;

	@Column({ name: 'first_name', type: 'varchar', nullable: false })
	firstName: string;

	@Column({ name: 'last_name', type: 'varchar', nullable: false })
	lastName: string;

	@Column({ name: 'email', type: 'varchar', unique: true, nullable: false })
	email: string;

	@Column({ name: 'password', type: 'varchar', nullable: false })
	password: string;

	@Column({ name: 'role', type: 'varchar', nullable: false })
	role: string;

	@Column({ name: 'status', type: 'varchar', nullable: false })
	status: string;

	@CreateDateColumn({ name: 'created_at', type: 'timestamp' })
	createdAt: Date;

	@UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
	updatedAt: Date;
}
