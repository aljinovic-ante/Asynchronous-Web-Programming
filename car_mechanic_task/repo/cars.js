const db = require("../db");

/**
 * Fetch all cars.
 * @returns {Promise<Array>}
 */
async function getCars() {
  return db("cars").select("*");
}

/**
 * Fetch a car by ID.
 * @param {number} carId
 * @returns {Promise<Object>}
 */
async function getCarById(carId) {
  return db("cars").where({ id: carId }).first();
}

/**
 * Fetch cars for a specific user by `userid`.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
async function getCarsByUserId(userId) {
  return db("cars").where({ userid: userId }).select("*");
}

/**
 * Create a new car.
 * @param {Object} carData
 * @returns {Promise<Object>}
 */
async function createCar(carData) {
  const createdCarId = await db("cars").insert({
    make: carData.make,
    model: carData.model,
    userid: carData.userid,
    manufacturingyear: carData.manufacturingyear,
  });

  return getCarById(Number(createdCarId[0]));
}

/**
 * Update an existing car by ID.
 * @param {number} carId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
async function updateCar(carId, updates) {
  await db("cars").where({ id: carId }).update(updates);
  return getCarById(carId);
}

/**
 * Delete a car by ID.
 * @param {number} carId
 * @returns {Promise<number>}
 */
async function deleteCar(carId) {
  return db("cars").where({ id: carId }).del();
}

module.exports = {
  getCars,
  getCarById,
  getCarsByUserId,
  createCar,
  updateCar,
  deleteCar,
};
