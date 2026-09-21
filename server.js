const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connect to database
const connectDB = require('./config/db');
connectDB();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Manager API is running' });
});

app.use('/api/tasks', require('./routes/taskRoutes'));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
