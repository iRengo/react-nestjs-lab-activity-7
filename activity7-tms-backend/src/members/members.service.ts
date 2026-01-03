import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Member} from './entities/member.entity';

@Injectable()
export class MembersService {
  constructor(
    @InjectRepository(Member)
    private readonly membersRepository: Repository<Member>,
  ) {}

  async findById(memberId: number): Promise<Member> {
    const member = await this.membersRepository.findOne({where: {id: memberId}});

    if (!member) {
      throw new NotFoundException('Member ID not found');
    }

    return member;
  }
}
