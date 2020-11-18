import connect from '../../../../lib/database';
import { ObjectID } from 'mongodb';

export default async (req, res) => {
	const db = await connect();
	const users = db.collection('users');
	const orders = db.collection('orders');

	const { id } = req.query;

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
			const { stock, price, qty } = req.body;

			response = await orders.insertOne({
				user_id,
				stock,
				qty,
				price,
			});

			res.status(200).json(response);
			break;

		case 'PUT':
			const { order_id } = req.body;
			
			let _id = null;

			try {
				_id = new ObjectID(order_id);		
			} catch(error) {
				res.status(400).end();
				return;
			}

			response = await orders.deleteOne({
				_id
			});

			res.status(200).json(response);
			break;
	}
}