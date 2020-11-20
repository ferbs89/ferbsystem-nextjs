import connect from '../../../../lib/database';
import { ObjectID } from 'mongodb';

export default async (req, res) => {
	const db = await connect();
	const users = db.collection('users');
	const orders = db.collection('orders');

	const { id } = req.query;

	let _id = null;
	let user_id = null;
	let response = null;

	try {
		user_id = new ObjectID(id);
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'GET':
			const user = await users.findOne({ _id: user_id });
			const userOrders = await orders.find({ user_id }).toArray();

			res.status(200).json({ 
				user: {
					...user,
					orders: userOrders,
				},
			});

			break;

		case 'POST':
			response = await orders.insertOne({
				user_id,
				stock: req.body.stock,
				price: req.body.price,
				qty: req.body.qty,
			});

			res.status(200).json(response);
			break;

		case 'PUT':
			try {
				_id = new ObjectID(req.body.order_id);		
			} catch(error) {
				res.status(400).end();
				return;
			}

			response = await orders.updateOne({ _id }, {
				$set: {
					stock: req.body.stock,
					price: req.body.price,
					qty: req.body.qty,
				}
			});

			res.status(200).json(response);
			break;

		case 'DELETE':
			try {
				_id = new ObjectID(req.query.order_id);	
			} catch(error) {
				res.status(400).end();
				return;
			}

			response = await orders.deleteOne({ _id });

			res.status(200).json(response);
			break;
	}
}