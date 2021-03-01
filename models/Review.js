const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const ReviewSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		desc: {
			type: String,
			required: true
		},
		rating: {
			type: String,
			required: true		
		},
        itemId: {
            type: String,
			required: true	
        },
        itemName: {
            type: String,
			required: true	
        },
		googleId: {
			type: String,
			required: true
		},
        name: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Review', ReviewSchema)
