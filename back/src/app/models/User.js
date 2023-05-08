const bcryptjs = require('bcryptjs');
const uuid = require('uuid');
const { Joi } = require('celebrate');

const ROUNDS = 10;

module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define("User", {
		firstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		lastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		username: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false
		}
	}, {
		hooks: {
			afterValidate: async (user) => {
				user.id = uuid.v4();

				if (user.password)
					user.password = await bcryptjs.hash(user.password, ROUNDS);
			}
		},
		sequelize,
		tableName: 'users',
		underscored: true
	});

	User.validation = {
		firstName: () => Joi.string().min(3).max(15).pattern(/^[a-z]+$/i),
		lastName: () => Joi.string().min(3).max(15).pattern(/^[a-z]+$/i),
		email: () => Joi.string().max(20).email(),
		username: () => Joi.string().min(5).max(20).pattern(/^([a-z\d]-?[a-z\d]*)+[^\W_]$/i),
		password: () => Joi.string().min(8).max(30)
	}

	User.prototype.comparePassword = function(password) {
		return bcryptjs.compare(password, this.password);
	}

	return User;
};
