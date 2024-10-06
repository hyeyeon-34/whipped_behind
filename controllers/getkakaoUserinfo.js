const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/auth/kakao/userinfo', async (req, res) => {
    const { access_token } = req.body;

    if (!access_token) {
        return res.status(400).json({ error: 'Access token is missing' });
    }

    try {
        const response = await fetch("https://kapi.kakao.com/v2/user/me", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${access_token}`,
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8"
            }
        });

        const userInfo = await response.json();

        if (response.ok) {
            res.json(userInfo);
        } else {
            res.status(response.status).json({
                error: userInfo.error || 'Failed to fetch user information',
                message: userInfo.error_description || response.statusText
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
