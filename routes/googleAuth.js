const express = require('express');
const app = express.Router();
const { google } = require('googleapis');
const dotenv = require('dotenv');
dotenv.config();

const scopes = [
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'
];

const Oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

app.get('/google-signin', (req, res) => {
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

module.exports = app;
