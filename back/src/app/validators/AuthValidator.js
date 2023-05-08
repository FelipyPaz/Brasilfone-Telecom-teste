const { celebrate, Joi, Segments } = require('celebrate');
const { User } = require('../models');

module.exports = {
	authenticate: celebrate({
		[Segments.BODY]: Joi.object().keys({
			user: Joi.alternatives().try(
					User.validation.username().required(),
					User.validation.email().required()
				).required(),
			password: User.validation.password().required()
		})
	})
}
