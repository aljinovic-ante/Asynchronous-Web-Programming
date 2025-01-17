/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  await knex("services").del();
  await knex("services").insert([
    {
      mechanicid: 1,
      carid: 1,
      description: "Oil change and engine inspection",
      status: "pending",
      starttime: new Date(),
      endtime: new Date(),
      price: 75.0,
    },
    {
      mechanicid: 2,
      carid: 2,
      description: "Brake replacement and tire alignment",
      status: "finished",
      starttime: new Date(),
      endtime: new Date(),
      price: 150.0,
    },
  ]);
};
