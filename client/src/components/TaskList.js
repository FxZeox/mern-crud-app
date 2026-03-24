// src/components/TaskList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (task) => {
    window.dispatchEvent(new CustomEvent('editTask', { detail: { id: task._id, title: task.title } }));
  };

  useEffect(() => {
    fetchTasks();
    const updateListener = () => fetchTasks();
    window.addEventListener('taskUpdated', updateListener);
    return () => window.removeEventListener('taskUpdated', updateListener);
  }, []);

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task._id} className="border p-3 flex justify-between items-center">
          <span>{task.title}</span>
          <div className="space-x-2">
            <button onClick={() => handleEdit(task)} className="bg-yellow-500 px-3 py-1 text-white rounded">
              Edit
            </button>
            <button onClick={() => handleDelete(task._id)} className="bg-red-600 px-3 py-1 text-white rounded">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;