"use strict";

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user = await queryInterface.sequelize.query(
      `select * from users`
    );
    if (user[0].length === 0) {
      return;
    }
    const bai_dang_cong_thuc = [];

    for (let i = 0; i <= 100; i++) {
      bai_dang_cong_thuc.push({
        id: uuidv4(),
        user_id: user[0][0].id,
        ten_bai_dang: faker.word.verb(),
        thoi_gian_nau: faker.random.numeric(),
        cac_buoc: 10,
        url_video: 'https://www.youtube.com/watch?v=owfWqUIitcQ',
        created_at: faker.date.birthdate(),
      });
    }

    await queryInterface.bulkInsert("bai_dang_cong_thuc", bai_dang_cong_thuc);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("bai_dang_cong_thuc", null, {});
  },
};
