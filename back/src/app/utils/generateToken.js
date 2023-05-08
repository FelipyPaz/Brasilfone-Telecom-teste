const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

function generateToken(params = {}) {
	return jwt.sign(params, jwtConfig.secret, {
		expiresIn: 86400
	});
}

module.exports = generateToken;
