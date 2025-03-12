const mysql = require("mysql2");
const dbConfig = require("../config.json").db;

const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

module.exports = promisePool;
