import withSession from '../../../lib/session';
import connect from '../../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const orders = db.collection('orders');

	const { id } = req.query;

	let _id = null;
	let user_id = null;
	let resultOrder = null;

	try {
		_id = new ObjectID(id);
		user_id = new ObjectID(user._id);
	} catch(error) {
		return res.status(400).end();
	}

	// Find order
	resultOrder = await orders.findOne({ _id, user_id });

	if (!resultOrder)
		return res.status(400).end();

	switch (req.method) {
		case 'PUT':
			const { date, stock, qty, price } = req.body;

			await orders.updateOne({
				_id,
				user_id,
			}, {
				$set: {
					date,
					stock: stock.toUpperCase(),
					qty: new Int32(qty),
					price: new Double(price),
				}
			});

			return res.status(200).end();
			break;

		case 'DELETE':
			await orders.deleteOne({ _id, user_id });
			return res.status(200).end();
			break;
	}
});
