const Task = require('../models/Task');
const User = require('../models/User');

// ─────────────────────────────────────────────
// @desc    Get all tasks for logged-in user
// @route   GET /api/tasks
// @access  Protected
// ─────────────────────────────────────────────
const getAllTasks = async (req, res) => {
  const { status, priority, list, tags, timeframe, sortBy = 'createdAt', order = 'desc' } = req.query;

  const filter = { userId: req.user._id }; // ← scope to current user
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (list) filter.list = list;
  if (tags) {
    // tags could be a comma-separated string
    const tagsArray = tags.split(',').map(tag => tag.trim());
    filter.tags = { $in: tagsArray };
  }

  // Handle timeframe filtering for "Today" and "Upcoming"
  if (timeframe) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (timeframe === 'today') {
      filter.dueDate = { $gte: today, $lt: tomorrow };
    } else if (timeframe === 'upcoming') {
      filter.dueDate = { $gte: tomorrow };
    }
  }

  const allowedSortFields = ['createdAt', 'updatedAt', 'dueDate', 'title', 'priority'];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
  const sortOrder = order === 'asc' ? 1 : -1;

  const tasks = await Task.find(filter).sort({ [sortField]: sortOrder });

  res.status(200).json({ success: true, count: tasks.length, data: tasks });
};

// ─────────────────────────────────────────────
// @desc    Get single task (must belong to user)
// @route   GET /api/tasks/:id
// @access  Protected
// ─────────────────────────────────────────────
const getTaskById = async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    const err = new Error(`Task not found with id: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, data: task });
};

// ─────────────────────────────────────────────
// @desc    Create a task for logged-in user
// @route   POST /api/tasks
// @access  Protected
// ─────────────────────────────────────────────
const createTask = async (req, res) => {
  const { title, description, status, priority, dueDate, list, tags } = req.body;
  const task = await Task.create({
    title, description, status, priority, dueDate, list, tags,
    userId: req.user._id, // ← attach owner
  });
  res.status(201).json({ success: true, message: 'Task created successfully', data: task });
};

// ─────────────────────────────────────────────
// @desc    Update a task (must belong to user)
// @route   PUT /api/tasks/:id
// @access  Protected
// ─────────────────────────────────────────────
const updateTask = async (req, res) => {
  const { title, description, status, priority, dueDate, list, tags } = req.body;

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id }, // ← ownership check
    { title, description, status, priority, dueDate, list, tags },
    { new: true, runValidators: true }
  );

  if (!task) {
    const err = new Error(`Task not found with id: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, message: 'Task updated successfully', data: task });
};

// ─────────────────────────────────────────────
// @desc    Delete a task (must belong to user)
// @route   DELETE /api/tasks/:id
// @access  Protected
// ─────────────────────────────────────────────
const deleteTask = async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!task) {
    const err = new Error(`Task not found with id: ${req.params.id}`);
    err.statusCode = 404;
    throw err;
  }
  res.status(200).json({ success: true, message: 'Task deleted successfully', data: {} });
};

// ─────────────────────────────────────────────
// @desc    Get all unique lists and tags for the user
// @route   GET /api/tasks/metadata
// @access  Protected
// ─────────────────────────────────────────────
const getTaskMetadata = async (req, res) => {
  const userId = req.user._id;

  const uniqueLists = await Task.distinct('list', { userId, list: { $ne: null, $ne: '' } });
  const uniqueTags = await Task.distinct('tags', { userId, tags: { $ne: null, $ne: [] } });

  const user = await User.findById(userId);

  // Merge default/custom ones from the user with the ones actively used in tasks
  // For backwards compatibility with existing users, supply default arrays if missing
  const userLists = user.customLists?.length ? user.customLists : ['Personal', 'Work', 'List 1'];
  const userTags = user.customTags?.length ? user.customTags : ['Tag 1', 'Tag 2'];

  const combinedLists = [...new Set([...userLists, ...uniqueLists])];
  const combinedTags = [...new Set([...userTags, ...uniqueTags])];

  res.status(200).json({ success: true, data: { lists: combinedLists, tags: combinedTags } });
};

// ─────────────────────────────────────────────
// @desc    Add a custom list
// @route   POST /api/tasks/metadata/list
// @access  Protected
// ─────────────────────────────────────────────
const addCustomList = async (req, res) => {
  const { list } = req.body;
  if (!list || list.trim() === '') {
    return res.status(400).json({ success: false, message: 'List name is required' });
  }

  const user = await User.findById(req.user._id);
  // Ensure defaults are populated before adding the new list for the first time
  if (!user.customLists || user.customLists.length === 0) {
    user.customLists = ['Personal', 'Work', 'List 1'];
  }
  if (!user.customLists.includes(list.trim())) {
    user.customLists.push(list.trim());
    await user.save();
  }

  res.status(201).json({ success: true, message: 'List added' });
};

// ─────────────────────────────────────────────
// @desc    Add a custom tag
// @route   POST /api/tasks/metadata/tag
// @access  Protected
// ─────────────────────────────────────────────
const addCustomTag = async (req, res) => {
  const { tag } = req.body;
  if (!tag || tag.trim() === '') {
    return res.status(400).json({ success: false, message: 'Tag name is required' });
  }

  const user = await User.findById(req.user._id);
  // Ensure defaults are populated before adding the new tag for the first time
  if (!user.customTags || user.customTags.length === 0) {
    user.customTags = ['Tag 1', 'Tag 2'];
  }
  if (!user.customTags.includes(tag.trim())) {
    user.customTags.push(tag.trim());
    await user.save();
  }

  res.status(201).json({ success: true, message: 'Tag added' });
};

// ─────────────────────────────────────────────
// @desc    Clear all completed tasks
// @route   DELETE /api/tasks/clear-completed
// @access  Protected
// ─────────────────────────────────────────────
const clearCompletedTasks = async (req, res) => {
  const result = await Task.deleteMany({ userId: req.user._id, status: 'completed' });
  res.status(200).json({ success: true, message: 'Completed tasks cleared', deletedCount: result.deletedCount });
};

module.exports = { 
  getAllTasks, 
  getTaskById, 
  createTask, 
  updateTask, 
  deleteTask, 
  getTaskMetadata,
  addCustomList,
  addCustomTag,
  clearCompletedTasks
};
