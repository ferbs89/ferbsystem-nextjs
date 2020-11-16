import connect from '../../../../lib/database';
import { ObjectID } from 'mongodb';

export default async (req, res) => {
	const db = await connect();
	const users = db.collection('users');
	const orders = db.collection('orders');

	const { id } = req.query;

	let user_id = null;

	try {
		user_id = new ObjectID(id);

	} catch(error) {
		res.status(400).end();
		return;
	}

	const user = await users.findOne({ _id: user_id });
	const userOrders = await orders.find({ user_id }).toArray();

	res.status(200).json({ 
		user: {
			...user,
			orders: userOrders,
		},		
	});
}