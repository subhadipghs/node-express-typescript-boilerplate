import { User } from "../entities/user.entity";
import { inject, injectable } from "inversify";
import { Repository } from "typeorm";

@injectable()
export class UserService {
  constructor(@inject(User.name) private userRepository: Repository<User>) {}

  async create(userDto: { name: string; age: number }): Promise<User> {
    const newUser = this.userRepository.create(userDto);
    const user = await this.userRepository.save(newUser);
    return user;
  }

  async get(id: number): Promise<User | undefined> {
    const user = await this.userRepository.findOne(id);
    return user;
  }
}
