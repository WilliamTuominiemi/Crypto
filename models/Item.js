const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const ItemSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		desc: {
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
		review: {
			type: Array
		}
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Item', ItemSchema)
