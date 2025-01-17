const Joi = require('joi')

const validate = section => objSchema => {
	const validationSchema = Joi.object(objSchema)

	return async (ctx, next) => {
		try {
			await validationSchema.validateAsync(ctx.request[section])
			return next()
		} catch (err) {
			ctx.status = 400;
			ctx.body = {
				message: 'Validation error',
				details: err.details.map(d => d.message),
			};
			return;
		}
	}
}

module.exports = {
	body: validate('body'),
	params: validate('params'),
}