const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt.
 * @param {string} password
 * @returns {Promise<string>}
 */
function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare a plain password with a hashed password.
 * @param {string} plainPassword
 * @param {string} hashedPassword
 * @returns {Promise<boolean>}
 */
async function checkPassword(plainPassword, hashedPassword) {
  const result = await bcrypt.compare(plainPassword, hashedPassword);
  return result;
}

/**
 * Generate a JWT for a user ID.
 * @param {number} id
 * @returns {string}
 */
function jwtUserId(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

/**
 * Fetch all users.
 * @returns {Promise<Array>}
 */
async function getUsers() {
  return db("users").select("*");
}

/**
 * Fetch a user by ID.
 * @param {number} userId
 * @returns {Promise<Object>}
 */
async function getUserById(userId) {
  return db("users").where({ id: userId }).first();
}

/**
 * Fetch a user by email.
 * @param {string} email
 * @returns {Promise<Object>}
 */
async function getUserByEmail(email) {
  return db("users").where({ email }).first();
}

/**
 * Create a new user.
 * @param {Object} body
 * @returns {Promise<Object>}
 */
async function createUser(body) {
  const createdUserId = await db("users").insert({
    email: body.email,
    password: body.password,
    fullname: body.fullname,
    role: body.role || "user",
    contact: body.contact,
  });

  return getUserById(Number(createdUserId[0]));
}

/**
 * Update an existing user by ID.
 * @param {number} userId
 * @param {Object} updates
 * @returns {Promise<Object>}
 */
async function updateUser(userId, updates) {
  if (updates.password) {
    updates.password = await hashPassword(updates.password);
  }
  await db("users").where({ id: userId }).update(updates);
  return getUserById(userId);
}

/**
 * Delete a user by ID.
 * @param {number} userId
 * @returns {Promise<number>}
 */
async function deleteUser(userId) {
  return db("users").where({ id: userId }).del();
}

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  createUser,
  updateUser,
  deleteUser,
  hashPassword,
  checkPassword,
  jwtUserId,
};
