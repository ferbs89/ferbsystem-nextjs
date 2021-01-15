import withSession from '../../../lib/session';
import connect from '../../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const collection = db.collection('orders');

	const { id } = req.query;

	let _id = null;

	try {
		_id = new ObjectID(id);		
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'PUT':
			const { date, stock, price, qty } = req.body;

			await collection.updateOne({ _id }, {
				$set: {
					date,
					stock: stock.toUpperCase(),
					qty: new Int32(qty),
					price: new Double(price),
				}
			});

			res.status(200).end();
			break;

		case 'DELETE':
			await collection.deleteOne({ _id });

			res.status(200).end();
			break;
	}
});
