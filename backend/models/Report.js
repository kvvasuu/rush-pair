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

  const today = new Date().toISOString().slice(0, 10);
  const latestReport = await Report.findOne({
    createdAt: { $gte: new Date(today) },
  }).sort({ sequenceNumber: -1 });

  if (
    latestReport &&
    latestReport.createdAt.toISOString().slice(0, 10) === today
  ) {
    this.sequenceNumber = latestReport.sequenceNumber + 1;
  } else {
    this.sequenceNumber = 1;
  }

  this.referenceId = `${today.replace(/-/g, "")}-${String(
    this.sequenceNumber
  ).padStart(3, "0")}`;

  next();
});

const Report = mongoose.model("Report", reportSchema);

export default Report;
