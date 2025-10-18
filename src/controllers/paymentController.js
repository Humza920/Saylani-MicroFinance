const Payment = require("../models/Payment");
const Loan = require("../models/Loan");

exports.makePayment = async (req, res) => {
    const { loanId, amountPaid } = req.body;
    const userId = req.user._id;

    try {
        const loan = await Loan.findById(loanId);
        if (!loan) return res.status(404).json({ message: "Loan not found" });

        if (loan.paymentStatus === "FulFilled" && loan.status === "Completed") {
            return res.status(400).json({
                message: "Loan already fully paid. No further payments allowed."
            });
        }

        if (loan.status !== "Approved" && loan.status !== "InProgress") {
            return res.status(400).json({ message: "Loan not approved yet" });
        }



        // Create payment
        const payment = await Payment.create({
            loan: loanId,
            user: userId,
            amountPaid,
        });

        // Update loan payments
        loan.totalPaid += amountPaid;
        loan.remainingAmount = loan.amount - loan.totalPaid;

        // Update paymentStatus
        loan.paymentStatus = loan.remainingAmount > 0 ? "InProgress" : "FulFilled";

        // If fully paid
        if (loan.remainingAmount <= 0) {
            loan.status = "Completed";
        }

        await loan.save();

        res.status(200).json({
            message: "Payment recorded successfully",
            payment,
            loan,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
