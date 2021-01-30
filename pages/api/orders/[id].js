import withSession from '../../../lib/session';
import connect from '../../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const orders = db.collection('orders');
	const stocks = db.collection('stocks');

	const { id } = req.query;

	let user_id = null;
	let _id = null;

	try {
		user_id = new ObjectID(user._id);
		_id = new ObjectID(id);
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'PUT':
			const { date, stock, price, qty } = req.body;

			const resultStock = await stocks.findOne({ user_id, stock });
			const resultOrder = await orders.findOne({ user_id, _id });

			// Remove old values
			const oldTotal = parseFloat(resultStock.total - (resultOrder.qty * resultOrder.price)).toFixed(2);
			const oldQty = resultStock.qty - resultOrder.qty;

			// Calculate new values
			const newTotal = parseFloat(parseFloat(oldTotal) + parseFloat(qty * price)).toFixed(2);
			const newQty = oldQty + parseInt(qty);
			const newPrice = parseFloat(newTotal / newQty).toFixed(2);

			await stocks.updateOne({ user_id, _id: resultStock._id }, {
				$set: {
					total: new Double(newTotal),
					qty: new Int32(newQty),
					price: new Double(newPrice),
				}
			});

			await orders.updateOne({ user_id, _id }, {
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
			const deleteOrder = await orders.findOne({ user_id, _id });
			const deleteStock = await stocks.findOne({ user_id, stock: deleteOrder.stock });

			// Remove old values
			const oldTotal2 = parseFloat(deleteStock.total - (deleteOrder.qty * deleteOrder.price)).toFixed(2);
			const oldQty2 = deleteStock.qty - deleteOrder.qty;
			const oldPrice2 = parseFloat(oldTotal2 / oldQty2).toFixed(2);

			await stocks.updateOne({ user_id, _id: deleteStock._id }, {
				$set: {
					total: new Double(oldTotal2),
					qty: new Int32(oldQty2),
					price: new Double(oldPrice2),
				}
			});

			await orders.deleteOne({ user_id, _id });

			return res.status(200).end();
			break;
	}
});
