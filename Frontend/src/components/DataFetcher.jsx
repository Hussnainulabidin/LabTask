import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import "./DataFetcher.css";

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://taskhosting.alwaysdata.net/api/data');
      
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
            <div className="stat-item">
              <span className="stat-value">{data.totalTasks}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{data.completedTasks}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{data.totalTasks - data.completedTasks}</span>
              <span className="stat-label">Remaining</span>
            </div>
          </>
        )}
      </div>
      
      <h3>Task List</h3>
      {loading ? (
        <div className="loading-indicator">Loading tasks...</div>
      ) : error ? (
        <div className="error-message">Error: {error}</div>
      ) : (
        <ul className="task-list">
          {data.tasks.length > 0 ? (
            data.tasks.map(task => (
              <li key={task._id} className={`task-item ${task.status}`}>
                <div className="task-info">
                  <span className="task-title">{task.title}</span>
                  <span className={`task-status-badge ${task.status}`}>{task.status}</span>
                </div>
              </li>
            ))
          ) : (
            <li className="empty-list-message">No tasks found. Add some tasks to get started!</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default DataFetcher; 