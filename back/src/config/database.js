require('./variables.env');

module.exports = {
	development: {
		dialect: process.env.DB_DIALECT || 'sqlite',
		storage: process.env.DB_STORAGE || 'src/database/development.sqlite',
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE || 'login_exemple',
		define: {
			timestamps: true,
			underscored: true
		}
	},
	production: {
		dialect: process.env.DB_DIALECT,
		dialectOptions: {
  		ssl: true
		},
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		username: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DATABASE,
		define: {
			timestamps: true,
			underscored: true
		},
		logging: false
	}
}
