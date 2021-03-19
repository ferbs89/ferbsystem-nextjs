import withSession from '../../lib/session';
import connect from '../../lib/database';
import { ObjectID } from 'mongodb';
import { getStockOrders } from '../../models/orders';

export default withSession(async (req, res) => {
	const user = req.session.get('user');

	if (!user || user.isLoggedIn === false)
		return res.status(401).end();

	const db = await connect();
	const orders = db.collection('orders');

	let user_id = null;

	try {
		user_id = new ObjectID(user._id);		
	} catch(error) {
		return res.status(400).end();
	}

	switch (req.method) {
		case 'GET':
			const aggCursor = orders.aggregate([{
				$match: {
					user_id: new ObjectID(user._id),
				},
			}, {
				$group: {
					_id: "$stock",
					qty: {
						$sum: "$qty",
					},
				},
			}, {
				$sort: { 
					_id: 1,
				},
			}]);
			
			const stocks = [];
			const resultStocks = [];
			
			await aggCursor.forEach(item => {
				stocks.push(item);
			});

			for (const item of stocks) {
				await getStockOrders({ user_id, stock: item._id }).then(response => {
					if (response.stock.qty > 0)
						resultStocks.push(response.stock);
				});
			}

			return res.status(200).json(resultStocks);
			break;
	}
});
