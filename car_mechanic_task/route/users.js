const Router = require("@koa/router");
const userRepo = require("../repo/users");
const Joi = require("joi");
const validationMiddleware = require("../db/middleware/validate");

const { jwtCheck } = require("../db/middleware/auth");
const router = new Router();

/**
 * Create a new user.
 */
router.post(
  "/users",
  validationMiddleware.body({
    email: Joi.string().email().trim().required(),
    password: Joi.string().trim().min(8).required(),
    fullname: Joi.string().trim().required(),
    role: Joi.string().valid("customer", "owner", "mechanic").optional(),
    contact: Joi.string().trim().optional(),
  }),
  async (ctx) => {
    const { fullname, email, password, role, contact } = ctx.request.body;

    const existingUser = await userRepo.getUserByEmail(email);

    if (existingUser) {
      ctx.status = 409;
      ctx.body = { message: "Email is already in use." };
      return;
    }
    const hashedPassword = await userRepo.hashPassword(password);
    const newUser = await userRepo.createUser({
      fullname,
      email,
      password: hashedPassword,
      role,
      contact,
    });

    ctx.body = await userRepo.createUser(newUser);
    ctx.status = 200;
  }
);

/**
 * Get all users.
 */
router.get("/users", jwtCheck, async (ctx) => {
  ctx.body = await userRepo.getUsers();
});

/**
 * Get a single user by ID.
 */
router.get(
  "/users/:userId",
  validationMiddleware.params({
    userId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const user = await userRepo.getUserById(ctx.params.userId);
    if (!user) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }
    ctx.body = user;
  }
);

/**
 * Update a user by ID.
 */
router.put(
  "/users/:userId",
  jwtCheck,
  validationMiddleware.params({
    userId: Joi.number().integer().required(),
  }),
  validationMiddleware.body({
    email: Joi.string().email().trim().optional(),
    password: Joi.string().trim().optional(),
    fullname: Joi.string().trim().optional(),
    role: Joi.string().valid("admin", "user").optional(),
    contact: Joi.string().trim().optional(),
  }),
  async (ctx) => {
    const updatedUser = await userRepo.updateUser(
      ctx.params.userId,
      ctx.request.body
    );
    if (!updatedUser) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }
    ctx.body = updatedUser;
  }
);

/**
 * Delete a user by ID.
 */
router.delete(
  "/users/:userId",
  jwtCheck,
  validationMiddleware.params({
    userId: Joi.number().integer().required(),
  }),
  async (ctx) => {
    const deletedCount = await userRepo.deleteUser(ctx.params.userId);
    if (!deletedCount) {
      ctx.status = 404;
      ctx.body = { message: "User not found" };
      return;
    }
    ctx.status = 204;
  }
);

router.post(
  "/login",
  validationMiddleware.body({
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
  }),
  async (ctx) => {
    try {
      const user = await userRepo.getUserByEmail(ctx.request.body.email);
      if (!user) {
        ctx.body = { message: "User doesnt exist" };
        ctx.status = 401;
        return;
      }

      const userAuthenticated = await userRepo.checkPassword(
        ctx.request.body.password,
        user.password
      );

      if (!userAuthenticated) {
        ctx.body = {
          message: "Incorrect email or password. Please try again brate :)",
        };
        ctx.status = 401;
        return;
      }

      ctx.body = {
        token: userRepo.jwtUserId(user.id),
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        message: "An unexpected error occurred. Please try again later.",
      };
      ctx.status = 500;
    }
  }
);

router.post(
  "/register",
  validationMiddleware.body({
    fullname: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match.",
      }),
  }),
  async (ctx) => {
    try {
      const { fullname, email, password } = ctx.request.body;

      const existingUser = await userRepo.getUserByEmail(email);

      if (existingUser) {
        ctx.body = {
          message: "Email is already in use.",
        };
        ctx.status = 409;
        return;
      }

      const hashedPassword = await userRepo.hashPassword(password);
      const newUser = await userRepo.createUser({
        fullname,
        email,
        password: hashedPassword,
      });

      if (!newUser) {
        ctx.body = {
          message: "Could not create user.",
        };
        ctx.status = 500;
        return;
      }

      ctx.body = {
        message: "User registered successfully.",
        token: userRepo.jwtUserId(newUser.id),
      };
    } catch (error) {
      console.error(error);
      ctx.body = {
        message: "An unexpected error occurred. Please try again later.",
      };
      ctx.status = 500;
    }
  }
);

module.exports = router;
