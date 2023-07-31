import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  no: number;

  /** 세션 아이디 */
  @Column({ unique: true })
  uuid: string;

  /** 쇼핑몰코드 */
  @Column({ type: 'varchar', length: 20 })
  shopCode: string;

  /** 세션 정보 */
  @Column({ type: 'text' })
  data: string;
}
