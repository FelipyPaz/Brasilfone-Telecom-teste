import { SecuritySchemeObject } from 'openapi3-ts';


export const authentication: SecuritySchemeObject = {
	type: 'apiKey',
	description: 'Um token JWT para autenticação de usuário',
	name: 'Authorization',
	in: 'header',
	scheme: 'Bearer',
	bearerFormat: 'Bearer {JWT}'
}
