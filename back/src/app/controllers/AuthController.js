const { Op } = require('sequelize');

const { User } = require('../models');
const generateToken = require('../utils/generateToken');

module.exports = {
	async authenticate(req, res) {
		const { user = '', password } = req.body;

		try {
			const findedUser = await User.findOne({
				where: {
					[Op.or]: [{ email: user }, { username: user }]
				}
			});

			if (!findedUser)
				return res.status(400).json({ error: 'User not found' });

			if (!(await findedUser.comparePassword(password)))
				return res.status(401).json({ error: 'Invalid password' });

			findedUser.password = undefined;

			return res.json({ user: findedUser, token: generateToken({ id: findedUser.id }) });

		} catch (err) {
			return res.status(500).json();
		}
	},
}
