import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import * as bcrypt from 'bcrypt';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from './entities/user.entity';
import {Task} from '../tasks/entities/task.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
		@InjectRepository(Task)
		private readonly tasksRepository: Repository<Task>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		await this.ensureEmailIsUnique(createUserDto.email);
		await this.ensureUserIdIsUnique(createUserDto.userId);

		const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
		const user = this.usersRepository.create({
			...createUserDto,
			role: createUserDto.role ?? 'user',
			status: createUserDto.status ?? 'active',
			password: hashedPassword,
		});
		return this.usersRepository.save(user);
	}

	async findAll(role?: string): Promise<User[]> {
		if (role) {
			return this.usersRepository.find({where: {role}});
		}

		return this.usersRepository.find();
	}

	async findOneById(userId: number): Promise<User> {
		const user = await this.usersRepository.findOne({where: {userId}});

		if (!user) {
			throw new NotFoundException(`User with id ${userId} not found`);
		}

		return user;
	}

	async update(userId: number, updateUserDto: UpdateUserDto): Promise<User> {
		const user = await this.findOneById(userId);

		if (updateUserDto.email && updateUserDto.email !== user.email) {
			await this.ensureEmailIsUnique(updateUserDto.email);
		}

		const payload: UpdateUserDto = {
			...updateUserDto,
		};

		if (payload.password) {
			payload.password = await bcrypt.hash(payload.password, 10);
		}

		const mergedUser = this.usersRepository.merge(user, payload);
		return this.usersRepository.save(mergedUser);
	}

	async remove(userId: number): Promise<void> {
		const user = await this.findOneById(userId);

		await this.tasksRepository
			.createQueryBuilder()
			.update(Task)
			.set({assignedTo: null})
			.where('assigned_to = :userId', {userId})
			.andWhere('(status IS NULL) OR (LOWER(status) NOT IN (:...completedStatuses))', {
				completedStatuses: ['completed', 'complete', 'done'],
			})
			.execute();

		await this.usersRepository.remove(user);
	}

	async findOneByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({where: {email}});
	}

	async updatePassword(userId: number, hashedPassword: string): Promise<void> {
		const user = await this.findOneById(userId);
		user.password = hashedPassword;
		await this.usersRepository.save(user);
	}

	private async ensureEmailIsUnique(email: string): Promise<void> {
		const existingUser = await this.usersRepository.findOne({where: {email}});

		if (existingUser) {
			throw new ConflictException('Email address is already in use');
		}
	}

	private async ensureUserIdIsUnique(userId: number): Promise<void> {
		const existingUser = await this.usersRepository.findOne({where: {userId}});

		if (existingUser) {
			throw new ConflictException('User ID is already registered');
		}
	}

}
