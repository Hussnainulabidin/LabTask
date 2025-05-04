const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB)
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => console.error('MongoDB connection error:', err));

// Create a Task model
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A task must have a title']
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Task = mongoose.model('Task', taskSchema);

// Enable CORS for the frontend
app.use(cors({
  origin: '*' // Vite default port
}));

// Parse JSON request body
app.use(express.json());

// API endpoint to get tasks
app.get('/api/data', async (req, res) => {
  try {
    const tasks = await Task.find();
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    
    res.status(200).json({
      status: 'success',
      data: {
        tasks,
        totalTasks,
        completedTasks
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
});

// API endpoint to create a task
app.post('/api/data', async (req, res) => {
  try {
    const newTask = await Task.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: {
        task: newTask
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

// Add a utility route to seed initial data if needed
app.post('/api/seed', async (req, res) => {
  try {
    // Remove existing tasks
    await Task.deleteMany({});
    
    // Insert sample tasks
    const sampleTasks = [
      { title: 'Complete backend setup', status: 'completed' },
      { title: 'Create frontend components', status: 'in-progress' },
      { title: 'Implement data fetching', status: 'pending' }
    ];
    
    const tasks = await Task.create(sampleTasks);
    
    res.status(201).json({
      status: 'success',
      message: 'Database seeded successfully',
      data: {
        tasks
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
