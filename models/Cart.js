const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const CartSchema = new Schema(
	{
		googleId: {
			type: String,
			required: true		
		},
        item_id: {
			type: String,
			required: true
		},
        item_name: {
            type: String,
			required: true
        },
		image_name: {
			type: String,
			required: true		
		},
		price: {
			type: String,
			required: true
		},
        amount: {
            type: String,
			required: true 
        }
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Cart', CartSchema)