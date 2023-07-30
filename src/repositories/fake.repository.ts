import { injectable } from 'inversify';
import { faker } from '@faker-js/faker';

export interface FakeEntity {
  /** primary key */
  id: string;

  /** session data */
  sessionData: Record<string, string | number | null>;
}

export type FindOptionsSelect<Entity> = keyof Entity;
export type FindOptionsWhere<Entity> = { [P in keyof Entity]?: Entity[P] };

export interface FindOptions<Entity> {
  select: FindOptionsSelect<Entity>[];
  where: FindOptionsWhere<Entity>;
}

@injectable()
export class FakeRepository {
  private _data: FakeEntity[];

  constructor() {
    this._data = [];

    this.dummyRegist(1000);
  }

  insert(rows: Omit<FakeEntity, 'id'>[]) {
    const insertRows: FakeEntity[] = [];

    for (const row of rows) {
      insertRows.push({
        id: faker.string.uuid(),
        sessionData: row.sessionData
      });
    }

    return new Promise((resolve) => {
      this._data = this._data.concat(insertRows);

      resolve(true);
    });
  }

  private async dummyRegist(count: number) {
    const rows: FakeEntity[] = [];

    for (let i = 0; i < count; i++) {
      rows.push({
        id: faker.string.uuid(),
        sessionData: {
          [faker.git.branch()]: faker.string.alpha(10),
          [faker.git.branch()]: faker.string.alpha(10),
          [faker.git.branch()]: faker.string.alpha(10),
          [faker.git.branch()]: faker.string.alpha(10),
          [faker.git.branch()]: faker.string.alpha(10)
        }
      });
    }

    await this.insert(rows);
  }

  /**
   * 로우 조회
   * @param options select, where
   * @returns rows
   */
  find(options?: Partial<FindOptions<FakeEntity>>): Promise<FakeEntity[]> {
    return new Promise((resolve) => {
      if (options) {
        const data = options.where ? this.whereFilter(options.where) : this._data;

        if (options.select && options.select) {
          return data.map((o) =>
            options.select!.reduce((prev, current) => {
              Object.defineProperty(prev, current, {
                value: o[current],
                configurable: false,
                enumerable: true,
                writable: false
              });

              return prev;
            }, {})
          );
        }

        return resolve(data);
      }

      return resolve(this._data);
    });
  }

  // /**
  //  * 로우 삭제
  //  * @param where 조건
  //  */
  // remove(where: FindOptionsWhere<FakeEntity>) {
  //   const data = this.whereFilter(where);
  //   const index = this._data.findIndex((o) => o === data);

  //   this._data.splice(index, 1);
  // }

  /**
   * 조건 필터링
   * @param where 조건
   */
  private whereFilter(where: FindOptionsWhere<FakeEntity>) {
    return this._data.filter((o) => {
      let isFindSuccess = true;

      for (const key of Object.keys(where!)) {
        if (o[key] !== where![key]) {
          isFindSuccess = false;
          break;
        }
      }

      return isFindSuccess;
    });
  }
}
