const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { asyncHandler } = require("../middlewares/asyncHandler");
const authorization = require("../middlewares/authorization");
const isAdmin = require("../middlewares/authMiddleware");

router
  .route("/addMember")
  .post(
    asyncHandler(authorization),
    asyncHandler(isAdmin, memberController.addMember)
  );

router
  .route("/updateMember/:id")
  .put(
    asyncHandler(authorization),
    asyncHandler(memberController.updateMember)
  );

router
  .route("/deleteMemberById/:id")
  .delete(
    asyncHandler(authorization),
    asyncHandler(memberController.deleteMemberById)
  );

router.route("/getAllMember").get(asyncHandler(memberController.getAllMember));

router
  .route("/getMemberById/:id")
  .get(asyncHandler(memberController.getMemberById));

router
  .route("/getMemberByUsername/:username")
  .get(
    asyncHandler(authorization),
    asyncHandler(memberController.getMemberByUsername)
  );


  router
  .route("/updateProfilePicture")
  .put(
    authorization, 
    asyncHandler(authController.updateProfilePicture)
  );


module.exports = router;
