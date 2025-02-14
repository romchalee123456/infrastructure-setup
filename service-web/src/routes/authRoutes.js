const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authorization = require("../middlewares/authorization");

router.route("/register").post(asyncHandler(authController.register));

router.route("/login").post(asyncHandler(authController.login));

router
  .route("/refresh")
  .post(
    authorization,
    asyncHandler(authController.refreshAccessToken)
  );

module.exports = router;

