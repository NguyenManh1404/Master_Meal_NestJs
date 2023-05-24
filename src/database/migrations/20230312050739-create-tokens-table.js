'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('tokens', {
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
        token_type: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        token_value: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });

      await queryInterface.addIndex('tokens', ['model_type', 'model_id']);

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tokens');
  },
};
