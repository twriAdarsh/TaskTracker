const express = require('express');
const router = express.Router();
const protect = require('../middleware/protect');
const validate = require('../middleware/validate');
const { taskCreateRules, taskUpdateRules } = require('../middleware/taskValidationRules');
const {
  getAllTasks, getTaskById, createTask, updateTask, deleteTask,
  getTaskMetadata, addCustomList, addCustomTag, clearCompletedTasks
} = require('../controllers/taskController');

// All task routes are protected — must be logged in
router.use(protect);

router.route('/metadata')
  .get(getTaskMetadata);

router.post('/metadata/list', addCustomList);
router.post('/metadata/tag', addCustomTag);

router.delete('/clear-completed', clearCompletedTasks);

router.route('/')
  .get(getAllTasks)
  .post(taskCreateRules, validate, createTask);

router.route('/:id')
  .get(getTaskById)
  .put(taskUpdateRules, validate, updateTask)
  .delete(deleteTask);

module.exports = router;
