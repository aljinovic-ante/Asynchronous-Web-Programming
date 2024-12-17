const { expect } = require('chai')
const userRepo = require('../repo/users')

describe('User routes', function () {
	describe('GET /users', function () {
		before(async function () {
			createdUser = await userRepo.createUser({
				email: "antealjinovic",
				password: 'sifra123'
			})
		})
		it('should fetch users', async function () {
			const resp = await global.api.get('/users')
			.expect(200)
			expect(resp.body.length > 0).to.be.true
			expect(Object.keys(resp.body[0])).to.deep.equal([
				'id',
				'email',
				'password',
				'created_at'
			])
		})
	})

	describe('GET /users/:userId', async function () {
		let createdUser
		const userEmail = 'automation.test@mail.com'

		before(async function () {
			createdUser = await userRepo.createUser({
				email: userEmail,
				password: 'sifra123'
			})
		})

		it('should fetch the user by id', async function () {
			const resp = await global.api.get(`/users/${createdUser.id}`)
			.expect(200)

			expect(resp.body.email).to.be.equal(userEmail)
		})
	})

	describe('POST /users', async function () {
		it('should create a new user', async function () {
			const newEmail = 'new.email@mail.com'
			const resp = await global.api.post('/users')
			.send({
				email: newEmail,
				password: 'sifra123'
			})
			.expect(200)

			expect(resp.body.email).to.be.equal(newEmail)
		})
	})

	describe('POST /login', function () {
		it('should log in the user', async function () {
			const resp = await global.api.post('/login')
			.send({
				email: 'antealjinovic',
				password: 'sifra123'
			})

			expect(!!resp.body.token).to.be.true
		})
	})

	describe('POST /register', function () {
		it('should register a new user', async function () {
		  const resp = await global.api.post('/register')
			.send({
			  email: 'testuser1',
			  password: 'password123',
			});
	  
		  expect(resp.status).to.equal(201);
		  expect(resp.body.message).to.equal('User registered successfully');
		  expect(!!resp.body.token).to.be.true;
		});
	  
		it('should not allow duplicate registration', async function () {
		  await global.api.post('/register')
			.send({
			  email: 'testuser2',
			  password: 'password123',
			});
	  
		  const resp = await global.api.post('/register')
			.send({
			  email: 'testuser2',
			  password: 'password123',
			});
	  
		  expect(resp.status).to.equal(400);
		  expect(resp.body.message).to.equal('User already exists!!');
		});
	  });
})