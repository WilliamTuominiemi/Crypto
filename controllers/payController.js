const paypal = require('paypal-rest-sdk')
const dotenv = require('dotenv')

const Order = require('../models/Order')
const Item = require('../models/Item')
const Cart = require('../models/Cart')


dotenv.config({ path: '../config/config.env' })

let price;
let item_ids = [];
let cartID;

paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
})

const nodemailer = require('nodemailer')

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const pay = (req, res) => {
    item_ids = []

    async function f() {

        items = [];
        req_items = req.body.body
        console.log("req_items: ", req_items)

        let itemsProcessed = 0

        req_items.forEach(item => {
            //console.log(item.id)
            const param = item.id
            Item.find({ _id: param })
            .then((result) => {
                let _price = parseFloat(result[0].price) * item.amount

                const item_body = {
                    "name": result[0].title,
                    "sku": "001",
                    "price": parseFloat(result[0].price),
                    "currency": "EUR",
                    "quantity": item.amount
                }
                let _item = {
                    "id": item.id,
                    "amount": item.amount
                }
                console.log(_item)
                item_ids.push(_item)
                items.push(item_body)
            })
            .catch((err) => {
                console.log(err)
            })   
        })

        let promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("done!"), 1000)
        });
      
        let result = await promise; // wait until the promise resolves (*)
      
        console.log("item_ids: ", item_ids)
        //console.log(items)

        price = parseFloat(req.body.subtotal)
        cartID = req.body.cart_id

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "http://localhost:3000/success",
                "cancel_url": "http://localhost:3000/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": items
                },
                "amount": {
                    "currency": "EUR",
                    "total": parseFloat(req.body.subtotal) // 25
                },
                "description": "Purcahsed from the Store"
            }]
        };
        
        // console.log(req.body)
        // console.log(create_payment_json.transactions[0])

        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i = 0;i < payment.links.length;i++){
                if(payment.links[i].rel === 'approval_url'){
                    res.redirect(payment.links[i].href);
                }
                }
            }
        });
    }
      
    f();
}
  
const success = (req, res) => {
    console.log(success)
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;

    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "EUR",
              "total": price
          }
      }]
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASS
        }
    })

    console.log(execute_payment_json)
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
        console.log("item ids", item_ids)
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            const body = {
                googleId: req.user.googleId,
                recipient_name: payment.payer.payer_info.shipping_address.recipient_name,
                email: payment.payer.payer_info.email,
                address: payment.payer.payer_info.shipping_address.line1,
                city: payment.payer.payer_info.shipping_address.city,
                state: payment.payer.payer_info.shipping_address.state,
                postal_code: payment.payer.payer_info.shipping_address.postal_code,
                country_code: payment.payer.payer_info.shipping_address.country_code,
                item_ids: item_ids,
                subtotal: price.toString()
            }

            const mailOptions = {
                from: process.env.EMAIL,
                to: "william.m.tuominiemi@gmail.com",
                // to: payment.payer.payer_info.email,
                subject: `Order receipt for Store`,
                text: `
                Recipient: ${payment.payer.payer_info.shipping_address.recipient_name}
                Address: ${payment.payer.payer_info.shipping_address.line1}
                Subtotal: ${price.toString()} €

                If you have any questions, contact support here cock@gmail.com
                `
            }

            const order = new Order(body)
            order
                .save()
                .then((result) => {
                    console.log(cartID)
                    Cart.deleteMany({ googleId: req.user.googleId }, (err) => {
                        if (err) {
                            return handleError(err);
                        } 
                        else {    
                            transporter.sendMail(mailOptions, (error, info) => {
                                if (error) {
                                    console.log("fuuuck5")
                                    console.log(error)
                                } else {
                                    console.log('Email sent: ' + info.response);
                                    res.redirect('/orders')
                                }
                            })
                        }
                    })
                })
                .catch((err) => {
                    console.log(err)
            })
      }
  });
}
  
const cancel = (req, res) => {
    res.send('Cancelled')
}

module.exports = {
	pay,
	success,
	cancel
}