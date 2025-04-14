const pool = require('../db');
const tasksModel = require('../models/tasks');

const handleCreate = async (req, res) => {
    const { name, description, status, due_time } = req.body;
    const user_id = req.user?.id || req.body.user_id;

    if (!name || !user_id) {
        return res.status(400).json({ message: 'Name and user_id are required.' });
    }

    try {
        const newTask = await tasksModel.createTask(name, description, status, due_time, user_id);
        res.status(201).json(newTask);
    } catch (err) {
        console.error('Create task error:', err.message);
        res.status(500).json({ message: 'Server error while creating task.' });
    }
}

const updateTaskStatus = async (req, res) => {
    const taskId = req.params.id;
    const newStatus = req.body;

    try {
        const updatedTask = await tasksModel.updateTask(taskId, newStatus);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or not updated.' });
        }
        res.json(updatedTask);
    } catch (err) {
        console.error('Update task error:', err.message);
        res.status(500).json({ message: 'Server error while updating task.' });
    }
}

const updateTask = async (req, res) => {
    const taskId = req.params.id;
    const fieldsToUpdate = req.body;

    try {
        const updatedTask = await tasksModel.updateTask(taskId, fieldsToUpdate);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found or not updated.' });
        }
        res.json(updatedTask);
    } catch (err) {
        console.error('Update task error:', err.message);
        res.status(500).json({ message: 'Server error while updating task.' });
    }
}

const getUserTasks = async (req, res) => {
    const user_id = req.user?.id || req.params.userId;

    if (!user_id) {
        return res.status(400).json({ message: 'User id is required.' });
    }

    let statuses = [];
    if (req.query.status) {
        statuses = req.query.status.split(',').map(s => s.trim());
    }

    try {
        const tasks = await tasksModel.getTasksByUserId(user_id, statuses);
        res.json(tasks);
    } catch (err) {
        console.error('Get tasks error:', err.message);
        res.status(500).json({ message: 'Server error while getting tasks.' });
    }
}

const deleteTask = async (req, res) => {
    const taskId = req.params.id;

    try {
        const task = await tasksModel.deleteTask(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.json(task);
    } catch (err) {
        console.error('Get task error:', err.message);
        res.status(500).json({ message: 'Server error while deleting task.' });
    }
}

const getSpecificTask = async (req, res) => {
    const taskName = req.query.name;

    try {
        const task = await tasksModel.getTaskByName(taskName);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        res.json(task);
    } catch (err) {
        console.error('Get task error:', err.message);
        res.status(500).json({ message: 'Server error while getting task.' });
    }
}

module.exports = {
    handleCreate,
    updateTaskStatus,
    updateTask,
    getUserTasks,
    deleteTask,
    getSpecificTask
}