import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID, Int32, Double } from 'mongodb';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const orders = db.collection('orders');

	let user_id = null;
	let resultStock = null;

	let newPrice = 0;
	let sellPrice = 0;

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

			// Find orders
			const resultOrders = await orders
				.find(query)
				.sort({ date: -1, _id: -1, stock: -1 })
				.toArray();

			if (req.query.stock !== undefined) {
				resultStock = {
					_id: query.stock,
					qty: 0,
					total: 0,
					profit: 0,
				}

				resultOrders.forEach(item => {
					resultStock.qty += item.qty;
					resultStock.total += (item.qty * item.price);
					
					if (item.sell > 0)
						resultStock.profit += ((Math.abs(item.qty) * item.sell) + (item.qty * item.price));
				});
			}

			return res.status(200).json({
				stock: resultStock,
				orders: resultOrders,
			});
			
			break;

		case 'POST':
			const { date, stock, qty, price } = req.body;
			
			if (qty < 0) {
				resultStock = orders.aggregate([{
					$match: {
						user_id: new ObjectID(user._id),
						stock,
					},
				}, {
					$group: {
						_id: "$stock",
						qty: {
							$sum: "$qty",
						},
						total: {
							$sum: {
								$multiply: ["$qty", "$price"],
							},
						},
					},
				}]);

				let listStocks = null;
			
				await resultStock.forEach(stock => {
					listStocks = stock;
				});

				newPrice = listStocks.total / listStocks.qty;
				sellPrice = price;
			
			} else {
				newPrice = price;
			}

			// Insert order
			await orders.insertOne({
				user_id,
				date,
				stock: stock.toUpperCase(),
				qty: new Int32(qty),
				price: new Double(newPrice),
				sell: new Double(sellPrice),
			});

			return res.status(200).end();
			break;
	}
});
