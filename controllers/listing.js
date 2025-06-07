const Listing = require("../models/Listing");

async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });
    const data = await response.json();

    if (data.length > 0) {
      const firstResult = data[0];
      const lat = firstResult.lat;
      const lon = firstResult.lon;
      console.log(`Coordinates of ${address}: ${lat}, ${lon}`);
      return { lat, lon };
    } else {
      console.log("No results found");
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}


module.exports.index = async (req, res) => {
  const lists = await Listing.find();
  res.render("listing/index.ejs", { lists });
};

module.exports.rendercreate = (req, res) => {
  res.render("listing/create.ejs");
};

module.exports.create = async (req, res) => {
  let url=req.file.path;
  let filename=req.file.filename;

  let listings = req.body.listings;

  let address=listings.location;
  let coord=await geocodeAddress(address);
  let lat=coord.lat;
  let lon=coord.lon;

  const newListing = new Listing(listings);
  newListing.owner = req.user._id;
  newListing.image = {url,filename};
  newListing.geometry = {
    type: "Point",
    coordinates: [lon, lat]  // longitude first, then latitude
  }
  await newListing.save();

  console.log(newListing);
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: "author" })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you request for does not exist");
    return res.redirect("/listings");
  }
  res.render("listing/show.ejs", { listing });
};

module.exports.renderedit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you request for does not exist");
    return res.redirect("/listings");
  }

  let originalImage=listing.image.url;
  originalImage=originalImage.replace("/upload","/upload/w_250")

  res.render("listing/edit.ejs", { listing , originalImage});
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing=await Listing.findByIdAndUpdate(id, { ...req.body.listings });

  if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename = req.file.filename;

    listing.image = {url,filename};
    await listing.save();
  }

  req.flash("success", "Listing Edited");
  res.redirect(`/listings/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
