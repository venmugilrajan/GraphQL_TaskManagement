const mongoose = require("mongoose");
const TaskSchema = new mongoose.Schema({
  jobtodo: { type: String, required: true, trim: true },
  toggle: { type: Number, default: 0 }
}, { timestamps: true });
module.exports = mongoose.model("Task", TaskSchema);
