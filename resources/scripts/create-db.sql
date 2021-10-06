-- to deal with ER_NOT_SUPPORTED_AUTH_MODE error. Only run this line for local dev
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'root';


-- create our main user for local dev
CREATE USER IF NOT EXISTS 'my_user'@'%' IDENTIFIED BY 'root';

CREATE DATABASE IF NOT EXISTS `test_container` DEFAULT CHARACTER SET utf8 COLLATE utf8_bin;
GRANT ALL PRIVILEGES ON test_container.* TO 'my_user'@'%'  WITH GRANT OPTION;
flush privileges;
