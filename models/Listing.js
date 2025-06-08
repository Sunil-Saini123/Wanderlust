const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./Reviews");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"], // must be "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // array of numbers
      required: true,
    },
  },
  category :{
    type : String,
    enum : ["Trending","Rooms","Mountains","Amazing Pools","Iconic Cities","Castles","Camping","Farms","Arctic","Domes","Boats"]
  }
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
