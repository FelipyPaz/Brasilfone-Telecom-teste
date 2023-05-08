import { SchemasObject } from 'openapi3-ts';


export const schemaHelpers: SchemasObject = {
	timeUTC: {
		title: 'Time UTC',
		type: 'string',
		format: 'date-time',
		nullable: false,
		uniqueItems: false,
		example: '2020-04-25T14:58:07.493Z',
		minLength: 24,
		maxLength: 24,
		pattern: '/^\\d{4}-[01]{1}\\d{1}-[0-3]{1}\\d{1}T[0-2]{1}\\d{1}:[0-6]{1}\\d{1}:[0-6]{1}\\d{1}.\\d{3}Z$/'
	},
	name: {
		title: 'Name',
		type: 'string',
		nullable: false,
		uniqueItems: false,
		example: 'Node',
		minLength: 3,
		maxLength: 15,
		pattern: '/^[A-Z][a-z]+$/'
	},
	token: {
		title: 'Token',
		type: 'string',
		format: 'JWT',
		nullable: false,
		uniqueItems: true
	},
	validationError: {
		title: 'Validation error',
		description: 'Campos não validos ou inexistentes na requisição',
		type: 'object',
		format: 'validation error object',
		minProperties: 4,
		properties: {
			statusCode: {
				type: 'number',
				example: 400
			},
			error: {
				type: 'string',
				example: 'Bad request'
			},
			message: {
				type: 'string',
				examples: [
					'{property} is required',
					'{property} is not allowed',
					'{property} does not match any of the allowed types',
					'{property} with value {value} fails to match the required pattern: {pattern}'
				]
			},
			validation: {
				type: 'object',
				minProperties: 2,
				properties: {
					source: {
						type: 'string',
						enum: [
							'body',
							'query',
							'headers',
							'params',
							'cookies',
							'signedCookies'
						],
					},
					keys: {
						type: 'array',
						minItems: 1,
						uniqueItems: true,
						items: {
							type: 'string',
							example: 'page'
						}
					}
				}
			}
		}
	},
	authenticationError: {
		title: 'Authentication error',
		description: 'Token não enviado ou mal formatado',
		type: 'object',
		format: 'validation error object',
		minProperties: 1,
		properties: {
			error: {
				type: 'string',
				oneOf: [{
					example: 'No token provided'
				}, {
					example: 'Malformatted token'
				}, {
					example: 'Invalid token'
				}]
			}
		}
	}
}

export const schemas: SchemasObject = {
	user: {
		title: 'User',
		description: 'User model',
		type: 'object',
		nullable: false,
		minProperties: 7,
		maxProperties: 8,
		properties: {
			id: {
				title: 'ID',
				type: 'string',
				format: 'UUID v4',
				nullable: false,
				uniqueItems: true,
				example: '407105b3-e059-4e4c-8aca-e9164046d1ac',
			},
			username: {
				title: 'Username',
				type: 'string',
				nullable: false,
				uniqueItems: true,
				example: 'username-43',
				minLength: 5,
				maxLength: 20,
				pattern: '/^([a-z\\d]-?[a-z\\d]*)+[^\\W_]$/i'
			},
			email: {
				title: 'Email',
				type: 'string',
				format: 'email',
				nullable: false,
				uniqueItems: true,
				example: 'name@email.com',
				minLength: 3,
				maxLength: 254,
			},
			password: {
				title: 'Password',
				type: 'string',
				format: 'password',
				nullable: false,
				uniqueItems: false,
				example: '',
				minLength: 8,
				maxLength: 30,
				pattern: ''
			},
			firstName: {
				...schemaHelpers.name,
				title: 'First Name',
			},
			lastName: {
				...schemaHelpers.name,
				title: 'Last Name',
			},
			createdAt: {
				...schemaHelpers.timeUTC,
				title: 'Created At',
			},
			updatedAt: {
				...schemaHelpers.timeUTC,
				title: 'Updated At',
			}
		},
	},
}
