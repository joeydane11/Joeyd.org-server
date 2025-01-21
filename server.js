const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

const clientId = '6325271009758156790';
const clientSecret = 'RBX-p83OHqrsO0mfkJuMEEcHOrksrKTv-n88W4iIPNl4UCOMMFrtl9A6CWoAFnn15prM';
const redirectUri = 'https://joeyd.org/index.html';

app.get('/exchange-token', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: 'No code provided' });
    }

    try {
        const response = await axios.post('https://api.roblox.com/oauth/token', {
            client_id: clientId,
            client_secret: clientSecret,
            code: code,
            redirect_uri: redirectUri,
            grant_type: 'authorization_code'
        });

        const accessToken = response.data.access_token;

        // Use the access token to get user information
        const userResponse = await axios.get('https://users.roblox.com/v1/users/authenticated', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const user = userResponse.data;
        const userInfo = {
            username: user.name,
            avatarUrl: `https://www.roblox.com/headshot-thumbnail/image?userId=${user.id}&width=100&height=100&format=png`
        };

        res.json({ user: userInfo });
    } catch (error) {
        console.error('Error exchanging token:', error);
        res.status(500).json({ error: 'Failed to authenticate' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
