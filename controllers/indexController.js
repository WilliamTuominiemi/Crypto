const Transaction = require('../models/Transaction')
const User = require('../models/User')
const BlockToMine = require('../models/BlockToMine')



let BlockChain = require('../src/blockChain')
let hash = require('object-hash')


const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const admin_id = `${process.env.ADMIN_ID}`

const render_index = (req, res, user, page) => {
}

// Redirects to /posts
const main = (req, res) => {
	if(req.user === undefined) {
		res.render('index', { title: 'Main', user: "undefined", code: "-"})
	}	else {
		res.render('index', { title: 'Main', user: req.user, code: "-"})
	}
}

const send = (req, res) => {
	User.find({googleId: req.user.googleId})
	.then((result) =>	{
		if(result[0].crypto >= req.body.amount )	{
			const body = {
				sender: req.user.googleId,
				recipient: req.body.recipient_id,
				amount: req.body.amount,
			}

			console.log(body)
			
			const blockToMine = new BlockToMine(body)

			blockToMine.save()
			.then((result) => {
				res.render('index', { title: 'Main', user: req.user, code: "00"})
			})
		}	else {
			res.render('index', { title: 'Main', user: req.user, code: "51"})
		}
	})	
}

const mine_page = (req, res) => {
	BlockToMine.find()
	.then((result) => {
		res.render('mine', { title: 'Mine', user: req.user, blocks: result, code:"-"})
	})
}

const mine = (req, res) => {
	console.log(req.body.blockToMine_id)
	const filter = {_id: req.body.blockToMine_id}
	BlockToMine.findOneAndDelete({_id: req.body.blockToMine_id})
	.then((result) => {
		
		let blockChain = new BlockChain()
		
		let PROOF = 420
		blockChain.addNewTransaction(req.user.googleId, req.body.sender_id, req.body.recipient_id, req.body.amount)
		blockChain.addNewBlock(null)
		res.redirect('/mine')
		
	})
}



module.exports = {
	main,
	send,
	mine_page,
	mine
}
