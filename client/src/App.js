// src/App.js
import React from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import './index.css';

function App() {
  return (
    <div className="container">
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>To Do List</h1>
      <TaskForm />
      <TaskList />
    </div>
  );
}

export default App;
