const {Pool} = require('pg')

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"charaforge",
    password:'#$*Soumya@32',
    port:5432
})

module.exports =  pool