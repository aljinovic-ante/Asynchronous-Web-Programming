const Router = require('@koa/router')
const Joi = require('joi')

const usersRepo = require('../repo/users')
const validationMiddleware = require('../db/middleware/validate');


const router = new Router()

router.get('/users', async ctx => {
  const result = await usersRepo.getUsers()
  ctx.body = result
})

router.get(
	'/users/:userId', 
	validationMiddleware.params({
		userId: Joi.number().integer().required(),
		}),
	async ctx => {
  	ctx.body = await usersRepo.getUserById(ctx.request.params.userId)
	}
)

router.post(
	'/users', 
	validationMiddleware.body({
		email: Joi.string().trim().required(),
		password: Joi.string().trim().required(),
	}), 
	async ctx => {
  	ctx.body = await usersRepo.createUser(ctx.request.body)
	}
)

// login
router.post('/login', validationMiddleware.body({
	email: Joi.string().trim().required(),
	password: Joi.string().trim().required(),
}), 
async ctx => {
	const user = await usersRepo.getUserByEmail(ctx.request.body.email)
	console.log("USER:",user);
	if (!user) {
		ctx.body = {
			status: 401,
			message: 'Error'
		}
		return 
	}

	const isPassNotGood = await usersRepo.checkPassword(
		user.password, 
		ctx.request.body.password
	)

	if (!isPassNotGood) {
		ctx.body = {
			status: 401,
			message: 'Error 2'
		}
		return 
	}
	console.log("user: ",user);

	ctx.body = { token: usersRepo.jwtUserId(user.id) }
})


router.post('/register', validationMiddleware.body({
	email: Joi.string().trim().required(),
	password: Joi.string().trim().required(),
  }), 
  async (ctx) => {
	const { email, password } = ctx.request.body;
	console.log("EMAIL: ",email);
	console.log("password: ",password);
	const existingUser = await usersRepo.getUserByEmail(email);
	if (existingUser) {
	  ctx.status = 400;
	  ctx.body = { message: 'User already exists!!' };
	  return;
	}
	
	const hashedPassword = await usersRepo.hashPassword(password)
	const newUser = await usersRepo.createUser({ email, password: hashedPassword });
	const token = usersRepo.jwtUserId(newUser.id);
	console.log("NEW USER: ",newUser)
	ctx.status = 201;
	ctx.body = {
	  message: 'User registered successfully',
	  token,
	};
  });

module.exports = router