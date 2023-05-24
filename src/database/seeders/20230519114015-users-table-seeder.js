"use strict";

const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const users = [];

    for (let i = 0; i <= 100; i++) {
      users.push({
        id: uuidv4(),
        email: faker.internet.email(),
        name: faker.internet.userName(),
        password: bcrypt.hashSync("Abc@1234", 10),
        so_bai_dang_cong_thuc: 10,
        phone: faker.phone.number(),
        created_at: faker.date.birthdate(),
      });
    }

    await queryInterface.bulkInsert("users", users);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
