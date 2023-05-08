import { PathItemObject, ResponseObject } from 'openapi3-ts';
import { schemas, schemaHelpers } from './schemas';


export const session: PathItemObject = {
	description: 'Recurso relacionado a sessão do usuário',
	summary: 'Login',

	post: {
		summary: 'Login de usuário',
		description: 'Retorna os dados do usuário e o token de autenticação',
		tags: ['session'],
		requestBody: {
			description: 'Dados de autenticação do usuário',
			required: true,
			content: {
				'application/json': {
					schema: {
						type: 'object',
						maxProperties: 3,
						properties: {
							user: {
								oneOf: [
									schemas.user.properties!.email,
									schemas.user.properties!.username
								]
							},
							password: schemas.user.properties!.password
						}
					},
					examples: {
						emailAuth: {
							summary: 'Autenticação com "email"',
							value: {
								user: 'name@email.com',
								password: '12345678'
							}
						},
						usernameAuth: {
							summary: 'Autenticação com "username"',
							value: {
								user: 'awesome-user-32',
								password: '12345678'
							}
						}
					}
				}
			}
		},
		responses: {
			'200': {
				description: 'O usuário foi autenticado com sucesso',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							maxProperties: 2,
							minProperties: 2,
							properties: {
								user: {
									...schemas.user,
									properties: {
										id: schemas.user.properties!.id,
										username: schemas.user.properties!.username,
										email: schemas.user.properties!.email,
										firstName: schemas.user.properties!.firstName,
										lastName: schemas.user.properties!.lastName,
										createdAt: schemas.user.properties!.createdAt,
										updatedAt: schemas.user.properties!.updatedAt
									}
								},
								token: schemaHelpers.token
							}
						}
					}
				}
			} as ResponseObject,
			'400': {
				description: 'Erro no corpo da requisição',
				content: {
					'application/json': {
						schema: {
							oneOf: [{
								title: 'Error',
								description: 'Usuário não encontrado',
								type: 'object',
								format: 'error object',
								minProperties: 1,
								properties: {
									error: {
										type: 'string',
										example: 'User not found'
									}
								}
							},
							schemaHelpers.validationError
							],
						},
						examples: {
							notFound: {
								summary: 'Usuário não encontrado',
								value: {
									error: 'User not found'
								}
							},
							validationError: {
								summary: 'Erro de validação',
								value: {
									statusCode: 400,
									error: "Bad Request",
									message: "\"page\" must be a number",
									validation: {
										source: "query",
										keys: ["page"]
									}
								}
							}
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Senha incorreta',
				content: {
					'application/json': {
						schema: {
							title: 'Error',
							description: 'Senha inválida',
							type: 'object',
							format: 'error object',
							minProperties: 1,
							properties: {
								error: {
									type: 'string',
									example: 'Invalid password'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	}
}

export const users: PathItemObject = {
	description: 'Operações nos usuários',
	summary: 'Users',

	post: {
		summary: 'Cria usuário',
		description: 'Cria e autentica um novo usuário na aplicação',
		tags: ['users'],
		requestBody: {
			description: 'Dados de criação de um usuário',
			required: true,
			content: {
				'application/json': {
					schema: {
						...schemas.user,
						properties: {
							username: schemas.user.properties!.username,
							email: schemas.user.properties!.email,
							firstName: schemas.user.properties!.firstName,
							lastName: schemas.user.properties!.lastName,
							password: schemas.user.properties!.password
						}
					}
				}
			}
		},
		responses: {
			'201': {
				description: 'Usuário criado com sucesso',
				content: {
					'application/json': {
						schema: {
							type: 'object',
							maxProperties: 2,
							minProperties: 2,
							properties: {
								user: {
									...schemas.user,
									properties: {
										id: schemas.user.properties!.id,
										username: schemas.user.properties!.username,
										email: schemas.user.properties!.email,
										firstName: schemas.user.properties!.firstName,
										lastName: schemas.user.properties!.lastName,
										password: schemas.user.properties!.password,
										createdAt: schemas.user.properties!.createdAt,
										updatedAt: schemas.user.properties!.updatedAt
									}
								},
								token: schemaHelpers.token
							}
						}
					}
				}
			} as ResponseObject,
			'400': {
				description: 'Erro no corpo da requisição',
				content: {
					'application/json': {
						schema: {
							oneOf: [{
								title: 'Error',
								description: 'Um usuário com esse email ou username já existe',
								type: 'object',
								format: 'error object',
								minProperties: 1,
								properties: {
									error: {
										type: 'string',
										example: 'User already exists'
									}
								}
							},
							schemaHelpers.validationError
							],
						},
						examples: {
							notFound: {
								summary: 'Usuário já existe',
								value: {
									error: 'User already exists'
								}
							},
							validationError: {
								summary: 'Erro de validação',
								value: {
									statusCode: 400,
									error: "Bad Request",
									message: "\"page\" must be a number",
									validation: {
										source: "query",
										keys: ["page"]
									}
								}
							}
						}
					}
				}
			} as ResponseObject,
		}
	},

	get: {
		summary: 'Lista usuários',
		description: 'Retorna uma lista de usuários',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'query',
			name: 'page',
			description: 'Pagina que será retornada',
			style: 'form',
			schema: {
				type: 'number',
				default: 1,
				example: 2
			}
		}, {
			in: 'query',
			name: 'first',
			description: 'Primeiro nome do usuário',
			style: 'form',
			schema: {
				type: 'string',
				example: 'node'
			}
		}],
		responses: {
			'200': {
				description: 'Listagem de usuários',
				headers: {
					'X-Total-Count': {
						description: 'Quantidade total de usuários encontrados',
						schema: {
							type: 'number',
							example: 27
						}
					}
				},
				content: {
					'application/json': {
						schema: {
							description: 'Array de usuários',
							type: 'array',
							maxItems: 10,
							uniqueItems: true,
							items: {
								...schemas.user,
								properties: {
									id: schemas.user.properties!.id,
									username: schemas.user.properties!.username,
									firstName: schemas.user.properties!.firstName,
									createdAt: schemas.user.properties!.createdAt
								},
							}
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	}
}

export const users_id: PathItemObject = {
	description: 'Operações nos usuários',
	summary: 'Users',

	get: {
		summary: 'Retorna usuário',
		description: 'Retorna um único usuário',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'path',
			name: 'id',
			description: 'id do usuário',
			style: 'simple',
			schema: {
				...schemas.user.properties!.id
			}
		}],
		responses: {
			'200': {
				description: 'Listagem de usuários',
				content: {
					'application/json': {
						schema: {
							...schemas.user,
							properties: {
								id: schemas.user.properties!.id,
								firstName: schemas.user.properties!.firstName,
								lastName: schemas.user.properties!.lastName,
								email: schemas.user.properties!.email,
								username: schemas.user.properties!.username,
								createdAt: schemas.user.properties!.createdAt,
								updatedAt: schemas.user.properties!.updatedAt,
							}
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							},
							deniedToken: {
								summary: 'Token negado',
								value: {
									error: 'The authenticated user cannot show another user'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	},

	put: {
		summary: 'Atualiza usuário',
		description: 'Atualiza primeiro e ultimo nome do usuário e o retorna',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'path',
			name: 'id',
			description: 'id do usuário',
			style: 'simple',
			schema: {
				...schemas.user.properties!.id
			}
		}],
		requestBody: {
			description: 'Dados de criação de um usuário',
			required: true,
			content: {
				'application/json': {
					schema: {
						...schemas.user,
						properties: {},
						anyOf: [{
							properties: {
								firstName: schemas.user.properties!.firstName,
							}
						}, {
							properties: {
								lastName: schemas.user.properties!.lastName,
							}
						}]
					},
					example: {
						firstName: 'first',
						lastName: 'last',
					}
				}
			}
		},
		responses: {
			'200': {
				description: 'Usuário atualizado',
				content: {
					'application/json': {
						schema: {
							...schemas.user,
							properties: {
								id: schemas.user.properties!.id,
								username: schemas.user.properties!.username,
								email: schemas.user.properties!.email,
								firstName: schemas.user.properties!.firstName,
								lastName: schemas.user.properties!.lastName,
								createdAt: schemas.user.properties!.createdAt,
								updatedAt: schemas.user.properties!.updatedAt
							}
						}
					}
				}
			} as ResponseObject,
			'400': {
				description: 'Erro no corpo da requisição',
				content: {
					'application/json': {
						schema: {
							...schemaHelpers.validationError
						},
						example: {
							summary: 'Erro de validação',
							value: {
								statusCode: 400,
								error: "Bad Request",
								message: "\"createdAt\" is not allowed",
								validation: {
									source: "body",
									keys: ["createdAt"]
								}
							}
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							},
							deniedToken: {
								summary: 'Token negado',
								value: {
									error: 'The authenticated user cannot update another user'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	},

	delete: {
		summary: 'Exclui usuário',
		description: 'Exclui usuário da aplicação',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'path',
			name: 'id',
			description: 'id do usuário',
			style: 'simple',
			schema: {
				...schemas.user.properties!.id
			}
		}],
		responses: {
			'204': {
				description: 'Usuário deletado com sucesso'
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							},
							deniedToken: {
								summary: 'Token negado',
								value: {
									error: 'The authenticated user cannot delete another user'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	}
}

export const users_id_email: PathItemObject = {
	description: 'Operações nos usuários',
	summary: 'Users',

	patch: {
		summary: 'Atualiza email do usuário',
		description: 'Atualiza o email do usuário e o retorna',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'path',
			name: 'id',
			description: 'id do usuário',
			style: 'simple',
			schema: {
				...schemas.user.properties!.id
			}
		}],
		requestBody: {
			description: 'Novo email do usuário',
			required: true,
			content: {
				'application/json': {
					schema: {
						properties: {
							email: schemas.user.properties!.email,
							password: schemas.user.properties!.password
						}
					}
				}
			}
		},
		responses: {
			'200': {
				description: 'Email do usuário atualizado',
				content: {
					'application/json': {
						schema: {
							...schemas.user,
							properties: {
								id: schemas.user.properties!.id,
								username: schemas.user.properties!.username,
								email: schemas.user.properties!.email,
								firstName: schemas.user.properties!.firstName,
								lastName: schemas.user.properties!.lastName,
								createdAt: schemas.user.properties!.createdAt,
								updatedAt: schemas.user.properties!.updatedAt
							}
						}
					}
				}
			} as ResponseObject,
			'400': {
				description: 'Erro no corpo da requisição',
				content: {
					'application/json': {
						schema: {
							oneOf: [{
									title: 'Error',
									description: 'Um usuário com esse email já existe',
									type: 'object',
									format: 'error object',
									minProperties: 1,
									properties: {
										error: {
											type: 'string',
											example: 'Email is already in use'
										}
									}
								},
								schemaHelpers.validationError
							]
						},
						examples: {
							notFound: {
								summary: 'Email já esta em uso',
								value: {
									error: 'Email is already in use'
								}
							},
							validationError: {
								summary: 'Erro de validação',
								value: {
									statusCode: 400,
									error: "Bad Request",
									message: "\"email\" must be a valid email",
									validation: {
										source: "body",
										keys: ["email"]
									}
								}
							}
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							},
							deniedToken: {
								summary: 'Token negado',
								value: {
									error: 'The authenticated user cannot update another user'
								}
							},
							invalidPassword: {
								summary: 'Senha invalida',
								value: {
									error: 'Invalid password'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	}
}

export const users_id_username: PathItemObject = {
	description: 'Operações nos usuários',
	summary: 'Users',

	patch: {
		summary: 'Atualiza o nome de usuário',
		description: 'Atualiza o nome de usuário e o retorna',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'path',
			name: 'id',
			description: 'id do usuário',
			style: 'simple',
			schema: {
				...schemas.user.properties!.id
			}
		}],
		requestBody: {
			description: 'Novo nome de usuário',
			required: true,
			content: {
				'application/json': {
					schema: {
						properties: {
							username: schemas.user.properties!.username,
							password: schemas.user.properties!.password
						}
					}
				}
			}
		},
		responses: {
			'200': {
				description: 'Username do usuário atualizado',
				content: {
					'application/json': {
						schema: {
							...schemas.user,
							properties: {
								id: schemas.user.properties!.id,
								username: schemas.user.properties!.username,
								email: schemas.user.properties!.email,
								firstName: schemas.user.properties!.firstName,
								lastName: schemas.user.properties!.lastName,
								createdAt: schemas.user.properties!.createdAt,
								updatedAt: schemas.user.properties!.updatedAt
							}
						}
					}
				}
			} as ResponseObject,
			'400': {
				description: 'Erro no corpo da requisição',
				content: {
					'application/json': {
						schema: {
							oneOf: [{
									title: 'Error',
									description: 'Um usuário com esse username já existe',
									type: 'object',
									format: 'error object',
									minProperties: 1,
									properties: {
										error: {
											type: 'string',
											example: 'Username is already in use'
										}
									}
								},
								schemaHelpers.validationError
							]
						},
						examples: {
							notFound: {
								summary: 'Username já esta em uso',
								value: {
									error: 'Username is already in use'
								}
							},
							validationError: {
								summary: 'Erro de validação',
								value: {
									statusCode: 400,
									error: "Bad Request",
									message: "\"username\" is required",
									validation: {
										source: "body",
										keys: ["username"]
									}
								}
							}
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							},
							deniedToken: {
								summary: 'Token negado',
								value: {
									error: 'The authenticated user cannot update another user'
								}
							},
							invalidPassword: {
								summary: 'Senha invalida',
								value: {
									error: 'Invalid password'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	}
}

export const users_id_password: PathItemObject = {
	description: 'Operações nos usuários',
	summary: 'Users',

	patch: {
		summary: 'Atualiza senha do usuário',
		description: 'Atualiza senha do usuário e o retorna',
		tags: ['users'],
		security: [{
			'authentication': []
		}],
		parameters: [{
			in: 'path',
			name: 'id',
			description: 'id do usuário',
			style: 'simple',
			schema: {
				...schemas.user.properties!.id
			}
		}],
		requestBody: {
			description: 'Nova senha do usuário',
			required: true,
			content: {
				'application/json': {
					schema: {
						properties: {
							oldPassword: schemas.user.properties!.password,
							newPassword: schemas.user.properties!.password
						}
					}
				}
			}
		},
		responses: {
			'204': {
				description: 'A senha do usuário foi atualizada'
			} as ResponseObject,
			'400': {
				description: 'Erro no corpo da requisição',
				content: {
					'application/json': {
						schema: {
							...schemaHelpers.validationError
						}
					}
				}
			} as ResponseObject,
			'401': {
				description: 'Erro de atenticação',
				content: {
					'application/json': {
						schema: schemaHelpers.authenticationError,
						examples: {
							noTokenProvided: {
								summary: 'Nenhum token enviado',
								value: {
									error: 'No token provided'
								}
							},
							malformatedToken: {
								summary: 'Token malformatado',
								value: {
									error: 'Malformatted token'
								}
							},
							invalidToken: {
								summary: 'Token inválido',
								value: {
									error: 'Invalid token'
								}
							},
							deniedToken: {
								summary: 'Token negado',
								value: {
									error: 'The authenticated user cannot update another user'
								}
							},
							invalidPassword: {
								summary: 'Senha invalida',
								value: {
									error: 'Invalid password'
								}
							}
						}
					}
				}
			} as ResponseObject
		}
	}
}
