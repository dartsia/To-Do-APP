const { deleteUser, getAllUsers } = require('../models/users');

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (err) {
        console.error('Error getting users:', err.message);
        res.status(500).json({ message: 'Server error while retrieving users' });
    }
};

const removeUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const deletedUser = await deleteUser(userId);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
        console.error('Error deleting user:', err.message);
        res.status(500).json({ message: 'Server error while deleting user' });
    }
};

module.exports = { getUsers, removeUser };