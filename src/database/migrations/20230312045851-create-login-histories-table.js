'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('login_histories', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        model_type: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        model_id: {
          type: Sequelize.UUID,
          allowNull: false,
        },
        user_agent: {
          type: Sequelize.STRING(150),
          allowNull: false,
        },
        login_ip: {
          type: Sequelize.STRING(45),
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });

      await queryInterface.addIndex('login_histories', ['model_type', 'model_id']);
      await queryInterface.addIndex('login_histories', ['login_ip']);

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('login_histories');
  },
};
