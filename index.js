const express = require('express')
const app = express()
const port = 3000

const path = require('path');

const mongoose = require("mongoose");

const connect = async (uri) => {
    await mongoose.connect(uri);
    console.log("db connected")
}

const uri = "mongodb://localhost:27017/Chanakya"
connect(uri);
// to avoid cors error
let cors = require('cors')
app.use(cors());

// to avoid req. body is undefined i use below 2 statements
app.use(express.json());
app.use(express.urlencoded());

// app.get('/', (req, res) => {
//     const file = path.join(__dirname, 'index.html');
//     res.sendFile(file);
// })

app.use('/api/auth', require('./Routes/user'));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})