const { Router } = require('express');

const authMiddleware = require('./app/middlewares/auth');

const UserConroller = require('./app/controllers/UserController');
const UserValidator = require('./app/validators/UserValidator');
const AuthController = require('./app/controllers/AuthController');
const AuthValidator = require('./app/validators/AuthValidator');

const routes = Router();

// Authentication:
routes.post('/session', AuthValidator.authenticate, AuthController.authenticate);

// User:
routes.post('/users', UserValidator.create, UserConroller.create);
//rotas para uso
/* routes.get('/users', UserValidator.index, authMiddleware, UserConroller.index);
routes.get('/users/:id', UserValidator.show, authMiddleware, UserConroller.show);
routes.put('/users/:id', UserValidator.update, authMiddleware, UserConroller.update);
routes.patch('/users/:id/email', UserValidator.updateEmail, authMiddleware, UserConroller.updateEmail);
routes.patch('/users/:id/username', UserValidator.updateUsername, authMiddleware, UserConroller.updateUsername);
routes.patch('/users/:id/password', UserValidator.updatePassword, authMiddleware, UserConroller.updatePassword);
routes.delete('/users/:id', UserValidator.destroy, authMiddleware, UserConroller.destroy);
 */
module.exports = routes;
