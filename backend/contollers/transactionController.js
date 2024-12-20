// const Model = require("../models/faqModel");
const QueryModel = require("../models/queryModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ApiFeatures = require("../utils/apiFeatures");
const db = require("../config/mysql_database");
const Joi = require("joi");
const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./scratch");

// const table_name = user_transction;
// const module_title = Model.module_title;
// const module_single_title = Model.module_single_title;
// const module_add_text = Model.module_add_text;
// const module_edit_text = Model.module_edit_text;
// const module_slug = Model.module_slug;
// const module_layout = Model.module_layout;

// Define the GET API to retrieve all user requests and render them in a view
// Define the API to fetch transactions
exports.allTransactions = catchAsyncErrors(async (req, res, next) => {
  // Fetch transaction data with related user info
  const [transactions] = await db.query(
    `SELECT 
        ut.user_id,
        ut.company_id,
        ut.tranction_coin,
        ut.tranction_rate,
        ut.transction_amount,
        ut.trans_doc,
        DATE_FORMAT(ut.data_created, "%d-%m-%Y %H:%i:%s") AS data_created,
        ut.status,
        u.user_name,
        ud.upi_id -- Added field from user_data table
     FROM user_transction ut
     JOIN users u ON ut.user_id = u.id
     LEFT JOIN user_data ud ON u.id = ud.user_id` );
  
  
  console.log("transactions:", transactions); // Log for debugging

  res.render("transactions/index", {
    layout: "layouts/main",
    title: "User Transactions", 
    transactions, // Pass transactions array to the frontendsdg
  });
});
exports.approveTransaction = catchAsyncErrors(async (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Update the transaction in the database
    const result = await connection.query(
      `UPDATE user_transction 
       SET status = 'approved', 
           date_approved = CURRENT_TIMESTAMP 
       WHERE user_id = ?`,
      [user_id]
    );

    if (result.affectedRows === 0) {
      throw new Error("No transaction found for the given user_id");
    }

    // Update the usercoin_audit table
    const updateAudit = await connection.query(
      `UPDATE usercoin_audit 
       SET status = 'completed' 
       WHERE transaction_id = (
           SELECT id FROM user_transction WHERE user_id = ?
       )`,
      [user_id]
    );

    if (updateAudit.affectedRows === 0) {
      throw new Error("No audit entry found for the given transaction_id");
    }

    await connection.commit();
    res.json({ success: true, message: "Transaction and audit updated successfully" });
  } catch (error) {
    await connection.rollback();
    console.error("Error approving transaction:", {
      message: error.message,
      stack: error.stack,
    });
    res.status(500).json({ success: false, message: "Internal server error" });
  } finally {
    connection.release();
  }
});


// exports.approveTransaction = catchAsyncErrors(async (req, res, next) => {
//   const { user_id } = req.body;

//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ success: false, message: "User ID is required" });
//   }

//   const connection = await db.getConnection();

//   try {
//     await connection.beginTransaction();

//     const dateApprove = new Date().toISOString().slice(0, 19).replace("T", " ");

//     const result = await connection.query(
//       `UPDATE user_transction 
//        SET status = 'approved', 
//            date_approved = ? 
//        WHERE user_id = ?`,
//       [dateApprove, user_id]
//     );

//     if (result.affectedRows === 0) {
//       throw new Error("No transaction found for the given user_id");
//     }

//     const updateAudit = await connection.query(
//       `UPDATE usercoin_audit 
//        SET status = 'completed' 
//        WHERE transaction_id = (
//            SELECT id FROM user_transction WHERE user_id = ?
//        )`,
//       [user_id]
//     );

//     if (updateAudit.affectedRows === 0) {
//       throw new Error("No audit entry found for the given transaction_id");
//     }

//     await connection.commit();
//     res.json({ success: true, message: "Transaction and audit updated successfully" });
//   } catch (error) {
//     await connection.rollback();
//     console.error("Error approving transaction:", {
//       message: error.message,
//       stack: error.stack,
//     });
//     res.status(500).json({ success: false, message: "Internal server error" });
//   } finally {
//     connection.release();
//   }
// });


// exports.approveTransaction = catchAsyncErrors(async (req, res, next) => {
//   const { user_id } = req.body;

//   // Validate input
//   if (!user_id) {
//     return res
//       .status(400)
//       .json({ success: false, message: "User ID is required" });
//   }

//   try {
//     const dateApprove = new Date().toISOString().slice(0, 19).replace("T", " "); // Current date & time

//     // Update the transaction in the database
//     const result = await db.query(
//       `UPDATE user_transction 
//            SET status = 'approved', 
//                date_approved = ? 
//            WHERE user_id = ?`,
//       [dateApprove, user_id]
//     );

//     if (result.affectedRows === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Transaction not found" });
//     }

//     res.json({ success: true, message: "Transaction approved successfully" });
//   } catch (error) {
//     console.error("Error approving transaction:", error);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });
