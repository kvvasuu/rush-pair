import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  sentByEmail: {
    type: String,
    required: true,
  },
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
