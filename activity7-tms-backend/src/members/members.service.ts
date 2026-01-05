import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectDataSource} from '@nestjs/typeorm';
import {DataSource} from 'typeorm';
import {Member} from './entities/member.entity';

const MEMBER_LOOKUP_QUERY = `
  SELECT id, first_name AS firstName, last_name AS lastName, email
  FROM members
  WHERE id = ?
  LIMIT 1
`;

@Injectable()
export class MembersService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async findById(memberId: number): Promise<Member> {
    const [row] = await this.dataSource.query(MEMBER_LOOKUP_QUERY, [memberId]);

    if (!row) {
      throw new NotFoundException('Member ID not found');
    }

    const member: Member = {
      id: Number(row.id),
      firstName: row.firstName ?? row.first_name,
      lastName: row.lastName ?? row.last_name,
      email: row.email,
    };

    return member;
  }
}
