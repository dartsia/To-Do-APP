var express = require('express');
var router = express.Router();
const taskController = require('../controllers/tasksController');

router.get('/tasks', taskController.getUserTasks);
router.post('/create-task', taskController.handleCreate);
router.put('/update-task/:id', taskController.updateTask);
router.put('/update-status/:id', taskController.updateTaskStatus);
router.delete('/delete-task/:id', taskController.deleteTask);
router.get('tasks/:name', taskController.getSpecificTask);


module.exports = router;