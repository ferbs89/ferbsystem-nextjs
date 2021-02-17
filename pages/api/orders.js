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
	let resultStock = null;

	let newQty = 0;
	let newTotal = 0;
	let newProfit = 0;
	let sellTotal = 0;
	let stockTotal = 0;
	let stockPrice = 0;
	let profit = 0;

	try {
		user_id = new ObjectID(user._id);
	} catch(error) {
		return res.status(400).end();
	}

	switch (req.method) {
		case 'GET':
			const query = { user_id };

			if (req.query.stock !== undefined) {
				query.stock = req.query.stock;

				// Find stock
				resultStock = await stocks.findOne({
					user_id,
					stock: query.stock,
				});

				if (!resultStock)
					return res.status(400).end();
			}

			// Find orders
			const resultOrders = await orders
				.find(query)
				.sort({ date: -1, _id: -1, stock: -1 })
				.toArray();

			return res.status(200).json({
				stock: resultStock,
				orders: resultOrders,
			});
			
			break;

		case 'POST':
			const { date, stock, qty, price } = req.body;
			
			// Find stock
			resultStock = await stocks.findOne({ user_id, stock });

			if (!resultStock) {
				// Insert stock
				await stocks.insertOne({
					user_id,
					stock: stock.toUpperCase(),
					qty: new Int32(qty),
					total: new Double(qty * price),
					profit: new Double(profit),
				});
			
			} else {
				if (qty > 0) {
					// Buy order
					stockPrice = price;
					newProfit = resultStock.profit;

				} else {
					// Sell order
					stockPrice = resultStock.total / resultStock.qty;					

					sellTotal = parseFloat(price * Math.abs(qty)).toFixed(2);
					stockTotal = parseFloat(stockPrice * Math.abs(qty)).toFixed(2);

					profit = parseFloat(sellTotal - stockTotal).toFixed(2);
					newProfit = parseFloat(resultStock.profit + parseFloat(profit)).toFixed(2);
				}

				newQty = resultStock.qty + parseInt(qty);
				newTotal = parseFloat(resultStock.total + (qty * stockPrice)).toFixed(2);

				// Update stock
				await stocks.updateOne({ user_id, _id: resultStock._id }, {
					$set: {
						qty: new Int32(newQty),
						total: new Double(newTotal),
						profit: new Double(newProfit),
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
				profit: new Double(profit),
			});

			return res.status(200).end();
			break;
	}
});
