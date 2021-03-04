import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';
import { getOrders } from '../../models/orders';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const orders = db.collection('orders');

	let user_id = null;
	let resultOrders = null;
	let resultStock = null;

	try {
		user_id = new ObjectID(user._id);
	} catch(error) {
		return res.status(400).end();
	}

	switch (req.method) {
		case 'GET':
			const query = { user_id };

			if (req.query.stock !== undefined)
				query.stock = req.query.stock;

			resultOrders = await getOrders(query);

			return res.status(200).json({
				stock: resultOrders.stock,
				orders: resultOrders.orders,
			});
			
			break;

		case 'POST':
			const { date, stock, qty, price } = req.body;
			
			resultOrders = await getOrders({ user_id, stock });

			await orders.insertOne({
				user_id,
				date,
				stock: stock.toUpperCase(),
				qty: new Int32(qty),
				price: new Double(price),
				avg_price: new Double(resultOrders.stock.avg_price), 
			});

			return res.status(200).end();
			break;
	}
});
