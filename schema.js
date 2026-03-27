const Joi = require('joi');

module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.number().required().min(0),
        location: Joi.string().required(),
        country: Joi.string().required(),
        imageUrl: Joi.string().allow('').optional(),
        geometry: Joi.object({
            coordinates: Joi.alternatives().try(
                Joi.array().items(Joi.number()).length(2),
                Joi.string().allow('')
            ).optional()
        }).optional()
    }).required()
}); 

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required()
}); 