const express = require("express");
const router = express.Router({ mergeParams: true });
const Listing = require("../models/Listing");
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/Reviews.js");
const { isLoggedin, isReviewAuthor } = require("../middleware.js");
const { validateReview } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js")

//reviews
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapAsync(ReviewController.addReview)
);

//Review Delete route
router.delete("/:rid", isLoggedin,isReviewAuthor,wrapAsync(ReviewController.delete));

module.exports = router;
