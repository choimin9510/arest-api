import { injectable } from 'inversify';
import { ObjectLiteral, Repository } from 'typeorm';

@injectable()
export class BaseRepository<Entity extends ObjectLiteral> extends Repository<Entity> {
  constructor(target: Repository<Entity>) {
    super(target.target, target.manager, target.queryRunner);
  }
}
