import MySQLHelper from "../src/utils/MySQLHelper";

require("dotenv-safe").config({ allowEmptyValues: false });

import DbContainer from "./DbContainer";
import UsersRepo from "../src/repos/UsersRepo";

jest.setTimeout(60 * 1000);

describe("Test container", () => {
  let dbContainer: DbContainer;
  beforeAll(async () => {
    dbContainer = new DbContainer();
    await dbContainer.start();
  });

  afterAll(async () => {
    await dbContainer.stop();
  });

  describe("Test MySQLHelper", () => {
    test("getTables", async () => {
      const mysql = new MySQLHelper();
      const tables = await mysql.getTables();
      console.debug(tables);
      expect(tables.length).toBeGreaterThan(0);
    });

    test("simple query", async () => {
      const mysql = new MySQLHelper();
      const result = await mysql.query("SELECT NOW()");
      console.debug(result);
      expect(result.length).toBeGreaterThan(0);
    });

    test("simple insert", async () => {
      const mysql = new MySQLHelper();
      const result = await mysql.insert("INSERT INTO users(username) VALUES (?)", ["test"]);
      console.debug(result);
      expect(result).toBeDefined();
    });

    test("simple delete", async () => {
      const mysql = new MySQLHelper();
      const transaction = await mysql.beginTransaction();
      try {
        await mysql.delete(transaction, "DELETE FROM users WHERE username = ?", ["admin"]);
        await mysql.commitTransaction(transaction);
        const result = await mysql.query("SELECT * FROM users WHERE username = ? ", ["admin"]);
        expect(result.length).toBe(0);
      } catch (e) {
        await mysql.rollbackTransaction(transaction);
        throw e;
      }
    });
  });

  describe("Test user repo", () => {
    test("find all users", async () => {
      const mysql = new MySQLHelper();
      const usersRepo = new UsersRepo(mysql);
      const users = await usersRepo.findAll();
      console.debug(users);
      expect(users.length).toBeGreaterThan(0);
    });
  });
});
