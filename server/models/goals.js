const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  description: { 
    type: String, 
    required: true 
  },
  targetAmount: { 
    type: Number, 
    required: true 
  },
  currentAmount: { 
    type: Number, 
    required: true 
  },
  completionDate: { 
    type: Date, 
    required: true 
  },
  createdBy: {
    type: String,
    required: true
  }
});

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;