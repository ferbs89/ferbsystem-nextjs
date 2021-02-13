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
	let newTotal, newQty, newPrice, newProfit, sellTotal, stockTotal, profit = 0;

	try {
		user_id = new ObjectID(user._id);
	} catch(error) {
		res.status(400).end();
		return;
	}

	switch (req.method) {
		case 'GET':
			const query = { user_id };

			let responseStock = null;

			if (req.query.stock !== undefined) {
				query.stock = req.query.stock;

				responseStock = await stocks.findOne({
					user_id,
					stock: query.stock,
				});

				if (!responseStock)
					return res.status(400).end();
			}

			const responseOrders = await orders
				.find(query)
				.sort({ date: -1, stock: -1, _id: -1 })
				.toArray();

			return res.status(200).json({ 
				stock: responseStock, 
				orders: responseOrders
			});
			
			break;

		case 'POST':
			const { date, stock, qty, price } = req.body;
			
			// Find stock
			const resultStock = await stocks.findOne({ user_id, stock });

			if (!resultStock) {
				// Insert stock
				await stocks.insertOne({
					user_id,
					stock: stock.toUpperCase(),
					total: new Double(qty * price),
					qty: new Int32(qty),
					price: new Double(price),
				});
			
			} else {
				if (qty > 0) {
					// Buy order
					newTotal = parseFloat(resultStock.total + (qty * price)).toFixed(2);
					newQty = resultStock.qty + parseInt(qty);
					newPrice = parseFloat(newTotal / newQty).toFixed(2);
			
				} else {
					// Sell order
					sellTotal = parseFloat(price * Math.abs(qty)).toFixed(2);
					stockTotal = parseFloat(resultStock.price * Math.abs(qty)).toFixed(2);					
					profit = parseFloat(sellTotal - stockTotal).toFixed(2);					

					newTotal = parseFloat(resultStock.total + (qty * resultStock.price)).toFixed(2);
					newQty = resultStock.qty + parseInt(qty);
					newPrice = resultStock.price;
					newProfit = parseFloat(resultStock.profit + parseFloat(profit)).toFixed(2);
				}

				// Update stock
				await stocks.updateOne({ user_id, _id: resultStock._id }, {
					$set: {
						total: new Double(newTotal),
						qty: new Int32(newQty),
						price: new Double(newPrice),
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
