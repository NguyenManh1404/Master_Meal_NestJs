'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable('nguyen_lieu', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true,
        },
        id_baidangcongthuc: {
          type: Sequelize.UUID,
          allowNull: false,
          reference: {
            model: 'bai_dang_cong_thuc',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        },
        ten_nguyen_lieu: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        so_luong: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        deleted_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
      });

      await transaction.commit();
    } catch (error) {
      console.log(error);
      await transaction.rollback();
    }
  },

  async down(queryInterface) {
    await queryInterface.dropTable('nguyen_lieu');
  },
};
