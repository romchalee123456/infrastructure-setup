const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authorization = require("../middlewares/authorization");

router
  .route("/addBook")
  .post(asyncHandler(authorization), asyncHandler(bookController.addBook));

router
  .route("/updateBookById/:id")
  .put(
    asyncHandler(authorization),
    asyncHandler(bookController.updateBookById)
  );

router
  .route("/deleteBookById/:id")
  .delete(
    asyncHandler(authorization),
    asyncHandler(bookController.deleteBookById)
  );

router.route("/getBookById/:id").get(asyncHandler(bookController.getBookById));

router.route("/getAllBook").get(asyncHandler(bookController.getAllBook));

router
  .route("/searchBooks")
  .get(
    asyncHandler(authorization),
    asyncHandler(bookController.searchBooks)
  );

  router
  .route("/categories")
  .get(asyncHandler(authorization), asyncHandler(bookController.getAllCategories));


module.exports = router;
