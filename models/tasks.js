const pool = require('../db');

async function createTask(name, description, status = 'new', due_time, user_id) {
    const query = `
        INSERT INTO tasks (name, description, status, due_time, user_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [name, description, status, due_time, user_id];
    const result = await pool.query(query, values);
    return result.rows[0];
}

async function getTasksByUserId(userId) {
    const query = `SELECT * FROM tasks WHERE user_id = $1 ORDER BY due_time ASC;`;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

async function getTaskByName(name) {
    const result = await pool.query(
        'SELECT * FROM tasks WHERE name = $1',
        [email]
    );
    return result.rows[0];
}

async function getTaskById(taskId) {
    const query = `SELECT * FROM tasks WHERE id = $1;`;
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
}

async function updateTask(taskId, fields) {
    const keys = Object.keys(fields);
    const values = Object.values(fields);
    if (keys.length === 0) return null;

    const updates = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
    const query = `UPDATE tasks SET ${updates} WHERE id = $${keys.length + 1} RETURNING *;`;

    const result = await pool.query(query, [...values, taskId]);
    return result.rows[0];
}

async function deleteTask(taskId) {
    const query = `DELETE FROM tasks WHERE id = $1 RETURNING *;`;
    const result = await pool.query(query, [taskId]);
    return result.rows[0];
}



module.exports = {
    createTask,
    getTaskByName,
    getTasksByUserId,
    getTaskById,
    updateTask,
    deleteTask
};

