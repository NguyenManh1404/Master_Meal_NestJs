'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('http_requests', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        method: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        url: {
          type: Sequelize.STRING(255),
          allowNull: false,
        },
        request_ip: {
          type: Sequelize.STRING(64),
          allowNull: false,
        },
        request_body: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        response_status: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        response_body: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        error: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      }, {
        transaction: transaction
      });

      await transaction.commit();
    } catch (e) {
      console.error(e);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('http_requests');
  }
};
