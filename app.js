if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express=require("express");
const app=express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride=require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session=require("express-session");
const flash=require("connect-flash");
const LocalStrategy = require("passport-local");
const User=require("./models/user.js")
const passport=require("passport");
const Mongostore=require("connect-mongo");

const listingRouter=require("./routes/listing");
const reviewsRouter=require("./routes/reviews");
const userRouter=require("./routes/user");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")))


const MONGO_DB_URL=process.env.ATLAS_URL;
async function main(){
    await mongoose.connect(MONGO_DB_URL);
}
main().then(()=>console.log("database connected")).catch(err=>console.log(err));

const store=Mongostore.create({
    mongoUrl : MONGO_DB_URL,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter : 24*3600,
});

store.on("error",(err)=>{
    console.log("Error in Mongo session store",err);
})

const sessionOptions={
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie:{
        expires :Date.now()+ 7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

app.get('/', (req, res) => {
  res.redirect('/listings'); // or wherever your main content is
});

app.use("/listings",listingRouter)
app.use("/listings/:id/review",reviewsRouter);
app.use("/",userRouter);


app.all('/{*any}', (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});


//error handling middleware
app.use((err,req,res,next)=>{
    let {status=500,message="Something went wrong"}=err;
    res.status(status).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log(`server is listenig at port ${port}`);
})