const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['In Progress', 'Completed', 'Pending'], default: 'In Progress' },
    progress: { type: Number, min: 0, max: 100, default: 0 }, 
  },
  { timestamps: true } 
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
