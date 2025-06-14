// const Sequelize = require("sequelize");

// const sequelize = new Sequelize("node-test", "root", "password", {
//   host: "localhost",
//   dialect: "mysql",
// });

// module.exports = sequelize;

const { MongoClient } = require("mongodb");
require("dotenv").config();

let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(process.env.mongo_url)
    .then((client) => {
      _db = client.db("shop");
      cb();
    })
    .catch(console.error);
};

const getDb = () => {
  return _db;
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
