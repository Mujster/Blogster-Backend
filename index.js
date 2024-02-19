const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes=require('./routes/authRoutes')
const blogRoutes = require('./routes/blogRoutes');
const userRoutes = require('./routes/userRoutes');

mongoose.connect('mongodb+srv://admin:admin@blogster.y53rufh.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => {console.log("Connected to MongoDB")})
.catch((err) => {console.log("Failed to connect to MongoDB", err)});    

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send("G-Lock API & Server Running...");
});

app.listen(3001, () => {
    console.log("Server is running on port 3001")
});

app.use('/', authRoutes);
app.use('/', blogRoutes);
app.use('/', userRoutes);