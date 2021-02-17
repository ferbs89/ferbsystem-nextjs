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

	let _id = null;
	let user_id = null;
	let resultOrder = null;
	let resultStock = null;

	let newQty = 0;
	let newTotal = 0;
	let newPrice = 0;
	let newProfit = 0;
	let oldQty = 0;
	let oldTotal = 0
	let oldProfit = 0;
	let sellTotal = 0;
	let stockTotal = 0;
	let stockPrice = 0;
	let profit = 0;

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

			// Find stock
			resultStock = await stocks.findOne({ user_id, stock });

			if (!resultStock)
				return res.status(400).end();

			if (resultOrder.qty > 0) {
				stockPrice = resultOrder.price;
				newPrice = price;
			
			} else {
				stockPrice = resultStock.total / resultStock.qty;
				newPrice = stockPrice;

				sellTotal = parseFloat(price * Math.abs(qty)).toFixed(2);
				stockTotal = parseFloat(stockPrice * Math.abs(qty)).toFixed(2);

				profit = parseFloat(sellTotal - stockTotal).toFixed(2);
			}

			// Calculate old values
			oldQty = resultStock.qty - resultOrder.qty;
			oldTotal = parseFloat(resultStock.total - (resultOrder.qty * stockPrice)).toFixed(2);
			oldProfit = parseFloat(resultStock.profit - resultOrder.profit).toFixed(2);

			// Calculate new values
			newQty = oldQty + parseInt(qty);
			newTotal = parseFloat(parseFloat(oldTotal) + parseFloat(qty * newPrice)).toFixed(2);
			newProfit = parseFloat(parseFloat(oldProfit) + parseFloat(profit)).toFixed(2);

			// Update stock
			await stocks.updateOne({ 
				_id: resultStock._id,
				user_id, 
			}, {
				$set: {
					qty: new Int32(newQty),
					total: new Double(newTotal),
					profit: new Double(newProfit),
				}
			});

			// Update order
			await orders.updateOne({
				_id,
				user_id,
			}, {
				$set: {
					date,
					stock: stock.toUpperCase(),
					qty: new Int32(qty),
					price: new Double(price),
					profit: new Double(profit),
				}
			});

			return res.status(200).end();
			break;

		case 'DELETE':
			// Find stock
			resultStock = await stocks.findOne({ user_id, stock: resultOrder.stock });

			if (!resultStock)
				return res.status(400).end();

			if (resultOrder.qty > 0)
				stockPrice = resultOrder.price;
			else
				stockPrice = resultStock.total / resultStock.qty;

			// Calculate old values
			oldQty = resultStock.qty - resultOrder.qty;
			oldTotal = parseFloat(resultStock.total - (resultOrder.qty * stockPrice)).toFixed(2);
			oldProfit = parseFloat(resultStock.profit - resultOrder.profit).toFixed(2);

			// Update stock
			await stocks.updateOne({ 
				_id: resultStock._id,
				user_id,
			}, {
				$set: {
					qty: new Int32(oldQty),
					total: new Double(oldTotal),
					profit: new Double(oldProfit),
				}
			});

			// Delete order
			await orders.deleteOne({ _id, user_id });

			return res.status(200).end();
			break;
	}
});
