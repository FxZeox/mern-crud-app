// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [taskId, setTaskId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (taskId) {
        await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { title });
      } else {
        await axios.post('http://localhost:5000/api/tasks', { title });
      }
      setTitle('');
      setTaskId(null);
      window.dispatchEvent(new Event('taskUpdated'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const editListener = (e) => {
      const { id, title } = e.detail;
      setTaskId(id);
      setTitle(title);
    };
    window.addEventListener('editTask', editListener);
    return () => window.removeEventListener('editTask', editListener);
  }, []);

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter task title"
        className="border p-2 mr-2 w-1/2"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        {taskId ? 'Update Task' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;