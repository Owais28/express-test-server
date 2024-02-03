require('dotenv').config()

module.exports = {
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABSE,
  host: process.env.MYSQL_HOST,
  dialect: 'mysql',
};