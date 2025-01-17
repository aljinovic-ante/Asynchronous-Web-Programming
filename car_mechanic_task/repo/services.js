const db = require("../db");

/**
 * Fetch all services.
 * @returns {Promise<Array>}
 */
async function getServices() {
  return db("services").select("*");
}

/**
 * Fetch a service by ID.
 * @param {number} serviceId
 * @returns {Promise<Object>}
 */
async function getServiceById(serviceId) {
  return db("services").where({ id: serviceId }).first();
}

/**
 * Fetch services for a specific mechanic.
 * @param {number} mechanicId
 * @returns {Promise<Array>}
 */
async function getServicesByMechanicId(mechanicId) {
  return db("services")
    .where({ mechanicid: mechanicId })
    .select("*");
}

/**
 * Fetch services for a specific car.
 * @param {number} carId
 * @returns {Promise<Array>}
 */
async function getServicesByCarId(carId) {
  return db("services")
    .where({ carid: carId })
    .select("*");
}

/**
 * Create a new service.
 * @param {Object} serviceData
 * @returns {Promise<Object>}
 */
async function createService(serviceData) {
  const createdServiceId = await db("services").insert({
    mechanicid: serviceData.mechanicid,
    carid: serviceData.carid,
    description: serviceData.description,
    status: serviceData.status,
    starttime: serviceData.starttime,
    endtime: serviceData.endtime,
    price: serviceData.price,
  });

  return getServiceById(Number(createdServiceId[0]));
}

/**
 * Update an existing service by ID.
 * @param {number} serviceId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
async function updateService(serviceId, updates) {
  await db("services").where({ id: serviceId }).update(updates);
  return getServiceById(serviceId);
}

/**
 * Delete a service by ID.
 * @param {number} serviceId
 * @returns {Promise<number>}
 */
async function deleteService(serviceId) {
  return db("services").where({ id: serviceId }).del();
}

module.exports = {
  getServices,
  getServiceById,
  getServicesByMechanicId,
  getServicesByCarId,
  createService,
  updateService,
  deleteService,
};