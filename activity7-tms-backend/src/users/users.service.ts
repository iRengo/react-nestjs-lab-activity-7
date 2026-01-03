import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {User} from './entities/user.entity';

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserDto): Promise<User> {
		await this.ensureEmailIsUnique(createUserDto.email);

		const user = this.usersRepository.create(createUserDto);
		return this.usersRepository.save(user);
	}

	async findAll(): Promise<User[]> {
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

		const mergedUser = this.usersRepository.merge(user, {
			...updateUserDto,
		});
		return this.usersRepository.save(mergedUser);
	}

	async remove(userId: number): Promise<void> {
		const user = await this.findOneById(userId);
		await this.usersRepository.remove(user);
	}

	async findOneByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findOne({where: {email}});
	}

	private async ensureEmailIsUnique(email: string): Promise<void> {
		const existingUser = await this.usersRepository.findOne({where: {email}});

		if (existingUser) {
			throw new ConflictException('Email address is already in use');
		}
	}

}
