const express = require('express');
const connectDB = require('./config/db');

const app = express()

//Connect DB
connectDB();

//initialising middleware
app.use(express.json({extended:false}))

//Defining Routes
app.use('/api/users', require('./routes/api/users'))
app.use('/api/posts', require('./routes/api/posts'))
app.use('/api/auth', require('./routes/api/auth'))
app.use('/api/profile', require('./routes/api/profile'))


const PORT = process.env.PORT || 3000

app.listen( PORT, ()=>{
    console.log(`App running on ${PORT}`)
} )