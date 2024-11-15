const express = require('express');
const Task = require('../models/taskModel');
const router = express.Router();

// Middleware to verify token (for protected routes)
const verifyToken = require('../middleware/verifyToken');

// Get all tasks (protected route)
router.get('/', verifyToken, async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks. Please try again later.' });
  }
});

// Get a single task by its ID (protected route)
router.get('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({ message: 'Error fetching task. Please try again later.' });
  }
});

// Add a new task (protected route)
router.post('/', verifyToken, async (req, res) => {
  const { title, description, startDate, endDate, status, progress } = req.body;

  // Validate required fields
  if (!title || !description || !startDate || !endDate || !status || progress === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const newTask = new Task({
      title,
      description,
      startDate,
      endDate,
      status,
      progress,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task. Please try again later.' });
  }
});

// Edit a task (protected route)
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, status, progress } = req.body;

  // Validate required fields
  if (!title || !description || !startDate || !endDate || !status || progress === undefined) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, startDate, endDate, status, progress },
      { new: true } // Return the updated task
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error updating task. Please try again later.' });
  }
});

// Delete a task (protected route)
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.status(200).json({ message: 'Task deleted successfully.' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task. Please try again later.' });
  }
});

module.exports = router;
