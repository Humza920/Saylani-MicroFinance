const Loan = require("../models/Loan")
const User = require("../models/User")

exports.applyLoan = async (req, res) => {
    const userId = req.user._id
    const { category, subCategory, amount, durationMonths, cnic, email, emiAmount } = req.body;

    try {
        if (!category || !subCategory || !amount || !durationMonths || !cnic || !email || !emiAmount) {
            return res.status(400).json({ success: false, message: "Fill all fields " });
        }
        const user = await User.findById(userId)
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        if (user.cnic !== cnic || user.email !== email) {
            return res.status(400).json({ message: "Invalid CNIC or Email" });
        }

        const newLoan = await Loan.create({
            user: userId,
            category,
            subCategory,
            amount,
            durationMonths,
            cnic,
            email,
            emiAmount
        });
        res.status(200).json({
            message: "Loan request submitted successfully",
            loan: newLoan,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

exports.getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user._id });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateloanstatus = async (req, res) => {
    const idFromParam = req.params.id;
    const { status } = req.body;

    try {
        // ✅ Check if status is provided
        if (!status) {
            return res.status(400).json({
                success: false,
                message: "Please provide a status",
            });
        }

        if (status !== "Approved" && status !== "Rejected") {
            return res.status(400).json({
                success: false,
                message: "Status must be either 'Approved' or 'Rejected'",
            });
        }
        // ✅ Find loan by ID
        const loan = await Loan.findById(idFromParam);
        if (!loan) {
            return res.status(404).json({
                success: false,
                message: "Loan not found",
            });
        }

        // ✅ Update status
        loan.status = status;
        await loan.save();

        // ✅ Send response
        res.status(200).json({
            success: true,
            message: `Loan status updated to '${status}'`,
            loan,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
