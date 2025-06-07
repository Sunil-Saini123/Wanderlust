const mongoose = require("mongoose");
const Listing = require("../models/Listing.js")
const InitData = require("./data.js");

const MONGO_DB_URL=process.env.ATLAS_URL;
async function main(){
    await mongoose.connect(MONGO_DB_URL);
}
main().then(()=>console.log("database connected")).catch(err=>console.log(err));


const init =async ()=>{
    await Listing.deleteMany({});
    InitData.data = InitData.data.map((obj)=>({...obj,owner : "683c04205571021828ea5166"}))
    await Listing.insertMany(InitData.data);
    console.log("data added");
}

init();