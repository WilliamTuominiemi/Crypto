const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const MineSchema = new Schema(
	{
		sender: {
			type: String,
			required: true,
		},
		recipient: {
			type: String,
			required: true
		},
		amount: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('BlockToMine',MineSchema)