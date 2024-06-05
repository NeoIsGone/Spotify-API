const express = require('express');
const fetch = require('node-fetch');
const querystring = require('querystring');
const app = express();

const clientId = 'd17d4259218c47fc844bd881ec2daf3a';
const clientSecret = 'abf301232e70477f903c5d2672da153f';
const redirectUri = 'http://localhost:8888';

app.get('/login', (req, res) => {
    const scope = 'user-read-currently-playing';
    const authUrl = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientId,
            scope: scope,
            redirect_uri: redirectUri
        });
    res.redirect(authUrl);
});

app.get('/callback', async (req, res) => {
    const code = req.query.code || null;
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const authHeader = 'Basic ' + Buffer.from(clientId + ':' + clientSecret).toString('base64');

    const body = querystring.stringify({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri
    });

    const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: body
    });
    const tokenData = await tokenResponse.json();

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token;

    res.redirect('/#' +
        querystring.stringify({
            access_token: accessToken,
            refresh_token: refreshToken
        }));
});

app.listen(8888, () => {
    console.log('Server running on http://localhost:8888');
});