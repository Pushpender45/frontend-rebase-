const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Serverless friendly MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ Database connection error:', err));
} else {
  console.error("MONGODB_URI is not defined in environment variables");
}

const todoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Root Route (to prevent 404 on Vercel)
app.get('/', (req, res) => {
  res.send('✅ Todo API is running...');
});

// GET API
app.get('/api/todos', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST API
app.post('/api/todos', async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ message: "Title is required" });
  }

  const todo = new Todo({
    title: title,
    completed: false
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5001;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;
