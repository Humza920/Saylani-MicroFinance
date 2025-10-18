const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  category: { type: String, required: true }, // e.g. Business, Education
  subCategory: { type: String, required: true }, // e.g. Tuition Fee, Furniture
  amount: { type: Number, required: true },
  durationMonths: { type: Number, required: true },
  cnic: { type: Number, required: true },
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected", "Completed"],
    default: "Pending",
  },
  emiAmount: { type: Number, required: true },
  totalPaid: { type: Number, default: 0 }, // Total paid so far
  remainingAmount: { type: Number, },       // Remaining balance
  appliedAt: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    enum: ["InProgress", "FulFilled",""],
    default: ""
  }
});

// Pre-save hook to initialize remainingAmount
loanSchema.pre("save", function (next) {
  if (this.isNew) {
    this.remainingAmount = this.amount;
  }
  next();
});

const Loan = mongoose.model("Loan", loanSchema);

module.exports = Loan
