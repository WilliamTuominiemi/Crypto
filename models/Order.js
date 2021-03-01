const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const OrderSchema = new Schema(
	{
		googleId: {
			type: String,
			required: true,
		},
		recipient_name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true
		},
		address: {
			type: String,
			required: true
		},
		city: {
			type: String,
			required: true		
		},
		state: {
			type: String,
			required: true
		},
		postal_code: {
			type: String,
			required: true
		},
		country_code: {
			type: String,
			required: true
		},
		item_ids: {
			type: Array,
			required: true
		},
		subtotal: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Order', OrderSchema)
