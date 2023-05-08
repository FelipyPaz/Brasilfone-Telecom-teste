'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
			id: {
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				field: 'id'
			},
			firstName: {
				type: Sequelize.STRING,
				allowNull: false,
				field: 'first_name'
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: true,
				field: 'last_name'
			},
			email: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				field: 'email'
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
				field: 'username'
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
				field: 'password'
			},
			createdAt: {
				type: Sequelize.DATE,
				allowNull: false,
				field: 'created_at'
			},
			updatedAt: {
				type: Sequelize.DATE,
				allowNull: false,
				field: 'updated_at'
			}
		});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};
