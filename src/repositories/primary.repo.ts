import { BaseRepoPostgreSql, BaseRepository } from './base.repo';

export class PrimaryRepo<Entity> extends BaseRepoPostgreSql<Entity> {
  constructor() {
    super();
  }
  static getConnectionName() {
    return 'default';
  }
}
