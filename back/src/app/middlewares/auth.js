const jwt = require('jsonwebtoken');
const jwtConfig = require('../../config/jwt');

module.exports = (req, res, next) => {
	const { authorization } = req.headers;

	if (!authorization)
		return res.status(401).json({ error: 'No token provided' });

	const [ scheme, token ] = authorization.split(' ');

	if (!/^Bearer$/i.test(scheme))
		return res.status(401).json({ error: 'Malformatted token' });

	jwt.verify(token, jwtConfig.secret, (err, decoded) => {
		if (err)
			return res.status(401).json({ error: 'Invalid token' });

		req.userId = decoded.id;
		return next();
	});
}
