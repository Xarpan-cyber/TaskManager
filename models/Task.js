const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title for the task'],
      trim: true,
      maxLength: [50, 'Title cannot be more than 50 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description cannot be more than 200 characters'],
    },
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
