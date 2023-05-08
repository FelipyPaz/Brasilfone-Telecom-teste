import { OpenAPIObject } from 'openapi3-ts';
import { schemas } from './schemas';
import { authentication } from './security';
import { session, users, users_id, users_id_email, users_id_username, users_id_password } from './paths';


const openAPI: OpenAPIObject = {
	openapi: '3.0.3',
	info: {
		title: 'login-exemple',
		description: 'Umas implementação da api de login de usuário com JWT token',
		version: '0.1.0',
		license: {
			name: 'MIT',
			url: 'https://github.com/CaioOliveira793/login-exemple-backend/blob/master/LICENSE'
		}
	},
	servers: [{
		url: 'http://localhost:{PORT}',
		description: 'Servidor de desenvolvimento',
		variables: {
			PORT: {
				default: '3333',
				enum: ['3333'],
				description: 'porta esposta pela api para as chamadas http'
			}
		}
	}, {
		url: 'https://login-exemple-backend.herokuapp.com',
		description: 'Servidor em deploy'
	}],
	components: {
		schemas,
		securitySchemes: {
			authentication
		}
	},
	tags: [{
		name: 'session'
	}, {
		name: 'users'
	}],
	paths: {
		'/session': session,
		'/users': users,
		'/users/{id}': users_id,
		'/users/{id}/email': users_id_email,
		'/users/{id}/username': users_id_username,
		'/users/{id}/password': users_id_password
	}
}

export default openAPI;
