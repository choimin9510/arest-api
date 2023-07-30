import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  no: number;

  @Column({ unique: true })
  uuid: string;

  @Column({ type: 'text' })
  data: string;
}
