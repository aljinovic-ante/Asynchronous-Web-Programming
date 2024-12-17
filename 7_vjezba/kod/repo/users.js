const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function getUsers() {
  return db('users').select('*')
}

const SALT_ROUNDS = 10

function hashPassword (pass) {
  return bcrypt.hash(pass, SALT_ROUNDS)
}

function checkPassword(hashPassword, plainPass) {
  return bcrypt.compare(plainPass, hashPassword)
}

function jwtUserId(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET)
}

async function createUser(body) {
  const createdUserId = (await db('users').insert({ 
    email: body.email,
    password: await hashPassword(body.password)
  }))?.[0]
  return getUserById(Number(createdUserId))
}

async function getUserById(userId) {
	const user = (await db('users').where({ id: userId }))?.[0]
  return user
}

async function getUserByEmail(email) {
	const user = (await db('users').where({ email }))?.[0]
  return user
}

module.exports = {
  createUser,
  getUsers,
  getUserById,
  getUserByEmail,
  hashPassword,
  checkPassword,
  jwtUserId
}