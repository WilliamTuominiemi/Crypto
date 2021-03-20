const { Int32 } = require('bson')
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
	googleId: {
		type: String,
		required: true,
	},
	displayName: {
		type: String,
		required: true,
	},
	image: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	crypto: {
		type: Number,
		required: true
	}
})

module.exports = mongoose.model('User', UserSchema)
