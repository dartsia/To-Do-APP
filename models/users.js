const pool = require('../db');

// Створення користувача
async function createUser(username, email, hashedPassword, role) {
    const query = `
    INSERT INTO users (username, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING *;
  `;
    const values = [username, email, hashedPassword, role];
    const result = await pool.query(query, values);
    return result.rows[0];
}

// Отримання користувача за email
async function getUserByEmail(email) {
    const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
    );
    return result.rows[0];
}

// Отримання користувача за id
async function getUserById(id) {
    const result = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [id]
    );
    return result.rows[0];
}

// const updateUser = async (id, fields) => {
//     const keys = Object.keys(fields);
//     const values = Object.values(fields);
//     const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
//     const query = `UPDATE users SET ${updates} WHERE id = $${keys.length + 1} RETURNING *`;

//     const result = await pool.query(query, [...values, id]);
//     return result.rows[0];
// }

const getUserByRefreshToken = async (token) => {
    const result = await pool.query('SELECT * FROM users WHERE refresh_token = $1', [token]);
    return result.rows[0];
}

async function deleteUser(id) {
    const result = await pool.query(
        'DELETE FROM users WHERE id = $1 RETURNING *;',
        [id]
    );
    return result.rows[0];
}

async function getAllUsers() {
    const result = await pool.query('SELECT id, username, email, role FROM users;');
    return result.rows;
}



module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
    //updateUser,
    deleteUser,
    getAllUsers,
    getUserByRefreshToken
};

