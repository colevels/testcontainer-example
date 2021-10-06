import { ExecResult } from "testcontainers/dist/docker/types";

require("dotenv-safe").config({ allowEmptyValues: false });

import { GenericContainer } from "testcontainers";
import { join } from "path";

/**
 * Container to deploy an empty DB for unit tests
 */
export default class DbContainer {
  private mySQLContainer;
  constructor() {}

  start = async () => {
    const DBCreationScript = "/usr/src/scripts/initTestDB.sh";

    console.debug("Starting test container");
    const resourcesPath = join(__dirname, "..", "resources", "scripts");
    const testScriptsPath = join(__dirname, "scripts");
    this.mySQLContainer = await new GenericContainer("mysql")
      .withName(`test_container_${Math.random()}`)
      .withEnv("MYSQL_ROOT_PASSWORD", process.env.MYSQL_PASSWORD || "root")
      .withBindMount(testScriptsPath, "/usr/src/scripts")
      .withBindMount(resourcesPath, "/usr/src/scripts/sql")
      .withExposedPorts(3306)
      .start();

    process.env.MYSQL_PORT = this.mySQLContainer.getMappedPort(3306);
    const knexCfg = require("../knexfile");

    console.debug("Creating DB");
    const creationResult: ExecResult = await this.mySQLContainer.exec(["sh", "-e", DBCreationScript]);
    console.debug(`DB creation result ${JSON.stringify(creationResult)}`);
    if (creationResult.exitCode > 0) throw new Error(`Error creating the database: ${JSON.stringify(creationResult)}`);

    console.debug("Running migrations");
    const knex = require("knex")(knexCfg);
    await knex.migrate.latest();

    console.debug("Test container started");
  };

  stop = () => {
    return this.mySQLContainer.stop();
  };
}
