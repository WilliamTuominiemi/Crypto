const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const CoinflipSchema = new Schema(
	{
		host: {
			type: String,
			required: true,
		},
		bet: {
			type: Number,
			required: true
		}
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Coinflip',CoinflipSchema)