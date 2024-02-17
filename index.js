const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes=require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes');

mongoose.connect('mongodb://127.0.0.1/Blogster', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log("Connected to MongoDB")})
.catch((err) => {console.log("Failed to connect to MongoDB", err)});    

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Hello World");
});

app.listen(3001, () => {
    console.log("Server is running on port 3001")
});

app.use('/', authRoutes);
app.use('/', blogRoutes);