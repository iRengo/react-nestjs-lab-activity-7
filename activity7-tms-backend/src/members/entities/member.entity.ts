import {Column, Entity, PrimaryColumn} from 'typeorm';

@Entity({name: 'members'})
export class Member {
  @PrimaryColumn({name: 'id', type: 'int'})
  id!: number;

  @Column({name: 'first_name', type: 'varchar'})
  firstName!: string;

  @Column({name: 'last_name', type: 'varchar'})
  lastName!: string;

  @Column({name: 'email', type: 'varchar'})
  email!: string;
}
