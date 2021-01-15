import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const collection = db.collection('orders');

	let user_id = null;

	try {
		user_id = new ObjectID(user._id);		
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'GET':
			const query = { user_id };

			if (req.query.stock !== undefined)
				query.stock = req.query.stock

			const response = await collection
				.find(query)
				.sort({ _id: -1 })
				.toArray();

			res.status(200).json(response);
			break;

		case 'POST':
			const { date, stock, qty, price } = req.body;

			await collection.insertOne({
				user_id,
				date,
				stock: stock.toUpperCase(),
				qty: new Int32(qty),
				price: new Double(price),
			});

			res.status(200).end();
			break;
	}
});