import { Column, Entity, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @VersionColumn()
  version: number;
}
