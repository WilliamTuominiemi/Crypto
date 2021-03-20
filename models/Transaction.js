const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const TransactionSchema = new Schema(
	{
		miner_id: {
			type: String,
			required: true,
		},
		sender_username: {
			type: String,
			required: true,
		},
		sender_googleId: {
			type: String,
			required: true
		},
		receiver_username: {
			type: String,
			required: true,
		},
		receiver_googleId: {
			type: String,
			required: true
		},
		amount_crypto: {
			type: String,
			required: true		
		},
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Transaction',TransactionSchema)
