'use strict';

module.exports = {
    development: {
        "username": "root",
        "password": "Yg9YhKp9yKkY",
        "database": "micromall",
        "host": "127.0.0.1",
        "dialect": "mysql"
    },
    production: {
        "username": process.env.MYSQL_DB_USERNAME,
        "password": process.env.MYSQL_DB_PASSWORD,
        "database": process.env.MYSQL_DB_NAME,
        "host": process.env.MYSQL_DB_HOST,
        "dialect": "mysql"
    }
} 