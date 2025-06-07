const Listing = require("../models/Listing");
const Review = require("../models/Reviews");

module.exports.addReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  listing.reviews.push(review);
  await listing.save();
  await review.save();
  req.flash("success", "New Review added");
  res.redirect(`/listings/${req.params.id}`);
};

module.exports.delete = async (req, res) => {
  const { id, rid } = req.params;
  await Review.findByIdAndDelete(rid);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: rid } });

  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${req.params.id}`);
}