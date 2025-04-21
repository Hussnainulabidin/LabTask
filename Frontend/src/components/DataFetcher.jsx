import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://lab-task-api.vercel.app/api/data');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTaskAdded = (newTask) => {
    // Refresh the entire list to get the updated counts
    fetchData();
  };

  return (
    <div className="data-container">
      <h2>Task Manager</h2>
      
      <TaskForm onTaskAdded={handleTaskAdded} />
      
      <div className="task-stats">
        {loading ? (
          <p>Loading stats...</p>
        ) : error ? (
          <p>Error loading stats: {error}</p>
        ) : (
          <>
            <p>Total Tasks: {data.totalTasks}</p>
            <p>Completed Tasks: {data.completedTasks}</p>
          </>
        )}
      </div>
      
      <h3>Task List</h3>
      {loading ? (
        <div>Loading tasks...</div>
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        <ul className="task-list">
          {data.tasks.length > 0 ? (
            data.tasks.map(task => (
              <li key={task._id} className={`task-item ${task.status}`}>
                <span className="task-title">{task.title}</span>
                <span className="task-status">{task.status}</span>
              </li>
            ))
          ) : (
            <li>No tasks found. Add some tasks to get started!</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default DataFetcher; 
