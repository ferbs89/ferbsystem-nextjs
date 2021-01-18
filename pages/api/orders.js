import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const orders = db.collection('orders');
	const stocks = db.collection('stocks');

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

			const response = await orders
				.find(query)
				.sort({ _id: -1 })
				.toArray();

			res.status(200).json(response);
			break;

		case 'POST':
			const { date, stock, qty, price } = req.body;
			
			// Find stock
			const result = await stocks.findOne({ user_id, stock });

			if (!result) {
				// Insert stock
				await stocks.insertOne({
					user_id,
					stock: stock.toUpperCase(),
					total: new Double(qty * price),
					qty: new Int32(qty),
					price: new Double(price),
				});
			
			} else {
				// Update stock
				const newTotal = parseFloat(result.total + (qty * price)).toFixed(2);
				const newQty = result.qty + parseInt(qty);
				const newPrice = parseFloat(newTotal / newQty).toFixed(2);

				await stocks.updateOne({ _id: result._id }, {
					$set: {
						total: new Double(newTotal),
						qty: new Int32(newQty),
						price: new Double(newPrice),
					}
				});
			}

			// Insert order
			await orders.insertOne({
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
