/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex("users").del();
    await knex("users").insert([
      {
        email: "pero.peric@example.com",
        password: "owner1234",
        fullname: "Pero Peric",
        role: "owner",
        contact: "1234567890",
      },
      {
        email: "ivana.ivic@example.com",
        password: "customer1234",
        fullname: "Ivana Ivic",
        role: "customer",
        contact: "0987654321",
      },
      {
        email: "mestar.mestric@example.com",
        password: "hashedpassword789",
        fullname: "Mestar Mestric",
        role: "mechanic",
        contact: "1122334455",
      },
    ]);
  };
  