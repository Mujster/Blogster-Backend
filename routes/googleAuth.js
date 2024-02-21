const express = require('express');
const app=express;
const {google}=require('googleapis');
const dotenv=require('dotenv');
dotenv.config();

const scopes = [
    'https://www.googleapis.com/auth'
];

const Oauth2Client = new google.auth.OAuth2(
    '932534104608-duj5u9fdvc942u18u1vhr8vm2v3pqq35.apps.googleusercontent.com',
    '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',
    'http://localhost:3001/google/redirect',
);


app.get('/check', (req, res) => {
    const url = Oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    res.redirect(url);
});

app.get('/google/redirect', async (req, res) => {
    const code = req.query.code;
    const { tokens } = await Oauth2Client.getToken(code);
    Oauth2Client.setCredentials(tokens);

    res.send({ message: 'Successful Login' });
});


app.listen(3000,()=>{console.log("jfowf")});

module.exports=app;