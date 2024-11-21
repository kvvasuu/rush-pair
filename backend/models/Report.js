import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reportedBy: {
    type: String,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  referenceId: {
    type: String,
    unique: true,
    required: true,
  },
  sequenceNumber: { type: Number, required: true },
});

reportSchema.pre("validate", async function (next) {
  if (!this.isNew) return next();

  const latestReport = await Report.findOne().sort({ sequenceNumber: -1 });
  const nextSequence = latestReport ? latestReport.sequenceNumber + 1 : 1;

  this.sequenceNumber = nextSequence;

  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  this.referenceId = `${date}-${String(nextSequence).padStart(3, "0")}`;
  next();
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
