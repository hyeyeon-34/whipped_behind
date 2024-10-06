const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());

const client_id = "38a2afec68e2505b2d742bbf2e8dea37";
const redirect_uri = "https://whippedf4.hyee34.site/login";
const client_secret = "YOUR_CLIENT_SECRET"; // Add your client secret here if required

app.get('/auth/kakao/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        return res.status(400).json({ error: 'Authorization code is missing' });
    }

    const tokenParams = new URLSearchParams({
        grant_type: "authorization_code",
        client_id: client_id,
        redirect_uri: redirect_uri,
        code: code,
        client_secret: client_secret // Remove if not required
    });

    try {
        const response = await fetch("https://kauth.kakao.com/oauth/token", {
            method: "POST",
            headers: {
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            body: tokenParams
        });

        const tokenData = await response.json();

        if (response.ok) {
            res.json(tokenData);
        } else {
            res.status(response.status).json(tokenData);
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch access token' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
