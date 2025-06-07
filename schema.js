const joi=require("joi");

module.exports.listingSchema = joi.object({
    listings : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        price : joi.number().min(0).required(),
        country : joi.string().required(),
        location : joi.string().required()
    }).required()
});

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required()
    }).required()
})