const Post = require('../models/Item')

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


// All logs in an array
const post_index = (req, res) => {
	/*Post.find( {privacy: "public"} )
		.sort({ createdAt: -1 })
		.then((result) => {
			console.log(result)
			res.render('posts/index', { title: 'All Posts', posts: result })
		})
		.catch((err) => {
			console.log(err)
	})*/
}

// Gets add log form
const post_add_get = (req, res) => {
	//res.render('posts/add', { title: 'Add Post', displayName: req.user.displayName, googleId: req.user.googleId })
}

// Posts post to /posts
const post_add_post = (req, res) => {
	/*const post = new Post(req.body)

	post
		.save()
		.then((result) => {
			res.redirect('/profile')
		})
		.catch((err) => {
			console.log(err)
		})*/
}



module.exports = {
	post_index,
	post_add_get,
	post_add_post,
	post_delete
}
