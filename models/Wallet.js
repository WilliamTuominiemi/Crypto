const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Schema
const WalletSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
		},
		googleId: {
			type: String,
			required: true
		},
		crypto: {
			type: String,
			required: true		
		},
		currency: {
			type: String,
			required: true
		}
	},
	{ timestamps: true }
)

// Model
module.exports = mongoose.model('Wallet', WalletSchema)
