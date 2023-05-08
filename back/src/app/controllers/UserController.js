const { Op } = require('sequelize');

const { User } = require('../models');
const generateToken = require('../utils/generateToken');
const capitalize = require('../utils/capitalize');
const { updateEmail, updatePassword } = require('../validators/UserValidator');

module.exports = {
	async create(req, res) {
		const { firstName, lastName, email, username, password } = req.body;

		try {
			const userExists = await User.findOne({
				where: {
					[Op.or]: [{ email }, { username }]
				}
			});

			if (userExists)
				return res.status(400).json({ error: 'User already exists' });

			const user = await User.create({
				firstName: capitalize(firstName),
				lastName: capitalize(lastName),
				email,
				username,
				password
			});

			user.password = undefined;

			return res.status(201).json({ user, token: generateToken({ id: user.id }) });

		} catch (err) {
			return res.status(500).json();
		}
	},

	async index(req, res) {
		const { page = 1, first = '' } = req.query;

		try {
			const users = await User.findAndCountAll({
				attributes: ['id', 'username', 'firstName', 'createdAt'],
				where: {
					firstName: {
						[Op.substring]: capitalize(first)
					}
				},
				limit: 10,
				offset: (page - 1) * 10,
			});

			res.header('X-Total-Count', users.count);

			return res.json(users.rows);

		} catch (err) {
			return res.status(500).json();
		}
	},

	async show(req, res) {
		const { id } = req.params;

		if (req.userId != id)
			return res.status(401).json({
				error: 'The authenticated user cannot show another user'
			});

		try {
			const user = await User.findByPk(id);

			user.password = undefined;

			if (user) return res.json(user);

			return res.status(400).json({ error: 'User not found' });

		} catch (err) {
			return res.status(500).json();
		}
	},

	async update(req, res) {
		const { firstName, lastName } = req.body;
		const { id } = req.params;

		if (req.userId != id)
			return res.status(401).json({
				error: 'The authenticated user cannot update another user'
			});

		try {
			const [updated] = await User.update({
				firstName: (firstName) ? capitalize(firstName) : undefined,
				lastName: (lastName) ? capitalize(lastName) : undefined
			}, {
				where: { id }
			});

			if (updated) {
				const newUser = await User.findByPk(id);

				newUser.password = undefined;

				return res.json(newUser);
			}

			return res.status(400).json({ error: 'User not updated' });

		} catch (err) {
			return res.status(500).json();
		}
	},

	async updateEmail(req, res) {
		const { email, password } = req.body;
		const { id } = req.params;

		if (req.userId != id)
			return res.status(401).json({
				error: 'The authenticated user cannot update another user'
			});

		try {
			const emailIsUsed = await User.findOne({
				where: { email }
			});

			if (emailIsUsed)
				return res.status(400).json({ error: 'Email is already in use' });

			const user = await User.findByPk(id);

			if (!(await user.comparePassword(password)))
				return res.status(401).json({ error: 'Invalid password' });

			const [updated] = await User.update({
				email
			}, {
				where: { id }
			});

			if (updated) {
				// send an email to the new user address, confirming the change
				// emailService.send(emailData);
				user.email = email;
				user.password = undefined;

				return res.json(user);
			}

			return res.status(400).json({ error: 'User email not updated' });

		} catch (err) {
			return res.status(500).json();
		}
	},

	async updateUsername(req, res) {
		const { username, password } = req.body;
		const { id } = req.params;

		if (req.userId != id)
			return res.status(401).json({
				error: 'The authenticated user cannot update another user'
			});

		try {
			const usernameIsUsed = await User.findOne({
				where: { username }
			});

			if (usernameIsUsed)
				return res.status(400).json({ error: 'Username is already in use' });

			const user = await User.findByPk(id);

			if (!(await user.comparePassword(password)))
				return res.status(401).json({ error: 'Invalid password' });

			const [updated] = await User.update({
				username
			}, {
				where: { id }
			});

			if (updated) {
				// send an email to the user, confirming the change
				user.username = username;
				user.password = undefined;

				return res.json(user);
			}

			return res.status(400).json({ error: 'User username not updated' });

		} catch (err) {
			return res.status(500).json();
		}
	},

	async updatePassword(req, res) {
		const { oldPassword, newPassword } = req.body;
		const { id } = req.params;

		if (req.userId != id)
			return res.status(401).json({
				error: 'The authenticated user cannot update another user'
			});

		try {
			const user = await User.findByPk(id);

			if (!(await user.comparePassword(oldPassword)))
				return res.status(401).json({ error: 'Invalid password' });

			const [updated] = await User.update({
				password: newPassword
			}, {
				where: { id }
			});

			if (updated) {
				// send an email to the user, confirming the change
				user.password = undefined;

				return res.status(204).json();
			}

			return res.status(400).json({ error: 'User password not updated' });

		} catch (err) {
			return res.status(500).json();
		}
	},

	async destroy(req, res) {
		const { id } = req.params;

		if (req.userId != id)
			return res.status(401).json({
				error: 'The authenticated user cannot delete another user'
			});

		try {
			const destroied = await User.destroy({
				where: { id }
			});

			if (destroied) return res.status(204).json();

			return res.status(400).json({ error: 'User not deleted' });

		} catch (err) {
			return res.status(500).json();
		}
	}
}
