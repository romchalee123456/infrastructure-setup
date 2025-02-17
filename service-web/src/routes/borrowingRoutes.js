const express = require("express");
const router = express.Router();
const borrowingController = require("../controllers/borrowingController");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authorization = require("../middlewares/authorization");

router
  .route("/borrowBook/:book_id")  
  .post(
    asyncHandler(authorization),
    asyncHandler(borrowingController.borrowBook)
  );

router
  .route("/returnBook/:borrow_id")
  .put(  
    asyncHandler(authorization),
    asyncHandler(borrowingController.returnBook)
  );

router
  .route("/getBorrowingHistoryAll/")
  .get(
    asyncHandler(authorization),
    asyncHandler(borrowingController.getBorrowingHistoryAll)
  );

router
  .route("/getBorrowingHistoryById/:member_id")
  .get(
    asyncHandler(authorization),
    asyncHandler(borrowingController.getBorrowingHistoryById)
  );

router
  .route("/getBooksStatus/:member_id")
  .get(
    asyncHandler(authorization),
    asyncHandler(borrowingController.getBooksStatus)
  );

  router
  .route("/calculateFine/:borrow_id")
  .put(
    asyncHandler(authorization),
    asyncHandler(borrowingController.calculateFine)
  );

module.exports = router;
