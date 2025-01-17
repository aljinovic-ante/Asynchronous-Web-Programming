/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
    await knex("cars").del();
    await knex("cars").insert([
      {
        make: "Audi",
        model: "A4",
        userid: 2,
        manufacturingyear: 2020,
      },
      {
        make: "Golf",
        model: "7",
        userid: 2,
        manufacturingyear: 2021,
      },
    ]);
  };
  