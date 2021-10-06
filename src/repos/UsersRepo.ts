import MySQLHelper from "../utils/MySQLHelper";

interface User {
  id: number;
  userName: string;
}

export default class UsersRepo {
  private readonly db: MySQLHelper;

  constructor(mySQLHelper: MySQLHelper) {
    this.db = mySQLHelper;
  }

  public findAll = (): Promise<User[]> => {
    return this.db.query<User>("SELECT * FROM users");
  };
}
