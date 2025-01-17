const db = require("../db");

/**
 * Fetch all user-service relationships.
 * @returns {Promise<Array>}
 */
async function getAllUserServices() {
  return db("user_services")
    .select(
      "user_services.userid",
      "user_services.serviceid",
      "users.fullname as user_name",
      "services.description as service_description"
    )
    .leftJoin("users", "user_services.userid", "users.id")
    .leftJoin("services", "user_services.serviceid", "services.id");
}

/**
 * Fetch all services associated with a specific user.
 * @param {number} userId
 * @returns {Promise<Array>}
 */
async function getServicesByUserId(userId) {
  return db("user_services").where({ userid: userId });
}

/**
 * Fetch all users associated with a specific service.
 * @param {number} serviceId
 * @returns {Promise<Array>}
 */
async function getUsersByServiceId(serviceId) {
  return db("user_services").where({ serviceid: serviceId });
}

/**
 * Associate a user with a service.
 * @param {number} userId
 * @param {number} serviceId
 * @returns {Promise<Object>}
 */
async function addUserService(userId, serviceId) {
  await db("user_services").insert({
    userid: userId,
    serviceid: serviceId,
  });
  return { userid: userId, serviceid: serviceId };
}

/**
 * Remove a user-service association.
 * @param {number} userId
 * @param {number} serviceId
 * @returns {Promise<number>}
 */
async function removeUserService(userId, serviceId) {
  return db("user_services")
    .where({ userid: userId, serviceid: serviceId })
    .del();
}

/**
 * Check if a user is associated with a service.
 * @param {number} userId
 * @param {number} serviceId
 * @returns {Promise<boolean>}
 */
async function userServiceExists(userId, serviceId) {
  const record = await db("user_services")
    .where({ userid: userId, serviceid: serviceId })
    .first();
  return !!record;
}

module.exports = {
  getAllUserServices,
  getServicesByUserId,
  getUsersByServiceId,
  addUserService,
  removeUserService,
  userServiceExists,
};
