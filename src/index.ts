import UsersRepo from "./repos/UsersRepo";
import MySQLHelper from "./utils/MySQLHelper";

console.log("Hello, I am the index file");

const init = async () => {
  const mysql = new MySQLHelper();
  const usersRepo = new UsersRepo(mysql);
  const users = await usersRepo.findAll();
  console.log('google')
  console.debug(users);
};

init()
  .then(() => console.debug("ok"))
  .catch((err) => console.error(err));
