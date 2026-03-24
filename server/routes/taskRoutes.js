// backend/routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// POST /api/tasks — create new task
router.post('/', async (req, res) => {
    
  try {
    const { title } = req.body;
    const newTask = new Task({ title });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
});
//GET /api/tasks — create new task
router.get('/', async (req, res) => {
  try {
    const tasks= await Task.find(); //fetch all data from db 
    res.status(201).json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});
//PUT /api/tasks — update a task
router.put('/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const updates = req.body; 
    const updatedTask = await Task.findByIdAndUpdate(taskId,updates,{new:true});
 
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks', error: err.message });
  }
});

// DELETE /api/tasks/:id — delete a task
router.delete('/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully', task: deletedTask });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
});


module.exports = router;
