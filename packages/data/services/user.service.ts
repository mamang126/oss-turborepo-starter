import { usersTable } from "../schemas";
import { ServiceParent } from "../parents/service.parent";

export class UserService extends ServiceParent {
  constructor() {
    super(usersTable);
  }

  override async create(data: typeof usersTable.$inferInsert) {
    data.password = await Bun.password.hash(data.password);
    return super.create(data);
  }

  override async update(id: number, data: typeof usersTable.$inferInsert) {
    if (data.password) {
      data.password = await Bun.password.hash(data.password);
    }
    return super.update(id, data);
  }
}
