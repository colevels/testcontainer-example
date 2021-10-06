import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex("users").insert({
    username: "admin",
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex("users").where("username", "admin").del();
}
