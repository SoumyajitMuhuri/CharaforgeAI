require('dotenv').config()

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

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
})

pool.query('SELECT NOW()',(err, result) => {
  if(err){
    console.error('Database connection failed:',err)
    return
  }

  console.log('Database Connected',result.rows[0])
})
