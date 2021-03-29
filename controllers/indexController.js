const Transaction = require('../models/Transaction')
const User = require('../models/User')
const BlockToMine = require('../models/BlockToMine')
const Coinflip = require('../models/Coinflip')


let BlockChain = require('../src/blockChain')
let BlockChainModel = require('../src/database/model')

let hash = require('object-hash')


const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const admin_id = `${process.env.ADMIN_ID}`

const house = '118195899940427162005'

const render_index = (req, res, user, page) => {
}

// Redirects to /
const main = (req, res) => {
	if(req.user === undefined) {
		res.render('index', { title: 'Main', user: "undefined", code: "-"})
	}	else {
		res.render('index', { title: 'Main', user: req.user, code: "-", public_key: req.user.googleId })
	}
}

const send_page = (req, res) => {
	if(req.user === undefined) {
		res.render('send', { title: 'Main', user: "undefined", code: "-"})
	}	else {
		res.render('send', { title: 'Main', user: req.user, code: "-", public_key: req.user.googleId })
	}
}

const create_blocktomine = (res, req, sender, recipient, amount, page, title, code) => {
	const body = {
		sender: sender,
		recipient: recipient,
		amount: amount,
	}
	
	const blockToMine = new BlockToMine(body)
	console.log(blockToMine)

	blockToMine.save()
	.then((result) => {
		res.render(page, { title: title, user: req.user, code: code })
	})
}

const send = (req, res) => {
	User.find({googleId: req.user.googleId})
	.then((result) =>	{
		const amount_int = parseInt(req.body.amount)
		const neg_amount_int = 0 - amount_int
		if(result[0].crypto >= req.body.amount )	{
			User.findOneAndUpdate({ googleId: req.user.googleId }, {$inc : {'crypto' : neg_amount_int}})
			.then(() => {
				create_blocktomine(res, req,  req.user.googleId, req.body.recipient_id, req.body.amount, 'send', 'Main', '00')
			})
		}	else {
			res.render('index', { title: 'Main', user: req.user, code: "51" })
		}
	})	
}

const mine_page = (req, res) => {
	if(req.user != undefined)
	{
		BlockToMine.find()
		.then((result) => {
			res.render('mine', { title: 'Mine', user: req.user, blocks: result, code:"-"})
		})
	}	else	{
		res.redirect('/')
	}
}

const mine = (req, res) => {
	if(req.user != undefined)
	{
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
	}	else	{
		res.redirect('/')
	}
	
}

const blockchain = (req, res) => {
	BlockChainModel.find()
	.sort({ timestamp: -1 })
	.then((result) => {
		if(req.user === undefined) res.render('blockchain', { title: 'Main', user: "undefined", blockchain: result })
		else res.render('blockchain', { title: 'Main', user: req.user, blockchain: result })
	})
	
}

const coinflip_page = (req, res) => {
	Coinflip.find()
	.then((result) => {
		res.render('coinflip', { title: 'Coinflip', user: req.user, coinflips: result})
	})
}

const coinflip = (req, res) => {
	const amount_int = parseInt(req.body.amount)
    const neg_amount_int = 0 - amount_int
	
	User.findOneAndUpdate({ googleId: req.user.googleId }, {$inc : {'crypto' : neg_amount_int}})
    .then(() => {
		const coin = Math.floor(Math.random() * 2)
		if(coin === parseInt(req.body.coinflip))	{
			create_blocktomine(res, req,  house, req.user.googleId, req.body.amount, 'index', 'Main', '01')
		}	else	{
			create_blocktomine(res, req, req.user.googleId, house, req.body.amount, 'index', 'Main', '10')
		}
	})
}



module.exports = {
	main,
	send,
	mine_page,
	mine,
	blockchain,
	coinflip,
	send_page
}
