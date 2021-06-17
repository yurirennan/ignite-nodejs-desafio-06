import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
   return this.repository.createQueryBuilder("users").leftJoinAndSelect("users.games", "games")
   .where("users.id = :id", { id: user_id}).getOneOrFail();
    // Complete usando ORM
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query("SELECT * FROM users ORDER BY users.first_name ASC"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(
    `
    SELECT * FROM users WHERE 
    users.first_name ilike $1 
    AND 
    users.last_name ilike $2 
    LIMIT 1
    `
    , [first_name, last_name]); // Complete usando raw query
  }
}
