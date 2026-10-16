const {Pool} = require('pg')
const {attachDatabasePool} = require('@vercel/functions')

const pool = process.env.DATABASE_URL
    ? new Pool({ connectionString: process.env.DATABASE_URL })
    : new Pool()

attachDatabasePool(pool)

module.exports =  pool
