const path = require('node:path')

require('dotenv').config({
  path: [
    path.resolve(__dirname, '../.env'),
    path.resolve(__dirname, '../../.env.local')
  ]
})

const express = require('express')
const cors = require('cors')
const pool = require('./db')
const charactersRouter = require('./routes/characters')
const generateRouter = require('./routes/generate');

const app=express();

app.use(cors());
app.use(express.json({limit: '10mb'}));

app.get('/api/health', (req, res) => {
  res.json({ message: 'CharaforgeAI server is running' });
})

app.use('/api/characters',charactersRouter)

app.use('/api/generate', generateRouter)

app.use((req,res)=>{
    res.status(404).json({ success:false, error: "Route not found"});
})

if (require.main === module) {
  const port = process.env.PORT || 5000
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
  })
}

module.exports = app

pool.query('SELECT NOW()',(err, result) => {
  if(err){
    console.error('Database connection failed:',err)
    return
  }

  console.log('Database Connected',result.rows[0])
})
