const bcrypt = require('bcrypt')
const pool = require('../db');
const { createUser, getUserByEmail, getUserByRefreshToken } = require('../models/users');

const jwt = require('jsonwebtoken');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password)
        return res.status(400).json({ message: 'Username, email, and password are required.' });

    try {
        const existing = await getUserByEmail(email);
        if (existing) return res.status(409).json({ message: 'User already exists.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(username, email, hashedPassword, 'user'); // role за замовчуванням

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Email and password are required.' });

    try {
        const user = await getUserByEmail(email);
        if (!user) return res.status(401).json({ message: 'Invalid credentials.' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials.' });

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await pool.query(
            'UPDATE users SET refresh_token = $1 WHERE id = $2',
            [refreshToken, user.id]
        );

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'None',
            maxAge: 24 * 60 * 60 * 1000, // 1 день
        });

        res.json({ accessToken });
    } catch (err) {
        console.error('Login error:', err.message);
        res.sendStatus(500);
    }
}

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    console.log(refreshToken)

    try {
        const foundUser = await getUserByRefreshToken(refreshToken);

        if (!foundUser) {
            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
            return res.sendStatus(204);
        }

        await pool.query(
            'UPDATE users SET refresh_token = $1 WHERE id = $2',
            [null, foundUser.id]
        );

        res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        res.sendStatus(204);
    } catch (err) {
        console.error('Logout error:', err.message);
        res.sendStatus(500);
    }
}

module.exports = {
    handleRegister,
    handleLogin,
    handleLogout
}