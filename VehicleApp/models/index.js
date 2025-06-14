const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

fs.readdirSync(__dirname)
  .filter((file) => file !== 'index.js' && file !== 'association.js')
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

require('./association')(db);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
