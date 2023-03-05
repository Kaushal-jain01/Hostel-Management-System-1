const mongoose = require('mongoose');

// Define the schema for a complaint
const complaintSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  hostelName: {
    type: String,
    required: true
  },
  submittedBy: {
    type: String,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Pending', 'Resolved'],
    default: 'Pending'
  }
});

// Create a model for the complaint schema
const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
