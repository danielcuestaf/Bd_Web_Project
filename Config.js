require('dotenv').config()
const PASSWORD = process.env.PASSWORD
const ORACLE_CLIENT = process.env.ORACLE_CLIENT
const PORT = process.env.PORT

module.exports = {
    PASSWORD,
    ORACLE_CLIENT,
    PORT
}