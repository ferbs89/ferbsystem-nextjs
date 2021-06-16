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

			let totalCost = 0;
			let totalWallet = 0;
			let totalProfit = 0;
			let totalSale = 0;
			let totalDividends = 0;
			
			await aggCursor.forEach(item => {
				stocks.push(item);
			});

			for (const item of stocks) {
				await getStockOrders({ user_id, stock: item._id }).then(response => {
					if (response.stock.qty > 0) {
						resultStocks.push(response.stock);

						totalCost += response.stock.total;
						totalWallet += response.stock.qty * response.stock.marketPrice;
						totalProfit += (response.stock.qty * response.stock.marketPrice) - response.stock.total;
					}

					totalSale += response.stock.profit;
					totalDividends += response.stock.dividend;
				});
			}

			return res.status(200).json({
				totalCost,
				totalWallet,
				totalProfit,
				totalSale,
				totalDividends,
				total: (totalProfit + totalSale + totalDividends),
				stocks: resultStocks,
			});

			break;
	}
});
