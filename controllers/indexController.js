const Item = require('../models/Item')
const Order = require('../models/Order')
const Cart = require('../models/Cart')
const Review = require('../models/Review')



const dotenv = require('dotenv')

dotenv.config({ path: './config/config.env' })

const admin_id = `${process.env.ADMIN_ID}`

const render_index = (req, res, user, dev, page) => {
	Item.find()
	.then((result) => {
		res.render(page, { title: 'Main', user: user, dev: dev, items: result})
	})
	.catch((err) => {
		console.log(err)
	})
}

// Redirects to /posts
const index_store = (req, res) => {
	if(req.user === undefined) {
		render_index(req, res, "undefined", false, 'index')
	}	else {
		if(req.user.googleId.toString() === admin_id)	{
			render_index(req, res, req.user, true, 'index')

		}	else {
			render_index(req, res,req.user, false, 'index')
		}
	}
}

const index_dev = (req, res) => {
	if(req.user === undefined) {
		res.status(404).render('404', { title: 'Page not found', user: "undefined", dev: false })
	}	else {
		if(req.user.googleId.toString() === admin_id) {
			res.render('dev', { title: 'DEV', user: req.user,  dev: true })
		}	else {
			res.status(404).render('404', { title: 'Page not found', user: "undefined", dev: false })
		}
	}
}

const index_dev_post = (req, res) => {
	const item = new Item(req.body)
	item
		.save()
		.then((result) => {
			res.redirect('/dev')
		})
		.catch((err) => {
			console.log(err)
	})
}

const product_page = (req, res) => {
	const param = req.params.id
	console.log('param' , param)
	const page = 'product'
	Item.find( {_id: param})
	.then((result) => {
		Review.find({itemId: param})
		.then((reviews) => {
			console.log(reviews)
			if(req.user === undefined) {
				res.render(page, { title: result[0].title, user: "undefined", dev: false, data: result[0], reviews: reviews })
			}	else {
				if(req.user.googleId.toString() === admin_id)	{
					res.render(page, { title: result[0].title, user: req.user, dev: true, data: result[0], reviews: reviews })
				}	else {
					res.render(page, { title: result[0].title, user: req.user, dev: false, data: result[0], reviews: reviews })
				}
			}
		})	
	})
}

const orders = (req, res) => {
	const page = 'orders'
	if(req.user === undefined) {
		res.redirect('/auth/google')
	}	
	else {
		let items = [];
		let data = [];
		
		const param = req.user.googleId

		Order.find( {googleId: param})
		.then((result) => {
			async function f() {
				let data1;

				result.forEach(order => {
					let array = [];
					
					order.item_ids.forEach(item => {
						Item.find({_id: item.id})
						.then((result1) => {
							const _item = {
								"item_": result1[0],
								"amount": item.amount
							}
							array.push(_item)
						})
					})
					data1 = {
						order,
						array
					}
					data.push(data1)
					items.push(array)
				})

				let promise = new Promise((resolve, reject) => {
					setTimeout(() => resolve("done!"), 1000)
				});
			
				let p_result = await promise; // wait until the promise resolves (*)

				res.render(page, { title: 'Orders', user: req.user, dev: false, data: data})
			}		
			f();
		})
	}		
}

const add_to_cart = (req, res) => {
	console.log(req.body, req.user.googleId)

	Item.find( {_id: req.body.id} )
	.then((result) => {
		const body = {
			googleId: req.user.googleId,
			item_id: result[0]._id.toString(),
			item_name: result[0].title,
			image_name: result[0].image_name,
			price: result[0].price,
			amount: req.body.amount
		}

		const cart = new Cart(body)

		cart
			.save()
			.then((result) => {
				res.redirect('/cart')
			})
			.catch((err) => {
				console.log(err)
		})
	})
}

const cart = (req, res) => {
	Cart.find( { googleId: req.user.googleId})
	.sort({ createdAt: -1 })
	.then((result) => {
		res.render('cart', { title: 'Cart', user: req.user, dev: false, items: result})
	})
}

const edit_cart = (req, res) => {
	const filter = {_id: req.body.id}
	if(parseInt(req.body.amount) === 0)	{
		Cart.findOneAndDelete(filter)
		.then((result) => {
			res.redirect('/cart')
		})
	}	else {
		const update = {amount: req.body.amount}
	
		Cart.findOneAndUpdate(filter, update)
		.then((result) => {
			res.redirect('/cart')
		})
	}	
}

const reviews = (req, res) => {
	console.log("pog")
	Review.find({googleId: req.user.googleId})
	.then((result) => {
		Item.find({_id: result})
		res.render('reviews', { title: 'Reviews', user: req.user, dev: false, reviews: result})
	})
}

const review = (req, res) => {
	const param = req.params.id

	Item.find( { _id: param})
	.sort({ createdAt: -1 })
	.then((result) => {
		Review.find({googleId: req.user.googleId, itemId: param})
		.then((result1) => {
			if(result1.length === 0)	{
				res.render('review', { title: 'Review', user: req.user, dev: false, item: result[0], review: "undefined"})
			}	else{
				res.render('review', { title: 'Review', user: req.user, dev: false, item: result[0], review: result1[0]})
			}
		})
	})
}

const write_review = (req, res) => {
	const param = req.params.id

	const url = `/${param}`

	if(req.body.update === "true")	{
		const filter = {itemId: req.body.itemId, googleId: req.user.googleId}
		const update = {
			title: req.body.title,
			desc: req.body.desc,
			rating: req.body.rating
		}
		delete review.update;
		Review.findOneAndUpdate(filter, update)
		.then((result) => {
			Item.findOneAndUpdate(
				{_id: req.body.itemId}, 
				{ $set: 
					{
						review: {
							"googleId": req.user.googleId,
							"rating" : req.body.rating
						}
					}
				}
			)
			.then((result2) => {
				res.redirect(url)
			})
		})
	}	else	{
		const review = new Review(req.body)
		review
			.save()
			.then((result) => {
				Item.findOneAndUpdate(
					{_id: req.body.itemId}, 
					{ $push: 
						{
							review: {
								"googleId": req.user.googleId,
								"rating" : req.body.rating
							}
						}
					}
				)
				.then((result2) => {
					res.redirect(url)
				})			
			})
			.catch((err) => {
				console.log(err)
		})
	}
}

// Renders EJS page
const index_about = (req, res) => {
	//res.render('about', { title: 'About' })
	
}

// View profile only if our are signed in
const index_profile = (req, res) => {
	/*try {
		res.render('profilenew', {
			title: 'Profile',
			displayName: req.user.displayName,
			image: req.user.image,
		})
		const param = String(req.user.googleId)
		Post.find({ posterId: param })
		.sort({ createdAt: -1 })
		.then((result) => {
			console.log(result)
			res.render('profilenew', { title: 'All Posts', posts: result, displayName: req.user.displayName, googleId: req.user.googleId })
		})
		.catch((err) => {
			console.log(err)
	})
	} catch (err) {
		console.log(err)
		res.redirect("/auth/google")
	}*/
}

const index_profile_ = (req, res) => {
	/*try {
		/*res.render('profilenew', {
			title: 'Profile',
			displayName: req.user.displayName,
			image: req.user.image,
		})
		const param = req.params.posterId

		console.log(req.params.posterId)

		Post.find( {posterId: param, privacy: "public"} )
		.sort({ createdAt: -1 })
		.then((result) => {
			console.log(result)
			res.render('profile', { title: result[0].username, posts: result, displayName: req.user.displayName, googleId: req.user.googleId })		
		})
		.catch((err) => {
			console.log(err)
	})
	} catch (err) {
		console.log(err)
		res.status(404).render('404', { title: 'Page not found' })
	}*/
}


const post_delete = (req, res) => {	
	/*console.log(req.params.id)
	
	const param = req.params.id

	Post.find( {_id: param} )
	.remove()
	.then((result) => {
		res.redirect('/profile')
	})
	.catch((err) => {
		console.log(err)
	})*/
}



module.exports = {
	index_store,
	index_about,
	index_profile,
	index_profile_,
	post_delete,
    index_dev,
	index_dev_post,
	product_page,
	orders,
	add_to_cart,
	cart,
	edit_cart,
	review,
	write_review,
	reviews
}
