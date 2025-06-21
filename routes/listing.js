const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin } = require("../middleware.js");
const { isOwner } = require("../middleware.js");
const { validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const { storage } = require("../cloudConfig.js");
const multer = require("multer");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedin,
    validateListing,
    upload.single("listings[image]"),
    wrapAsync(ListingController.create)
  );

//create route
router.get("/new", isLoggedin, ListingController.rendercreate);

router.post("/search",isLoggedin,wrapAsync(async (req,res)=>{
  let {search}=req.body;
 
    let query={};
    if (search) {
      query.country = { $regex: new RegExp(search, "i") }; // "i" for case-insensitive
      const listings = await Listing.find(query);
      res.render("listing/index.ejs",{lists : listings})
    }else{
      res.redirect("/listings")
    }
}))

router
  .route("/:id")
  .get(wrapAsync(ListingController.show))
  .put(
    isLoggedin,
    isOwner,
    validateListing,
    upload.single("listings[image]"),
    wrapAsync(ListingController.edit)
  )
  .delete(isLoggedin, isOwner, wrapAsync(ListingController.delete));

//edit route
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(ListingController.renderedit)
);

module.exports = router;
