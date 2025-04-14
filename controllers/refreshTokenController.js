const jwt = require('jsonwebtoken');
const { getUserByRefreshToken } = require('../models/users');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await getUserByRefreshToken(refreshToken);
        if (!foundUser) return res.sendStatus(403); // Forbidden

        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username) {
                    console.log(err);
                    console.log(foundUser.username, decoded.username)
                    return res.sendStatus(403);
                }

                const accessToken = jwt.sign(
                    {
                        id: foundUser.id,
                        username: foundUser.username,
                        role: foundUser.role, // якщо в тебе є ролі
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );

                res.json({ accessToken });
            }
        );
    } catch (err) {
        console.error('Refresh token error:', err.message);
        res.sendStatus(500);
    }
};

module.exports = handleRefreshToken;
